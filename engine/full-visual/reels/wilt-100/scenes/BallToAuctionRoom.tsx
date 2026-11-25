// wilt-100 "ball": the auction room, 2000. Walnut panelled wall with its rails, a spot from above, the black plinth,
// the glass vitrine (drawn in two halves so the ball sits inside it), a typed lot card on a small brass easel, a
// walnut gavel with a brass band on its round sounding block, bentwood chair backs in the foreground with white
// bidder paddles on turned handles, the price board rolling, the year dater and a red SOLD stamp.
import React from "react";
import { BTA_AMBER, BTA_TYPE, btaClamp, btaLerp, btaRnd } from "./BallToAuctionKit";

export const BTA_CASE = { x: 410, y: 905, w: 260, h: 270 };
export const BTA_PLINTH_TOP = BTA_CASE.y + BTA_CASE.h;
export const BTA_BALL_IN_CASE = { x: 540, y: 1066, r: 92 };
export const BTA_CARD = { x: 152, y: 1046, w: 196, h: 128 };
export const BTA_BLOCK = { x: 810, y: 1224 };

export const BallToAuctionWall: React.FC<{ spot: number; f: number }> = ({ spot, f }) => {
  const panels: React.ReactNode[] = [];
  for (let i = 0; i < 4; i++) {
    const x = 20 + i * 262;
    panels.push(
      <g key={i}>
        <rect x={x} y={660} width={244} height={500} fill="#2C1C12" />
        <rect x={x + 14} y={674} width={216} height={472} fill="#24170E" />
        <rect x={x + 14} y={674} width={216} height={4} fill="rgba(255,210,160,0.12)" />
        <rect x={x + 14} y={1142} width={216} height={4} fill="rgba(0,0,0,0.4)" />
        {Array.from({ length: 7 }, (_, k) => (
          <path key={k} d={`M ${x + 24 + k * 30} 680 q ${8 - btaRnd(i * 9 + k) * 16} 230 ${btaRnd(k + i) * 10 - 5} 460`} stroke="rgba(80,46,22,0.35)" strokeWidth={2} fill="none" />
        ))}
      </g>,
    );
  }
  const sweep = 0.5 + 0.5 * Math.sin(f / 90);
  return (
    <g>
      <defs>
        <linearGradient id="btaRoomWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C120B" />
          <stop offset="1" stopColor="#2A1A10" />
        </linearGradient>
        <radialGradient id="btaRoomSpot" cx="540" cy="1080" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,226,180,0.4)" />
          <stop offset="0.55" stopColor="rgba(255,214,160,0.1)" />
          <stop offset="1" stopColor="rgba(255,214,160,0)" />
        </radialGradient>
        <linearGradient id="btaCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,236,200,0.22)" />
          <stop offset="1" stopColor="rgba(255,236,200,0.02)" />
        </linearGradient>
        <linearGradient id="btaRoomFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A1E1A" />
          <stop offset="1" stopColor="#140B0A" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#btaRoomWall)" />
      <rect x={0} y={630} width={1080} height={14} fill="#3A2718" />
      <rect x={0} y={630} width={1080} height={3} fill="rgba(255,210,160,0.2)" />
      {panels}
      {/* the dado rail and the carpet */}
      <rect x={0} y={1166} width={1080} height={16} fill="#3A2718" />
      <rect x={0} y={1166} width={1080} height={3} fill="rgba(255,210,160,0.25)" />
      <rect x={0} y={1182} width={1080} height={800} fill="url(#btaRoomFloor)" />
      {/* the light: the spot on the plinth, its cone in the air, a slow drift of light over the panels */}
      <polygon points="470,0 610,0 760,1240 320,1240" fill="url(#btaCone)" opacity={spot} />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#btaRoomSpot)" opacity={0.35 + 0.65 * spot} />
      <rect x={0} y={660} width={1080} height={500} fill={`rgba(255,220,170,${0.03 * sweep})`} />
    </g>
  );
};

