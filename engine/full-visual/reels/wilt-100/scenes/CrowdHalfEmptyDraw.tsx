// wilt-100 "crowd": the objects, each drawn flat in centimetres from its reference photo. Props lays them into the world.
import React from "react";
import { AMBER } from "./CrowdHalfEmptyKit";

type Font = { ui: string; mono: string; caption: string };

/** RCA TK-41 studio camera on its pedestal, side on, lens to the left (toward the court). 156 x 200, floor at y 200.
 *  From the Early Television Museum photo: brushed silver body, raised louvred hood, black lens turret, red script
 *  badge, rear viewfinder, chrome column through a steering ring, grey bell base, three-foot spider on castors. */
export const CrowdHalfEmptyTK41: React.FC<{ unplug: number }> = ({ unplug }) => {
  const louvres = [0, 1, 2].flatMap((r) => Array.from({ length: 7 }, (_, i) => ({ x: 42 + i * 9.5, y: 9 + r * 4.6 })));
  // the cable: plugged into the back, falling to the riser, coiled; it pulls out and slides away on "cameras"
  const px = 128 + unplug * 70, py = 70 + unplug * 118;
  return (
    <g>
      <defs>
        <linearGradient id="cheTkBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DADDE1" /><stop offset="0.45" stopColor="#B4B9BF" /><stop offset="1" stopColor="#7E848B" />
        </linearGradient>
        <linearGradient id="cheTkChrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6E747B" /><stop offset="0.35" stopColor="#F1F3F5" /><stop offset="0.6" stopColor="#9EA4AB" /><stop offset="1" stopColor="#5B6168" />
        </linearGradient>
        <linearGradient id="cheTkBell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A5058" /><stop offset="0.4" stopColor="#7C838C" /><stop offset="1" stopColor="#3B4047" />
        </linearGradient>
      </defs>
      {/* the cable on the riser, then up into the plug */}
      <path d={`M${px} ${py} C ${px + 18} ${py + 40}, ${150 + unplug * 60} 170, ${170 + unplug * 90} 196 C 190 ${200 - unplug * 0} 230 196 ${250 + unplug * 140} 198`} fill="none" stroke="#17191C" strokeWidth={4.2} strokeLinecap="round" />
      <ellipse cx={210 + unplug * 120} cy={197} rx={26} ry={3.2} fill="none" stroke="#17191C" strokeWidth={3.4} />
      <ellipse cx={212 + unplug * 120} cy={196} rx={19} ry={2.4} fill="none" stroke="#24272B" strokeWidth={3} />
      <rect x={px - 3} y={py - 5} width={9} height={10} rx={1.5} fill="#2E3237" />
      {/* the three-foot spider and castors */}
      <path d="M78 186 L14 194 M78 186 L142 194 M78 186 L84 198" stroke="#5E656D" strokeWidth={6} strokeLinecap="round" />
      {[14, 142, 84].map((x) => <g key={x}><circle cx={x} cy={195} r={5} fill="#1A1C1F" /><circle cx={x} cy={195} r={1.8} fill="#6E747B" /></g>)}
      {/* the bell base */}
      <path d="M56 190 C 58 172, 64 156, 66 146 L 90 146 C 92 156, 98 172, 100 190 Z" fill="url(#cheTkBell)" />
      <ellipse cx={78} cy={146} rx={12} ry={2.2} fill="#9AA0A7" />
      {/* the chrome column and its telescoping tube */}
      <rect x={71} y={92} width={14} height={56} fill="url(#cheTkChrome)" />
      <rect x={73} y={78} width={10} height={18} fill="url(#cheTkChrome)" />
      {/* the steering ring, seen edge on, with its spokes */}
      <path d="M78 122 L42 120 M78 122 L114 120 M78 122 L64 125 M78 122 L94 125" stroke="#A9AFB5" strokeWidth={1.6} />
      <ellipse cx={78} cy={120} rx={40} ry={5.5} fill="none" stroke="url(#cheTkChrome)" strokeWidth={3.6} />
      {/* the pan head */}
      <rect x={58} y={70} width={40} height={10} rx={2} fill="#2B2F35" />
      <rect x={66} y={66} width={24} height={6} fill="#3A3F46" />
      {/* the pan bars, out the back with their grips */}
      <path d="M118 66 L 170 104" stroke="#9EA4AB" strokeWidth={3.2} strokeLinecap="round" />
      <path d="M163 99 L 176 108" stroke="#1C1E21" strokeWidth={6} strokeLinecap="round" />
      {/* the body */}
      <rect x={18} y={22} width={110} height={46} rx={3} fill="url(#cheTkBody)" stroke="#5D636A" strokeWidth={0.8} />
      <path d="M18 46 H128" stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />
      <path d="M70 22 V68" stroke="rgba(0,0,0,0.12)" strokeWidth={0.7} />
      {[24, 64, 76, 122].flatMap((x) => [26, 64].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={0.9} fill="#5D636A" />))}
      {/* the raised hood with its louvres */}
      <path d="M32 22 L36 5 L 112 5 L 116 22 Z" fill="url(#cheTkBody)" stroke="#5D636A" strokeWidth={0.8} />
      {louvres.map((l, i) => <rect key={i} x={l.x} y={l.y} width={6.5} height={2.2} rx={1} fill="#3E444B" />)}
      {/* the dead tally lamp */}
      <circle cx={38} cy={3.6} r={2.6} fill="#3A1A1C" stroke="#1C1E21" strokeWidth={0.8} />
      {/* the red script badge */}
      <text x={30} y={41} fill="#C8102E" fontFamily="'Brush Script MT', 'Segoe Script', cursive" fontStyle="italic" fontSize={8.5}>Color Television</text>
      {/* the lens turret and its lenses, pointing at the court */}
      <rect x={6} y={16} width={13} height={58} rx={4} fill="#15171A" />
      {[{ y: 22, l: 24, h: 11 }, { y: 38, l: 14, h: 12 }, { y: 55, l: 19, h: 10 }].map((q, i) => (
        <g key={i}>
          <rect x={6 - q.l} y={q.y} width={q.l} height={q.h} rx={1.5} fill="#1E2125" />
          <rect x={6 - q.l + 2} y={q.y} width={2.2} height={q.h} fill="#8A9097" />
          <rect x={6 - q.l} y={q.y + 1.5} width={1.5} height={q.h - 3} fill="#2E4552" />
        </g>
      ))}
      <circle cx={12.5} cy={45} r={3} fill="#2E3237" />
      {/* the viewfinder at the back */}
      <rect x={120} y={10} width={22} height={40} rx={2} fill="#1E2125" />
      <path d="M142 12 L 150 8 L 150 48 L 142 46 Z" fill="#121315" />
      <rect x={124} y={54} width={8} height={10} rx={1} fill="#2B2F35" />
    </g>
  );
};

