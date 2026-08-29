# BioDockLab Team Structure

## 1. 팀 구성 원칙

BioDockLab은 단순 웹앱이 아니라 의료·바이오 데이터, 역할 기반 접근제어, 환자 설명, 연구 워크플로우, 보안 감사가 결합된 플랫폼이다.

따라서 상용화 또는 팀 MVP를 목표로 할 경우 다음 직무가 필요하다.

---

## 2. 최소 MVP 팀

## 2.1 Product Architect / Founder

담당자: 이영준

역할:

- 전체 제품 방향 설계
- 역할 기반 구조 설계
- 화면 흐름 설계
- GitHub 문서화
- 교수/의료진 피드백 정리
- 발표/PPT/데모 패키지 제작
- 개발 우선순위 결정

핵심 역량:

- 시스템 설계
- 풀스택 프로토타입
- 문서화
- 발표/기획
- 보안/권한 구조 이해

---

## 2.2 Clinical Workflow Advisor

모집 인원:

- 간호학과 학생
- 간호사
- 의사
- 보건행정/원무 경험자

역할:

- 간호사 화면 검토
- 환자 설명 문구 검토
- EMR/간호기록/처방 시스템과의 차이 검토
- 병원 업무흐름 피드백
- 의료적으로 위험한 표현 지적

---

## 2.3 Frontend Developer

모집 인원:
- 디자인학과 학생

역할:

- 역할별 UI 구현
- Patient View
- Nurse Workspace
- Doctor Workspace
- Pharmacist Workspace
- Admin View
- Security Center
- Admin Console
- Protein Atlas UI
- 반응형 UI 개선

기술:

- React 또는 Next.js
- TypeScript
- Tailwind CSS
- Chart UI
- 3D Viewer UI

---

## 2.4 Backend / Security Developer

역할:

- 로그인/계정
- 역할 기반 접근제어
- API 설계
- Audit Log
- Risk Event
- Access Policy
- 민감정보 마스킹
- 관리자 권한 통제

기술:

- FastAPI 또는 Spring Boot
- PostgreSQL
- JWT/OAuth2
- RBAC/ABAC
- Audit Logging

---

## 2.5 Bio / Research Advisor

모집 인원:

- 생명공학
- 화학공학
- 바이오 관련 전공자
- 약학/생명과학 관심자

역할:

- Protein Atlas 검토
- 단백질/변이/질환 설명 검토
- 도킹 실험 흐름 검토
- 연구자 화면 현실성 검토
- 교육용 바이오 콘텐츠 검토

---

## 3. 확장 팀

## 3.1 AI Engineer

역할:

- 환자용 쉬운 설명 생성
- 의사용 요약 리포트 생성
- 상담 질문 리스트 생성
- 유사 사례 검색
- 사전문진 요약

주의:

- AI는 진단/처방을 하지 않는다.
- AI는 설명과 정리를 보조한다.

---

## 3.2 Bio Data Curator

역할:

- 단백질 데이터 정리
- 질환/변이 데이터 정리
- 약물/상호작용 데이터 구조화
- 샘플 환자 데이터 구조화
- 비식별 사례 데이터 설계

---

## 3.3 Bio Security Architect

역할:

- 의료·바이오 데이터 접근권한 설계
- 내부자 과다열람 탐지 모델
- Audit Log 정책
- 개인정보보호 구조
- 관리자 권한 통제
- 보안 리스크 문서화

---

## 3.4 QA / Compliance

역할:

- 역할별 접근 테스트
- 의료 표현 검수
- 개인정보 위험 확인
- 기능별 테스트
- 교수/의료진 피드백 반영 확인

---

## 4. 직무별 산출물

| 직무 | 주요 산출물 |
|---|---|
| Product Architect | 제품 정의서, 로드맵, PPT, 데모 흐름 |
| Clinical Workflow Advisor | 의료/간호 피드백, 위험 표현 목록 |
| Frontend Developer | 역할별 화면 구현 |
| Backend Developer | API, DB, 권한, 감사 로그 |
| Security Developer | 접근제어, 로그, 위험 이벤트 |
| Bio Advisor | Protein Atlas 검토, 연구 화면 검토 |
| AI Engineer | 요약/설명/사례 매칭 모델 |
| QA / Compliance | 테스트 리포트, 검수 체크리스트 |

---

## 5. 초기 팀 모집 우선순위

## 1순위

- 간호/의료 자문자
- 백엔드/보안 개발자
- 바이오/생명과학 자문자

## 2순위

- 프론트엔드 개발자
- AI 요약/검색 담당
- 디자인/UI 담당

## 3순위

- 법률/개인정보 자문
- 병원/창업지원 연결 담당

---

## 6. 이영준의 포지션

현재 이영준의 포지션은 단순 개발자가 아니라 다음에 가깝다.

**Founder / Product Architect / System Builder**

주요 역할:

- 문제 정의
- 제품 구조 설계
- 역할 기반 접근 모델 설계
- 핵심 프로토타입 구현
- GitHub/문서화
- 전문가 피드백 수집
- 팀 구성 및 개발 우선순위 결정