/** the plinth, the back of the vitrine and the small brass ring the ball sits in */
export const BallToAuctionCaseBack: React.FC<{ drop: number }> = ({ drop }) => {
  const { x, y, w, h } = BTA_CASE;
  const top = BTA_PLINTH_TOP;
  return (
    <g>
      <defs>
        <linearGradient id="btaPlinth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0B0C0E" />
          <stop offset="0.45" stopColor="#25282D" />
          <stop offset="1" stopColor="#08090A" />
        </linearGradient>
      </defs>
      <ellipse cx={540} cy={1440} rx={240} ry={26} fill="rgba(0,0,0,0.6)" />
      <rect x={x - 22} y={top} width={w + 44} height={1450 - top} fill="url(#btaPlinth)" />
      <rect x={x - 34} y={top - 4} width={w + 68} height={22} fill="#1A1C20" />
      <rect x={x - 34} y={top - 4} width={w + 68} height={3} fill="rgba(255,236,200,0.35)" />
      {/* the case's back glass: barely there */}
      <g transform={`translate(0 ${-drop})`}>
        <rect x={x + 18} y={y + 12} width={w - 36} height={h - 18} fill="rgba(160,190,210,0.05)" stroke="rgba(200,220,235,0.18)" strokeWidth={2} />
      </g>
      {/* the brass ring */}
      <ellipse cx={540} cy={top - 6} rx={56} ry={10} fill="#6E5428" />
      <ellipse cx={540} cy={top - 9} rx={52} ry={8} fill="#B8913E" />
    </g>
  );
};

/** the vitrine's front: glass edges, bevelled lid, reflections that slide as it settles */
export const BallToAuctionCaseFront: React.FC<{ drop: number; f: number; o: number }> = ({ drop, f, o }) => {
  const { x, y, w, h } = BTA_CASE;
  const slide = (f % 400) / 400;
  return (
    <g transform={`translate(0 ${-drop})`} opacity={o}>
      <rect x={x} y={y} width={w} height={h} fill="rgba(170,200,220,0.06)" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="rgba(220,236,245,0.55)" strokeWidth={3} />
      <line x1={x} y1={y} x2={x + 18} y2={y + 12} stroke="rgba(220,236,245,0.4)" strokeWidth={2} />
      <line x1={x + w} y1={y} x2={x + w - 18} y2={y + 12} stroke="rgba(220,236,245,0.4)" strokeWidth={2} />
      <line x1={x} y1={y + h} x2={x + 18} y2={y + h - 6} stroke="rgba(220,236,245,0.3)" strokeWidth={2} />
      <line x1={x + w} y1={y + h} x2={x + w - 18} y2={y + h - 6} stroke="rgba(220,236,245,0.3)" strokeWidth={2} />
      {/* the lid */}
      <rect x={x - 6} y={y - 14} width={w + 12} height={16} fill="rgba(210,228,240,0.25)" stroke="rgba(230,242,250,0.6)" strokeWidth={2} />
      {/* reflections: two long diagonal streaks of the spot */}
      <clipPath id="btaCaseClip">
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath="url(#btaCaseClip)">
        <polygon points={`${x + 30 + slide * 20},${y} ${x + 70 + slide * 20},${y} ${x - 40 + slide * 20},${y + h} ${x - 80 + slide * 20},${y + h}`} fill="rgba(255,255,255,0.08)" />
        <polygon points={`${x + 200},${y} ${x + 214},${y} ${x + 120},${y + h} ${x + 106},${y + h}`} fill="rgba(255,255,255,0.07)" />
      </g>
    </g>
  );
};

/** the lot card on its easel; stamped = 0..1 the 2000 printed by the dater */
export const BallToAuctionLotCard: React.FC<{ o: number; stamped: number; font: string }> = ({ o, stamped, font }) => {
  const { x, y, w, h } = BTA_CARD;
  return (
    <g opacity={o}>
      {/* brass easel legs */}
      <line x1={x + 40} y1={y + h} x2={x + 26} y2={y + h + 40} stroke="#9C7A36" strokeWidth={5} />
      <line x1={x + w - 40} y1={y + h} x2={x + w - 26} y2={y + h + 40} stroke="#9C7A36" strokeWidth={5} />
      <rect x={x + 6} y={y + 10} width={w} height={h} fill="rgba(0,0,0,0.5)" />
      <rect x={x} y={y} width={w} height={h} fill="#EFE6D2" />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} fill="none" stroke="rgba(27,27,27,0.35)" strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 46} textAnchor="middle" fontFamily={BTA_TYPE} fontSize={34} fontWeight={700} fill="#1B1B1B" letterSpacing={6}>
        LOT
      </text>
      <rect x={x + 30} y={y + 58} width={w - 60} height={2} fill="rgba(27,27,27,0.5)" />
      {stamped > 0.001 && (
        <g opacity={stamped} transform={`translate(${x + w / 2} ${y + 100}) rotate(-3)`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={BTA_TYPE} fontSize={36} fontWeight={700} fill="#3A2C5A" letterSpacing={3} filter="url(#btaInk)">
            2000
          </text>
        </g>
      )}
    </g>
  );
};

