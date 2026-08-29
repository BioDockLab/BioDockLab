# BioDockLab Open Positions and Required Skills

## 0. Additional Recruiting Plan

현재 BioDockLab은 초기 기획, 프로토타입, AI/데이터 관심 인력, 디자인 후보, 사업/회계 후보는 어느 정도 확보되어 있다.

다만 MVP 개발과 파일럿 제안 단계로 가기 위해서는 아래 인원을 추가로 모집해야 한다.

## 0.1 추가 모집 필요 인원 요약

| 우선순위 | 모집 포지션 | 필요 인원 | 모집 상태 | 이유 |
|---:|---|---:|---|---|
| P0 | Backend / Security Developer | 1명 | 필수 모집 | 역할 기반 접근제어, API, DB, 감사 로그 구현 필요 |
| P0 | Clinical Workflow Advisor | 1~2명 | 필수 모집 | 간호사·의사·약사·원무 화면의 현장성 검토 필요 |
| P0/P1 | Bio / Research Advisor | 1명 | 우선 모집 | Protein Atlas, 단백질·변이·질환·도킹 설명 검토 필요 |
| P1 | Frontend Developer | 1명 | 가능하면 모집 | 현재 UI를 더 안정적이고 상용화형 화면으로 개선 필요 |
| P1 | QA / Documentation | 1명 | 가능하면 모집 | 의료 표현, 개인정보, 기능 검증, 문서화 관리 필요 |
| P1 | AI / Data Engineer | 1명 | 후보 있음 / 보강 가능 | 설명 요약, 유사 사례, 사전문진 데이터 구조화 필요 |
| P2 | DevOps / Infra | 1명 | 후순위 모집 | 배포, Docker, 서버, 로그, 백업 구조 필요 |
| P2 | Legal / Privacy Advisor | 외부 자문 1명 | 후순위 / 외부 자문 | 실제 환자 데이터, 원격상담, 상용화 전 법률 검토 필요 |

## 0.2 현재 후보자 기준 부족한 포지션

현재 후보자 기준으로 보면 다음 영역은 어느 정도 확보 가능하다.

| 영역 | 후보 |
|---|---|
| Product / System Architecture | 이영준 |
| AI / Medical Data Interest | 류종걸 |
| UI / Design | ???  |
| Business / Data Strategy | 이상목 |
| Business / Finance / Healthcare Strategy | 이찬규 |

하지만 아래 영역은 아직 보강이 필요하다.

| 부족한 영역 | 필요한 이유 |
|---|---|
| Backend / Security | BioDockLab의 핵심인 권한제어와 감사 로그를 실제 서버에서 강제해야 함 |
| Clinical Workflow | 병원 현장 업무흐름, 간호사·의사·약사·원무 역할 구분 검토가 필요함 |
| Bio / Research | Protein Atlas와 Research Lab이 과학적으로 과장되지 않도록 검토해야 함 |
| QA / Compliance | 의료 표현, 개인정보, 접근권한 테스트를 체계적으로 관리해야 함 |

## 0.3 가장 먼저 뽑아야 할 사람

가장 먼저 필요한 사람은 **Backend / Security Developer**다.

이유:

- 현재 BioDockLab은 UI와 프로토타입은 어느 정도 구현되어 있다.
- 다음 단계에서는 “보이는 화면”보다 “서버에서 권한을 실제로 막는 구조”가 중요하다.
- 의료·바이오 데이터 플랫폼처럼 보이려면 RBAC, Audit Log, Access Denied, Risk Event가 백엔드에서 강제되어야 한다.

Backend / Security Developer가 맡을 핵심 작업:

- 로그인/회원가입 API
- 사용자 역할 모델
- 역할별 접근제어
- 권한 없는 접근 차단
- Audit Log DB 저장
- Risk Event 생성
- 관리자 권한 정책
- 민감정보 마스킹

## 0.4 두 번째로 필요한 사람

두 번째로 필요한 사람은 **Clinical Workflow Advisor**다.

