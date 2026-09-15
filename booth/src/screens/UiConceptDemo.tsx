import { useState } from 'react';
import { KioskShell } from '../components/ui/KioskShell';
import { Protein3DViewer } from '../components/Protein3DViewer';
import {
  dockingTargetByProteinId,
  type DeepDiveProteinId,
} from '../data/dockingTargets';
import { dockingResultByProteinId } from '../data/dockingResults';

type Screen =
  | 'home'
  | 'atlas'
  | 'structure'
  | 'binding'
  | 'compare'
  | 'report'
  | 'done';

const CANDIDATE_INDEX_KEY =
  'biodocklab-selected-candidate-index';

function readSelectedCandidateIndex(): number {
  try {
    const raw = localStorage.getItem(
      CANDIDATE_INDEX_KEY,
    );

    const value = Number(raw);

    if (
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 2
    ) {
      return value;
    }
  } catch {
    // continue with default
  }

  return 1;
}

function saveSelectedCandidateIndex(
  index: number,
) {
  try {
    localStorage.setItem(
      CANDIDATE_INDEX_KEY,
      String(index),
    );
  } catch {
    // kiosk remains usable without storage
  }
}


const diseaseCards = [
  {
    label: 'COVID-19',
    proteinId: 'sars2-mpro' as DeepDiveProteinId,
    protein: 'SARS‑CoV‑2 Mpro',
    sub: 'Main protease (Mpro)',
    pdb: '6LU7',
    color: 'red',
    note: '바이러스가 복제될 때 꼭 필요한 단백질로, 구조 기반 치료제 후보 탐색의 핵심 표적입니다.',
  },
  {
    label: 'MERS',
    proteinId: 'mers-mpro' as DeepDiveProteinId,
    protein: 'MERS‑CoV Mpro',
    sub: 'Main protease (Mpro)',
    pdb: '4YLU',
    color: 'green',
    note: 'MERS 바이러스의 복제에 필수적인 단백질을 표적으로, 새로운 치료제 개발 가능성을 탐색합니다.',
  },
  {
    label: 'H1N1',
    proteinId: 'h1n1-neuraminidase' as DeepDiveProteinId,
    protein: 'H1N1 Neuraminidase',
    sub: 'Neuraminidase (NA)',
    pdb: '3TI6',
    color: 'purple',
    note: '바이러스가 세포 밖으로 빠져나갈 때 필요한 단백질을 이해하고 감염 확산 억제를 탐색합니다.',
  },
] as const;