/** the walnut gavel and its sounding block. lift: 0 = resting on the block, 1 = raised */
export const BallToAuctionGavel: React.FC<{ lift: number; o: number; hit: number }> = ({ lift, o, hit }) => {
  const { x: bx, y: by } = BTA_BLOCK;
  const pivot = { x: bx + 190, y: by - 150 };
  const ang = 40 * lift;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id="btaWalnut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A4A26" />
          <stop offset="0.45" stopColor="#4E2C14" />
          <stop offset="1" stopColor="#2A160A" />
        </linearGradient>
        <linearGradient id="btaBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0D38A" />
          <stop offset="0.5" stopColor="#B8913E" />
          <stop offset="1" stopColor="#6E5428" />
        </linearGradient>
      </defs>
      {/* the auctioneer's rostrum: a walnut lectern under the block */}
      <rect x={bx - 150} y={by + 30} width={300} height={420} fill="url(#btaWalnut)" />
      <rect x={bx - 166} y={by + 22} width={332} height={18} fill="#5A3418" />
      <rect x={bx - 166} y={by + 22} width={332} height={3} fill="rgba(255,220,170,0.3)" />
      <rect x={bx - 120} y={by + 62} width={240} height={150} fill="none" stroke="rgba(20,10,4,0.55)" strokeWidth={4} />
      <rect x={bx - 116} y={by + 66} width={232} height={3} fill="rgba(255,220,170,0.12)" />
      <g transform={`translate(${bx} ${by}) scale(1.25) translate(${-bx} ${-by})`}>
      {/* the block */}
      <ellipse cx={bx} cy={by + 40} rx={96} ry={18} fill="rgba(0,0,0,0.55)" />
      <rect x={bx - 82} y={by} width={164} height={34} fill="url(#btaWalnut)" />
      <ellipse cx={bx} cy={by + 34} rx={82} ry={14} fill="#2A160A" />
      <ellipse cx={bx} cy={by} rx={82} ry={14} fill="#6A3E1E" />
      <ellipse cx={bx} cy={by} rx={60} ry={9} fill="none" stroke="rgba(30,14,6,0.4)" strokeWidth={1.5} />
      <ellipse cx={bx - 14} cy={by - 3} rx={30} ry={4} fill="rgba(255,220,170,0.18)" />
      {/* the gavel on its arc: head lands on the block at lift 0 */}
      <g transform={`rotate(${ang} ${pivot.x} ${pivot.y})`}>
        {/* turned handle */}
        <path d={`M ${bx + 20} ${by - 66} L ${pivot.x} ${pivot.y - 9} L ${pivot.x + 4} ${pivot.y + 9} L ${bx + 22} ${by - 44} Z`} fill="#5A3418" />
        <path d={`M ${bx + 20} ${by - 66} L ${pivot.x} ${pivot.y - 9}`} stroke="rgba(255,214,160,0.45)" strokeWidth={3} />
        <ellipse cx={pivot.x + 2} cy={pivot.y} rx={11} ry={14} fill="#3A2210" transform={`rotate(-25 ${pivot.x + 2} ${pivot.y})`} />
        {[0.25, 0.55, 0.8].map((t) => {
          const hx = btaLerp(bx + 21, pivot.x, t), hy = btaLerp(by - 55, pivot.y, t);
          return <ellipse key={t} cx={hx} cy={hy} rx={5} ry={12} fill="#3A2210" transform={`rotate(${Math.atan2(pivot.y - by + 48, pivot.x - bx - 8) * 57.3} ${hx} ${hy})`} />;
        })}
        {/* head: a walnut cylinder standing on the block, the brass band round its middle */}
        <rect x={bx - 26} y={by - 108} width={52} height={104} rx={8} fill="url(#btaWalnut)" />
        <rect x={bx - 26} y={by - 64} width={52} height={14} fill="url(#btaBrass)" />
        <rect x={bx - 20} y={by - 104} width={10} height={96} rx={4} fill="rgba(255,220,170,0.18)" />
        <ellipse cx={bx} cy={by - 106} rx={26} ry={6} fill="#6A3E1E" />
      </g>
      </g>
      {/* the strike: a short ring of dust and a flash on the block */}
      {hit > 0.001 && (
        <g opacity={hit}>
          <ellipse cx={bx} cy={by - 4} rx={130 + (1 - hit) * 110} ry={16 + (1 - hit) * 10} fill="none" stroke="rgba(255,236,200,0.5)" strokeWidth={3} />
          {Array.from({ length: 10 }, (_, k) => (
            <circle key={k} cx={bx + Math.cos(k * 0.63) * (60 + (1 - hit) * 90)} cy={by - 6 - (1 - hit) * 30 * btaRnd(k)} r={2 + btaRnd(k * 2) * 2} fill="rgba(240,220,190,0.6)" />
          ))}
        </g>
      )}
    </g>
  );
};

