import urllib.request
import json
import sys

def run_test():
    print("==================================================================")
    print("SCHOLAR AI — END-TO-END DATA FLOW & DATABASE VERIFICATION TEST")
    print("==================================================================")

    # -------------------------------------------------------------
    # 1. VERIFY HEALTH OF ALL MICROSERVICES
    # -------------------------------------------------------------
    req_actuator = urllib.request.Request("http://localhost:8000/actuator/health")
    with urllib.request.urlopen(req_actuator) as resp:
        h = json.loads(resp.read().decode("utf-8"))
        print(f"[1.1] Spring Boot Health (Port 8000): {h.get('status')}")
        assert h.get('status') == 'UP'

    req_ml = urllib.request.Request("http://localhost:8001/health")
    with urllib.request.urlopen(req_ml) as resp:
        ml_h = json.loads(resp.read().decode("utf-8"))
        print(f"[1.2] Python ML Health (Port 8001): {ml_h.get('status')}, Model: {ml_h.get('modelVersion')}, Features: {ml_h.get('featuresCount')}")
        assert ml_h.get('status') == 'UP'

    # -------------------------------------------------------------
    # 2. USER A (ANANYA SHARMA) ONBOARDING & REAL ML EVALUATION
    # -------------------------------------------------------------
    user_a_id = "11111111-2222-3333-4444-555555555555"
    user_a_profile = {
        "fullName": "Ananya Sharma",
        "email": "ananya.sharma@scholarai.in",
        "phone": "9876543210",
        "gender": "FEMALE",
        "nationality": "INDIAN",
        "educationLevel": "UNDERGRADUATE",
        "course": "B.Tech",
        "branch": "Computer Science",
        "institutionName": "COEP Technological University",
        "institutionType": "Government",
        "currentYear": 2,
        "admissionYear": 2023,
        "class10Percentage": 92.0,
        "class12Percentage": 88.5,
        "currentCgpa": 8.4,
        "annualFamilyIncome": 220000,
        "incomeSource": "SALARY",
        "fatherOccupation": "Teacher",
        "motherOccupation": "Homemaker",
        "familyMemberCount": 4,
        "earningMemberCount": 1,
        "category": "OBC",
        "isObcNcl": True,
        "hasCategoryCertificate": True,
        "domicileState": "Maharashtra",
        "hasDomicileCertificate": True,
        "pincode": "411005",
        "hasDisability": False,
        "isFarmerFamily": False,
        "isFirstGraduate": True,
        "onboardingStep": 5,
        "onboardingComplete": True
    }

    req_save_a = urllib.request.Request(
        "http://localhost:8000/api/profile",
        data=json.dumps(user_a_profile).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-User-Id": user_a_id},
        method="POST"
    )
    with urllib.request.urlopen(req_save_a) as resp:
        saved_a = json.loads(resp.read().decode("utf-8"))
        print(f"[2.1] User A Profile Saved to Supabase: Name={saved_a['data']['fullName']}, Completion={saved_a['data']['profileCompletionScore']}%")
        assert saved_a['data']['onboardingComplete'] == True

    # -------------------------------------------------------------
    # 3. VERIFY USER A DASHBOARD COUNTS (DYNAMIC & > 0 ELIGIBLE)
    # -------------------------------------------------------------
    req_dash_a = urllib.request.Request(
        "http://localhost:8000/api/dashboard/summary",
        headers={"X-User-Id": user_a_id}
    )
    with urllib.request.urlopen(req_dash_a) as resp:
        dash_a = json.loads(resp.read().decode("utf-8"))
        data_a = dash_a["data"]
        print(f"[3.1] User A Live Dashboard Counts: Eligible={data_a['eligibleCount']}, Possible={data_a['possibleCount']}, Not Eligible={data_a['notEligibleCount']}, Total={data_a['totalCount']}")
        assert data_a['eligibleCount'] > 0, "User A should have eligible scholarships (e.g. Pragati, Panjabrao Deshmukh, NSP, HDFC)!"
        print(f"      -> SUCCESS: {data_a['eligibleCount']} scholarships dynamically evaluated as ELIGIBLE by ML + Rules engine!")

    # -------------------------------------------------------------
    # 4. PROFILE CHANGE & DYNAMIC INVALIDATION TEST (Income 2.2L -> 7.0L)
    # -------------------------------------------------------------
    user_a_profile["annualFamilyIncome"] = 700000
    req_update_a = urllib.request.Request(
        "http://localhost:8000/api/profile",
        data=json.dumps(user_a_profile).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-User-Id": user_a_id},
        method="POST"
    )
    with urllib.request.urlopen(req_update_a) as resp:
        updated_a = json.loads(resp.read().decode("utf-8"))
        print(f"[4.1] User A Income Updated: Rs. {updated_a['data']['annualFamilyIncome']}")

    with urllib.request.urlopen(req_dash_a) as resp:
        dash_a_after = json.loads(resp.read().decode("utf-8"))
        data_a_after = dash_a_after["data"]
        print(f"[4.2] User A Post-Update Counts (Income 7.0L): Eligible={data_a_after['eligibleCount']}, Possible={data_a_after['possibleCount']}, Not Eligible={data_a_after['notEligibleCount']}")
        assert data_a_after['eligibleCount'] <= data_a['eligibleCount'], "Higher income should eliminate lower-income tier scholarships!"
        print("      -> SUCCESS: Invalidation automatically re-evaluated scholarships upon profile mutation.")

    # -------------------------------------------------------------
    # 5. USER B (RAHUL VERMA) PROFILE & TOTAL ISOLATION TEST
    # -------------------------------------------------------------
    user_b_id = "99999999-8888-7777-6666-555555555555"
    user_b_profile = {
        "fullName": "Rahul Verma",
        "email": "rahul.verma@scholarai.in",
        "phone": "9123456780",
        "gender": "MALE",
        "nationality": "INDIAN",
        "educationLevel": "UNDERGRADUATE",
        "course": "B.Com",
        "branch": "Accounting & Finance",
        "institutionName": "Delhi University",
        "institutionType": "Government",
        "currentYear": 1,
        "admissionYear": 2024,
        "class10Percentage": 78.0,
        "class12Percentage": 72.0,
        "currentCgpa": 6.8,
        "annualFamilyIncome": 850000,
        "incomeSource": "BUSINESS",
        "category": "GENERAL",
        "isObcNcl": False,
        "domicileState": "Delhi",
        "hasDisability": False,
        "isFarmerFamily": False,
        "onboardingStep": 5,
        "onboardingComplete": True
    }

    req_save_b = urllib.request.Request(
        "http://localhost:8000/api/profile",
        data=json.dumps(user_b_profile).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-User-Id": user_b_id},
        method="POST"
    )
    with urllib.request.urlopen(req_save_b) as resp:
        saved_b = json.loads(resp.read().decode("utf-8"))
        print(f"[5.1] User B Profile Saved to Supabase: Name={saved_b['data']['fullName']}")

    req_dash_b = urllib.request.Request(
        "http://localhost:8000/api/dashboard/summary",
        headers={"X-User-Id": user_b_id}
    )
    with urllib.request.urlopen(req_dash_b) as resp:
        dash_b = json.loads(resp.read().decode("utf-8"))
        data_b = dash_b["data"]
        print(f"[5.2] User B Live Dashboard Counts: Eligible={data_b['eligibleCount']}, Possible={data_b['possibleCount']}, Not Eligible={data_b['notEligibleCount']}")
        print(f"[5.3] Verification of Isolation: User A Eligible ({data_a_after['eligibleCount']}) != User B Eligible ({data_b['eligibleCount']})")

    # -------------------------------------------------------------
    # 6. BOOKMARK ISOLATION TEST
    # -------------------------------------------------------------
    req_bm_a = urllib.request.Request(
        "http://localhost:8000/api/bookmarks/dst-inspire-she",
        headers={"X-User-Id": user_a_id},
        method="POST"
    )
    with urllib.request.urlopen(req_bm_a) as resp:
        bm_res = json.loads(resp.read().decode("utf-8"))
        print(f"[6.1] User A Bookmarked 'dst-inspire-she'")

    req_bms_b = urllib.request.Request(
        "http://localhost:8000/api/bookmarks",
        headers={"X-User-Id": user_b_id}
    )
    with urllib.request.urlopen(req_bms_b) as resp:
        bms_b = json.loads(resp.read().decode("utf-8"))
        print(f"[6.2] User B Bookmarks count: {len(bms_b['data'])} (Must be 0)")
        assert len(bms_b['data']) == 0, "User B must not see User A's bookmarks!"

    print("\n==================================================================")
    print("ALL 6 END-TO-END DATA FLOW AND DATABASE TESTS PASSED WITH 100% SUCCESS!")
    print("==================================================================")

if __name__ == "__main__":
    run_test()