/** Zenith T522W tube clock radio, 1954, front on. 50 x 26, from the Joe Haupt photo: ivory case narrowing to the top,
 *  two square gold-framed dials (clock left, broadcast band right), stepped centre grille with the crown badge,
 *  ZENITH along the base between two gold knobs, splayed feet. `glow` lights the broadcast dial. */
export const CrowdHalfEmptyRadio: React.FC<{ glow: number; f: number; font: Font }> = ({ glow, f, font }) => {
  const nums = ["5.5", "6", "7", "8", "9", "10", "12", "14", "16"];
  const flick = 1 + 0.04 * Math.sin(f * 0.9) * glow;
  const face = glow > 0 ? `rgba(242,179,61,${(0.25 + 0.75 * glow) * flick})` : "#D9CBA4";
  const dials = (cx: number, clock: boolean) => (
    <g>
      <rect x={cx - 8.6} y={5.2} width={17.2} height={14.6} rx={1.6} fill="#2A2620" stroke="#C7A24A" strokeWidth={0.7} />
      <circle cx={cx} cy={12.5} r={6.4} fill={clock ? "#D9CBA4" : face} stroke="#B48F3C" strokeWidth={0.35} />
      <circle cx={cx} cy={12.5} r={3.9} fill={clock ? "#3B3A36" : glow > 0 ? "#6B4A12" : "#3B3A36"} />
      <circle cx={cx} cy={12.5} r={2.2} fill="#9C8456" />
      {clock
        ? Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 3;
            return <text key={i} x={cx + Math.cos(a) * 5.2} y={12.5 + Math.sin(a) * 5.2 + 0.55} fontSize={1.5} fontFamily={font.ui} fontWeight={700} fill="#2A2620" textAnchor="middle">{i + 1}</text>;
          })
        : nums.map((n, i) => {
            const a = Math.PI * (0.8 + (1.4 * i) / 8);
            return <text key={n} x={cx + Math.cos(a) * 5.2} y={12.5 + Math.sin(a) * 5.2 + 0.5} fontSize={1.3} fontFamily={font.ui} fontWeight={700} fill={glow > 0.3 ? "#3A2606" : "#8C6A22"} textAnchor="middle">{n}</text>;
          })}
      {clock ? (
        <g stroke="#111" strokeLinecap="round"><path d={`M${cx} 12.5 L${cx + 2.6} ${10.6}`} strokeWidth={0.5} /><path d={`M${cx} 12.5 L${cx - 1.0} ${7.6}`} strokeWidth={0.35} /></g>
      ) : (
        <path d={`M${cx} 12.5 L${cx + 4.6} ${9.6}`} stroke="#B3261E" strokeWidth={0.4} strokeLinecap="round" />
      )}
      {!clock && <text x={cx} y={18.6} fontSize={0.9} fontFamily={font.ui} fontWeight={700} letterSpacing={0.12} fill={glow > 0.3 ? "#3A2606" : "#8C6A22"} textAnchor="middle">STANDARD BROADCAST</text>}
      {clock && [cx - 3.4, cx, cx + 3.4].map((x) => <circle key={x} cx={x} cy={21.2} r={0.95} fill="#C7A24A" />)}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="cheZenith" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4EFE2" /><stop offset="0.7" stopColor="#E2DACA" /><stop offset="1" stopColor="#BDB4A2" />
        </linearGradient>
        <radialGradient id="cheKnob" cx="0.4" cy="0.35"><stop offset="0" stopColor="#F3D98B" /><stop offset="0.6" stopColor="#C09133" /><stop offset="1" stopColor="#7A5916" /></radialGradient>
      </defs>
      {/* the feet */}
      <path d="M8 24 L 6 26 L 10 26 L 11 24 Z M42 24 L 40 24 L 41 26 L 45 26 Z" fill="#E7E0D0" />
      {/* the case */}
      <path d="M2.4 3.2 Q 2.6 1 5 1 L 45 1 Q 47.4 1 47.6 3.2 L 49.6 22.4 Q 49.8 24.4 47.6 24.4 L 2.4 24.4 Q 0.2 24.4 0.4 22.4 Z" fill="url(#cheZenith)" stroke="#9F9785" strokeWidth={0.3} />
      <path d="M3 3.6 L 47 3.6" stroke="rgba(255,255,255,0.7)" strokeWidth={0.4} />
      {dials(9.6, true)}
      {dials(40.5, false)}
      {/* the stepped centre grille and its crown badge */}
      {[0, 1, 2].map((k) => <rect key={k} x={19.2 + k * 1.4} y={5.4 + k * 1.2} width={11.6 - k * 2.8} height={12.6 - k * 2.4} rx={0.6} fill="none" stroke="#D3C9B4" strokeWidth={0.9} />)}
      <rect x={22.2} y={8.6} width={5.6} height={6.4} fill="#CFC6B2" />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={22.6} x2={27.4} y1={9.4 + k * 1.5} y2={9.4 + k * 1.5} stroke="#AFA48E" strokeWidth={0.35} />)}
      <path d="M23.9 10.6 L 24.4 9.4 L 25 10.3 L 25.6 9.4 L 26.1 10.6 L 26 13 Q 25 13.8 24 13 Z" fill="#C7A24A" stroke="#7A5916" strokeWidth={0.15} />
      {/* the base bar: ZENITH between the two big knobs */}
      <rect x={13} y={19.6} width={24} height={3.6} rx={0.8} fill="#ECE5D6" stroke="#CFC6B2" strokeWidth={0.25} />
      <text x={25} y={22.3} fontSize={2.3} fontFamily={font.ui} fontWeight={700} letterSpacing={0.7} fill="#2A2620" textAnchor="middle">ZENITH</text>
      <circle cx={15.6} cy={21.4} r={2.4} fill="url(#cheKnob)" stroke="#6B4E12" strokeWidth={0.2} />
      <circle cx={34.4} cy={21.4} r={2.4} fill="url(#cheKnob)" stroke="#6B4E12" strokeWidth={0.2} />
      {glow > 0 && <rect x={31.9} y={5.2} width={17.2} height={14.6} rx={1.6} fill={AMBER} opacity={0.18 * glow} />}
    </g>
  );
};

