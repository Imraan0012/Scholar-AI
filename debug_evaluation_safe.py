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
        for r in results[:5]:
            name = r.get('scholarshipName', '').encode('ascii', 'ignore').decode('ascii')
            status = r.get('evaluationStatus')
            score = r.get('matchScore')
            print(f"\nScholarship: {name}")
            print(f"  Status: {status}, Score: {score}")
            print("  Matched:")
            for m in r.get('matchedCriteria', []):
                print(f"    + {m.encode('ascii', 'ignore').decode('ascii')}")
            print("  Failed:")
            for f in r.get('failedCriteria', []):
                print(f"    - {f.encode('ascii', 'ignore').decode('ascii')}")

if __name__ == "__main__":
    debug_evaluation()
