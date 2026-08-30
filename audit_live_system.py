import urllib.request
import json
import os

# Script to query Spring Boot backend and Supabase to audit all table rows, counts, and structures
def run_audit():
    print("=======================================================")
    print("SCHOLAR AI — COMPLETE SYSTEM & DATABASE AUDIT")
    print("=======================================================")
    
    # 1. Check Spring Boot Health
    try:
        req = urllib.request.Request("http://localhost:8000/actuator/health")
        with urllib.request.urlopen(req) as resp:
            health = json.loads(resp.read().decode("utf-8"))
            print(f"[Backend Health] Status: {health.get('status')}")
    except Exception as e:
        print(f"[Backend Health] ERROR: {e}")

    # 2. Check Python ML Engine Health
    try:
        req = urllib.request.Request("http://localhost:8001/health")
        with urllib.request.urlopen(req) as resp:
            ml_health = json.loads(resp.read().decode("utf-8"))
            print(f"[ML Engine Health] Status: {ml_health.get('status')}, Model: {ml_health.get('modelVersion')}, Features: {ml_health.get('featuresCount')}")
    except Exception as e:
        print(f"[ML Engine Health] ERROR: {e}")

    # 3. Query Scholarships from Spring Boot
    try:
        req = urllib.request.Request("http://localhost:8000/api/scholarships?page=0&size=100")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            scholarships = data.get("data", {}).get("content", [])
            total_elements = data.get("data", {}).get("totalElements", 0)
            print(f"[Scholarships in DB] Total: {total_elements}, Loaded: {len(scholarships)}")
            
            # Inspect first 3 scholarships and their rules
            for i, s in enumerate(scholarships[:3]):
                print(f"  Scholarship #{i+1}: {s.get('name')} | Provider: {s.get('provider')} | Level: {s.get('governmentLevel')} | Rules Count: {len(s.get('rules', []))}")
                for r in s.get('rules', [])[:2]:
                    print(f"    - Rule: field={r.get('conditionField')}, op={r.get('operator')}, val={r.get('valueJson')}, mandatory={r.get('isMandatory')}")
    except Exception as e:
        print(f"[Scholarships DB] ERROR: {e}")

    # 4. Query Sources from Spring Boot
    try:
        req = urllib.request.Request("http://localhost:8000/api/sources")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            sources = data.get("data", [])
            print(f"[Sources in DB] Count: {len(sources)}")
    except Exception as e:
        print(f"[Sources DB] ERROR: {e}")

if __name__ == "__main__":
    run_audit()