/** a typewriter under its vinyl cover, 44 x 22: the dome over the carriage bump, a seam, the rubber feet showing */
export const CrowdHalfEmptyTypewriter: React.FC = () => (
  <g>
    <path d="M3 22 L 41 22" stroke="#0B0C0E" strokeWidth={1.4} />
    {[6, 38].map((x) => <rect key={x} x={x - 2} y={20.6} width={4} height={2} rx={0.6} fill="#121315" />)}
    <path d="M1.5 21 C 1 15, 3 10, 7 8.2 L 8.8 4 C 9.2 2.8, 10.4 2.4, 11.6 2.4 L 32.4 2.4 C 33.6 2.4, 34.8 2.8, 35.2 4 L 37 8.2 C 41 10, 43 15, 42.5 21 Z" fill="#2B2F35" stroke="#16181B" strokeWidth={0.5} />
    <path d="M7 8.4 C 15 10, 29 10, 37 8.4" fill="none" stroke="#1A1C20" strokeWidth={0.7} />
    <path d="M2.5 19.6 C 14 20.6, 30 20.6, 41.5 19.6" fill="none" stroke="#3D424A" strokeWidth={0.5} strokeDasharray="1 0.8" />
    <path d="M10 4.2 C 16 3.4, 28 3.4, 34 4.2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />
    <path d="M4 15 C 5 11.5, 8 10, 12 10.2" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.2} />
  </g>
);

