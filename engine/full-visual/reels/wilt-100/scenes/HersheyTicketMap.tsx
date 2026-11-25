// wilt-100 "hershey" (5.62-11.76 s): "March 2, 1962. Not in some big city arena, but in Hershey, Pennsylvania, the
// chocolate town, against the New York Knicks." TOWN scale. A cream 1962-style ticket is the thread: it types
// MARCH 2 and stamps 1962, rises to the top third while the world under it travels New York (old Madison Square
// Garden blinks off and slides away) -> Pennsylvania (the real outline draws, the amber pin drops on Hershey, the
// camera pushes in) -> Chocolate Avenue at night (the dive through the pin, the Kiss lamps lighting toward the HERSHEY
// smokestacks), types HERSHEY SPORTS ARENA, comes back to the centre, types the game, takes the Knicks stamp and
// tears off its stub for the gate.
// Parts: Kit (times, map, camera), Desk (the prints under the ticket at first), Ticket, Garden (New York), State (Pennsylvania), Avenue (Hershey), Counter.
import React from "react";
import { ease, prog, useScene } from "../../../src/engine";
import { HersheyTicketMapAvenue } from "./HersheyTicketMapAvenue";
import { HersheyTicketMapCounter } from "./HersheyTicketMapCounter";
import { HersheyTicketMapDesk } from "./HersheyTicketMapDesk";
import { HersheyTicketMapGarden } from "./HersheyTicketMapGarden";
import { HTM_OSWALD, useHersheyT } from "./HersheyTicketMapKit";
import { HersheyTicketMapState } from "./HersheyTicketMapState";
import { HersheyTicketMapTicket } from "./HersheyTicketMapTicket";

const FULL = { position: "absolute" as const, inset: 0 };

export const HersheyTicketMap: React.FC = () => {
  const { f } = useScene();
  const T = useHersheyT();
  // a warm light under the ticket while it is alone on the stage (it is held, under a lamp)
  const lampK = prog(f, T.born, 12, ease.out) * (1 - prog(f, T.not - 4, 14, ease.inOut));
  return (
    <div style={{ ...FULL, overflow: "hidden" }}>
      <HersheyTicketMapDesk f={f} T={T} />
      <div style={{ ...FULL, background: "radial-gradient(ellipse 520px 360px at 540px 1010px, rgba(255,214,150,0.10), rgba(255,214,150,0) 70%)", opacity: lampK }} />
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{
          ...FULL,
          // the world lives on the stage only: it fades under the caption band and before Instagram's bottom bar
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, transparent 506px, #000 566px, #000 1420px, transparent 1480px)",
          maskImage: "linear-gradient(to bottom, transparent 0, transparent 506px, #000 566px, #000 1420px, transparent 1480px)",
        }}
      >
        <HersheyTicketMapGarden f={f} T={T} />
        <HersheyTicketMapState f={f} T={T} />
        <HersheyTicketMapAvenue f={f} T={T} />
      </svg>
      <HersheyTicketMapCounter f={f} T={T} font={HTM_OSWALD} />
      <HersheyTicketMapTicket f={f} T={T} />
    </div>
  );
};