이유:

- BioDockLab은 의료·간호 현장과 연결된 프로젝트처럼 보이기 때문에, 현장성이 없으면 설득력이 약해진다.
- 간호사 화면, 환자 설명 화면, 약사 화면, 원무 화면이 실제 업무흐름과 맞는지 검토해야 한다.
- 의료적으로 위험한 문구를 걸러야 한다.

Clinical Workflow Advisor가 검토할 핵심 질문:

- 간호사 화면에 바이탈·인수인계·투약 전 확인이 적절한가?
- 환자에게 보여주는 설명 문구가 위험하지 않은가?
- 의사·간호사·약사·원무가 볼 수 있는 정보 범위가 현실적인가?
- EMR/간호기록/처방 시스템을 대체하는 것처럼 보이지 않는가?

## 0.5 세 번째로 필요한 사람

세 번째로 필요한 사람은 **Bio / Research Advisor**다.

이유:

- Protein Atlas와 Virtual Docking Lab은 프로젝트의 연구·교육 확장 포인트다.
- 하지만 단백질, 변이, 질환, 후보 리간드, 도킹 점수를 잘못 설명하면 과학적으로 과장돼 보일 수 있다.
- 생명공학, 화학공학, 생명과학, 약학 관심자가 검토해야 한다.

Bio / Research Advisor가 맡을 핵심 작업:

- 단백질 설명 검토
- 변이·질환 연결 검토
- 후보 리간드 설명 검토
- 도킹 실험 문구 검토
- 교육·연구용 표현으로 제한

## 0.6 동아리 기반 모집 원칙

BioDockLab은 초기 단계에서 정식 채용 조직이 아니라 대학동아리 기반 프로젝트팀으로 운영한다.

팀원에게 제공할 수 있는 가치는 다음과 같다.

- 활동비
- 회의비
- 식비
- 교통비
- 공모전 수상금 배분
- GitHub 기여 기록
- 포트폴리오 산출물
- 발표/공모전 경험
- 의료·바이오 융합 프로젝트 경험
- 창업/사업화 검토 경험

주의:

- 실제 환자 데이터는 사용하지 않는다.
- 병원 내부 데이터는 무단 수집하지 않는다.
- 진단·처방·치료 추천 기능은 만들지 않는다.
- AI는 설명과 상담 준비를 보조하는 범위로 제한한다.
- 상용화 전에는 의료·보안·개인정보·법률 검토가 필요하다.

---


## 1. Purpose

이 문서는 BioDockLab 팀에서 추가로 모집해야 하는 포지션과 각 포지션별 요구 스킬, 사용 도구, 역할 범위를 정리한 문서다.

BioDockLab은 단순 웹앱이 아니라 의료·바이오 데이터, 역할 기반 접근제어, 환자 설명, 연구자 실험, 보안 감사 로그가 결합된 프로젝트다.

따라서 팀원은 단순히 “코드만 짜는 사람”이 아니라, 각자 맡은 영역에서 의료·바이오 데이터를 안전하고 이해하기 쉬운 시스템으로 만드는 역할을 맡는다.

---

## 2. Recruiting Priority Summary

| 우선순위 | 포지션 | 필요한 이유 |
|---:|---|---|
| 1 | Backend / Security Developer | 권한제어, 감사 로그, DB, API 구조가 핵심이기 때문 |
| 2 | Clinical Workflow Advisor | 간호사·의사·약사·원무 화면의 현장성이 필요하기 때문 |
| 3 | Bio / Research Advisor | Protein Atlas와 Research Lab의 과학적 검토가 필요하기 때문 |
| 4 | Frontend Developer | 현재 UI를 상용화 가능한 수준으로 개선해야 하기 때문 |
| 5 | QA / Documentation | 의료 표현, 개인정보, 기능 검증 문서화가 필요하기 때문 |
| 6 | DevOps / Infra | 배포, 서버, Docker, 운영 안정성이 필요하기 때문 |
| 7 | Legal / Privacy Advisor | 실제 환자 데이터나 상용화 전 법률 검토가 필요하기 때문 |

