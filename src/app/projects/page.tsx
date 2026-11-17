import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";
import { Card } from "@/components/ui/card";

// Ported from _design/v4-Projects.dc.html
export const metadata: Metadata = {
  title: "AI Automation Projects: n8n Agents",
  description:
    "AI agents I run with n8n (lead finder, research assistant, Medium watch, outreach sender) and hobby projects like ChessSite and Streamline.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="page">
      <SiteFx />
      <section className="night">
        <div className="wrap">
          <div className="phero">
            <span className="kick">Projects</span>
            <h1>Things I&apos;ve built.</h1>
            <p className="lead">
              Two kinds: AI agents that do real work for me, and hobby projects
              I make when I&apos;m free.
            </p>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <span className="kick">From my n8n agent builder</span>
          <h2 style={{ marginBottom: "36px" }}>AI agents I run.</h2>
          <div
            className="stack"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: "20px",
            }}
          >
            <Card className="agent">
              <div
                className="scene ascene"
                aria-label="Animation: the agent searches YouTube, scores each channel, saves it to a sheet and sends an alert"
              >
                <span className="pill">Runs every day</span>
                <div className="aflow">
                  <div className="wfn">
                    <div className="wfbox lit-6">
                      <img
                        src="/logos/youtube.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Search YouTube
                  </div>
                  <div className="alink grow-14"></div>
                  <div className="wfn">
                    <div className="wfbox lit-18">
                      <img
                        src="/logos/googlegemini.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Gemini scores
                  </div>
                  <div className="alink grow-26"></div>
                  <div className="wfn">
                    <div className="wfbox lit-30">
                      <img
                        src="/logos/googlesheets.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Save to sheet
                  </div>
                  <div className="alink grow-38"></div>
                  <div className="wfn">
                    <div className="wfbox lit-42">
                      <img
                        src="/logos/discord.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Discord alert
                  </div>
                </div>
                <div className="aout side-50">
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <strong>New lead found</strong>
                    <br />
                    <span className="muted">
                      Example channel · score 8/10 · saved
                    </span>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: "24px", margin: "0" }}>
                YouTube lead finder
              </h3>
              <p className="muted" style={{ margin: "0" }}>
                Finds YouTube creators who could use my services, scores each
                one with AI and saves the good ones to a sheet.
              </p>
              <div className="atools">
                <span className="tag">n8n</span>
                <span className="tag">YouTube API</span>
                <span className="tag">Gemini</span>
                <span className="tag">Google Sheets</span>
                <span className="tag">Discord</span>
              </div>
            </Card>
            <Card className="agent">
              <div
                className="scene ascene"
                aria-label="Animation: a Discord message asks for a video package, the agent researches and writes a script document"
              >
                <span className="pill">Ask in Discord</span>
                <div
                  className="amsg in-2"
                  style={{
                    top: "20px",
                    left: "170px",
                    right: "24px",
                    width: "fit-content",
                    maxWidth: "calc(100% - 194px)",
                  }}
                >
                  &quot;Make a video package on AI tools&quot;
                </div>
                <div className="aflow">
                  <div className="wfn">
                    <div className="wfbox lit-10">
                      <img
                        src="/logos/discord.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Discord chat
                  </div>
                  <div className="alink grow-18"></div>
                  <div className="wfn">
                    <div className="wfbox lit-22">
                      <img
                        src="/logos/youtube.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Study top videos
                  </div>
                  <div className="alink grow-30"></div>
                  <div className="wfn">
                    <div className="wfbox lit-34">
                      <img
                        src="/logos/googlegemini.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Gemini writes
                  </div>
                  <div className="alink grow-42"></div>
                  <div className="wfn">
                    <div className="wfbox lit-46">
                      <img
                        src="/logos/googledocs.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Script doc
                  </div>
                </div>
                <div className="aout side-54">
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <strong>Package ready</strong>
                    <br />
                    <span className="muted">
                      5 titles · thumbnail idea · script in Google Docs
                    </span>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: "24px", margin: "0" }}>
                YouTube research assistant
              </h3>
              <p className="muted" style={{ margin: "0" }}>
                I type a topic in Discord. It studies the top videos, then
                writes titles, a thumbnail idea and a script into a Google Doc.
              </p>
              <div className="atools">
                <span className="tag">n8n</span>
                <span className="tag">Discord</span>
                <span className="tag">YouTube API</span>
                <span className="tag">Gemini</span>
                <span className="tag">Google Docs</span>
              </div>
            </Card>
            <Card className="agent">
              <div
                className="scene ascene"
                aria-label="Animation: new articles come in, AI picks the useful ones, saves them and sends an alert"
              >
                <span className="pill">Watches the web</span>
                <div className="aflow">
                  <div className="wfn">
                    <div className="wfbox lit-6">
                      <img src="/logos/rss.svg" alt="" width={34} height={34} />
                    </div>
                    New articles
                  </div>
                  <div className="alink grow-14"></div>
                  <div className="wfn">
                    <div className="wfbox lit-18">
                      <img
                        src="/logos/googlegemini.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    AI filters
                  </div>
                  <div className="alink grow-26"></div>
                  <div className="wfn">
                    <div className="wfbox lit-30">
                      <img
                        src="/logos/googlesheets.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Save to sheet
                  </div>
                  <div className="alink grow-38"></div>
                  <div className="wfn">
                    <div className="wfbox lit-42">
                      <img
                        src="/logos/discord.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Discord alert
                  </div>
                </div>
                <div className="aout side-50">
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <strong>3 articles worth a look</strong>
                    <br />
                    <span className="muted">
                      Summaries saved · the rest skipped
                    </span>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: "24px", margin: "0" }}>Medium Watch</h3>
              <p className="muted" style={{ margin: "0" }}>
                Checks new Medium posts in my topic, lets AI pick the ones that
                matter, saves a short summary and alerts me.
              </p>
              <div className="atools">
                <span className="tag">n8n</span>
                <span className="tag">RSS</span>
                <span className="tag">Serper search</span>
                <span className="tag">Gemini</span>
                <span className="tag">Discord</span>
              </div>
            </Card>
            <Card className="agent">
              <div
                className="scene ascene"
                aria-label="Animation: the agent reads a contact from a sheet, writes an email, sends it and checks for a reply"
              >
                <span className="pill">Emails on a schedule</span>
                <div className="aflow">
                  <div className="wfn">
                    <div className="wfbox lit-6">
                      <img
                        src="/logos/googlesheets.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Contact list
                  </div>
                  <div className="alink grow-14"></div>
                  <div className="wfn">
                    <div className="wfbox lit-18">
                      <svg
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                      </svg>
                    </div>
                    Write email
                  </div>
                  <div className="alink grow-26"></div>
                  <div className="wfn">
                    <div className="wfbox lit-30">
                      <img
                        src="/logos/gmail.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Send by Gmail
                  </div>
                  <div className="alink grow-38"></div>
                  <div className="wfn">
                    <div className="wfbox lit-42">
                      <img
                        src="/logos/gmail.svg"
                        alt=""
                        width={34}
                        height={34}
                      />
                    </div>
                    Check replies
                  </div>
                </div>
                <div className="aout side-50">
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <strong>Sheet updated</strong>
                    <br />
                    <span className="muted">
                      Sent · reply marked · next follow-up set
                    </span>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: "24px", margin: "0" }}>Outreach sender</h3>
              <p className="muted" style={{ margin: "0" }}>
                Takes contacts from a sheet, sends a personal email from Gmail,
                then checks for replies and updates the sheet.
              </p>
              <div className="atools">
                <span className="tag">n8n</span>
                <span className="tag">Google Sheets</span>
                <span className="tag">Gmail</span>
                <span className="tag">AI writing</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <span className="kick">When I&apos;m free</span>
          <h2 style={{ marginBottom: "36px" }}>Hobby projects.</h2>
          <div
            className="stack"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,minmax(0,1fr))",
              gap: "20px",
            }}
          >
            <Card className="hcard">
              <div className="hart" style={{ background: "#3E2E22" }}>
                <div className="mini" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span
                  style={{
                    position: "absolute",
                    fontSize: "44px",
                    color: "#FFFFFF",
                    textShadow: "0 2px 6px rgba(0,0,0,.5)",
                  }}
                >
                  ♞
                </span>
              </div>
              <div className="hbody">
                <span className="tag" style={{ alignSelf: "flex-start" }}>
                  Hobby
                </span>
                <h3>ChessSite</h3>
                <p className="muted">
                  A free chess site, like a mini chess.com: play, puzzles,
                  lessons and game review with the Stockfish engine.
                </p>
                <div className="atools">
                  <span className="tag">Next.js</span>
                  <span className="tag">Stockfish</span>
                </div>
                <div className="hlinkrow">
                  <a href="https://chesssite-kappa.vercel.app">Try it</a>
                  <a href="https://github.com/asfequl700-a11y/chesssite">
                    Code
                  </a>
                </div>
              </div>
            </Card>
            <Card className="hcard">
              <div
                className="hart"
                style={{
                  background: "#141821",
                  flexDirection: "column",
                  gap: "8px",
                }}
                aria-hidden="true"
              >
                <span className="bucket pop-6">⚡ Quick Fix</span>
                <span className="bucket pop-14">📘 Deep Dive</span>
                <span
                  className="bucket pop-22"
                  style={{ background: "#FF6B1A", color: "#FFFFFF" }}
                >
                  ★ Gold Standard
                </span>
              </div>
              <div className="hbody">
                <span className="tag" style={{ alignSelf: "flex-start" }}>
                  Hobby
                </span>
                <h3>Streamline</h3>
                <p className="muted">
                  Search YouTube smarter. It scores videos and sorts them into
                  Quick Fix, Deep Dive and Gold Standard, so you find the best
                  one fast.
                </p>
                <div className="atools">
                  <span className="tag">Next.js</span>
                  <span className="tag">YouTube API</span>
                  <span className="tag">AI</span>
                </div>
                <div className="hlinkrow">
                  <a href="https://streamline-seven-sooty.vercel.app">Try it</a>
                </div>
              </div>
            </Card>
            <Card className="hcard">
              <div
                className="hart"
                style={{ background: "#2346E8" }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="56"
                  height="56"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="13" rx="2" />
                  <path d="m10 8 5 2.5-5 2.5z" />
                  <circle cx="7" cy="21" r="1" />
                  <circle cx="12" cy="21" r="1" />
                  <circle cx="17" cy="21" r="1" />
                </svg>
              </div>
              <div className="hbody">
                <span className="tag" style={{ alignSelf: "flex-start" }}>
                  Hobby
                </span>
                <h3>GroupWatch</h3>
                <p className="muted">
                  A watch-together page: friends join one room and watch a movie
                  in sync.
                </p>
                <div className="atools">
                  <span className="tag">JavaScript</span>
                  <span className="tag">AI Studio</span>
                </div>
                <div className="hlinkrow">
                  <a href="https://group-watch-five.vercel.app">Try it</a>
                </div>
              </div>
            </Card>
            <Card className="hcard">
              <div
                className="hart"
                style={{ background: "#F2EDE4" }}
                aria-hidden="true"
              >
                <div
                  className="browser"
                  style={{
                    width: "200px",
                    height: "110px",
                    background: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "10px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <b
                    style={{
                      height: "10px",
                      width: "60%",
                      background: "#141821",
                      borderRadius: "3px",
                    }}
                  ></b>
                  <b
                    style={{
                      height: "6px",
                      width: "90%",
                      background: "#D6DBE3",
                      borderRadius: "3px",
                    }}
                  ></b>
                  <b
                    style={{
                      height: "6px",
                      width: "75%",
                      background: "#D6DBE3",
                      borderRadius: "3px",
                    }}
                  ></b>
                  <b
                    style={{
                      marginTop: "auto",
                      height: "18px",
                      width: "70px",
                      background: "#FF6B1A",
                      borderRadius: "999px",
                    }}
                  ></b>
                </div>
              </div>
              <div className="hbody">
                <span className="tag" style={{ alignSelf: "flex-start" }}>
                  Practice site
                </span>
                <h3>UK Web Design</h3>
                <p className="muted">
                  A sample website for UK tradespeople. Made to practise the
                  kind of site I build for local businesses.
                </p>
                <div className="atools">
                  <span className="tag">Next.js</span>
                  <span className="tag">Design</span>
                </div>
                <div className="hlinkrow">
                  <a href="https://uk-web-design.vercel.app">See it</a>
                  <a href="https://github.com/asfequl700-a11y/uk-web-design">
                    Code
                  </a>
                </div>
              </div>
            </Card>
            <Card className="hcard">
              <div
                className="hart"
                style={{ background: "#1D2B1F" }}
                aria-hidden="true"
              >
                <span
                  style={{
                    fontSize: "52px",
                    filter: "drop-shadow(0 3px 0 #000)",
                  }}
                >
                  👾
                </span>
              </div>
              <div className="hbody">
                <span className="tag" style={{ alignSelf: "flex-start" }}>
                  Hobby
                </span>
                <h3>Family Games</h3>
                <p className="muted">
                  A pixel-art game room for my family, with a little runner game
                  inside a computer screen.
                </p>
                <div className="atools">
                  <span className="tag">HTML</span>
                  <span className="tag">CSS</span>
                  <span className="tag">JavaScript</span>
                </div>
                <div className="hlinkrow">
                  <a href="https://family-games-sigma-tawny.vercel.app">
                    Play it
                  </a>
                </div>
              </div>
            </Card>
            <Card className="hcard">
              <div
                className="hart"
                style={{ background: "#FFF1A8" }}
                aria-hidden="true"
              >
                <span
                  style={{
                    font: "800 26px var(--f-display),sans-serif",
                    background: "#FFE14D",
                    padding: "4px 10px",
                    borderRadius: "4px",
                  }}
                >
                  Highlight
                </span>
              </div>
              <div className="hbody">
                <span className="tag" style={{ alignSelf: "flex-start" }}>
                  Hobby
                </span>
                <h3>Page Marker</h3>
                <p className="muted">
                  A Chrome extension to highlight text and add notes on any
                  page. Saves on your own computer only.
                </p>
                <div className="atools">
                  <span className="tag">Chrome extension</span>
                  <span className="tag">JavaScript</span>
                </div>
                <div className="hlinkrow">
                  <a href="https://github.com/asfequl700-a11y/page_marker">
                    Code
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      <FinalCta
        title={
          <>
            Want an agent
            <br />
            like this?
          </>
        }
      />
    </div>
  );
}
