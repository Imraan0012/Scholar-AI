import urllib.request
import json

def test_ml_predictions():
    # 1. Fetch first 5 scholarships from Spring Boot
    req = urllib.request.Request("http://localhost:8000/api/scholarships?page=0&size=10")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        scholarships = data.get("data", {}).get("scholarships", [])

    profile = {
        "fullName": "Ananya Sharma",
        "gender": "FEMALE",
        "educationLevel": "UNDERGRADUATE",
        "currentYear": 2,
        "class10Percentage": 92.0,
        "class12Percentage": 88.5,
        "undergraduateCgpa": 8.4,
        "annualFamilyIncome": 220000,
        "category": "OBC",
        "isObcNcl": True,
        "domicileState": "Maharashtra",
        "hasIncomeCertificate": True,
        "hasCategoryCertificate": True,
        "hasDomicileCertificate": True,
        "hasDisability": False,
        "isFarmerFamily": False,
        "isFirstGraduate": True
    }

    print(f"Testing ML engine on {len(scholarships)} scholarships for Ananya Sharma...")
    for s in scholarships:
        ml_req_body = {
            "studentProfile": profile,
            "scholarship": s
        }
        
        req_ml = urllib.request.Request(
            "http://localhost:8001/predict",
            data=json.dumps(ml_req_body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req_ml) as resp_ml:
                pred = json.loads(resp_ml.read().decode("utf-8"))
                print(f"Scholarship: {s.get('name')[:40]}... -> Eligible: {pred.get('isEligible')}, Score: {pred.get('matchScore')}, Tier: {pred.get('tier')}, Strengths: {len(pred.get('keyStrengths', []))}, Gaps: {len(pred.get('criticalGaps', []))}")
        except Exception as e:
            print(f"Error predicting {s.get('id')}: {e}")

if __name__ == "__main__":
    test_ml_predictions()
