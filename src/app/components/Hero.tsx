import {
  LinkedInIcon,
  TwitterIcon,
  GitHubIcon,
  InstagramIcon,
  YouTubeIcon,
  PhoneIcon,
  ArrowDownIcon,
} 
from "./Icons";

export default function Hero() {
  return (
    <section id="home">
      <div className="hero-bg-orb"></div>
      <div className="hero-bg-orb"></div>

      <div className="container">
        <p className="hero-eyebrow">Available for freelance &amp; collaborations</p>

        <h1 className="hero-title">
          <span className="line">
            <span>
              Crafting&nbsp;<em>Digital</em>
            </span>
          </span>
          <span className="line">
            <span>Growth</span>
          </span>
          <span className="line">
            <span>
              <em>Stories.</em>
            </span>
          </span>
        </h1>

        <p className="hero-sub">
          SEO Specialist at Ryne AI — helping brands rank, grow, and stand out
          online. Also on a journey into Full-Stack Development &amp; indie
          hacking.
        </p>

        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary">
            <PhoneIcon />
            Let&rsquo;s Talk
          </a>
          <a href="#about" className="btn btn-ghost">
            Discover More
            <ArrowDownIcon />
          </a>
        </div>

        <div className="hero-social">
          <a href="" className="hero-social-link" title="LinkedIn" target="_blank" rel="noopener">
            <LinkedInIcon />
          </a>
          <a href="" className="hero-social-link" title="Twitter / X" target="_blank" rel="noopener">
            <TwitterIcon />
          </a>
          <a href="" className="hero-social-link" title="GitHub" target="_blank" rel="noopener">
            <GitHubIcon />
          </a>
          <a href="" className="hero-social-link" title="Instagram" target="_blank" rel="noopener">
            <InstagramIcon />
          </a>
          <a href="" className="hero-social-link" title="YouTube" target="_blank" rel="noopener">
            <YouTubeIcon />
          </a>
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
}
