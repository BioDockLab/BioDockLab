#!/usr/bin/env python3
import json
import sys
import urllib.request
import urllib.error
from urllib.parse import urlencode

BASE = "http://127.0.0.1:8000"
PATIENT_ID = "PT-2025-0520-0017"

def request(method, path, payload=None, query=None):
    if query:
        path = path + "?" + urlencode(query)

    url = BASE + path
    data = None
    headers = {}

    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            body = res.read().decode("utf-8")
            return res.status, json.loads(body) if body else None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = body
        return e.code, parsed
    except Exception as e:
        return None, {"error": str(e)}

def main():
    print("BioDockLab Smoke Test")
    print("=" * 60)

    failures = 0

    basic_tests = [
        ("health check", "GET", "/health", 200),
        ("clinical users", "GET", "/clinical/users", 200),
    ]

    for name, method, path, expected_status in basic_tests:
        status, body = request(method, path)
        ok = status == expected_status
        print(f"[{'PASS' if ok else 'FAIL'}] {name} -> {status}")
        if not ok:
            failures += 1
            print("  body:", body)

    print("\nRole-based access checks")
    print("=" * 60)

    access_cases = [
        ("patient", "Patient", "patient", True),
        ("patient", "Patient", "research_lab", False),
        ("doctor", "Doctor", "doctor", True),
        ("doctor", "Doctor", "security", False),
        ("pharmacist", "Pharmacist", "prescription", True),
        ("nurse", "Nurse", "nurse", True),
        ("nurse", "Nurse", "security", False),
        ("pharmacist", "Pharmacist", "security", False),
        ("admin_staff", "AdminStaff", "admin", True),
        ("admin_staff", "AdminStaff", "prescription", False),
        ("researcher", "Researcher", "research_lab", True),
        ("researcher", "Researcher", "patient", False),
        ("security", "Security", "security", True),
        ("security", "Security", "prescription", False),
        ("super_admin", "PlatformAdmin", "security", True),
        ("super_admin", "PlatformAdmin", "patient", True),
        ("bio_security_architect", "BioSecurityArchitect", "security", True),
        ("virtual_lab_developer", "VirtualLabDeveloper", "research_lab", True),
    ]

    for role, actor, view, expected in access_cases:
        payload = {
            "role": role,
            "actor": actor,
            "view": view,
            "patient_id": PATIENT_ID,
            "reason": "smoke test"
        }

        status, body = request("POST", "/security/access-check", payload)
        allowed = bool(body.get("allowed")) if isinstance(body, dict) else False
        ok = (status == 200 and allowed == expected)

        print(f"[{'PASS' if ok else 'FAIL'}] role={role:<28} view={view:<14} expected={expected} actual={allowed}")

        if not ok:
            failures += 1
            print("  body:", body)

    print("\nSecurity log visibility")
    print("=" * 60)

    status, body = request("GET", "/security/audit-logs", query={"role": "security", "actor": "Security"})
    ok = status == 200 and isinstance(body, list)
    print(f"[{'PASS' if ok else 'FAIL'}] audit logs readable by security -> {status}")

    if not ok:
        failures += 1
        print("  body:", body)

    print("\nResult")
    print("=" * 60)

    if failures:
        print(f"FAILED: {failures} issue(s)")
        sys.exit(1)

    print("ALL TESTS PASSED")

if __name__ == "__main__":
    main()