/** a steel folding chair seen from the front, empty, 46 x 84, floor at y 84 */
export const CrowdHalfEmptyChair: React.FC = () => (
  <g>
    <path d="M6 84 L 10 46 M40 84 L 36 46 M9 84 L 37 50 M37 84 L 9 50" stroke="#3B4048" strokeWidth={2.2} strokeLinecap="round" />
    <path d="M8 4 C 16 1.5, 30 1.5, 38 4 L 37.5 18 C 30 16, 16 16, 8.5 18 Z" fill="#454B54" stroke="#2A2E34" strokeWidth={0.6} />
    <path d="M10 5 C 17 3, 29 3, 36 5" stroke="rgba(255,255,255,0.18)" strokeWidth={1} fill="none" />
    <path d="M9 4 L 9.5 46 M37 4 L 36.5 46" stroke="#3B4048" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M7 44 L 39 44 L 40 50 L 6 50 Z" fill="#4C535C" stroke="#2A2E34" strokeWidth={0.6} />
  </g>
);

/** the arena's period scoreboard on the far end wall, 900 x 420: a black steel cabinet with rivets, WARRIORS and
 *  KNICKS in white paint over two banks of dead bulb digits, four round quarter lamps. Lamp 4 lights amber, and the
 *  radio's waves run under it as a waveform. The WILT flip panel hangs under the board, its flaps still blank. */
