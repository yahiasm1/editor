// Instagram iOS glyphs for `cta`, redrawn as 24-unit outline icons (2 px stroke at 24, like the app's).
import React from "react";

type P = { size: number; color?: string; stroke?: number; style?: React.CSSProperties };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size, color = "#F5F5F5", stroke = 2, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const FollowAndSendChevron: React.FC<P> = (p) => <Svg {...p}><path d="M15.5 3.5 7 12l8.5 8.5" /></Svg>;
export const FollowAndSendBell: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 16.5v-5.2a6 6 0 0 1 12 0v5.2l1.8 2H4.2z" />
    <path d="M10 21a2.2 2.2 0 0 0 4 0" />
  </Svg>
);
export const FollowAndSendMore: React.FC<P> = ({ size, color = "#F5F5F5", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {[5, 12, 19].map((x) => <circle key={x} cx={x} cy={12} r={1.7} fill={color} />)}
  </svg>
);
export const FollowAndSendGrid: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </Svg>
);
export const FollowAndSendReels: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <path d="M2.5 8h19M8.5 2.5 11.5 8M14.5 2.5 17.5 8" />
    <path d="M10 11.2v6l5-3z" />
  </Svg>
);
export const FollowAndSendTagged: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M9.5 3H4.5a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3h-5l-2.5 2.6z" />
    <circle cx="12" cy="11" r="3" />
    <path d="M6.5 19.5c.9-2.6 3-4 5.5-4s4.6 1.4 5.5 4" />
  </Svg>
);
export const FollowAndSendAddPerson: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="9.5" cy="8" r="4" />
    <path d="M2.5 21c0-4 3.1-6.6 7-6.6s7 2.6 7 6.6M19 7.5v6M16 10.5h6" />
  </Svg>
);
export const FollowAndSendSearch: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="7" />
    <path d="m16 16 5.5 5.5" />
  </Svg>
);
/** Instagram's share glyph: the paper plane */
export const FollowAndSendPlane: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M22 3 9.2 10.6" />
    <path d="M22 3 2.6 8.9l6.6 1.7 3 9.9z" />
  </Svg>
);
export const FollowAndSendLink: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1.4 1.4" />
    <path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1.4-1.4" />
  </Svg>
);
export const FollowAndSendStoryAdd: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 1 0 9 9" strokeDasharray="0" />
    <path d="M17 3.6a9 9 0 0 1 3.4 3.4" />
    <path d="M12 8v8M8 12h8" />
  </Svg>
);
export const FollowAndSendShareOut: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
    <path d="M8 10.5H5.5v10h13v-10H16" />
  </Svg>
);
export const FollowAndSendDownload: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4 17v3.5h16V17" />
  </Svg>
);
/** iOS status bar: cellular bars, wifi, battery, drawn at its real proportions */
export const FollowAndSendStatus: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 * k }}>
    <svg width={18 * k} height={12 * k} viewBox="0 0 18 12">
      {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 4.7} y={9 - i * 2.6} width={3.2} height={3 + i * 2.6} rx={0.8} fill="#F5F5F5" />)}
    </svg>
    <svg width={17 * k} height={12 * k} viewBox="0 0 17 12" fill="#F5F5F5">
      <path d="M8.5 2.6c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.9 10.6 10.6 0 0 0 1 3.9l1.2 1.2a9 9 0 0 1 6.3-2.5z" />
      <path d="M8.5 6c1.5 0 2.8.6 3.8 1.5l1.2-1.2a7 7 0 0 0-10 0l1.2 1.2c1-1 2.3-1.5 3.8-1.5z" />
      <path d="m8.5 11.6 2.3-2.4a3.3 3.3 0 0 0-4.6 0z" />
    </svg>
    <svg width={27 * k} height={13 * k} viewBox="0 0 27 13">
      <rect x="0.6" y="0.6" width="23" height="11.8" rx="3.6" fill="none" stroke="rgba(245,245,245,0.45)" strokeWidth="1.1" />
      <rect x="2.4" y="2.4" width="16.8" height="8.2" rx="2.1" fill="#F5F5F5" />
      <path d="M25 4.4v4.2a2.2 2.2 0 0 0 0-4.2z" fill="rgba(245,245,245,0.5)" />
    </svg>
  </div>
);
/** Instagram's default picture for an account with no photo: a grey head and shoulders in a grey circle */
export const FollowAndSendSilhouette: React.FC<{ size: number; bg: string; fg: string }> = ({ size, bg, fg }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <clipPath id="fas-sil-clip"><circle cx="50" cy="50" r="50" /></clipPath>
    </defs>
    <circle cx="50" cy="50" r="50" fill={bg} />
    <g clipPath="url(#fas-sil-clip)" fill={fg}>
      <circle cx="50" cy="39" r="17" />
      <ellipse cx="50" cy="92" rx="33" ry="27" />
    </g>
  </svg>
);
