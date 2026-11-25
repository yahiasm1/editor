// wilt-100 "ball": the two places the ball leaves through. Inside: the arena's basketball floor laid over the ice,
// maple boards in perspective, a painted lane line, a programme and a torn stub left by the crowd that flooded it,
// the dark stands behind. Outside: the main gate at night, redrawn from Bruce C. Cooper's 2001 photo (CC BY 3.0)
// without its later "HERSHEYPARK ARENA" sign: the banded brown canopy with its medallion, the ribbed frieze, the
// grooved pilasters, two door bays (the right one open, the lobby's light spilling out), the blank box office board,
// the globe sconce, the downspout, evergreen planters, red mats, wet pavement.
import React from "react";
import { btaRnd } from "./BallToAuctionKit";

/** the open right door's opening in the gate world (camera at Z = 1) */
export const BTA_AP = { x: 580, y: 880, w: 220, h: 400 };
/** inner (floor) space is a whole 1080-wide frame mapped into the opening */
export const BTA_INNER_A = BTA_AP.w / 1080;
export const BTA_INNER_Y0 = 1920 - BTA_AP.h / BTA_INNER_A;
export const BTA_P0 = { x: BTA_AP.x + BTA_AP.w / 2, y: BTA_AP.y + BTA_AP.h / 2 };

/** where a point of the inner frame lands in the gate world */
export const btaInnerToWorld = (x: number, y: number) => ({ x: BTA_AP.x + BTA_INNER_A * x, y: BTA_AP.y + BTA_INNER_A * (y - BTA_INNER_Y0) });

const VX = 540, VY = 330, HY = 640, BOT = 1920;
const along = (xb: number, y: number) => VX + (xb - VX) * ((y - VY) / (BOT - VY));
const depthY = (d: number) => VY + (BOT - VY) / d;