export type Bid = { at: number; x: number; n: number; win?: boolean };

/** bentwood chair backs in the foreground and the paddles that rise from them */
export const BallToAuctionBidders: React.FC<{ f: number; bids: Bid[]; o: number; font: string; amber: number }> = ({ f, bids, o, font, amber }) => (
  <g opacity={o}>
    {bids.map((b, i) => {
      const t = f - b.at;
      if (t < -2) return null;
      const up = btaClamp(t / 7);
      const down = b.win ? 0 : btaClamp((t - 22) / 10);
      const k = up * (1 - down);
      if (k <= 0.001) return null;
      const y = btaLerp(1560, 1300 - (i % 3) * 22, 1 - Math.pow(1 - k, 3));
      const rot = (btaRnd(i * 5) - 0.5) * 14;
      return (
        <g key={i} transform={`translate(${b.x} ${y}) rotate(${rot})`}>
          <rect x={-7} y={40} width={14} height={150} rx={6} fill="#6E4422" />
          {[70, 100, 140].map((yy) => <rect key={yy} x={-9} y={yy} width={18} height={6} rx={3} fill="#4E2C14" />)}
          <rect x={-58} y={-62} width={116} height={106} rx={14} fill="rgba(0,0,0,0.4)" transform="translate(5 6)" />
          <rect x={-58} y={-62} width={116} height={106} rx={14} fill="#F3EFE6" />
          <rect x={-58} y={-62} width={116} height={6} rx={3} fill="rgba(255,255,255,0.8)" />
          <text x={0} y={8} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={52} fill="#141414">
            {b.n}
          </text>
          {b.win && amber > 0.001 && (
            <g opacity={amber}>
              <rect x={-52} y={-56} width={104} height={94} rx={11} fill="none" stroke={BTA_AMBER} strokeWidth={5} />
              <text x={0} y={8} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={52} fill="none" stroke={BTA_AMBER} strokeWidth={2.5}>
                {b.n}
              </text>
            </g>
          )}
        </g>
      );
    })}
    {/* chair backs */}
    {Array.from({ length: 7 }, (_, i) => {
      const cx = 70 + i * 160 + (i % 2) * 20;
      return (
        <g key={i} transform={`translate(${cx} 1395)`}>
          <path d="M -62 120 L -62 10 Q -62 -38 0 -38 Q 62 -38 62 10 L 62 120" stroke="#1A0F08" strokeWidth={14} fill="none" />
          <path d="M -40 120 L -40 18 Q -40 -16 0 -16 Q 40 -16 40 18 L 40 120" stroke="#140B06" strokeWidth={8} fill="none" />
          <path d="M -62 6 Q -62 -38 0 -38" stroke="rgba(255,210,160,0.12)" strokeWidth={3} fill="none" />
        </g>
      );
    })}
  </g>
);

