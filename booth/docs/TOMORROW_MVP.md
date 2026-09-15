# BioDockLab 내일 부스 MVP

## 관람객에게 보여 줄 한 문장

코로나19·메르스·신종플루를 겪은 세대가 이제 공개 바이오 데이터와 AI 도구를 이용해 집에서도 단백질 구조를 탐색하는 시대가 되었습니다.

## 실제 체험 경로

1. 감염병 단백질 아틀라스에서 단백질을 선택한다.
2. 공개 실험 구조의 출처와 단백질 기능을 확인한다.
3. 사전 계산·검수된 구조/도킹 결과를 탐색한다.
4. 후보물질을 비교하고 다음 연구 질문을 고른다.
5. 결과 리포트와 연구원 카드를 출력하거나 QR로 가져간다.

현장 표현은 반드시 `사전 계산된 교육용 결과`로 통일한다. Mac 또는 Raspberry Pi에서 AlphaFold와 AutoDock Vina를 새로 실행해 몇 분 안에 결과가 나왔다고 표현하지 않는다.

## 내일 12시 전 우선순위

### P0 — 부스가 멈추지 않게

- 감염병 단백질 아틀라스와 3개 심층 시나리오
- 오프라인 캐시 결과와 실패 시 데모 폴백
- A4 인쇄 1종, QR 전달
- Mac 메인 화면 + 두 번째 브라우저 결과 화면
- GPIO/WS2812B 서비스가 꺼져도 프론트엔드가 계속 동작

### P1 — 시간이 남으면

- NFC에는 개인정보 대신 세션 URL 또는 짧은 세션 ID만 기록
- 10초 퀴즈 3문항
- 연구원 성향 테스트 4문항
- Raspberry Pi의 실제 버튼/LED 어댑터

### 행사 뒤로 미룰 것

- 100개 전부의 실제 도킹 계산
- 현장 실시간 AlphaFold 전체 실행
- 암 세포주와 바이러스 단백질 결과를 한 분석으로 결합
- 대규모 리팩터링

## 데이터 역할

| 출처 | 이번 부스에서의 역할 | 주의 |
|---|---|---|
| NCBI | 바이러스 서열·유전체 식별자 | 내려받은 시점과 accession/version 기록 |
| UniProt | 단백질 기능·명칭 | reviewed/unreviewed 상태 기록 |
| RCSB PDB | 실험 3D 구조 | PDB ID, 실험법, 해상도 기록 |
| KCLB / SNU CRI | 한국 암 세포주·오가노이드 트랙 | 바이러스 단백질 카탈로그와 분리 |
| ATCC | 인증 세포주·reference omics 탐색 | 제품/사용 조건과 라이선스 확인 |
| Helix BioStructures | 산업의 단백질 특성 분석 절차 참고 | 공개 데이터 저장소로 표시하지 않음 |

## Mac에서 실행

```bash
cd booth
chmod +x scripts/run-mac-demo.sh
./scripts/run-mac-demo.sh
```

개별 실행이 필요하면 두 터미널을 연다.

```bash
cd booth
python3 mock-device/server.py
```

```bash
cd booth
npm ci
npm run dev
```

브라우저 주소는 `http://localhost:5173/?cellscope=device`이다.

## 스탠바이미 터치 운영

HDMI는 화면과 음성을 전달하지만 일반적인 USB 터치 모니터의 HID 입력 경로를 대신하지 않는다. Raspberry Pi에서 아래 진단을 먼저 실행한다.

```bash
cd ~/BioDockLab/booth
chmod +x scripts/diagnose-touch-pi.sh
./scripts/diagnose-touch-pi.sh
```

`Touchscreen` 또는 이에 해당하는 HID 입력 장치가 전혀 없다면 브라우저나 React 문제가 아니다. 내일 부스에서는 다음 구성을 우선 사용한다.

1. Pi와 스탠바이미를 같은 Wi-Fi에 연결한다.
2. Pi에서 `hostname -I`로 IP를 확인한다.
3. Pi에서 `./scripts/run-mac-demo.sh` 대신 `python3 mock-device/server.py`와 `npm run dev`를 실행한다.
4. 스탠바이미 내장 웹 브라우저에서 `http://<Pi-IP>:5173/?cellscope=device`를 연다.

앱은 네트워크 접속 시 현재 웹 서버의 IP에서 자동으로 `8765` 장비 API를 찾는다. 웹 서버와 장비 서버가 서로 다른 컴퓨터라면 다음처럼 명시한다.

```text
http://<Web-IP>:5173/?cellscope=device&cellscopeApi=http://<Pi-IP>:8765
```

## Raspberry Pi 5 연결 계약

프론트엔드는 `http://127.0.0.1:8765`에서 아래 API만 기대한다.

- `GET /api/cellscope/health`
- `GET /api/cellscope/sample`
- `POST /api/cellscope/capture`
- `POST /api/cellscope/analyze`
- `POST /api/cellscope/led`

WS2812B 상태는 `idle`, `checking-device`, `waiting-for-sample`, `sample-detected`, `capturing`, `analyzing`, `complete`, `error`이다. 실제 GPIO 라이브러리는 Pi 서비스 안에만 두고 React 앱에는 넣지 않는다.

## 심층 시나리오 3개

- SARS-CoV-2 Mpro — PDB 6LU7
- MERS-CoV Spike RBD–DPP4 — PDB 4L72
- 2009 H1N1 Neuraminidase–oseltamivir — PDB 3TI6

각 시나리오의 리포트에는 PDB 원문 링크, 교육용 표시, 사전 계산 날짜, 사용한 엔진과 버전, 입력 파일 해시를 남긴다.
