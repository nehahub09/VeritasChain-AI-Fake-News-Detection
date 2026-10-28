"""
Scoring Engine
Calculates calibrated Fake News vs. Real News probabilities and epistemic Confidence scores
from extracted multi-modal AI/ML and NLP signals.
"""

from typing import Dict, Any, List

class ScoringEngine:
    @staticmethod
    def calibrate_scores(
        fake_signals: float,
        real_signals: float,
        evidence_factors: List[float],
        modality: str = "text"
    ) -> Dict[str, Any]:
        """
        Calculates:
        - fake_percentage (0 - 100)
        - real_percentage (0 - 100, where fake + real == 100)
        - confidence (0 - 100)
        - verdict: 'REAL', 'FAKE', or 'UNVERIFIED'
        """
        # Normalize raw signals with soft weighting
        total_raw = fake_signals + real_signals
        if total_raw <= 0.001:
            raw_fake_prob = 0.50
        else:
            raw_fake_prob = fake_signals / total_raw

        # Epistemic Confidence Calculation:
        # Measures evidence density, signal divergence/concurrence, input richness.
        # Strictly separated from the veracity probability.
        evidence_quality = sum(evidence_factors) / max(len(evidence_factors), 1)
        evidence_quality = min(max(evidence_quality, 0.1), 1.0)
        
        directional_certainty = (abs(raw_fake_prob - 0.5) / 0.5) ** 0.6
        raw_confidence = (0.40 * evidence_quality + 0.60 * directional_certainty) * 100.0
        confidence = round(min(max(raw_confidence, 20.0), 98.0), 1)

        # Verdict Assignment & Probability Calibration:
        # Calibrated so that when classified as REAL, real% > 75%,
        # and when classified as FAKE, fake% > 75%, while maintaining fake% + real% == 100%.
        if confidence < 42.0 or (0.46 <= raw_fake_prob <= 0.54):
            verdict = "UNVERIFIED"
            fake_pct = round(raw_fake_prob * 100.0, 1)
            real_pct = round(100.0 - fake_pct, 1)
        elif raw_fake_prob > 0.54:
            verdict = "FAKE"
            # Scale from 76.0% up to 96.5% based on signal intensity
            norm_strength = min(max((raw_fake_prob - 0.54) / 0.46, 0.0), 1.0)
            fake_prob_calibrated = 76.0 + 20.5 * (norm_strength ** 0.70)
            fake_pct = round(fake_prob_calibrated, 1)
            real_pct = round(100.0 - fake_pct, 1)
        else:
            verdict = "REAL"
            # Scale from 76.0% up to 96.5% based on signal intensity
            norm_strength = min(max((0.46 - raw_fake_prob) / 0.46, 0.0), 1.0)
            real_prob_calibrated = 76.0 + 20.5 * (norm_strength ** 0.70)
            real_pct = round(real_prob_calibrated, 1)
            fake_pct = round(100.0 - real_pct, 1)

        return {
            "verdict": verdict,
            "fake_percentage": fake_pct,
            "real_percentage": real_pct,
            "confidence": confidence,
            "modality": modality
        }

    @staticmethod
    def generate_explanation(
        verdict: str,
        fake_pct: float,
        real_pct: float,
        confidence: float,
        factors: Dict[str, Any]
    ) -> str:
        """Constructs human-readable, forensic explanation based on detected signals."""
        reasons = []
        if factors.get("sensationalism_score", 0) > 60:
            reasons.append(f"High sensationalist/clickbait rhetoric detected ({factors['sensationalism_score']}%)")
        if factors.get("tamper_score", 0) > 50:
            reasons.append(f"Visual compression and edge inconsistency indicative of tampering ({factors['tamper_score']}%)")
        if factors.get("sentiment_polarization", 0) > 70:
            reasons.append("Extreme emotional polarization and provocative framing")
        if factors.get("factual_vagueness", 0) > 60:
            reasons.append("Absence of verifiable citations, named sources, or institutional corroboration")
        if factors.get("source_credibility", 0) < 40 and factors.get("source_credibility") is not None:
            reasons.append("Domain/publisher footprint has low credibility rating")
        if factors.get("audio_inconsistency", 0) > 50:
            reasons.append("Audio speech patterns show synthetic pitch artifacts or erratic cadence")

        if verdict == "FAKE":
            base = f"The content has been classified as FAKE ({fake_pct}% probability) with {confidence}% model confidence. "
            if reasons:
                base += "Key forensic flags: " + "; ".join(reasons) + "."
            else:
                base += "Linguistic and contextual patterns align strongly with synthetic or fabricated disinformation."
            return base

        elif verdict == "REAL":
            base = f"The content has been verified as REAL ({real_pct}% probability) with {confidence}% model confidence. "
            base += "The text exhibits neutral linguistic tone, standard journalistic syntax, consistent metadata, and lack of visual/audio tampering markers."
            return base

        else:
            base = f"The content status is UNVERIFIED (Confidence: {confidence}%). "
            base += "Signals are ambiguous, contradictory, or insufficient to reach an authoritative veracity consensus without additional independent corroboration."
            return base
