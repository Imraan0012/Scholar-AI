import urllib.request
import json

def debug_evaluation():
    user_a_id = "11111111-2222-3333-4444-555555555555"
    req = urllib.request.Request(
        "http://localhost:8000/api/eligibility/results",
        headers={"X-User-Id": user_a_id}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        results_map = data.get("data", {})
        results = results_map.get("allResults", [])
        print(f"Total results: {len(results)}, Summary: {results_map.get('summary')}")
        for r in results[:10]:
            print(f"\nScholarship: {r.get('scholarshipName')} ({r.get('scholarshipId')})")
            print(f"  Status: {r.get('evaluationStatus')}, Score: {r.get('matchScore')}")
            print(f"  Matched: {r.get('matchedCriteria')}")
            print(f"  Failed: {r.get('failedCriteria')}")
            print(f"  Missing: {r.get('missingInformation')}")
            print(f"  Explanation: {r.get('explanation')}")

if __name__ == "__main__":
    debug_evaluation()
