import Image from "next/image";
import Link from "next/link";
import { Ar, Spark } from "./ui";
import { companies } from "../data/site";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Todo = ({ text }: { text: string }) => <span className="todo">{text}</span>;

// Home: "Where I've worked", 3 full-screen panels that swap while pinned (animation in HomeFx).
export function WorkPanels() {
  return (
    <section className="night" id="work">
      <div className="wp-stage">
        {companies.map((c, i) => (
          <article key={c.name} className={i === 0 ? "wp-panel on" : "wp-panel"} data-i={i} aria-label={c.name}>
            <div className="wp-head">
              <div>
                <span className="kick">Where I&apos;ve worked · 0{i + 1} / 0{companies.length}</span>
                <h2 className="wp-name">{c.name}</h2>
                <p className="wp-role">{c.role}</p>
              </div>
              <Image className={c.darkLogo ? "wp-logo dark" : "wp-logo"} src={c.logo} alt={`${c.name} logo`} width={96} height={96} />
            </div>
            <div className="wp-grid">
              <div className="wp-box wp-main">
                <small>{c.main.label}</small>
                <div className="wp-big"><span className="pcount">{c.main.value}</span><Badge variant="demo">demo</Badge></div>
                <div className="wp-chart"><Spark ys={c.chart} w={600} className="wpspark" /></div>
                <small className="wp-axis">Last 12 months</small>
              </div>
              {c.stats.map((s) => (
                <div key={s.label} className="wp-box"><b className="pcount">{s.value}</b><Badge variant="demo">demo</Badge><small>{s.label}</small></div>
              ))}
              <div className="wp-box wp-did">
                <small>What I did</small>
                <p>{c.did || <Todo text="[Your tasks, in your words]" />}</p>
                <a className="lnk" href={c.url} target="_blank" rel="noopener">Visit {c.host}<Ar /></a>
              </div>
            </div>
          </article>
        ))}
        <div className="wp-foot">
          <div className="wp-prog">
            {companies.map((c, i) => (
              <button key={c.name} type="button" data-go={i} className={i === 0 ? "on" : undefined}><i><em></em></i>{c.name}</button>
            ))}
          </div>
          <span>Numbers are placeholders for now.</span>
          <Link className={buttonVariants({ variant: "brandGhost" })} href="/work" style={{ color: "#EEF1F8" }}>See all my work<Ar /></Link>
        </div>
      </div>
    </section>
  );
}

// Work page: one big card per site.
export function WorkList() {
  return (
    <section className="night sec" id="work">
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {companies.map((c) => (
          <article key={c.name} className="wfull">
            <div className="wf-top">
              <div className="wlogo big">
                <Image src={c.logo} alt={`${c.name} logo`} width={60} height={60} />
                <div><b>{c.name}</b><small>{c.role}</small></div>
              </div>
              <a className="arr" href={c.url}>{c.host} ↗</a>
            </div>
            <div className="wf-body">
              <div className="wf-stats">
                {c.stats.map((s) => (
                  <div key={s.label}><span className="count">{s.value}</span><small>{s.label}</small></div>
                ))}
                <span style={{ alignSelf: "flex-start" }}><Badge variant="demo">demo</Badge></span>
              </div>
              <div className="wf-chart">
                <div className="wf-axis"><span>12 months ago</span><span>now</span></div>
                <Spark ys={c.chart} w={560} className="wspark tall" />
              </div>
            </div>
            <div className="wf-did"><strong>What I did</strong>{c.did || <Todo text="Your tasks, in your words" />}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
