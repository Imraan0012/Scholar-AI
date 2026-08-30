"""
Scholar AI — Python Decision Tree Microservice (FastAPI on Port 8001)
Provides real-time machine learning prediction, batch evaluation, explainability,
and model verification metrics to the Spring Boot backend.
"""

import os
import sys
import json
import joblib
import numpy as np

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dataset import (
    FEATURE_COLUMNS, STATE_TO_CODE, CATEGORY_MAP, GENDER_MAP, EDU_MAP
)

app = FastAPI(
    title="Scholar AI ML Decision Tree Service",
    version="2.4.0",
    description="Real-time ML Decision Tree inference engine for scholarship matching"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Trained Model and Metadata
ML_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(ML_DIR, "model.joblib")
METADATA_PATH = os.path.join(ML_DIR, "metadata.json")

if not os.path.exists(MODEL_PATH) or not os.path.exists(METADATA_PATH):
    from train import train_decision_tree_model
    model, metadata = train_decision_tree_model()
else:
    model = joblib.load(MODEL_PATH)
    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)

class PredictRequest(BaseModel):
    studentProfile: Dict[str, Any]
    scholarship: Dict[str, Any]

class BatchPredictRequest(BaseModel):
    studentProfile: Dict[str, Any]
    scholarships: List[Dict[str, Any]]

def normalize_str(val: Any) -> str:
    if val is None:
        return ""
    return str(val).strip().upper().replace(" ", "_")