---

## 3. Backend / Security Developer

## Role

BioDockLab의 핵심인 역할 기반 접근제어, 계정, API, 감사 로그, 보안 이벤트를 구현하는 포지션이다.

## Main Work

- 로그인/회원가입 API
- 사용자 역할 관리
- 역할 기반 접근제어
- 환자/간호사/의사/약사/원무/연구자/보안관리자별 API 분리
- Audit Log 저장
- 권한 없는 접근 차단
- 내부자 과다열람 의심 이벤트 구조 설계
- 민감정보 마스킹
- 관리자 권한 관리

## Required Skills

- REST API 설계
- DB 모델링
- 인증/인가 이해
- RBAC / ABAC 기본 이해
- 보안 로그 구조 이해
- 테스트 코드 작성
- 에러 처리
- 개인정보보호 기본 감각

## Tools

- FastAPI 또는 Spring Boot
- Python 또는 Java/Kotlin
- PostgreSQL 또는 SQLite
- SQLAlchemy 또는 JPA
- JWT / Session
- OAuth2 / OIDC 기초
- bcrypt / argon2
- Docker
- Pytest
- OpenAPI / Swagger
- GitHub Issues / Projects

## Portfolio Value

- 의료·바이오 데이터 접근제어 시스템 구현 경험
- RBAC 기반 백엔드 설계 경험
- Audit Log 및 보안 이벤트 설계 경험
- 보안 중심 SaaS 백엔드 포트폴리오 확보

## Priority

P0

---

## 4. Clinical Workflow Advisor

## Role

간호사·의사·약사·원무 화면이 실제 병원 업무흐름과 맞는지 검토하는 포지션이다.

## Main Work

- Nurse Workspace 검토
- Patient View 의료 표현 검토
- Doctor Workspace 정보 구조 검토
- Pharmacist Workspace 처방 검토 범위 검토
- Administration View 원무 정보 범위 검토
- EMR/간호기록/처방 시스템과의 차이 정리
- 환자에게 위험하게 보일 수 있는 문구 지적
- 병원 현장에서 실제로 필요한 정보 우선순위 제안

## Required Skills

- 간호/의료 업무흐름 이해
- 병원 시스템에 대한 기본 이해
- 환자 커뮤니케이션 감각
- 의료 표현 민감도
- 개인정보보호 기본 감각
- 문서 피드백 능력

## Possible Background

- 간호학과
- 간호사
- 의사
- 약학 관련 전공
- 보건행정
- 병원 실무 경험자
- 의료정보관리 관심자

## Tools

- Google Docs
- PDF Review
- GitHub Issues Comment
- Figma Comment
- Markdown
- Zoom / Meet

## Portfolio Value

- 의료 IT 프로젝트 자문 경험
- 병원 업무흐름 기반 서비스 검토 경험
- 헬스케어 UX 검토 경험
- 창업/공모전 의료 자문 참여 경험

## Priority

P0

---

## 5. Bio / Research Advisor

## Role

Protein Atlas, Virtual Docking Lab, 단백질·변이·질환·리간드 설명의 과학적 타당성을 검토하는 포지션이다.

## Main Work

- Protein Atlas 구조 검토
- 단백질 기본 정보 검토
- 변이/질환/리간드 연결 검토
- Virtual Docking Lab 흐름 검토
- 과학적으로 과장된 표현 제거
- 교육·연구용 설명 문구 정리
- 공개 바이오 데이터 출처 제안

## Required Skills

- 단백질 구조 기본 이해
- 유전자 변이 기본 이해
- 질환-표적 관계 이해
- 리간드/화합물 개념 이해
- 도킹 실험 개념 이해
- 연구윤리 기본 이해
- 논문/공개 데이터 읽기 능력

## Possible Background

- 생명공학
- 생명과학
- 화학공학
- 약학 관심자
- 바이오인포매틱스 관심자
- 분자생물학 관심자

