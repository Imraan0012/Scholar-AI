"""
Scholar AI — ML Test Suite (unittest compatible)
Verifies model performance, feature extraction, and prediction accuracy.
"""

import unittest
from app import extract_features, predict_eligibility, PredictRequest, metadata

class TestDecisionTreeModel(unittest.TestCase):

    def test_metadata_loaded(self):
        self.assertIsNotNone(metadata)
        self.assertIn("modelVersion", metadata)
        self.assertGreater(metadata["metrics"]["accuracy"], 0.85)

    def test_feature_extraction(self):
        profile = {
            "educationLevel": "UNDERGRADUATE",
            "currentYear": 2,
            "class10Percentage": 88.0,
            "class12Percentage": 85.0,
            "undergraduateCgpa": 8.5,
            "annualFamilyIncome": 220000,
            "gender": "FEMALE",
            "category": "OBC",
            "domicileState": "TAMIL_NADU"
        }
        scholarship = {
            "id": "tata-trusts-scholarship",
            "governmentLevel": "PRIVATE",
            "state": "ALL_INDIA",
            "rules": [
                {"conditionField": "ANNUAL_INCOME", "valueJson": "600000"},
                {"conditionField": "CGPA", "valueJson": "7.0"}
            ]
        }
        vector, strengths, gaps = extract_features(profile, scholarship)
        self.assertEqual(len(vector), 30)
        self.assertGreaterEqual(len(strengths), 2)
        self.assertEqual(len(gaps), 0)

    def test_prediction_eligible_student(self):
        req = PredictRequest(
            studentProfile={
                "educationLevel": "UNDERGRADUATE",
                "currentYear": 3,
                "class10Percentage": 92.0,
                "class12Percentage": 90.0,
                "undergraduateCgpa": 8.8,
                "annualFamilyIncome": 180000,
                "gender": "FEMALE",
                "category": "OBC",
                "isObcNcl": True,
                "domicileState": "TAMIL_NADU"
            },
            scholarship={
                "id": "central-sector-scheme",
                "governmentLevel": "CENTRAL",
                "state": "ALL_INDIA",
                "rules": [
                    {"conditionField": "ANNUAL_INCOME", "valueJson": "450000"},
                    {"conditionField": "PERCENTAGE", "valueJson": "80.0"}
                ]
            }
        )
        res = predict_eligibility(req)
        self.assertTrue(res["isEligible"])
        self.assertGreaterEqual(res["matchScore"], 75.0)
        self.assertIn("Decision Tree", res["explanation"])

    def test_prediction_high_income_ineligible(self):
        req = PredictRequest(
            studentProfile={
                "educationLevel": "UNDERGRADUATE",
                "currentYear": 1,
                "class10Percentage": 75.0,
                "class12Percentage": 70.0,
                "undergraduateCgpa": 6.5,
                "annualFamilyIncome": 1500000, # 15 Lakhs
                "gender": "MALE",
                "category": "GENERAL",
                "domicileState": "DELHI"
            },
            scholarship={
                "id": "nsp-post-matric",
                "governmentLevel": "CENTRAL",
                "state": "ALL_INDIA",
                "rules": [
                    {"conditionField": "ANNUAL_INCOME", "valueJson": "250000"} # 2.5L limit
                ]
            }
        )
        res = predict_eligibility(req)
        self.assertGreater(len(res["criticalGaps"]), 0)
        self.assertTrue(any("income" in g.lower() for g in res["criticalGaps"]))

if __name__ == '__main__':
    unittest.main()