/** the floor, in a 1080 x 1920 frame of its own; light = the pool of light around the ball */
export const BallToAuctionFloor: React.FC<{ lx: number; ly: number }> = ({ lx, ly }) => {
  const boards: React.ReactNode[] = [];
  const W = 128;
  for (let i = -9; i <= 9; i++) {
    const xa = VX + (i - 0.5) * W, xb = VX + (i + 0.5) * W;
    const tint = btaRnd(i * 3.7);
    boards.push(
      <polygon key={`b${i}`} points={`${along(xa, HY)},${HY} ${along(xb, HY)},${HY} ${xb},${BOT} ${xa},${BOT}`} fill={tint > 0.5 ? "rgba(255,222,170,0.06)" : "rgba(60,30,10,0.08)"} stroke="rgba(40,22,10,0.55)" strokeWidth={1.4} />,
    );
    // grain running along the board
    for (let g = 0; g < 3; g++) {
      const off = 0.2 + 0.3 * g + 0.08 * btaRnd(i * 11 + g);
      const x0 = xa + (xb - xa) * off;
      boards.push(<line key={`g${i}-${g}`} x1={along(x0, HY + 4)} y1={HY + 4} x2={x0 + (btaRnd(i + g) - 0.5) * 20} y2={BOT} stroke="rgba(70,38,14,0.22)" strokeWidth={1 + btaRnd(i * 5 + g)} />);
    }
    // board ends, staggered
    for (let j = 0; j < 6; j++) {
      const d = 1.08 + j * 0.9 + btaRnd(i * 7 + j) * 0.8;
      const y = depthY(d);
      if (y < HY + 6) continue;
      boards.push(<line key={`e${i}-${j}`} x1={along(xa, y)} y1={y} x2={along(xb, y)} y2={y} stroke="rgba(40,20,8,0.6)" strokeWidth={Math.max(0.8, 2.6 / d)} />);
    }
  }
  // painted lines: the lane's edge running away, a baseline across
  const lane = (xb: number, w: number) => `${along(xb - w, HY)},${HY} ${along(xb + w, HY)},${HY} ${xb + w},${BOT} ${xb - w},${BOT}`;
  const baseY = depthY(3.1);
  const progX = 210, progY = 1390;
  return (
    <g>
      <defs>
        <linearGradient id="btaFloor" x1="0" y1={HY} x2="0" y2={BOT} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2A1A0E" />
          <stop offset="0.25" stopColor="#6E4825" />
          <stop offset="0.6" stopColor="#A87443" />
          <stop offset="1" stopColor="#8C5B32" />
        </linearGradient>
        <radialGradient id="btaPool" cx={lx} cy={ly} r={620} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,214,150,0.34)" />
          <stop offset="0.5" stopColor="rgba(255,200,130,0.1)" />
          <stop offset="1" stopColor="rgba(255,200,130,0)" />
        </radialGradient>
        <linearGradient id="btaStands" x1="0" y1="0" x2="0" y2={HY} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#07090D" />
          <stop offset="1" stopColor="#151B24" />
        </linearGradient>
        <filter id="btaFloorSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      {/* the stands, dark, rows of seats emptied */}
      <rect x={0} y={0} width={1080} height={HY} fill="url(#btaStands)" />
      {Array.from({ length: 11 }, (_, r) => {
        const y = HY - 30 - r * 46;
        return (
          <g key={r} opacity={0.75 - r * 0.05}>
            <rect x={0} y={y} width={1080} height={3} fill="rgba(140,150,165,0.18)" />
            {Array.from({ length: 30 }, (_, s) => (
              <rect key={s} x={(s * 37 + (r % 2) * 18) % 1100 - 10} y={y - 20} width={26} height={18} rx={4} fill="rgba(70,78,92,0.32)" />
            ))}
          </g>
        );
      })}
      {/* the rail at the edge of the floor */}
      <rect x={0} y={HY - 26} width={1080} height={26} fill="#1E140D" />
      <rect x={0} y={HY - 26} width={1080} height={3} fill="rgba(255,210,150,0.3)" />
      <rect x={0} y={HY} width={1080} height={BOT - HY} fill="url(#btaFloor)" />
      {boards}
      <polygon points={lane(VX - 2.5 * W + 40, 9)} fill="rgba(238,226,196,0.78)" />
      <polygon points={`${along(-400, baseY - 5)},${baseY - 5} ${along(1480, baseY - 5)},${baseY - 5} ${along(1480, baseY + 6)},${baseY + 6} ${along(-400, baseY + 6)},${baseY + 6}`} fill="rgba(238,226,196,0.7)" />
      {/* a dropped programme, its cover's printed band, and a torn stub */}
      <g transform={`translate(${progX} ${progY}) scale(1 0.42) rotate(-18)`}>
        <rect x={-92} y={-120} width={184} height={240} fill="rgba(0,0,0,0.35)" filter="url(#btaFloorSoft)" transform="translate(10 14)" />
        <rect x={-92} y={-120} width={184} height={240} fill="#E6DCC4" />
        <rect x={-92} y={-120} width={184} height={70} fill="#7A2A22" />
        <rect x={-74} y={-30} width={148} height={96} fill="#C9BEA4" />
        {Array.from({ length: 4 }, (_, k) => <rect key={k} x={-74} y={80 + k * 0} width={110 - k * 18} height={4} transform={`translate(0 ${k * 9})`} fill="rgba(40,30,20,0.4)" />)}
        <path d="M 92 -120 L 92 120 L 60 120 Z" fill="rgba(0,0,0,0.12)" />
      </g>
      <g transform="translate(860 1560) scale(1 0.5) rotate(24)">
        <rect x={-70} y={-34} width={140} height={68} fill="#EFE6D2" />
        {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={70} cy={-30 + k * 7.5} r={2.4} fill="#8C5B32" />)}
        <rect x={-56} y={-18} width={90} height={5} fill="rgba(27,27,27,0.5)" />
        <rect x={-56} y={-4} width={62} height={4} fill="rgba(27,27,27,0.35)" />
      </g>
      <rect x={0} y={HY} width={1080} height={BOT - HY} fill="url(#btaPool)" />
    </g>
  );
};