## Tools

- PDB
- UniProt
- PubChem
- RDKit
- BioPython
- PyMOL
- Mol*
- 3Dmol.js
- Google Scholar
- Markdown

## Portfolio Value

- 바이오 소프트웨어 프로젝트 참여 경험
- Protein Atlas 기획 경험
- 연구자용 UI 검토 경험
- 바이오 데이터 큐레이션 경험

## Priority

P0 / P1

---

## 6. Frontend Developer

## Role

BioDockLab의 역할별 화면을 실제 사용 가능한 수준으로 개선하는 포지션이다.

## Main Work

- Patient View UI
- Nurse Workspace UI
- Doctor Workspace UI
- Pharmacist Workspace UI
- Administration View UI
- Research Lab UI
- Security Center UI
- Admin Console UI
- Protein Atlas UI
- 반응형 화면 개선
- 접근 차단 화면 개선
- 대시보드 카드/차트/테이블 정리

## Required Skills

- React
- TypeScript
- Component-based UI
- API 연동
- 상태관리 기본 이해
- 반응형 레이아웃
- 접근성 기본 이해
- 데이터 시각화 기본 이해

## Tools

- React 또는 Next.js
- TypeScript
- Tailwind CSS
- Vite
- Axios 또는 Fetch
- Recharts
- Lucide Icons
- Figma
- GitHub

## Portfolio Value

- 헬스케어 SaaS UI 구현 경험
- 역할 기반 대시보드 구현 경험
- 실제 팀 프로젝트 프론트엔드 기여
- GitHub 기반 포트폴리오 확보

## Priority

P1

---

## 7. AI / Data Engineer

## Role

환자 설명 요약, 상담 질문 생성, 유사 사례 검색, 사전문진 요약 기능을 안전한 범위에서 기획/구현하는 포지션이다.

## Main Work

- 환자용 쉬운 설명 요약
- 의사용 상담 전 요약
- 질문 리스트 생성
- 유사 사례 검색 구조
- 사전문진 요약
- 위험 문구 필터링
- RAG 기반 문서 검색 실험
- 샘플 데이터 기반 AI 기능 검증

## Important Boundary

- AI는 진단하지 않는다.
- AI는 처방하지 않는다.
- AI는 치료 추천을 하지 않는다.
- AI는 설명과 상담 준비를 보조한다.
- 실제 환자 데이터는 사용하지 않는다.

## Required Skills

- Python
- LLM API 활용
- Prompt Engineering
- RAG 기본 이해
- Embedding Search
- 데이터 전처리
- 평가/Evaluation
- Hallucination Risk 관리

## Tools

- Python
- Pandas
- OpenAI API 또는 Local LLM
- LangChain
- LlamaIndex
- FAISS
- Chroma
- Jupyter Notebook
- FastAPI

## Portfolio Value

- 의료 안전 경계가 있는 AI 기능 설계 경험
- RAG 기반 유사 사례 검색 경험
- 상담 준비형 AI 서비스 기획 경험
- LLM 기능을 제품에 연결한 경험

## Priority

P1

---

## 8. QA / Documentation

## Role

BioDockLab의 기능, 의료 표현, 개인정보 위험, 문서 품질을 검수하는 포지션이다.

## Main Work

- 역할별 접근 테스트
- 권한 없는 접근 차단 테스트
- 환자 화면 의료 표현 검토
- 간호사/약사/원무 화면 정보 범위 체크
- 개인정보 위험 체크리스트 작성
- Smoke Test 실행
- 데모 런북 작성
- 전문가 피드백 로그 정리
- GitHub 문서 정리

## Required Skills

- 꼼꼼한 문서 검토
- 테스트 케이스 작성
- 사용자 시나리오 이해
- 의료 표현 민감도
- 개인정보 기본 이해
- Markdown 작성
- GitHub Issues 활용

## Tools

- GitHub Issues
- GitHub Projects
- Markdown
- Google Docs
- PDF
- Browser Testing
- Smoke Test Scripts
- Checklist

