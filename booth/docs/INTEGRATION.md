# 기존 BioDockLab 저장소 통합 전략

## 판단

기존 저장소는 실험 데이터, 위험도/우선순위 분석, 디지털 트윈, 연구 보고서 중심의 광범위한 연구 플랫폼 프로토타입입니다. 부스 앱은 목적·사용자·운영 환경이 다르므로 기존 `src/`를 즉시 교체하지 않습니다.

## 권장 구조

```text
BioDockLab/
├─ booth/               # 부스 교육용 앱 — 이번 패키지
├─ src/                 # 기존 루트 Vite 프로토타입
├─ frontend/            # 기존 실험 UI/레거시
├─ backend/
├─ ai/
├─ simulation/
└─ docs/
```

## 이유

- 기존 112개 커밋의 이력과 프로토타입을 보존
- 병원·임상 느낌의 레거시 UI가 부스 화면에 혼입되는 것을 차단
- 1학년 팀원이 독립된 경계에서 개발 가능
- 행사 후 필요할 때 공통 데이터 모델이나 API만 선택적으로 통합 가능

## 첫 통합 PR

브랜치: `feature/booth-experience-mvp`

커밋:

```text
feat(booth): add educational booth experience MVP
```

PR 설명에 다음을 명시합니다.

- 의료·임상 시스템이 아니라 교육용 부스 앱
- 기존 backend와 연결하지 않는 정적 데이터 MVP
- 수치와 후보물질은 검증 전 예시 데이터
- 실제 계산 기능은 비범위