export const CrowdHalfEmptyBoard: React.FC<{ f: number; lamp4: number; wave: number; font: Font }> = ({ f, lamp4, wave, font }) => {
  const bulbs: React.ReactNode[] = [];
  for (const bx of [70, 560]) for (let d = 0; d < 3; d++) for (let c = 0; c < 5; c++) for (let r = 0; r < 7; r++)
    bulbs.push(<circle key={`${bx}${d}${c}${r}`} cx={bx + d * 96 + c * 15.5} cy={122 + r * 15.5} r={5.4} fill="#22262B" />);
  const lamps = [285, 395, 505, 615];
  const wv = Array.from({ length: 90 }, (_, i) => {
    const x = 470 + i * 3.4;
    const env = Math.sin((Math.PI * i) / 89);
    const a = wave * env * 16 * (0.45 + 0.55 * Math.abs(Math.sin(i * 0.83 + f * 0.31) * Math.cos(i * 0.29 - f * 0.17)));
    return `${i ? "L" : "M"}${x.toFixed(1)} ${(395 - a).toFixed(1)} L${x.toFixed(1)} ${(395 + a).toFixed(1)}`;
  }).join(" ");
  return (
    <g>
      {/* the WILT panel hanging under the board */}
      <path d="M390 420 L 396 470 M510 420 L 504 470" stroke="#4A5058" strokeWidth={4} strokeDasharray="7 4" />
      <rect x={370} y={468} width={160} height={92} rx={6} fill="#0E1012" stroke="#2C3036" strokeWidth={5} />
      <text x={450} y={492} fill="#8B949E" fontFamily={font.ui} fontWeight={700} fontSize={18} letterSpacing={3} textAnchor="middle">WILT</text>
      {[0, 1, 2].map((k) => <g key={k}><rect x={384 + k * 46} y={500} width={40} height={52} rx={3} fill="#17191C" /><line x1={384 + k * 46} x2={424 + k * 46} y1={526} y2={526} stroke="#050506" strokeWidth={2} /></g>)}
      {/* the cabinet */}
      <rect x={0} y={0} width={900} height={420} rx={8} fill="#0E1012" stroke="#2C3036" strokeWidth={14} />
      {Array.from({ length: 30 }, (_, i) => <circle key={`rt${i}`} cx={14 + i * 30.4} cy={8} r={2.2} fill="#4A5058" />)}
      {Array.from({ length: 30 }, (_, i) => <circle key={`rb${i}`} cx={14 + i * 30.4} cy={412} r={2.2} fill="#4A5058" />)}
      <text x={180} y={88} fill="#E9E6DE" fontFamily={font.ui} fontWeight={800} fontSize={54} letterSpacing={4} textAnchor="middle">WARRIORS</text>
      <text x={720} y={88} fill="#E9E6DE" fontFamily={font.ui} fontWeight={800} fontSize={54} letterSpacing={4} textAnchor="middle">KNICKS</text>
      {bulbs}
      <line x1={450} y1={30} x2={450} y2={250} stroke="#2C3036" strokeWidth={4} />
      <text x={450} y={262} fill="#8B949E" fontFamily={font.ui} fontWeight={700} fontSize={22} letterSpacing={5} textAnchor="middle">QUARTER</text>
      {lamps.map((x, i) => {
        const lit = i === 3 ? lamp4 : 0;
        return (
          <g key={x}>
            <circle cx={x} cy={315} r={44} fill="#1A1C1F" stroke="#3A3F46" strokeWidth={4} />
            <circle cx={x} cy={315} r={38} fill={lit > 0 ? `rgba(242,179,61,${(0.15 + 0.85 * lit).toFixed(3)})` : "#2A2416"} />
            {lit > 0 && <circle cx={x} cy={315} r={38 + 26 * lit} fill={AMBER} opacity={0.18 * lit} />}
            <circle cx={x - 12} cy={302} r={9} fill="rgba(255,255,255,0.08)" />
            <text x={x} y={333} fill={lit > 0.5 ? "#2A1C04" : "#5A5F66"} fontFamily={font.ui} fontWeight={800} fontSize={50} textAnchor="middle">{i + 1}</text>
          </g>
        );
      })}
      {wave > 0 && <path d={wv} stroke={AMBER} strokeWidth={2.4} strokeLinecap="round" opacity={0.95} />}
    </g>
  );
};