## Portfolio Value

- 의료 IT QA 경험
- 보안/개인정보 체크리스트 작성 경험
- 팀 프로젝트 문서화 경험
- 공모전/창업 프로젝트 증거 패키지 작성 경험

## Priority

P1

---

## 9. DevOps / Infra

## Role

BioDockLab의 개발환경, 배포환경, 서버 운영, 로그 관리, 백업 구조를 정리하는 포지션이다.

## Main Work

- Docker 환경 정리
- 개발/운영 환경 분리
- 서버 배포
- HTTPS 설정
- DB 백업
- 로그 수집
- GitHub Actions
- 모니터링
- 장애 대응 문서화

## Required Skills

- Linux 기본
- Docker
- 환경변수 관리
- 서버 배포
- Nginx / Reverse Proxy
- HTTPS
- CI/CD
- 로그 관리
- 백업/복구 기본

## Tools

- Docker
- Docker Compose
- GitHub Actions
- Nginx
- Uvicorn
- PostgreSQL
- Cloud Server
- Sentry or Basic Logging
- Bash

## Portfolio Value

- 헬스케어 SaaS 배포 환경 구성 경험
- Docker 기반 프로젝트 운영 경험
- CI/CD 구축 경험
- 운영 문서화 경험

## Priority

P2

---

## 10. Legal / Privacy Advisor

## Role

BioDockLab이 실제 서비스로 발전하기 전 의료법, 개인정보, 원격진료, 의료광고, 동의서 구조를 검토하는 외부 자문 포지션이다.

## Main Work

- 개인정보 처리방침 검토
- 실제 환자 데이터 사용 가능성 검토
- 의료광고 표현 검토
- 원격진료/상담 매칭 규제 검토
- 동의서/면책 문구 검토
- 연구용 비식별 데이터 사용 조건 검토

## Required Skills

- 개인정보보호법 이해
- 의료법 기본 이해
- 헬스케어 서비스 규제 이해
- 계약/동의서 검토
- 법적 위험 식별

## Tools

- Docs
- PDF Review
- Legal Checklist
- Meeting Notes

## Portfolio Value

- 헬스케어 스타트업 자문 경험
- 개인정보/의료 규제 검토 경험
- 산학협력/창업 프로젝트 법률 검토 경험

## Priority

P2 / External Advisor

---

## 11. Recruiting Message Template

BioDockLab은 의료·바이오 데이터를 역할별로 안전하게 보여주고, 환자 설명, 연구자 실험, 보안 감사 로그를 연결하는 웹 기반 프로토타입입니다.

현재는 실제 환자 데이터나 실제 진단 기능을 사용하지 않고, 샘플 데이터 기반 MVP로 개발합니다.

모집하는 역할은 다음과 같습니다.

- Backend / Security Developer
- Clinical Workflow Advisor
- Bio / Research Advisor
- Frontend Developer
- AI / Data Engineer
- QA / Documentation
- DevOps / Infra
- Legal / Privacy Advisor

팀원에게 제공 가능한 가치는 다음과 같습니다.

- 활동비
- 회의비
- 식비
- 교통비
- 공모전 수상금 배분
- GitHub 기여 기록
- 포트폴리오 산출물
- 발표/공모전 경험
- 의료·바이오 융합 프로젝트 경험
- 창업/사업화 검토 경험

중요 원칙:

- 실제 환자 데이터 사용 금지
- 병원 내부 데이터 무단 수집 금지
- 진단/처방/치료 추천 기능 금지
- AI는 설명과 상담 준비 보조로 제한
- 상용화 전 의료/보안/개인정보/법률 검토 필수

---

## 12. Final Recruiting Priority

가장 먼저 필요한 사람은 다음 순서다.

1. Backend / Security Developer
2. Clinical Workflow Advisor
3. Bio / Research Advisor
4. Frontend Developer
5. QA / Documentation
6. AI / Data Engineer
7. DevOps / Infra
8. Legal / Privacy Advisor