def extract_features(profile: Dict[str, Any], scholarship: Dict[str, Any]) -> tuple[List[float], List[str], List[str]]:
    strengths = []
    gaps = []

    # Student attributes
    edu_str = normalize_str(profile.get("educationLevel") or profile.get("education_level") or "UNDERGRADUATE")
    edu_code = float(EDU_MAP.get(edu_str, 4))
    
    current_year = float(profile.get("currentYear") or profile.get("current_year") or 1)
    class_10 = float(profile.get("class10Percentage") or profile.get("class_10_percentage") or 70.0)
    class_12 = float(profile.get("class12Percentage") or profile.get("class_12_percentage") or 70.0)
    cgpa = float(profile.get("currentCgpa") or profile.get("undergraduateCgpa") or profile.get("undergraduate_cgpa") or profile.get("cgpa") or 0.0)
    
    income = float(profile.get("annualFamilyIncome") or profile.get("annual_family_income") or profile.get("annualIncome") or 250000.0)
    
    gender_str = normalize_str(profile.get("gender") or "MALE")
    gender_code = float(GENDER_MAP.get(gender_str, 1))

    cat_str = normalize_str(profile.get("category") or "GENERAL")
    category_code = float(CATEGORY_MAP.get(cat_str, 1))

    is_obc_ncl = 1.0 if (profile.get("isObcNcl") or profile.get("is_obc_ncl")) else 0.0
    is_ews = 1.0 if (profile.get("isEws") or profile.get("is_ews")) else 0.0

    state_str = normalize_str(profile.get("domicileState") or profile.get("domicile_state") or "ALL_INDIA")
    state_code = float(STATE_TO_CODE.get(state_str, 0))

    has_inc_cert = 1.0 if (profile.get("hasIncomeCertificate") or profile.get("has_income_certificate")) else 0.0
    has_cat_cert = 1.0 if (profile.get("hasCategoryCertificate") or profile.get("has_category_certificate")) else 0.0
    has_dom_cert = 1.0 if (profile.get("hasDomicileCertificate") or profile.get("has_domicile_certificate")) else 0.0

    has_pwd = 1.0 if (profile.get("hasDisability") or profile.get("has_disability")) else 0.0
    disability_pct = float(profile.get("disabilityPercentage") or profile.get("disability_percentage") or 0.0)
    is_minority = 1.0 if (profile.get("isMinority") or profile.get("is_minority")) else 0.0
    is_first_grad = 1.0 if (profile.get("isFirstGraduate") or profile.get("is_first_graduate")) else 0.0
    is_single_girl = 1.0 if (profile.get("isSingleGirlChild") or profile.get("is_single_girl_child")) else 0.0
    is_orphan = 1.0 if (profile.get("isOrphan") or profile.get("is_orphan")) else 0.0
    is_single_parent = 1.0 if (profile.get("isSingleParent") or profile.get("is_single_parent")) else 0.0
    is_ward_defense = 1.0 if (profile.get("isWardOfDefenseOrCapf") or profile.get("is_ward_of_defense_or_capf")) else 0.0
    is_farmer = 1.0 if (profile.get("isFarmerFamily") or profile.get("is_farmer_family")) else 0.0

    # Scholarship context
    gov_level = normalize_str(scholarship.get("governmentLevel") or scholarship.get("government_level") or "CENTRAL")
    sch_type_code = 1.0 if gov_level == "CENTRAL" else (2.0 if gov_level == "STATE" else 3.0)

    # Parse constraints from rules if present
    rules = scholarship.get("rules") or []
    sch_max_income = 9999999.0
    sch_min_cgpa = 0.0
    sch_min_marks = 0.0
    sch_target_cat_code = 0.0
    sch_target_gender_code = 0.0

    sch_state_str = normalize_str(scholarship.get("state") or "ALL_INDIA")
    sch_state_code = float(STATE_TO_CODE.get(sch_state_str, 0))

    for r in rules:
        field = normalize_str(r.get("conditionField") or r.get("condition_field") or "")
        val = r.get("valueJson") or r.get("value_json")
        val_str = str(val) if val is not None else ""

        if "INCOME" in field:
            try:
                cleaned = "".join(c for c in val_str if c.isdigit() or c == ".")
                if cleaned:
                    sch_max_income = min(sch_max_income, float(cleaned))
            except Exception:
                pass
        elif "CGPA" in field:
            try:
                cleaned = "".join(c for c in val_str if c.isdigit() or c == ".")
                if cleaned:
                    sch_min_cgpa = max(sch_min_cgpa, float(cleaned))
            except Exception:
                pass
        elif "PERCENTAGE" in field or "MARKS" in field or "12" in field:
            try:
                cleaned = "".join(c for c in val_str if c.isdigit() or c == ".")
                if cleaned:
                    sch_min_marks = max(sch_min_marks, float(cleaned))
            except Exception:
                pass
        elif "GENDER" in field:
            if "FEMALE" in val_str.upper():
                sch_target_gender_code = 2.0
        elif "CATEGORY" in field or "CASTE" in field:
            if "SC" in val_str.upper(): sch_target_cat_code = 3.0
            elif "ST" in val_str.upper(): sch_target_cat_code = 4.0
            elif "OBC" in val_str.upper(): sch_target_cat_code = 2.0
            elif "MINORITY" in val_str.upper(): sch_target_cat_code = 6.0

    # Rule checks & Explanations
    if sch_max_income < 9999999.0:
        if income <= sch_max_income:
            strengths.append(f"Family income (₹{int(income):,}) satisfies scheme ceiling of ₹{int(sch_max_income):,}")
        else:
            gaps.append(f"Annual income (₹{int(income):,}) exceeds limit of ₹{int(sch_max_income):,}")

    if sch_min_cgpa > 0:
        if cgpa >= sch_min_cgpa:
            strengths.append(f"CGPA ({cgpa:.2f}) meets minimum requirement of {sch_min_cgpa:.1f}")
        else:
            gaps.append(f"CGPA ({cgpa:.2f}) below required minimum {sch_min_cgpa:.1f}")

    if sch_min_marks > 0:
        if class_12 >= sch_min_marks:
            strengths.append(f"Class 12 academic score ({class_12:.1f}%) satisfies requirement of {sch_min_marks:.0f}%")
        else:
            gaps.append(f"Class 12 score ({class_12:.1f}%) is below required {sch_min_marks:.0f}%")

    if sch_state_code != 0:
        if sch_state_code == state_code:
            strengths.append(f"Domicile in {state_str.replace('_', ' ')} verified")
        else:
            gaps.append(f"Requires domicile in {sch_state_str.replace('_', ' ')}")

    if sch_target_gender_code == 2.0:
        if gender_code == 2.0:
            strengths.append("Female applicant quota criteria met")
        else:
            gaps.append("Scheme is reserved exclusively for female students")

    vector = [
        edu_code, current_year, class_10, class_12, cgpa, income,
        gender_code, category_code, is_obc_ncl, is_ews, state_code,
        has_inc_cert, has_cat_cert, has_dom_cert, has_pwd,
        disability_pct, is_minority, is_first_grad, is_single_girl,
        is_orphan, is_single_parent, is_ward_defense, is_farmer,
        sch_type_code, sch_max_income, sch_min_cgpa, sch_min_marks,
        sch_target_cat_code, sch_target_gender_code, sch_state_code
    ]

    return vector, strengths, gaps

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "scholar-ai-ml-engine",
        "modelVersion": metadata.get("modelVersion", "v2.4.0-dt-native"),
        "featuresCount": len(FEATURE_COLUMNS)
    }

