import { ArrowLeft, Atom, CheckCircle2, Database, ExternalLink, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { proteinAtlas, type ProteinAtlasEntry, type ProteinReadiness } from '../data/proteinAtlas';
import './ProteinAtlas.css';

const readinessLabel: Record<ProteinReadiness, string> = {
  'deep-dive': '심층 체험 준비',
  structure: '구조 검증 완료',
  catalog: '카탈로그',
};

const sourceRegistry = [
  { name: 'NCBI', role: '서열·유전체 원천', track: '감염병 단백질', url: 'https://www.ncbi.nlm.nih.gov/datasets/' },
  { name: 'UniProt', role: '단백질 기능·식별자', track: '감염병 단백질', url: 'https://www.uniprot.org/' },
  { name: 'RCSB PDB', role: '실험 3D 구조', track: '감염병 단백질', url: 'https://www.rcsb.org/' },
  { name: 'KCLB · SNU CRI', role: '세포주·오가노이드', track: '암 세포주(별도)', url: 'https://cellbank.snu.ac.kr/' },
  { name: 'ATCC', role: '인증 생물자원·오믹스', track: '암 세포주(별도)', url: 'https://www.atcc.org/' },
  { name: 'Helix BioStructures', role: '산업 분석 절차', track: '워크플로 참고', url: 'https://www.helixbiostructures.com/services/biophysical-characterization' },
];

export function ProteinAtlas({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (protein: ProteinAtlasEntry) => void;
}) {
  const [query, setQuery] = useState('');
  const [virus, setVirus] = useState('전체');
  const viruses = ['전체', ...new Set(proteinAtlas.map((protein) => protein.virus))];
  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return proteinAtlas.filter((protein) => {
      const matchesVirus = virus === '전체' || protein.virus === virus;
      const searchable = `${protein.virus} ${protein.name} ${protein.nameKo} ${protein.pdbId}`.toLowerCase();
      return matchesVirus && (!keyword || searchable.includes(keyword));
    });
  }, [query, virus]);

  return (
    <div className="screen protein-atlas">
      <section className="protein-atlas__hero">
        <button type="button" className="protein-atlas__back" onClick={onBack}><ArrowLeft /> 홈으로</button>
        <div>
          <span><ShieldCheck /> PUBLIC DATA · EDUCATIONAL EXPERIENCE</span>
          <h1>감염병 단백질 아틀라스</h1>
          <p>코로나19·메르스·신종플루를 지나온 우리가, 공개 구조 데이터로 단백질을 직접 탐색합니다.</p>
        </div>
        <dl>
          <div><dt>오늘 검증</dt><dd>{proteinAtlas.length}<small>proteins</small></dd></div>
          <div><dt>심층 체험</dt><dd>{proteinAtlas.filter((p) => p.readiness === 'deep-dive').length}<small>ready</small></dd></div>
          <div><dt>목표 카탈로그</dt><dd>100<small>proteins</small></dd></div>
        </dl>
      </section>

      <section className="panel protein-atlas__workspace">
        <header>
          <div><span className="eyebrow"><Database /> 구조 데이터 선택</span><h2>한 가지 단백질을 골라 깊게 연구해 보세요.</h2></div>
          <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="단백질·바이러스·PDB 검색" /></label>
        </header>
        <div className="protein-atlas__filters">
          {viruses.map((item) => <button key={item} type="button" className={virus === item ? 'is-active' : ''} onClick={() => setVirus(item)}>{item}</button>)}
        </div>
        <div className="protein-atlas__grid">
          {visible.map((protein) => (
            <article key={protein.id} className={`protein-card protein-card--${protein.readiness}`}>
              <header><span>{protein.virus}</span><em>{readinessLabel[protein.readiness]}</em></header>
              <div className="protein-card__title"><span><Atom /></span><div><small>PDB {protein.pdbId}</small><h3>{protein.nameKo}</h3><p>{protein.name}</p></div></div>
              <p>{protein.function}</p>
              <blockquote>{protein.researchQuestion}</blockquote>
              <footer>
                <a href={protein.sourceUrl} target="_blank" rel="noreferrer">RCSB 원문 <ExternalLink /></a>
                {protein.readiness === 'deep-dive' ? (
                  <button type="button" onClick={() => onSelect(protein)}>이 단백질 연구 <CheckCircle2 /></button>
                ) : <span>심층 시나리오 준비 중</span>}
              </footer>
            </article>
          ))}
        </div>
        {visible.length === 0 && <p className="protein-atlas__empty">검색 결과가 없습니다.</p>}
      </section>

      <section className="panel protein-atlas__sources">
        <header><span className="eyebrow"><Database /> SOURCE REGISTRY</span><h2>데이터 출처와 역할을 섞지 않습니다.</h2></header>
        <div>{sourceRegistry.map((source) => (
          <a key={source.name} href={source.url} target="_blank" rel="noreferrer">
            <span>{source.track}</span><strong>{source.name}</strong><small>{source.role}</small><ExternalLink />
          </a>
        ))}</div>
      </section>

      <p className="protein-atlas__disclaimer">현재 목록은 검증된 시드 카탈로그입니다. 심층 체험은 사전 계산·검수된 교육용 결과를 사용하며, 현장에서 새 AlphaFold/AutoDock 연산이 완료됐다는 뜻이 아닙니다.</p>
    </div>
  );
}
