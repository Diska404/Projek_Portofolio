"use client";

import { useState } from "react";
import { levaLinks, levaModules } from "@/lib/leva-architecture";

export function LevaModuleGraph() {
  const [selected, setSelected] = useState<string>("dispatch");
  const current = levaModules.find((item) => item.id === selected) ?? levaModules[3];
  const related = new Set<string>([selected]);
  for (const [from, to] of levaLinks) {
    if (from === selected) related.add(to);
    if (to === selected) related.add(from);
  }
  return (
    <div className="leva-explorer">
      <div className="leva-map">
        <div className="leva-map-heading">
          <span>ALUR APLIKASI</span>
          <span>13 modul · ringkasan terkurasi</span>
        </div>
        <svg
          viewBox="0 0 960 700"
          role="img"
          aria-labelledby="leva-graph-title leva-graph-description"
        >
          <title id="leva-graph-title">Hubungan modul Leva</title>
          <desc id="leva-graph-description">
            Input desktop, mikrofon, dan HP bertemu pada LevaWindow. Jalur bercabang ke Chat/Secret
            atau agent, lalu kembali menjadi teks dan suara. Pilih modul melalui tombol di bawah
            diagram untuk membaca perannya.
          </desc>
          <defs>
            <pattern id="leva-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#27372e" />
            </pattern>
            <marker
              id="leva-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#749e83" />
            </marker>
          </defs>
          <rect width="960" height="700" fill="url(#leva-dots)" />
          {levaLinks.map(([from, to]) => {
            const a = levaModules.find((n) => n.id === from)!;
            const b = levaModules.find((n) => n.id === to)!;
            const horizontal = a.y === b.y;
            const connected = from === selected || to === selected;
            const sx = a.x + (horizontal ? 108 : 0),
              sy = a.y + (horizontal ? 0 : 26);
            const ex = b.x - (horizontal ? 110 : 0),
              ey = b.y - (horizontal ? 0 : 28);
            return (
              <path
                key={`${from}-${to}`}
                d={
                  horizontal
                    ? `M ${sx} ${sy} L ${ex} ${ey}`
                    : `M ${sx} ${sy} C ${sx} ${(sy + ey) / 2}, ${ex} ${(sy + ey) / 2}, ${ex} ${ey}`
                }
                stroke={connected ? "#7fdaa2" : "#385445"}
                strokeWidth={connected ? 2.4 : 1.5}
                fill="none"
                markerEnd="url(#leva-arrow)"
                opacity={connected ? 1 : 0.65}
              />
            );
          })}
          {levaModules.map((node) => (
            <g key={node.id} opacity={related.has(node.id) ? 1 : 0.6}>
              <rect
                x={node.x - 108}
                y={node.y - 26}
                width="216"
                height="52"
                rx="9"
                fill={node.id === selected ? "#203c2c" : "#152019"}
                stroke={node.id === selected ? "#8ae2ac" : "#3c5445"}
                strokeWidth={node.id === selected ? 2 : 1}
              />
              <circle
                cx={node.x - 88}
                cy={node.y}
                r="3"
                fill={node.id === selected ? "#a9f4c7" : "#6ba582"}
              />
              <text
                x={node.x + 6}
                y={node.y + 5}
                textAnchor="middle"
                fill="#edf6ef"
                fontSize="15"
                fontFamily="system-ui, sans-serif"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="leva-inspector">
        <span className="eyebrow">PILIH MODUL</span>
        <div className="leva-module-picker" role="group" aria-label="Pilih modul Leva">
          {levaModules.map((node) => (
            <button
              key={node.id}
              aria-pressed={selected === node.id}
              onClick={() => setSelected(node.id)}
            >
              {node.label}
            </button>
          ))}
        </div>
        <div className="leva-module-detail" aria-live="polite" aria-atomic="true">
          <span className="leva-detail-group">{current.group}</span>
          <h3>{current.label}</h3>
          <p>{current.detail}</p>
          <span className="leva-source">SUMBER SNAPSHOT 0.28.0</span>
          <code>{current.source}</code>
        </div>
        <p className="leva-map-note">
          Panah menunjukkan alur ringkasan yang diperiksa dari kode. Graf lengkap mencakup simbol,
          dokumen, dan pengujian; hubungan di dalamnya tidak selalu berarti urutan eksekusi.
        </p>
      </div>
    </div>
  );
}
