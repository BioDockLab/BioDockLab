import { Dna } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand__mark"><Dna size={compact ? 20 : 28} /></span>
      <span>
        <strong>BioDockLab</strong>
        {!compact && <small>세포 기반 바이오 AI 연구 체험</small>}
      </span>
    </div>
  );
}