/** one odometer digit window */
const Wheel: React.FC<{ v: number; x: number; w: number; h: number; size: number; font: string; color: string; blur: number }> = ({ v, x, w, h, size, font, color, blur }) => {
  const d = Math.floor(v) % 10;
  const fr = v - Math.floor(v);
  return (
    <g>
      <svg x={x} y={-h / 2} width={w} height={h} overflow="hidden">
        <g style={{ filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
          {[0, 1].map((k) => (
            <text key={k} x={w / 2} y={h / 2 + size * 0.36 + (k - fr) * h} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={size} fill={color}>
              {(d + k) % 10}
            </text>
          ))}
        </g>
      </svg>
    </g>
  );
};

/** odometer: P is the continuous value; vel the per-frame change (for the blur) */
export const BallToAuctionOdometer: React.FC<{ P: number; digits: number; size: number; font: string; color: string; vel: number; comma?: boolean; prefix?: string }> = ({ P, digits, size, font, color, vel, comma, prefix }) => {
  const w = size * 0.62;
  const h = size * 1.12;
  const items: React.ReactNode[] = [];
  let x = 0;
  if (prefix) {
    items.push(
      <text key="p" x={x + w * 0.45} y={size * 0.36} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={size} fill={color}>
        {prefix}
      </text>,
    );
    x += w * 0.9;
  }
  const shown = Math.max(1, Math.min(digits, Math.floor(Math.log10(Math.max(1, P))) + 1));
  for (let k = shown - 1; k >= 0; k--) {
    const pow = Math.pow(10, k);
    const base = Math.floor(P / pow);
    const lower = P - base * pow;
    const fast = Math.abs(vel) / pow > 0.6;
    let v = base % 10;
    if (!fast) {
      if (k === 0) v = P % 10;
      else if (lower > pow - 1) v += lower - (pow - 1);
    }
    const blur = btaClamp(Math.abs(vel) / pow / 3, 0, 1) * 6;
    items.push(<Wheel key={k} v={v} x={x} w={w} h={h} size={size} font={font} color={color} blur={blur} />);
    x += w;
    if (comma && k === 3) {
      items.push(
        <text key="c" x={x + w * 0.18} y={size * 0.36} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={size} fill={color}>
          ,
        </text>,
      );
      x += w * 0.36;
    }
  }
  return <g transform={`translate(${-x / 2} 0)`}>{items}</g>;
};

/** the rubber-band year dater: black body, knob, steel frame, the year band in its window */
export const BallToAuctionDater: React.FC<{ year: number; vel: number; press: number; font: string }> = ({ year, vel, press, font }) => (
  <g>
    {/* knob and stem */}
    <rect x={-16} y={-176} width={32} height={70} rx={6} fill="#1C1C1E" />
    <ellipse cx={0} cy={-186} rx={46} ry={26} fill="#222225" />
    <ellipse cx={-12} cy={-194} rx={20} ry={8} fill="rgba(255,255,255,0.14)" />
    {/* steel frame, compressing as it presses */}
    <g transform={`translate(0 ${-press * 22})`}>
      <rect x={-104} y={-112} width={208} height={30} rx={6} fill="#2A2B2E" />
      <rect x={-104} y={-112} width={208} height={4} rx={2} fill="rgba(255,255,255,0.2)" />
    </g>
    <rect x={-92} y={-86} width={10} height={120} fill="#9EA3A8" />
    <rect x={82} y={-86} width={10} height={120} fill="#9EA3A8" />
    <rect x={-92} y={-86} width={3} height={120} fill="rgba(255,255,255,0.45)" />
    {/* the band wheels in their window */}
    <rect x={-82} y={-60} width={164} height={74} rx={4} fill="#121214" />
    <g transform="translate(0 -22)">
      <BallToAuctionOdometer P={year} digits={4} size={56} font={BTA_TYPE} color="#E8E2D6" vel={vel} />
    </g>
    <rect x={-82} y={-60} width={164} height={16} fill="rgba(0,0,0,0.55)" />
    <rect x={-82} y={-2} width={164} height={16} fill="rgba(0,0,0,0.55)" />
    {/* the rubber foot */}
    <rect x={-98} y={34} width={196} height={20} rx={3} fill="#151517" />
    <rect x={-90} y={52} width={180} height={6} fill="#3A2C5A" opacity={0.9} />
  </g>
);

/** the red SOLD stamp: ink with a rough edge */
export const BallToAuctionSold: React.FC<{ k: number; font: string }> = ({ k, font }) => {
  if (k <= 0.001) return null;
  const s = btaLerp(1.6, 1, btaClamp(k * 1.4));
  return (
    <g transform={`rotate(-8) scale(${s})`} opacity={btaClamp(k * 2)} filter="url(#btaInk)">
      <rect x={-150} y={-54} width={300} height={108} rx={8} fill="none" stroke="#B3261E" strokeWidth={8} />
      <rect x={-138} y={-42} width={276} height={84} rx={4} fill="none" stroke="#B3261E" strokeWidth={2.5} />
      <text x={0} y={14} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={66} fill="#B3261E" letterSpacing={10}>
        SOLD
      </text>
      <text x={0} y={42} textAnchor="middle" fontFamily={BTA_TYPE} fontWeight={700} fontSize={22} fill="#B3261E" letterSpacing={6}>
        2000
      </text>
    </g>
  );
};

export const BallToAuctionInkDefs: React.FC = () => (
  <defs>
    <filter id="btaInk" x="-10%" y="-20%" width="120%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.8 0 0 0 1.5" result="m" />
      <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
      <feDisplacementMap in="c" in2="n" scale={3} />
    </filter>
  </defs>
);

