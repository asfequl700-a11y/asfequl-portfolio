const skills = [
  {
    icon: "🔍",
    name: "Search Engine Optimisation",
    desc: "Technical audits, on-page optimisation, keyword strategy, link building, and ranking content that actually converts.",
    bar: 88,
    delay: "delay-1",
  },
  {
    icon: "📈",
    name: "Digital Marketing",
    desc: "Growth strategy, content marketing, social media, analytics-driven decision making, and brand positioning.",
    bar: 75,
    delay: "delay-2",
  },
  {
    icon: "💻",
    name: "Full-Stack Development",
    desc: "Actively learning HTML, CSS, JavaScript, and modern frameworks — building real projects along the way.",
    bar: 40,
    delay: "delay-3",
  },
  {
    icon: "🚀",
    name: "Indie Hacking",
    desc: "Ideating, validating, and shipping small products. Focused on solving real problems with minimal resources.",
    bar: 62,
    delay: "delay-1",
  },
  {
    icon: "📄",
    name: "Content Strategy",
    desc: "Crafting content plans that align search intent with business goals — from topic clustering to publication.",
    bar: 80,
    delay: "delay-2",
  },
  {
    icon: "🔗",
    name: "Link Building & Outreach",
    desc: "Building authority through quality backlinks, digital PR, and authentic relationship-based outreach.",
    bar: 72,
    delay: "delay-3",
  },
];

export default function Skills() {
  return (
    <section id="skills">
      <p className="section-label reveal">02 &mdash; Skills</p>
      <div className="skills-grid">
        {skills.map((s) => (
          <div key={s.name} className={`skill-card reveal ${s.delay}`}>
            <div className="skill-icon">{s.icon}</div>
            <div className="skill-name">{s.name}</div>
            <p className="skill-desc">{s.desc}</p>
            <div className="skill-bar-wrap">
              <div className="skill-bar" data-w={s.bar}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
