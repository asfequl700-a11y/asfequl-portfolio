import type { LucideIcon } from "lucide-react";
import { Clapperboard, FileText, Bot, Brain, Cpu, Wrench, Scissors, Share2, Mail, ImagePlus, MessagesSquare, UserCheck, CalendarClock, Inbox, Table, Radar } from "lucide-react";

// An example "n8n-style" board: one video goes in, agents research, write and cut, you approve, it publishes.
// Fixed 1200 x 650 canvas; on small screens the wrapper scrolls sideways like a real board.
type N = { id: string; x: number; y: number; w: number; h: number; icon: LucideIcon; t: string; s: string; tag?: string; agent?: boolean; d: number; small?: boolean };

const nodes: N[] = [
  { id: "trig", x: 10, y: 260, w: 180, h: 76, icon: Clapperboard, t: "New video", s: "Trigger: you upload", d: 0 },
  { id: "tx", x: 225, y: 260, w: 180, h: 76, icon: FileText, t: "Get transcript", s: "Captions and notes", d: 1 },
  { id: "agent", x: 450, y: 223, w: 230, h: 150, icon: Bot, t: "Content agent", s: "Reads the video, decides what to make, calls its tools", tag: "AI agent", agent: true, d: 2 },
  { id: "model", x: 445, y: 425, w: 88, h: 50, icon: Cpu, t: "Model", s: "", small: true, d: 2.4 },
  { id: "mem", x: 540, y: 425, w: 88, h: 50, icon: Brain, t: "Your style", s: "", small: true, d: 2.6 },
  { id: "tools", x: 635, y: 425, w: 88, h: 50, icon: Wrench, t: "Tools", s: "", small: true, d: 2.8 },
  { id: "o1", x: 750, y: 20, w: 190, h: 76, icon: Scissors, t: "Shorts agent", s: "Finds the best moments", tag: "Agent", d: 3.6 },
  { id: "o2", x: 750, y: 140, w: 190, h: 76, icon: Share2, t: "Post writer", s: "Social posts in your voice", tag: "Agent", d: 4 },
  { id: "o3", x: 750, y: 260, w: 190, h: 76, icon: Mail, t: "Newsletter draft", s: "Recap for your list", d: 4.4 },
  { id: "o4", x: 750, y: 380, w: 190, h: 76, icon: ImagePlus, t: "Titles and thumbnails", s: "Ideas to test", d: 4.8 },
  { id: "o5", x: 750, y: 500, w: 190, h: 76, icon: MessagesSquare, t: "Community post", s: "Keeps viewers talking", d: 5.2 },
  { id: "ok", x: 985, y: 170, w: 205, h: 76, icon: UserCheck, t: "You approve", s: "Nothing goes out without you", d: 6.6 },
  { id: "pub", x: 985, y: 330, w: 205, h: 76, icon: CalendarClock, t: "Schedule and publish", s: "Checklist done every time", d: 7.8 },
  { id: "q", x: 10, y: 545, w: 180, h: 70, icon: Inbox, t: "New enquiry", s: "Email or form", d: 8.6 },
  { id: "qa", x: 225, y: 545, w: 180, h: 70, icon: Radar, t: "Enquiry agent", s: "Answers about your offer", tag: "Agent", d: 9.4 },
  { id: "qs", x: 450, y: 545, w: 230, h: 70, icon: Table, t: "Saved to your sheet", s: "And you get an alert", d: 10.2 },
];
const by = Object.fromEntries(nodes.map((n) => [n.id, n]));

const link = (a: string, b: string) => {
  const A = by[a], B = by[b];
  const x1 = A.x + A.w, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y + B.h / 2, dx = (x2 - x1) / 2;
  return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
};
const wires = [
  link("trig", "tx"), link("tx", "agent"),
  link("agent", "o1"), link("agent", "o2"), link("agent", "o3"), link("agent", "o4"), link("agent", "o5"),
  link("o1", "ok"), link("o2", "ok"), link("o3", "ok"), link("o4", "ok"), link("o5", "ok"),
  `M${985 + 102} ${170 + 76} L${985 + 102} 330`,
  link("q", "qa"), link("qa", "qs"),
];
// dashed "plug-ins" from the agent down to its model, memory and tools
const plugs = ["model", "mem", "tools"].map((id) => {
  const B = by[id], x1 = by.agent.x + by.agent.w / 2, y1 = by.agent.y + by.agent.h, x2 = B.x + B.w / 2;
  return `M${x1} ${y1} C${x1} ${y1 + 25} ${x2} ${B.y - 25} ${x2} ${B.y}`;
});

export default function WorkflowBoard() {
  return (
    <div className="fb" role="img" aria-label="Example workflow board: a new video is read by an AI agent, which creates shorts, posts, a newsletter draft, titles and a community post. You approve, then it is scheduled and published. A second flow answers enquiries.">
      <div className="fb-bar">
        <i /><i /><i />
        <b>Content pipeline</b><span className="fb-tab on">Editor</span><span className="fb-tab">Executions</span>
        <em><u />Active · example</em>
      </div>
      <div className="fb-scroll" tabIndex={0}>
        <div className="fb-canvas" aria-hidden="true">
          <svg width="1200" height="650" viewBox="0 0 1200 650">
            {wires.map((d, i) => <path key={i} d={d} className="fb-wire" />)}
            {plugs.map((d, i) => <path key={i} d={d} className="fb-plug" />)}
            {wires.map((d, i) => (
              <circle key={i} r="4.5" className="fb-pkt">
                <animateMotion dur="3.2s" begin={`${(i * 0.37).toFixed(2)}s`} repeatCount="indefinite" path={d} />
              </circle>
            ))}
          </svg>
          {nodes.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className={"fb-n" + (n.agent ? " agent" : "") + (n.small ? " small" : "")} style={{ left: n.x, top: n.y, width: n.w, height: n.h, animationDelay: n.d + "s" }}>
                <span className="fb-ic"><Icon /></span>
                <div><b>{n.t}</b>{n.s && <small>{n.s}</small>}</div>
                {n.tag && <em className="fb-tag">{n.tag}</em>}
              </div>
            );
          })}
          <span className="fb-lbl" style={{ left: 10, top: 505 }}>Second flow: replies to people interested in your offer</span>
          <span className="fb-lbl" style={{ left: 985, top: 130 }}>Human check</span>
        </div>
      </div>
      <p className="fb-hint">Example workflow. Swipe the board to see all of it. I&apos;d build it around your channel.</p>
    </div>
  );
}