/** the gate facade around the opening; open = 0..1 how far the right door leaves stand open; glow = the lobby light */
export const BallToAuctionFacade: React.FC<{ glow: number; f: number; part: "base" | "front" }> = ({ glow, f, part }) => {
  const { x: ax, y: ay, w: aw, h: ah } = BTA_AP;
  const sill = ay + ah;
  const flick = 0.96 + 0.04 * Math.sin(f / 7) * Math.sin(f / 13);
  if (part === "front") return <g>
      {/* the open right bay: the frame around the opening, the two leaves swung in, a threshold */}
      <rect x={ax - 6} y={ay - 6} width={aw + 12} height={6} fill="#2A2E33" />
      <rect x={ax - 6} y={ay - 6} width={6} height={ah + 6} fill="#2A2E33" />
      <rect x={ax + aw} y={ay - 6} width={6} height={ah + 6} fill="#2A2E33" />
      <polygon points={`${ax},${ay} ${ax + 34},${ay + 18} ${ax + 34},${sill - 10} ${ax},${sill}`} fill="#23282E" />
      <polygon points={`${ax + 4},${ay + 10} ${ax + 30},${ay + 24} ${ax + 30},${sill - 16} ${ax + 4},${sill - 8}`} fill="rgba(255,206,140,0.16)" opacity={glow} />
      <polygon points={`${ax + aw},${ay} ${ax + aw - 34},${ay + 18} ${ax + aw - 34},${sill - 10} ${ax + aw},${sill}`} fill="#23282E" />
      <polygon points={`${ax + aw - 4},${ay + 10} ${ax + aw - 30},${ay + 24} ${ax + aw - 30},${sill - 16} ${ax + aw - 4},${sill - 8}`} fill="rgba(255,206,140,0.2)" opacity={glow} />
      <rect x={ax - 6} y={sill - 4} width={aw + 12} height={8} fill="#9A9890" />
    </g>;
  return (
    <g>
      <defs>
        <linearGradient id="btaWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B2A27" />
          <stop offset="0.5" stopColor="#5C5446" />
          <stop offset="1" stopColor="#4A4338" />
        </linearGradient>
        <radialGradient id="btaSconce" cx="930" cy="770" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,226,170,0.5)" />
          <stop offset="1" stopColor="rgba(255,226,170,0)" />
        </radialGradient>
        <radialGradient id="btaSpill" cx={ax + aw / 2} cy={sill} r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,206,140,0.55)" />
          <stop offset="0.45" stopColor="rgba(255,190,120,0.18)" />
          <stop offset="1" stopColor="rgba(255,190,120,0)" />
        </radialGradient>
        <linearGradient id="btaPave" x1="0" y1={sill} x2="0" y2="1920" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2E2C29" />
          <stop offset="1" stopColor="#121417" />
        </linearGradient>
        <linearGradient id="btaGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1C232C" />
          <stop offset="0.5" stopColor="#0E1217" />
          <stop offset="1" stopColor="#1A2028" />
        </linearGradient>
        <filter id="btaGateSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {/* the wall, cream stucco at night */}
      <rect x={-1200} y={-200} width={3480} height={sill + 200} fill="url(#btaWall)" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={-1200 + i * 150} y={-200} width={2} height={sill + 200} fill="rgba(0,0,0,0.06)" />
      ))}
      <rect x={-1200} y={-200} width={3480} height={sill + 200} fill="url(#btaSconce)" opacity={flick} />
      {/* the recess under the canopy */}
      <rect x={236} y={700} width={628} height={sill - 700} fill="#4A4338" />
      <rect x={236} y={700} width={628} height={sill - 700} fill="url(#btaSpill)" opacity={glow * 0.8} />
      {/* ribbed frieze over the doors */}
      <rect x={290} y={760} width={520} height={92} fill="#5E574A" />
      {Array.from({ length: 52 }, (_, i) => <rect key={i} x={292 + i * 10} y={764} width={4} height={84} fill="rgba(0,0,0,0.22)" />)}
      <rect x={290} y={852} width={520} height={6} fill="rgba(0,0,0,0.35)" />
      {/* the pilasters, banded with grooves */}
      {[236, 810].map((px) => (
        <g key={px}>
          <rect x={px} y={720} width={54} height={sill - 720} fill="#6A6252" />
          <rect x={px} y={720} width={10} height={sill - 720} fill="rgba(255,240,210,0.08)" />
          {Array.from({ length: 30 }, (_, i) => <rect key={i} x={px} y={734 + i * 18} width={54} height={3} fill="rgba(0,0,0,0.28)" />)}
        </g>
      ))}
      {/* the left door bay, closed: dark glass in thin metal frames, two leaves, push bars, a sliver of lobby light */}
      <g>
        <rect x={300} y={ay} width={200} height={ah} fill="#2A2E33" />
        {[0, 1].map((k) => (
          <g key={k}>
            <rect x={306 + k * 97} y={ay + 6} width={91} height={ah - 12} fill="url(#btaGlass)" />
            <rect x={306 + k * 97} y={ay + 6} width={91} height={ah - 12} fill="rgba(255,200,130,0.12)" opacity={glow} />
            <polygon points={`${310 + k * 97},${ay + 40} ${330 + k * 97},${ay + 10} ${360 + k * 97},${ay + 10} ${316 + k * 97},${ay + 90}`} fill="rgba(255,255,255,0.05)" />
            <rect x={312 + k * 97} y={ay + ah * 0.52} width={79} height={8} rx={4} fill="#8F949A" />
            <rect x={312 + k * 97} y={ay + ah * 0.52} width={79} height={2} fill="rgba(255,255,255,0.4)" />
          </g>
        ))}
      </g>
      {/* the box office board between the bays (later lettering, left blank) and its placard */}
      <rect x={508} y={ay + 22} width={64} height={210} fill="#D8D4C8" opacity={0.85} />
      <rect x={512} y={ay + 26} width={56} height={202} fill="none" stroke="#3A3A3A" strokeWidth={2} />
      <rect x={518} y={ay + 160} width={44} height={28} fill="#2A2A2A" opacity={0.7} />
      <rect x={508} y={ay + 262} width={64} height={52} fill="#CFC8B4" opacity={0.75} />
      {/* the canopy: banded brown fascia, the round medallion, its soffit and two downlights */}
      <rect x={120} y={608} width={840} height={96} fill="#3A2A20" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={120} y={612 + k * 22} width={840} height={11} fill={k % 2 ? "#2B1E16" : "#46332A"} />)}
      <rect x={116} y={604} width={848} height={6} fill="#5A4636" />
      <circle cx={540} cy={656} r={27} fill="#33241B" stroke="#5E4838" strokeWidth={3} />
      <rect x={530} y={646} width={20} height={20} fill="none" stroke="#6E5644" strokeWidth={2.5} transform="rotate(45 540 656)" />
      <rect x={128} y={704} width={824} height={18} fill="#1E1814" />
      {[360, 720].map((dx) => (
        <g key={dx}>
          <rect x={dx - 10} y={718} width={20} height={8} fill="#111" />
          <polygon points={`${dx - 8},${726} ${dx + 8},${726} ${dx + 90},${sill} ${dx - 90},${sill}`} fill="rgba(255,226,170,0.06)" />
        </g>
      ))}
      {/* the downspout and the globe sconce on its bracket */}
      <rect x={884} y={700} width={9} height={sill - 700} fill="#2B2620" />
      <rect x={924} y={792} width={10} height={44} fill="#1C1A18" />
      <rect x={914} y={790} width={30} height={8} fill="#1C1A18" />
      <circle cx={929} cy={766} r={34} fill="rgba(255,226,170,0.35)" filter="url(#btaGateSoft)" opacity={flick} />
      <circle cx={929} cy={768} r={22} fill="#FFF1D2" opacity={0.95 * flick} />
      <circle cx={922} cy={761} r={7} fill="#FFFFFF" opacity={0.8} />
      {/* the pavement: concrete slabs, wet, the doorway's light on it */}
      <rect x={-1200} y={sill} width={3480} height={1920 - sill} fill="url(#btaPave)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={540 + (i - 4) * 160} y1={sill} x2={540 + (i - 4) * 520} y2={1920} stroke="rgba(0,0,0,0.35)" strokeWidth={2} />
      ))}
      <line x1={-1200} y1={sill + 110} x2={2280} y2={sill + 110} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
      {/* mats */}
      <polygon points={`296,${sill} 504,${sill} 524,${sill + 34} 276,${sill + 34}`} fill="#4A1A16" />
      <polygon points={`${ax - 4},${sill} ${ax + aw + 4},${sill} ${ax + aw + 24},${sill + 34} ${ax - 24},${sill + 34}`} fill="#5A201A" />
      <polygon points={`${ax},${sill} ${ax + aw},${sill} ${ax + aw + 160},1700 ${ax - 160},1700`} fill="rgba(255,200,130,0.12)" opacity={glow} />
      <rect x={-1200} y={sill} width={3480} height={1920 - sill} fill="url(#btaSpill)" opacity={glow * 0.9} />
      {/* the reflections of the sconce and the doorway in the wet concrete */}
      <ellipse cx={929} cy={sill + 120} rx={14} ry={60} fill="rgba(255,226,170,0.12)" filter="url(#btaGateSoft)" />
      <ellipse cx={ax + aw / 2} cy={sill + 140} rx={70} ry={90} fill="rgba(255,206,140,0.14)" filter="url(#btaGateSoft)" opacity={glow} />
      {/* evergreen planters either side */}
      {[
        [150, 1],
        [930, 1.1],
      ].map(([px, s]) => (
        <g key={px} transform={`translate(${px} ${sill}) scale(${s})`}>
          <rect x={-44} y={-62} width={88} height={62} fill="#1F3328" />
          <rect x={-44} y={-62} width={88} height={6} fill="#2D4A3A" />
          {Array.from({ length: 16 }, (_, k) => {
            const a = -Math.PI / 2 + (btaRnd(k + px) - 0.5) * 1.6;
            const l = 40 + btaRnd(k * 3 + px) * 70;
            return <path key={k} d={`M 0 -60 q ${Math.cos(a) * l * 0.4} ${Math.sin(a) * l * 0.6} ${Math.cos(a) * l * 0.8} ${Math.sin(a) * l}`} stroke={k % 3 ? "#1E3A26" : "#2C5235"} strokeWidth={9} strokeLinecap="round" fill="none" />;
          })}
        </g>
      ))}
    </g>
  );
};
