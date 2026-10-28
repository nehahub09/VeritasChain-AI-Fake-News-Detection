import os
import unittest
import json
from app import app
from blockchain.web3_client import blockchain_manager

class FakeNewsSystemTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_01_health_endpoint(self):
        res = self.app.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("ai_engines", data)

    def test_02_stats_endpoint(self):
        res = self.app.get('/api/stats')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertGreater(data["data"]["total_news_analyzed"], 0)
        self.assertIn("fake_percentage", data["data"])
        self.assertIn("real_percentage", data["data"])

    def test_03_text_analyzer_fake(self):
        payload = {
            "headline": "SHOCKING: 5G mind control towers secret government document leaked!",
            "text": "Secret government document leaked! They don't want you to know the truth! Wake up people! Share before deleted!",
            "source_url": "http://conspiracy-leak-5g.blogspot.com"
        }
        res = self.app.post('/api/analyze/text', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["analysis"]["verdict"], "FAKE")
        self.assertGreaterEqual(data["analysis"]["fake_percentage"], 75.0)
        self.assertAlmostEqual(data["analysis"]["fake_percentage"] + data["analysis"]["real_percentage"], 100.0, places=1)
        self.assertIn("tx_hash", data["blockchain"])
        self.assertTrue(data["news_hash"].startswith("0x"))

    def test_04_text_analyzer_real(self):
        payload = {
            "headline": "Federal Reserve Adjusts Benchmark Interest Rates",
            "text": "The Federal Reserve announced an adjustment in benchmark interest rates by a quarter percentage point, citing steady employment figures and ongoing economic stabilization.",
            "source_url": "https://www.reuters.com/business"
        }
        res = self.app.post('/api/analyze/text', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["analysis"]["verdict"], "REAL")
        self.assertGreaterEqual(data["analysis"]["real_percentage"], 75.0)
        self.assertAlmostEqual(data["analysis"]["fake_percentage"] + data["analysis"]["real_percentage"], 100.0, places=1)

    def test_05_image_analyzer(self):
        sample_img = os.path.join(os.path.dirname(__file__), "uploads", "sample_fake_explosion.jpg")
        self.assertTrue(os.path.exists(sample_img), f"Sample image not found: {sample_img}")
        
        with open(sample_img, 'rb') as f:
            res = self.app.post('/api/analyze/image', data={
                'image': (f, 'sample_fake_explosion.jpg'),
                'caption': 'Explosion allegation over skyline'
            }, content_type='multipart/form-data')
            
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("ela_heatmap_url", data["analysis"]["forensics"])
        self.assertAlmostEqual(data["analysis"]["fake_percentage"] + data["analysis"]["real_percentage"], 100.0, places=1)

    def test_06_blockchain_verification(self):
        # Compute a text hash and verify endpoint
        res = self.app.get('/api/blockchain/verify/0x89e2c4d9a117d3d198031ba048e7e127391dfcfcf9f67a29e92d775196f7c001')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["verified"])
        self.assertEqual(data["record"]["verdict"], "REAL")

if __name__ == '__main__':
    unittest.main()