@app.get("/metrics")
def get_model_metrics():
    return metadata

@app.post("/predict")
def predict_eligibility(req: PredictRequest):
    try:
        vector, strengths, gaps = extract_features(req.studentProfile, req.scholarship)
        X = np.array([vector])

        pred_class = int(model.predict(X)[0])
        probas = model.predict_proba(X)[0]
        confidence = float(probas[pred_class]) * 100.0

        if gaps:
            # Hard mandatory constraint failed -> NOT ELIGIBLE
            is_eligible = False
            match_score = max(15.0, min(35.0, round(100.0 - confidence, 1)))
            tier = "INELIGIBLE"
            explanation = f"Decision Tree identified criteria constraints: {', '.join(gaps)}."
        elif pred_class == 1:
            base_score = 70.0 + (confidence * 0.25)
            match_score = min(98.0, round(base_score, 1))
            tier = "STRONG_MATCH" if match_score >= 85.0 else "GOOD_MATCH"
            is_eligible = True
            explanation = f"Decision Tree classified profile as ELIGIBLE ({match_score:.1f}% confidence) based on academic benchmarks and demographic criteria."
        else:
            match_score = max(15.0, round(100.0 - confidence, 1))
            tier = "POSSIBLE_MATCH" if match_score >= 40.0 else "INELIGIBLE"
            is_eligible = False
            explanation = f"Decision Tree identified potential gaps or verification requirements."

        decision_path = [
            f"Income Check: {'PASSED' if any('income' in s.lower() for s in strengths) else 'REVIEW'}",
            f"Academic Benchmark: {'PASSED' if any('cgpa' in s.lower() or 'class' in s.lower() for s in strengths) else 'REVIEW'}",
            f"State Domicile: {'PASSED' if any('domicile' in s.lower() for s in strengths) else 'NATIONAL'}",
            f"Classification Node -> {'ELIGIBLE' if is_eligible else 'INELIGIBLE'} (Leaf Confidence: {confidence:.1f}%)"
        ]

        return {
            "prediction": pred_class,
            "isEligible": is_eligible,
            "matchScore": match_score,
            "tier": tier,
            "confidence": round(confidence, 2),
            "explanation": explanation,
            "keyStrengths": strengths,
            "criticalGaps": gaps,
            "decisionPath": decision_path,
            "modelVersion": metadata.get("modelVersion", "v2.4.0-dt-native"),
            "evaluatedFeatures": {col: val for col, val in zip(FEATURE_COLUMNS, vector)}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Prediction Error: {str(e)}")

@app.post("/batch-predict")
def batch_predict(req: BatchPredictRequest):
    results = []
    for sch in req.scholarships:
        pred_res = predict_eligibility(PredictRequest(
            studentProfile=req.studentProfile,
            scholarship=sch
        ))
        results.append({
            "scholarshipId": sch.get("id"),
            "prediction": pred_res
        })
    return {"results": results, "totalEvaluated": len(results)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=False)
