import re
import math
from typing import Dict, Any
from .scoring_engine import ScoringEngine
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Comprehensive corpora for training an authentic benchmark model
TRAINING_SAMPLES = [
    # REAL NEWS SAMPLES (Journalistic, neutral, sourced, empirical)
    ("The Federal Reserve announced an increase in benchmark interest rates by a quarter percentage point, citing steady employment numbers and ongoing efforts to bring annual inflation toward its target.", 1),
    ("Researchers at the National Institute of Standards and Technology published findings detailing advancements in quantum error correction using silicon-based superconducting qubits.", 1),
    ("The Department of Transportation released new safety compliance guidelines for electric vehicles, focusing on high-voltage battery insulation and automated braking performance.", 1),
    ("According to a peer-reviewed study in the New England Journal of Medicine, phase three clinical trials showed significant efficacy in the prevention of seasonal respiratory infections.", 1),
    ("Officials from the World Health Organization confirmed an update to global vaccine monitoring protocols following a consultative committee meeting in Geneva.", 1),
    ("Local municipal authorities held a public hearing on Wednesday regarding the proposed municipal transit expansion and urban zoning amendments for commercial corridors.", 1),
    ("Reuters reported that international energy ministers finalized a collaborative framework aimed at expanding offshore wind turbine installations and power grid interconnection.", 1),
    ("The National Oceanic and Atmospheric Administration issued a seasonal advisory noting higher than average precipitation patterns across the Pacific Northwest region.", 1),
    ("Spokespersons for the European Space Agency confirmed the successful telemetry transmission from the deep-space probe after completing its orbital gravitational slingshot.", 1),
    ("The Bureau of Labor Statistics reported that nonfarm payroll employment rose by 175,000 in April, with healthcare and social assistance leading overall sector growth.", 1),
    ("A bipartisan delegation of lawmakers introduced legislation today aimed at reinforcing cybersecurity standards for municipal water treatment facilities.", 1),
    ("The Central Meteorological Agency verified that barometric pressure measurements dropped sharply prior to the coastal storm system making landfall yesterday morning.", 1),

    # FAKE NEWS SAMPLES (Sensationalist, hyperbolic, unsubstantiated, clickbait)
    ("SHOCKING: Secret government document leaked! They don't want you to know the truth about 5G towers controlling everyone's mind! Wake up people!", 0),
    ("MIRACLE CURE: Doctors are stunned! One weird kitchen spice destroys 100% of cancer cells overnight! Big Pharma is trying to ban this video!", 0),
    ("BREAKING: Alien spacecraft found buried beneath Antarctica ice sheet! World leaders held secret emergency summit to surrender humanity! SHARE THIS BEFORE IT'S DELETED!", 0),
    ("BOMBSHELL REVELATION: Renowned scientist exposes global conspiracy! Drinking lemon water cures all diseases instantly, hospitals furious!", 0),
    ("EXPOSED: Massive microchips found inside tap water supply! Military insiders blow whistle on globalist plot to turn population into zombies!", 0),
    ("You won't believe what this celebrity did! Entire internet in tears after leaked hidden camera footage reveals shocking forbidden ritual!", 0),
    ("URGENT ALERT: Government is banning cash starting Monday midnight! Your bank account will be wiped unless you do this one simple trick now!", 0),
    ("NASA insider admits Earth is actually hollow and inhabited by ancient reptilian civilization! Proof censored from satellite photos!", 0),
    ("Secret potion discovered in remote jungle reverses aging by 40 years! Scientists can't explain it, pharmaceutical giants panic!", 0),
    ("HOLY COW: Leaked audio reveals billionaires plotting to block the sun forever to freeze the economy! Viral video is breaking the internet!", 0),
    ("Warning: Eating bread causes instant cellular breakdown! Whistleblower claims FDA knew for 30 years and covered it up!", 0),
    ("PROOF: Time traveler from the year 2099 arrives with video footage of catastrophic asteroid impact tomorrow! Elite fleeing to underground bunkers!", 0)
]

