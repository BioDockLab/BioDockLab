import {
  useEffect,
  useRef,
  useState,
} from 'react';
import * as $3Dmol from '3dmol/build/3Dmol.js';
import type { DockingTarget } from '../data/dockingTargets';

type Props = {
  target: DockingTarget;
  compact?: boolean;
};

export function Protein3DViewer({
  target,
  compact = false,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const viewerRef =
    useRef<any>(null);

  const [failed, setFailed] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let disposed = false;

    const load = async () => {
      if (!containerRef.current) {
        return;
      }

      setLoading(true);
      setFailed(false);

      try {
        const response = await fetch(
          target.structurePath,
          {
            cache: 'force-cache',
          },
        );

        if (!response.ok) {
          throw new Error(
            `PDB fetch failed: ${response.status}`,
          );
        }

        const pdb =
          await response.text();

        if (
          disposed ||
          !containerRef.current
        ) {
          return;
        }

        containerRef.current.innerHTML =
          '';

        const viewer =
          $3Dmol.createViewer(
            containerRef.current,
            {
              backgroundColor: '#07111f',
              antialias: true,
            },
          );

        viewerRef.current = viewer;

        viewer.addModel(
          pdb,
          'pdb',
        );

        viewer.setStyle(
          {
            hetflag: false,
          },
          {
            cartoon: {
              color: 'spectrum',
              opacity: 0.95,
            },
          },
        );

        viewer.setStyle(
          {
            resn:
              target.referenceLigand
                .residueName,
          },
          {
            stick: {
              radius: 0.28,
              colorscheme:
                'greenCarbon',
            },
            sphere: {
              scale: 0.28,
              colorscheme:
                'greenCarbon',
            },
          },
        );

        viewer.addStyle(
          {
            byres: true,
            within: {
              distance: 4.5,
              sel: {
                resn:
                  target
                    .referenceLigand
                    .residueName,
              },
            },
          },
          {
            stick: {
              radius: 0.12,
              colorscheme:
                'cyanCarbon',
            },
          },
        );

        viewer.zoomTo({
          resn:
            target.referenceLigand
              .residueName,
        });

        viewer.zoom(0.82);

        viewer.render();
        viewer.resize();

        if (!disposed) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          '[Protein3DViewer]',
          error,
        );

        if (!disposed) {
          setFailed(true);
          setLoading(false);
        }
      }
    };

    void load();

    const onResize = () => {
      viewerRef.current?.resize?.();
      viewerRef.current?.render?.();
    };

    window.addEventListener(
      'resize',
      onResize,
    );

    return () => {
      disposed = true;

      window.removeEventListener(
        'resize',
        onResize,
      );

      try {
        viewerRef.current?.clear?.();
      } catch {
        // kiosk shutdown cleanup
      }

      viewerRef.current = null;
    };
  }, [target]);

  return (
    <div
      className={`protein-3d ${
        compact
          ? 'protein-3d--compact'
          : ''
      }`}
    >
      <div
        ref={containerRef}
        className="protein-3d__canvas"
      />

      {loading && (
        <div className="protein-3d__overlay">
          <strong>
            실제 PDB 구조 불러오는 중
          </strong>
          <span>
            {target.pdbId} · local file
          </span>
        </div>
      )}

      {failed && (
        <div className="protein-3d__fallback">
          <strong>
            3D 구조 표시를 사용할 수 없습니다
          </strong>
          <span>
            {target.pdbId} 로컬 구조는
            보존되어 있습니다.
          </span>
        </div>
      )}

      {!loading && !failed && (
        <div className="protein-3d__legend">
          <span>
            PDB {target.pdbId}
          </span>

          <span>
            Ligand ·{' '}
            {target.referenceLigand.name}
          </span>

          <span>
            drag 회전 · pinch/scroll 확대
          </span>
        </div>
      )}
    </div>
  );
}
