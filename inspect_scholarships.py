import urllib.request
import json

def inspect_scholarships_and_rules():
    req = urllib.request.Request("http://localhost:8000/api/scholarships?page=0&size=100")
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        data = res.get("data", {})
        scholarships = data.get("scholarships", [])
        print(f"Fetched {len(scholarships)} scholarships from Supabase database.")
        
        for s in scholarships:
            rules = s.get("rules", [])
            print(f"ID: {s.get('id')} | Name: {s.get('name')} | GovLevel: {s.get('governmentLevel')} | State: {s.get('state')} | Rules: {len(rules)}")
            for r in rules:
                print(f"   - Field: {r.get('conditionField')}, Op: {r.get('operator')}, Val: {r.get('valueJson')}, Mand: {r.get('isMandatory')}")

if __name__ == "__main__":
    inspect_scholarships_and_rules()