class TextAnalyzer:
    def __init__(self):
        self._train_benchmark_classifier()

    def _train_benchmark_classifier(self):
        texts = [s[0] for s in TRAINING_SAMPLES]
        labels = [s[1] for s in TRAINING_SAMPLES]
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english', lowercase=True)
        X = self.vectorizer.fit_transform(texts)
        self.classifier = LogisticRegression(C=1.5, random_state=42)
        self.classifier.fit(X, labels)

    def extract_linguistic_signals(self, text: str) -> Dict[str, Any]:
        """Extracts deep NLP stylistic and sensationalism metrics."""
        cleaned = text.strip()
        words = re.findall(r'\b[a-zA-Z]+\b', cleaned)
        word_count = len(words)
        
        # Clickbait & sensationalism lexicon
        sensational_terms = [
            "shocking", "miracle", "secret", "exposed", "bombshell", "leaked", "conspiracy",
            "wake up", "urgent alert", "you won't believe", "banned", "cover up", "mind control",
            "furious", "whistleblower", "hoax", "crisis", "censored", "alien", "zombie", "plot"
        ]
        
        # Credible journalistic lexicon
        journalistic_terms = [
            "according to", "stated", "confirmed", "spokesperson", "reuters", "associated press",
            "study", "published", "researchers", "official", "department", "findings", "reported",
            "bureau", "agency", "data", "peer-reviewed", "announced", "guidelines", "protocol"
        ]

        text_lower = cleaned.lower()
        sensational_hits = sum(1 for term in sensational_terms if term in text_lower)
        journalistic_hits = sum(1 for term in journalistic_terms if term in text_lower)

        # Caps Lock & Exclamation Ratio
        caps_count = sum(1 for c in cleaned if c.isupper())
        total_letters = sum(1 for c in cleaned if c.isalpha())
        caps_ratio = (caps_count / max(total_letters, 1)) * 100
        
        excl_count = cleaned.count('!')
        q_count = cleaned.count('?')

        # Sensationalism score (0 - 100)
        raw_sensationalism = (sensational_hits * 18.0) + (caps_ratio * 0.8) + (excl_count * 12.0)
        sensationalism_score = min(round(raw_sensationalism, 1), 99.0)

        # Journalistic Credibility score (0 - 100)
        raw_credibility = (journalistic_hits * 22.0) + (min(word_count, 120) * 0.25)
        credibility_score = min(round(max(raw_credibility, 5.0), 1), 98.0)

        # Emotional Sentiment Polarization (0 - 100)
        sentiment_polarization = min(round((sensationalism_score * 0.7) + (excl_count * 8.0), 1), 98.0)

        return {
            "word_count": word_count,
            "sensational_hits": sensational_hits,
            "journalistic_hits": journalistic_hits,
            "sensationalism_score": sensationalism_score,
            "source_credibility": credibility_score,
            "sentiment_polarization": sentiment_polarization,
            "caps_ratio": round(caps_ratio, 1),
            "exclamation_count": excl_count
        }

    def analyze(self, text: str, headline: str = "", source_url: str = "") -> Dict[str, Any]:
        """Performs full end-to-end NLP and ML analysis on the news content."""
        full_text = f"{headline}. {text}".strip()
        if len(full_text) < 15:
            return {
                "verdict": "UNVERIFIED",
                "fake_percentage": 50.0,
                "real_percentage": 50.0,
                "confidence": 20.0,
                "explanation": "Text content is too short for conclusive NLP veracity determination.",
                "signals": {},
                "headline": headline,
                "source_url": source_url
            }

        signals = self.extract_linguistic_signals(full_text)
        
        # Scikit-Learn TF-IDF classification
        X_test = self.vectorizer.transform([full_text])
        proba = self.classifier.predict_proba(X_test)[0]
        # proba[0] = fake, proba[1] = real
        ml_fake_signal = proba[0]
        ml_real_signal = proba[1]

        # Source URL bonus/penalty
        url_weight = 0.0
        if source_url:
            trusted_domains = ["reuters.com", "apnews.com", "bbc.com", "nature.com", "gov", "edu", "who.int", "bloomberg.com"]
            suspicious_domains = ["blogspot", "conspiracy", "freedom-patriot", "truth-revealed", "click-now"]
            if any(dom in source_url.lower() for dom in trusted_domains):
                url_weight = 0.25
            elif any(dom in source_url.lower() for dom in suspicious_domains):
                url_weight = -0.35

        # Combined signal fusion
        sensational_norm = signals["sensationalism_score"] / 100.0
        credibility_norm = signals["source_credibility"] / 100.0

        fake_signals = (ml_fake_signal * 0.50) + (sensational_norm * 0.40) + (0.10 if url_weight < 0 else 0)
        real_signals = (ml_real_signal * 0.50) + (credibility_norm * 0.40) + (max(url_weight, 0))

        # Evidence quality factor based on word count & richness
        evidence_factor = min(signals["word_count"] / 60.0, 1.0)
        
        result = ScoringEngine.calibrate_scores(
            fake_signals=fake_signals,
            real_signals=real_signals,
            evidence_factors=[evidence_factor, 0.85],
            modality="text"
        )

        factors = {
            "sensationalism_score": signals["sensationalism_score"],
            "source_credibility": signals["source_credibility"],
            "sentiment_polarization": signals["sentiment_polarization"],
            "factual_vagueness": round(max(100 - signals["source_credibility"], 10.0), 1)
        }

        explanation = ScoringEngine.generate_explanation(
            verdict=result["verdict"],
            fake_pct=result["fake_percentage"],
            real_pct=result["real_percentage"],
            confidence=result["confidence"],
            factors=factors
        )

        return {
            **result,
            "explanation": explanation,
            "signals": signals,
            "factors": factors,
            "headline": headline,
            "source_url": source_url
        }

text_analyzer = TextAnalyzer()