function HomeScreen({ goVirus }: { goVirus: () => void }) {
  return (
    <div className="bd-main">
      <div className="bd-grid home-top">
        <div className="bd-card pad-lg">
          <div className="bd-eyebrow">2026 미래직업 진로체험 박람회</div>
          <h2 className="bd-title">
            디지털 트윈으로 떠나는
            <br />
            <strong>바이오 탐험, Bio AI CellScope</strong>
          </h2>
          <p className="bd-subtitle">
            실제 세포 이미지를 관찰하고, AI와 함께 단백질 구조를 탐색하며
            미래의 치료 후보를 비교해보는 특별한 연구 체험에 참여하세요.
          </p>

          <div className="bd-info-box" style={{ marginTop: 18 }}>
            <div className="bd-info-icon">⏱</div>
            <div>
              <h3 style={{ marginBottom: 8 }}>약 3~4분 · 교육용 체험</h3>
              <p className="bd-subtitle" style={{ fontSize: 16 }}>
                이 체험에서 제공되는 분석 결과는 교육 목적으로만 제공되며,
                의학적 진단이 아닙니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bd-grid home-cta">
          <button className="bd-card bd-cta-card blue pad-lg" onClick={goVirus}>
            <div className="bd-card-arrow">›</div>
            <div className="bd-visual protein" />
            <div className="bd-cta-title">바이러스 단백질 연구 시작</div>
            <p className="bd-cta-sub">VIRUS PROTEIN RESEARCH</p>
          </button>

          <button className="bd-card bd-cta-card green pad-lg" type="button">
            <div className="bd-card-arrow">›</div>
            <div className="bd-visual cell" />
            <div className="bd-cta-title">세포·오가노이드 연구 시작</div>
            <p className="bd-cta-sub">CELL &amp; ORGANOID RESEARCH</p>
          </button>
        </div>
      </div>

      <div className="bd-card pad-lg">
        <h3 className="bd-section-title">체험 진행 순서</h3>
        <div className="bd-process">
          {[
            ['1', '단백질 선택', '연구 대상을 골라요'],
            ['2', '구조 확인', '3D 구조를 탐색해요'],
            ['3', '결합 탐색', '어떻게 결합할까요?'],
            ['4', '후보 비교', 'AI가 후보를 비교해요'],
            ['5', '결과 전달', '나만의 리포트를 받아요'],
          ].map(([num, title, sub]) => (
            <div className="bd-process-item" key={num}>
              <div className="bd-process-num">{num}</div>
              <div>
                <strong>{title}</strong>
                <div>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AtlasScreen({
  selectProtein,
}: {
  selectProtein: (proteinId: DeepDiveProteinId) => void;
}) {
  return (
    <div className="bd-main">
      <div className="bd-card pad-lg">
        <div className="bd-eyebrow">감염병 단백질 아틀라스</div>
        <h2 className="bd-title" style={{ fontSize: 54 }}>
          우리에게 익숙한 감염병을 선택하고,
          <br />
          대표 단백질 구조를 탐험해보세요.
        </h2>
      </div>

      <div className="bd-grid atlas">
        <div className="bd-card pad-lg">
          <div className="bd-disease-grid">
            {diseaseCards.map((card, idx) => (
              <button
                key={card.label}
                className="bd-disease-card"
                onClick={() => selectProtein(card.proteinId)}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <div className={`virus ${card.color}`} />
                <div className="bd-chip">{card.label}</div>
                <div className="bd-protein-preview" />
                <div>
                  <h3 style={{ marginBottom: 6 }}>{card.protein}</h3>
                  <p className="bd-subtitle" style={{ fontSize: 15 }}>
                    {card.sub}
                  </p>
                </div>
                <div className="bd-mini-item">
                  <strong>PDB ID</strong>
                  <span>{card.pdb}</span>
                </div>
                <p className="bd-subtitle" style={{ fontSize: 15, marginBottom: 0 }}>
                  {card.note}
                </p>
                <div className="bd-btn primary" style={{ minHeight: 46 }}>
                  {idx === 0 ? '이 단백질로 시작하기' : '선택 화면 예시'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bd-side-stack">
          <div className="bd-card pad-md">
            <h3 className="bd-section-title">우리가 다루는 감염병 10가지</h3>
            <div className="bd-tag-grid">
              {[
                'COVID‑19',
                '신종플루(H1N1)',
                '메르스(MERS)',
                '계절독감',
                '결핵',
                'B형간염',
                '홍역',
                '수두',
                '노로바이러스',
                'RSV 감염증',
              ].map((item) => (
                <div key={item} className="bd-mini-item">
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="bd-card pad-md">
            <h3 className="bd-section-title">이런 체험이에요!</h3>
            <p className="bd-subtitle" style={{ fontSize: 15 }}>
              실제 바이러스 단백질 구조 데이터를 기반으로 한 교육·체험용 콘텐츠입니다.
              본 체험은 질병의 진단, 치료, 의료적 조언을 제공하지 않으며,
              과학적 이해를 돕기 위한 목적으로 구성되었습니다.
            </p>
          </div>

          <div className="bd-card pad-md">
            <div className="bd-mascot">
              <div className="bd-mascot-ball">
                <div className="bd-mascot-sprout" />
              </div>
              <div className="bd-note">
                보고, 만지고,
                <br />
                탐험하는
                <br />
                바이오의 세계!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StructureScreen({
  proteinId,
  next,
}: {
  proteinId: DeepDiveProteinId;
  next: () => void;
}) {
  const dockingTarget = dockingTargetByProteinId(proteinId);

  return (
    <div className="bd-main">
      <div className="bd-grid structure">
        <div className="bd-card pad-lg">
          <h2 className="bd-title" style={{ fontSize: 44 }}>단백질 구조 확인</h2>
          <p className="bd-subtitle">
            실제 단백질의 3차원 구조를 살펴보고, 바이러스의 특징과 결합 부위를 탐색해보세요.
          </p>

          <div className="bd-dark-viewer" style={{ marginTop: 18 }}>
            <div className="bd-dark-top">
              <div>
                <h3 style={{ marginBottom: 6 }}>SARS‑CoV‑2 Main protease (Mpro)</h3>
                <div>코로나바이러스‑2 주요 단백질분해효소</div>
              </div>

              <div className="bd-mini-list" style={{ minWidth: 260 }}>
                <div className="bd-mini-item"><strong>PDB ID</strong><span>6LU7</span></div>
                <div className="bd-mini-item"><strong>출처</strong><span>RCSB Protein Data Bank</span></div>
              </div>
            </div>

            {dockingTarget ? (
              <Protein3DViewer target={dockingTarget} />
            ) : (
              <div className="bd-dark-protein">
                <div className="bd-pocket" />
                <div className="bd-ligand" />
              </div>
            )}

            <div className="bd-controls">
              <div className="bd-control"><strong>회전하기</strong><br />드래그로 구조를 돌려보세요.</div>
              <div className="bd-control"><strong>확대/축소</strong><br />휠로 구조를 자세히 볼 수 있습니다.</div>
              <div className="bd-control"><strong>원래대로</strong><br />기본 시점으로 돌아갑니다.</div>
              <div className="bd-control"><strong>참고 리간드 보기</strong><br />실험에 사용된 리간드를 표시합니다.</div>
            </div>
          </div>
        </div>

        <div className="bd-side-stack">
          <div className="bd-card pad-md">
            <h3 className="bd-section-title">왜 단백질 구조를 살펴볼까요?</h3>
            <p className="bd-subtitle" style={{ fontSize: 15 }}>
              바이러스의 단백질 구조를 이해하면 어떤 부위에 약물이 결합할 수 있는지 예측할 수 있습니다.
            </p>
          </div>

          <div className="bd-list-card">
            <div className="bd-list-row">
              <div className="bd-list-icon">🦠</div>
              <div>
                <strong>바이러스 · SARS‑CoV‑2</strong>
                <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
                  COVID‑19를 유발하는 코로나바이러스입니다.
                </p>
              </div>
            </div>

            <div className="bd-list-row">
              <div className="bd-list-icon">🧬</div>
              <div>
                <strong>단백질 · Main protease (Mpro)</strong>
                <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
                  바이러스가 복제되기 위해 필요한 단백질들을 절단하는 핵심 효소입니다.
                </p>
              </div>
            </div>

            <div className="bd-list-row">
              <div className="bd-list-icon">📘</div>
              <div>
                <strong>PDB ID · 6LU7</strong>
                <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
                  RCSB Protein Data Bank에 공개된 신뢰할 수 있는 구조 데이터입니다.
                </p>
              </div>
            </div>
          </div>

          <button className="bd-btn primary" onClick={next}>다음 단계로</button>
        </div>
      </div>
    </div>
  );
}

function BindingScreen({
  proteinId,
  next,
}: {
  proteinId: DeepDiveProteinId;
  next: () => void;
}) {
  const dockingTarget = dockingTargetByProteinId(proteinId);

  return (
    <div className="bd-main">
      <div className="bd-card pad-lg">
        <div className="bd-eyebrow">BINDING EXPLORATION</div>
        <h2 className="bd-title" style={{ fontSize: 50 }}>
          단백질 구조를 기반으로 AI가
          <br />
          <strong>결합 부위를 탐색하고 구조를 보완합니다.</strong>
        </h2>
      </div>

      <div className="bd-grid binding">
        <div className="bd-card pad-md bd-binding-box">
          <h3 className="bd-section-title">선택한 단백질</h3>
          <div className="bd-pill">SARS‑CoV‑2 Mpro (6LU7)</div>
          <p className="bd-subtitle" style={{ fontSize: 15, marginTop: 12 }}>
            코로나19 바이러스의 주요 단백질 분해효소로, 항바이러스제 개발의 핵심 표적입니다.
          </p>
          <div className="bd-binding-visual" style={{ marginTop: 16 }} />
        </div>

        <div className="bd-card pad-md bd-binding-box">
          <h3 className="bd-section-title">실험 구조 (PDB)</h3>
          <div className="bd-chip">PDB 우선</div>

          <div className="bd-mini-list" style={{ marginTop: 16 }}>
            <div className="bd-mini-item"><strong>출처</strong><span>RCSB PDB</span></div>
            <div className="bd-mini-item"><strong>해상도</strong><span>2.16 Å</span></div>
            <div className="bd-mini-item"><strong>실험 방법</strong><span>X-ray Crystallography</span></div>
            <div className="bd-mini-item"><strong>사슬 길이</strong><span>306 aa</span></div>
            <div className="bd-mini-item"><strong>리간드</strong><span>{dockingTarget?.referenceLigand.name ?? '-'} (공동결정)</span></div>
          </div>
        </div>

        <div className="bd-card pad-md bd-binding-box">
          <h3 className="bd-section-title">AI 구조 보완 판단</h3>
          <div className="bd-progress"><span /></div>
          <p style={{ margin: '10px 0 0', fontWeight: 800 }}>구조 완성도 예측 87%</p>

          <div className="bd-checks">
            <div className="bd-check"><i>✓</i><span>주요 골격 구조 완전함</span></div>
            <div className="bd-check"><i>✓</i><span>리간드 결합 부위 명확함</span></div>
            <div className="bd-check"><i>✓</i><span>AI 보완 필요 가능 영역 2개</span></div>
          </div>
        </div>
      </div>

      <div className="bd-card pad-lg">
        <h3 className="bd-section-title">AI 분석 결과</h3>
        <div className="bd-task-grid">
          <div className="bd-task">
            <strong>1. 출처 검증</strong>
            <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
              RCSB PDB에서 구조 정보 확인 및 실험 방법 검증.
            </p>
          </div>
          <div className="bd-task">
            <strong>2. 구조 적용 단계</strong>
            <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
              결합 부위 식별 완료, 실험 구조를 분석 기준으로 사용.
            </p>
          </div>
          <div className="bd-task">
            <strong>3. 다음 계산 준비</strong>
            <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
              결합 포켓 좌표 설정 및 후보 물질 라이브러리 연결 대기.
            </p>
          </div>
          <div className="bd-task">
            <strong>4. 연구 메모</strong>
            <p className="bd-subtitle" style={{ fontSize: 14, marginBottom: 0 }}>
              PDB {dockingTarget?.pdbId ?? '-'} 구조를 기준으로 후속 도킹 계산을 준비합니다.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button className="bd-btn primary" onClick={next}>후보 비교 단계로 이동</button>
        </div>
      </div>
    </div>
  );
}

function CompareScreen({
  proteinId,
  next,
}: {
  proteinId: DeepDiveProteinId;
  next: () => void;
}) {
  const dockingTarget = dockingTargetByProteinId(proteinId);
  const dockingResult = dockingResultByProteinId(proteinId);

  const candidates = dockingResult?.candidates ?? [];

  const [
    selectedCandidateIndex,
    setSelectedCandidateIndex,
  ] = useState(() => readSelectedCandidateIndex());

  const selectCandidate = (index: number) => {
    setSelectedCandidateIndex(index);
    saveSelectedCandidateIndex(index);
  };

  return (
    <div className="bd-main">
      <div className="bd-card pad-lg">
        <h2 className="bd-title" style={{ fontSize: 52 }}>후보물질 비교</h2>
        <p className="bd-subtitle">
          사전 계산된 도킹 결과를 바탕으로 후보물질을 비교하고 있습니다.
        </p>
      </div>

      <div className="bd-grid compare">
        <div className="bd-card pad-lg">
          <div className="bd-candidates">
            {candidates.map((card, index) => (
              <div
                key={card.code}
                className={['bd-candidate', index === selectedCandidateIndex ? 'selected' : ''].join(' ')}
                onClick={() => selectCandidate(index)}
              >
                <div className="bd-candidate-top">
                  <div>
                    <div className="bd-chip">후보물질</div>
                    <h3 style={{ margin: '10px 0 4px' }}>{card.name}</h3>
                    <div>{card.code}</div>
                  </div>
                  {index === selectedCandidateIndex && <div className="bd-pill">다음 연구 방향 선택</div>}
                </div>

                <div className="bd-candidate-molecule" />

                <div className="bd-mini-item">
                  <strong>Vina 점수</strong>
                  <span>
                    {card.vinaScore == null
                      ? '검증 대기'
                      : `${card.vinaScore.toFixed(2)} kcal/mol`}
                  </span>
                </div>

                <div className="bd-checks" style={{ marginTop: 0 }}>
                  {card.interactions.length > 0 ? (
                    card.interactions.map((interaction) => (
                      <div className="bd-check" key={interaction}>
                        <i>✓</i>
                        <span>{interaction}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bd-check">
                      <i>·</i>
                      <span>{card.note}</span>
                    </div>
                  )}
                </div>

                <button
                  className={index === selectedCandidateIndex ? 'bd-btn secondary' : 'bd-btn ghost'}
                  onClick={next}
                >
                  {index === selectedCandidateIndex ? '선택됨' : '이 후보물질 선택'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bd-side-stack">
          <div className="bd-card pad-md">
            <h3 className="bd-section-title">타겟 단백질 정보</h3>
            <div className="bd-thumbnail" />
            <div className="bd-mini-list" style={{ marginTop: 12 }}>
              <div className="bd-mini-item"><strong>단백질</strong><span>SARS‑CoV‑2 Mpro (6LU7)</span></div>
              <div className="bd-mini-item"><strong>기준 리간드</strong><span>{dockingTarget?.referenceLigand.name ?? '-'}</span></div>
            </div>
          </div>

          <div className="bd-card pad-md">
            <h3 className="bd-section-title">꼭 확인하세요!</h3>
            <p className="bd-subtitle" style={{ fontSize: 14 }}>
              본 결과는 교육 및 체험용으로 사전 계산된 도킹 결과를 기반으로 합니다.
              실제 약물 개발을 위해서는 추가적인 실험 검증과 전문적인 연구가 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({
  proteinId,
  next,
}: {
  proteinId: DeepDiveProteinId;
  next: () => void;
}) {
  const dockingTarget = dockingTargetByProteinId(proteinId);
  const dockingResult = dockingResultByProteinId(proteinId);

  const selectedCandidate =
    dockingResult?.candidates?.[readSelectedCandidateIndex()] ??
    dockingResult?.candidates?.[0] ??
    null;

  return (
    <div className="bd-main">
      <div className="bd-card pad-lg">
        <h2 className="bd-title" style={{ fontSize: 54 }}>
          <strong>Research Trail 리포트</strong>
        </h2>
        <p className="bd-subtitle">
          당신의 연구 결과를 확인하고, 리포트와 연구원 카드를 받아가세요.
        </p>
      </div>

      <div className="bd-grid report">
        <div className="bd-card pad-md">
          <h3 className="bd-section-title">연구자 정보</h3>
          <div className="bd-mini-list">
            <div className="bd-mini-item"><strong>연구자 이름</strong><span>이영준 / Lee Young Jun</span></div>
            <div className="bd-mini-item"><strong>관심 분야</strong><span>감염병 · 항바이러스 치료제</span></div>
            <div className="bd-mini-item"><strong>연구 질문</strong><span>SARS‑CoV‑2 Mpro에 결합하는 후보는?</span></div>
            <div className="bd-mini-item"><strong>선택 단백질</strong><span>SARS‑CoV‑2 Mpro</span></div>
            <div className="bd-mini-item"><strong>PDB ID</strong><span>6LU7</span></div>
            <div className="bd-mini-item"><strong>선택 후보</strong><span>COVID Candidate B</span></div>
            <div className="bd-mini-item"><strong>분석 일시</strong><span>2026. 9. 16. 14:22</span></div>
          </div>
        </div>

        <div className="bd-card pad-md">
          <h3 className="bd-section-title">A4 리포트 미리보기</h3>
          <div className="bd-report-sheet">
            <div className="bd-report-top">
              <div>
                <h3>Bio AI Analysis Report</h3>
                <div>바이오 AI 분석 리포트</div>
              </div>
              <div className="bd-thumbnail" style={{ height: 100 }} />
            </div>

            <div className="bd-report-lines">
              <div className="bd-report-line"><strong>연구 주제</strong><span>COVID‑19 치료제 후보 물질 탐색</span></div>
              <div className="bd-report-line"><strong>선택 단백질</strong><span>Main protease (Mpro)</span></div>
              <div className="bd-report-line"><strong>PDB ID</strong><span>6LU7</span></div>
              <div className="bd-report-line"><strong>기준 리간드</strong><span>N3</span></div>
              <div className="bd-report-line"><strong>선택 후보물질</strong><span>COVID Candidate B</span></div>
              <div className="bd-report-line"><strong>계산 엔진</strong><span>Molecular Docking (AutoDock Vina)</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 16 }}>
              <div>
                <strong>주요 결과 요약</strong>
                <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>
                  <li>선택 후보물질의 결합 가능성 확인</li>
                  <li>기준 리간드와의 결합 포즈 유사성 분석</li>
                  <li>후속 탐색 방향 제안</li>
                </ul>
              </div>
              <div className="bd-qr" />
            </div>
          </div>
        </div>

        <div className="bd-side-stack">
          <div className="bd-researcher-card">
            <div className="bd-chip" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              스마트 연구원 카드 (NFC)
            </div>
            <h4>BioDockLab</h4>
            <p style={{ marginTop: 0 }}>RESEARCHER · LEE YOUNG JUN</p>
            <p style={{ opacity: 0.84 }}>QR로 온라인 접속 (오프라인도 OK)</p>
          </div>

          <div className="bd-action-stack">
            <button className="bd-btn primary" onClick={next}>A4 리포트 출력</button>
            <button className="bd-btn secondary" onClick={next}>연구원 카드 발급</button>
            <button className="bd-btn ghost">이전으로</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoneScreen({
  proteinId,
  home,
}: {
  proteinId: DeepDiveProteinId;
  home: () => void;
}) {
  const dockingTarget = dockingTargetByProteinId(proteinId);
  const dockingResult = dockingResultByProteinId(proteinId);

  const selectedCandidate =
    dockingResult?.candidates?.[readSelectedCandidateIndex()] ??
    dockingResult?.candidates?.[0] ??
    null;

  return (
    <div className="bd-main">
      <div className="bd-card pad-lg">
        <h2 className="bd-title" style={{ fontSize: 58 }}>
          <strong>Research Trail 완료</strong>
        </h2>
        <p className="bd-subtitle">
          체험이 완료되었습니다. 리포트와 연구원 카드를 받아가세요!
        </p>
      </div>

      <div className="bd-grid done">
        <div className="bd-card pad-md">
          <h3 className="bd-section-title">오늘의 연구 경로</h3>
          <div className="bd-mini-list">
            <div className="bd-mini-item"><strong>감염병</strong><span>COVID‑19</span></div>
            <div className="bd-mini-item"><strong>바이러스</strong><span>SARS‑CoV‑2</span></div>
            <div className="bd-mini-item"><strong>단백질</strong><span>Main protease (Mpro)</span></div>
            <div className="bd-mini-item"><strong>PDB ID</strong><span>6LU7</span></div>
            <div className="bd-mini-item"><strong>기준 리간드</strong><span>N3</span></div>
            <div className="bd-mini-item"><strong>선택 후보</strong><span>COVID Candidate B</span></div>
            <div className="bd-mini-item"><strong>결과 상태</strong><span>교육용 결과 표시</span></div>
          </div>
        </div>

        <div className="bd-card pad-md">
          <h3 className="bd-section-title">AI 분석 리포트 미리보기</h3>
          <div className="bd-report-sheet" style={{ aspectRatio: '1 / 0.92' }}>
            <div className="bd-report-top">
              <div>
                <h3>Bio AI Analysis Report</h3>
                <div>오늘의 탐험이 한 장의 리포트로 정리되었습니다.</div>
              </div>
              <div className="bd-thumbnail" style={{ height: 92 }} />
            </div>

            <div className="bd-report-lines">
              <div className="bd-report-line"><strong>연구 주제</strong><span>COVID‑19 치료제 후보 물질 탐색</span></div>
              <div className="bd-report-line"><strong>단백질 표적</strong><span>Main protease (Mpro)</span></div>
              <div className="bd-report-line"><strong>선택 후보</strong><span>COVID Candidate B</span></div>
              <div className="bd-report-line"><strong>출처</strong><span>RCSB PDB / 6LU7</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <div>
                <strong>주요 결과</strong>
                <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                  <li>결합 가능성 확인</li>
                  <li>구조 기반 후속 탐색 방향 제안</li>
                </ul>
              </div>
              <div className="bd-qr" />
            </div>
          </div>
        </div>

        <div className="bd-side-stack">
          <div className="bd-card pad-md">
            <h3 className="bd-section-title">받아가기</h3>
            <div className="bd-action-stack">
              <button className="bd-btn primary">A4 리포트 출력</button>
              <button className="bd-btn secondary">연구원 카드 발급</button>
              <button className="bd-btn ghost" onClick={home}>처음으로</button>
            </div>
          </div>

          <div className="bd-card pad-md">
            <div className="bd-mascot">
              <div className="bd-mascot-ball">
                <div className="bd-mascot-sprout" />
              </div>
              <div className="bd-note">
                탐구하는 당신이 만드는
                <br />
                더 건강한 내일!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UiConceptDemo() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedProteinId, setSelectedProteinId] =
    useState<DeepDiveProteinId>('sars2-mpro');

  const activeStep =
    screen === 'atlas'
      ? 1
      : screen === 'structure'
      ? 2
      : screen === 'binding'
      ? 3
      : screen === 'compare'
      ? 4
      : screen === 'report' || screen === 'done'
      ? 5
      : 0;

  return (
    <KioskShell showSteps={screen !== 'home'} activeStep={activeStep}>
      <div className="bd-dev-nav">
        {[
          ['home', '메인'],
          ['atlas', '감염병 선택'],
          ['structure', '구조 확인'],
          ['binding', '결합 탐색'],
          ['compare', '후보 비교'],
          ['report', '리포트'],
          ['done', '완료'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={['bd-dev-tab', screen === key ? 'active' : ''].join(' ')}
            onClick={() => setScreen(key as Screen)}
          >
            {label}
          </button>
        ))}
      </div>

      {screen === 'home' && <HomeScreen goVirus={() => setScreen('atlas')} />}
      {screen === 'atlas' && (
        <AtlasScreen
          selectProtein={(proteinId) => {
            setSelectedProteinId(proteinId);
            setScreen('structure');
          }}
        />
      )}

      {screen === 'structure' && (
        <StructureScreen
          proteinId={selectedProteinId}
          next={() => setScreen('binding')}
        />
      )}

      {screen === 'binding' && (
        <BindingScreen
          proteinId={selectedProteinId}
          next={() => setScreen('compare')}
        />
      )}

      {screen === 'compare' && (
        <CompareScreen
          proteinId={selectedProteinId}
          next={() => setScreen('report')}
        />
      )}
      {screen === 'report' && (
        <ReportScreen
          proteinId={selectedProteinId}
          next={() => setScreen('done')}
        />
      )}

      {screen === 'done' && (
        <DoneScreen
          proteinId={selectedProteinId}
          home={() => setScreen('home')}
        />
      )}
    </KioskShell>
  );
}
