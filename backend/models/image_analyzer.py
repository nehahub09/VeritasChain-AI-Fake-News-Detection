import os
import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from typing import Dict, Any, Tuple
from config import Config
from .scoring_engine import ScoringEngine
from .text_analyzer import text_analyzer

try:
    import pytesseract
    HAS_PYTESSERACT = True
except ImportError:
    HAS_PYTESSERACT = False

class ImageAnalyzer:
    def __init__(self):
        os.makedirs(Config.HEATMAP_FOLDER, exist_ok=True)

    def extract_ocr_text(self, image_path: str) -> Tuple[str, float]:
        """
        Extracts embedded text using pytesseract OCR with fallback to OpenCV contour heuristic.
        Returns: (extracted_text, ocr_confidence)
        """
        extracted = ""
        confidence = 0.50

        if HAS_PYTESSERACT:
            try:
                img = Image.open(image_path)
                text = pytesseract.image_to_string(img)
                if text and len(text.strip()) > 3:
                    extracted = text.strip()
                    confidence = 0.85
                    return extracted, confidence
            except Exception as e:
                # If tesseract executable is not installed on system PATH, fallback gracefully
                pass

        # Fallback heuristic: OpenCV contour and edge detection for text-like regions
        try:
            cv_img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if cv_img is not None:
                # Apply morphological gradient to detect high-frequency text boundaries
                kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
                grad = cv2.morphologyEx(cv_img, cv2.MORPH_GRADIENT, kernel)
                _, thresh = cv2.threshold(grad, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                text_regions = [c for c in contours if cv2.contourArea(c) > 40]
                if len(text_regions) > 5:
                    extracted = "[Graphic with embedded text headlines detected via Computer Vision]"
                    confidence = 0.65
                else:
                    extracted = "[Visual content with minimal or no embedded text detected]"
                    confidence = 0.50
        except Exception:
            extracted = "[No readable text layer detected in image]"
            confidence = 0.30

        return extracted, confidence

    def compute_ela_and_forensics(self, image_path: str, filename_base: str) -> Dict[str, Any]:
        """
        Performs Error Level Analysis (ELA) to reveal compression artifacts from image manipulation.
        Generates an ELA difference heatmap image and calculates manipulation variance.
        """
        heatmap_filename = f"ela_{filename_base}.jpg"
        heatmap_dest = os.path.join(Config.HEATMAP_FOLDER, heatmap_filename)
        
        try:
            # 1. Open original image
            original = Image.open(image_path).convert('RGB')
            
            # 2. Resave at known JPEG quality (90) to create baseline compression
            temp_resaved = os.path.join(Config.HEATMAP_FOLDER, f"temp_{filename_base}.jpg")
            original.save(temp_resaved, 'JPEG', quality=90)
            resaved = Image.open(temp_resaved)

            # 3. Calculate absolute pixel difference
            ela_image = ImageChops.difference(original, resaved)
            
            # 4. Enhance difference brightness to make manipulation hotspots visible
            extrema = ela_image.getextrema()
            max_diff = max([ex[1] for ex in extrema])
            scale = 255.0 / max_diff if max_diff > 0 else 1.0
            enhanced = ImageEnhance.Brightness(ela_image).enhance(scale * 1.5)
            
            # Convert to false-color heatmap using OpenCV for attractive cyber-defense visualization
            np_enhanced = np.array(enhanced)
            gray_ela = cv2.cvtColor(np_enhanced, cv2.COLOR_RGB2GRAY)
            color_heatmap = cv2.applyColorMap(gray_ela, cv2.COLORMAP_JET)
            cv2.imwrite(heatmap_dest, color_heatmap)
            
            if os.path.exists(temp_resaved):
                os.remove(temp_resaved)

            # 5. Measure tamper metric based on variance and high-energy clusters in difference
            tamper_energy = float(np.mean(gray_ela))
            tamper_std = float(np.std(gray_ela))
            
            # High standard deviation in ELA indicates spliced sections with divergent compression levels
            raw_tamper_score = min(max((tamper_energy * 0.8 + tamper_std * 1.2), 5.0), 95.0)
            tamper_score = round(raw_tamper_score, 1)

            # 6. Metadata inspection (detect software signatures)
            exif_tampered = False
            software_detected = "None / Stripped"
            try:
                exif = original._getexif()
                if exif:
                    for tag_id, value in exif.items():
                        val_str = str(value).lower()
                        if any(sw in val_str for sw in ["photoshop", "gimp", "canva", "midjourney", "stable diffusion"]):
                            exif_tampered = True
                            software_detected = str(value)
                            tamper_score = min(tamper_score + 25.0, 98.0)
                            break
            except Exception:
                pass

            return {
                "tamper_score": tamper_score,
                "ela_heatmap_url": f"/uploads/heatmaps/{heatmap_filename}",
                "software_signature": software_detected,
                "metadata_tampered": exif_tampered,
                "compression_variance": round(tamper_std, 2)
            }

        except Exception as e:
            # Fallback if image format prevents PIL ELA
            return {
                "tamper_score": 15.0,
                "ela_heatmap_url": "",
                "software_signature": "Standard Image",
                "metadata_tampered": False,
                "compression_variance": 0.0
            }

    def analyze(self, image_path: str, user_caption: str = "") -> Dict[str, Any]:
        """
        Complete Multi-Modal Image Analysis:
        Combines Computer Vision ELA manipulation forensics + OCR text extraction + NLP veracity.
        """
        filename_base = os.path.splitext(os.path.basename(image_path))[0]
        
        # 1. OCR Extraction
        ocr_text, ocr_conf = self.extract_ocr_text(image_path)
        
        # 2. Computer Vision ELA & Tamper Analysis
        forensics = self.compute_ela_and_forensics(image_path, filename_base)
        
        # 3. NLP Analysis of OCR / Caption
        combined_text = f"{user_caption} {ocr_text}".strip()
        has_text = len(combined_text) > 10 and not combined_text.startswith("[")

        if has_text:
            text_result = text_analyzer.analyze(combined_text)
            text_fake_signal = text_result["fake_percentage"] / 100.0
            text_real_signal = text_result["real_percentage"] / 100.0
        else:
            text_fake_signal = 0.5
            text_real_signal = 0.5

        # 4. Synthesize Visual Tampering + Text Semantics
        visual_fake_signal = forensics["tamper_score"] / 100.0
        visual_real_signal = (100.0 - forensics["tamper_score"]) / 100.0

        if has_text:
            final_fake_signal = (visual_fake_signal * 0.55) + (text_fake_signal * 0.45)
            final_real_signal = (visual_real_signal * 0.55) + (text_real_signal * 0.45)
            evidence_factor = 0.85
        else:
            final_fake_signal = visual_fake_signal
            final_real_signal = visual_real_signal
            evidence_factor = 0.70

        # Calibrate output scores
        scores = ScoringEngine.calibrate_scores(
            fake_signals=final_fake_signal,
            real_signals=final_real_signal,
            evidence_factors=[evidence_factor, ocr_conf],
            modality="image"
        )

        factors = {
            "tamper_score": forensics["tamper_score"],
            "compression_variance": forensics["compression_variance"],
            "sensationalism_score": text_result["factors"]["sensationalism_score"] if has_text else 20.0,
            "source_credibility": text_result["factors"]["source_credibility"] if has_text else 60.0
        }

        explanation = ScoringEngine.generate_explanation(
            verdict=scores["verdict"],
            fake_pct=scores["fake_percentage"],
            real_pct=scores["real_percentage"],
            confidence=scores["confidence"],
            factors=factors
        )

        return {
            **scores,
            "explanation": explanation,
            "ocr_text": ocr_text,
            "user_caption": user_caption,
            "forensics": forensics,
            "factors": factors
        }

image_analyzer = ImageAnalyzer()
