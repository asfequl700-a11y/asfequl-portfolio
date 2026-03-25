import {
  LinkedInIcon,
  TwitterIcon,
  GitHubIcon,
  InstagramIcon,
  YouTubeIcon,
  LocationIcon,
  EmailIcon,
  GlobeIcon,
} from "./Icons";

export default function About() {
  return (
    <section id="about">
      <p className="section-label reveal">01 &mdash; About</p>
      <div className="about-grid">
        <div>
          <h2 className="about-heading reveal-left">
            Hello, I&rsquo;m&nbsp;<em>Fahim</em>
          </h2>
          <p className="about-text reveal-left delay-1">
            I&rsquo;m an SEO Specialist based in Comilla, Bangladesh, currently
            working with <strong>Ryne AI</strong> in the UK — helping brands
            conquer search results and build meaningful digital presence.
          </p>
          <p className="about-text reveal-left delay-2">
            Beyond SEO, I&rsquo;m actively learning Full-Stack Development and
            exploring the indie hacker path — building products, automating
            workflows, and turning ideas into real things people use.
          </p>
          <p className="about-text reveal-left delay-3">
            I believe great digital work sits at the intersection of data,
            creativity, and genuine curiosity.
          </p>
          <div className="about-stats">
            <div className="stat-card reveal delay-2">
              <div className="stat-num">6+</div>
              <div className="stat-label">Months at Ryne AI</div>
            </div>
            <div className="stat-card reveal delay-3">
              <div className="stat-num">3+</div>
              <div className="stat-label">Skills in Progress</div>
            </div>
            <div className="stat-card reveal delay-4">
              <div className="stat-num">&infin;</div>
              <div className="stat-label">Ideas to Build</div>
            </div>
          </div>
        </div>

        <div className="profile-card reveal-right">
          <div className="profile-img-wrap">
            <img src="/profile.jpg" alt="Asfequl alam Fahim" />
          </div>
          <div className="profile-info">
            <div className="profile-name">Asfequl alam Fahim</div>
            <div className="profile-role">
              SEO Specialist &middot; Indie Hacker &middot; Dev in Progress
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <LocationIcon />
                Comilla, Chattogram, Bangladesh
              </div>
              <div className="profile-detail">
                <EmailIcon />
                asfequl700@gmail.com
              </div>
              <div className="profile-detail">
                <GlobeIcon />
                Open to global remote work
              </div>
            </div>
            <div className="profile-socials">
              <a href="" className="profile-social-btn" title="LinkedIn" target="_blank">
                <LinkedInIcon size={14} />
              </a>
              <a href="" className="profile-social-btn" title="Twitter/X" target="_blank">
                <TwitterIcon size={14} />
              </a>
              <a href="" className="profile-social-btn" title="GitHub" target="_blank">
                <GitHubIcon size={14} />
              </a>
              <a href="" className="profile-social-btn" title="Instagram" target="_blank">
                <InstagramIcon size={14} />
              </a>
              <a href="" className="profile-social-btn" title="YouTube" target="_blank">
                <YouTubeIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
