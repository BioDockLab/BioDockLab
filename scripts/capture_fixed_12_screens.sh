#!/usr/bin/env bash

set -e

BASE_DIR="$HOME/Documents/001.개발/BioDockLab"
SHOT_DIR="$BASE_DIR/docs/review/screenshots"

mkdir -p "$SHOT_DIR"

echo "======================================"
echo "BioDockLab 01~12 화면 캡처"
echo "======================================"
echo "저장 위치: $SHOT_DIR"
echo ""
echo "각 화면이 열리면 화면이 완전히 뜬 뒤 Enter를 누르세요."
echo "그 다음 마우스로 캡처 영역을 드래그하면 됩니다."
echo ""

capture() {
  local filename="$1"
  local url="$2"
  local title="$3"
  local desc="$4"

  echo ""
  echo "--------------------------------------"
  echo "$filename"
  echo "$title"
  echo "$desc"
  echo "--------------------------------------"
  echo ""
  open "$url"

  echo "화면이 완전히 뜨면 Enter를 누르세요."
  read -r

  echo "캡처 영역을 드래그하세요."
  screencapture -i "$SHOT_DIR/$filename"

  echo "저장 완료: $SHOT_DIR/$filename"
}

capture \
"01_login_role_based_access.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=login" \
"01. 역할 기반 로그인 화면" \
"환자·간호사·의사·약사·원무·연구자·보안관리자가 서로 다른 권한으로 접속하는 진입 화면"

capture \
"02_patient_explanation_report.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=patient&view=patient" \
"02. 환자/의사용 결과 설명 리포트" \
"복잡한 검사 결과와 후보 치료제 정보를 환자와 의료진이 이해하기 쉽게 확인하는 설명 보조 화면"

capture \
"03_nurse_handoff_workspace.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=nurse&view=nurse" \
"03. 간호사용 바이탈·인수인계 보조 화면" \
"바이탈 요약, 투약 전 확인, 인수인계 요약을 제공하지만 EMR이나 간호기록을 대체하지 않는 보조 화면"

capture \
"04_doctor_result_summary.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=doctor&view=doctor" \
"04. 의사용 결과 요약 화면" \
"환자 상태, 검사 결과, 설명 리포트, 상담 준비 정보를 의료진 관점에서 확인하는 화면"

capture \
"05_pharmacist_prescription_review.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=pharmacist&view=prescription" \
"05. 약사용 처방 검토 화면" \
"처방량, 병용약, 약물상호작용, 유전자 적합성 정보를 중심으로 검토하는 화면"

capture \
"06_admin_consent_document_view.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=admin_staff&view=admin" \
"06. 원무용 예약·동의서·서류 상태 화면" \
"원무는 예약, 동의서, 서류 발급 상태 등 업무에 필요한 최소 정보만 확인하고 진단·처방 상세는 제한되는 구조"

capture \
"07_research_virtual_docking_lab.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=researcher&view=research_lab" \
"07. 연구자용 단백질-화합물 가상 도킹 실험 화면" \
"타겟 단백질, 후보 화합물, 3D 구조, 도킹 점수, 실험 파라미터를 확인하는 연구 워크플로우 화면"

capture \
"08_security_audit_center.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=security&view=security" \
"08. 보안관리자용 접근 감사 로그 화면" \
"누가 어떤 정보에 접근했는지, 권한 밖 접근이 있었는지, 내부자 과다열람 의심 이벤트가 있는지 확인하는 화면"

capture \
"09_platform_admin_policy_matrix.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=super_admin&view=admin_console" \
"09. 플랫폼 관리자용 권한 정책 매트릭스 화면" \
"역할별 접근 가능 화면, 차단 정책, 계정 관리, 상용화 보안 체크리스트를 확인하는 관리자 화면"

capture \
"10_access_denied_audit_log.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=patient&view=security" \
"10. 권한 없는 접근 차단 화면" \
"사용자가 허용되지 않은 화면에 접근하려 할 때 차단하고, 해당 시도를 보안 감사 로그에 기록하는 화면"

capture \
"11_nurse_role_workspace.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=nurse&view=role_workspace" \
"11. 간호사 역할별 워크스페이스 화면" \
"간호사가 수행하는 주요 업무, 접근 가능한 데이터, 제한되는 데이터, 생성 산출물을 정리한 역할 설명 화면"

capture \
"12_bio_security_architect_workspace.png" \
"http://127.0.0.1:5500/clinical_v3.html?capture=1&role=bio_security_architect&view=role_workspace" \
"12. Bio Security Architect 워크스페이스 화면" \
"바이오그래머 직무 중 보안·권한·감사 로그·내부자 위험 탐지를 설계하는 역할을 보여주는 화면"

echo ""
echo "======================================"
echo "01~12 캡처 완료"
echo "저장 위치: $SHOT_DIR"
echo "======================================"

ls -lh "$SHOT_DIR"/0*.png "$SHOT_DIR"/1*.png 2>/dev/null || true
