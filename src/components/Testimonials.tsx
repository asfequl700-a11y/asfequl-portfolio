import Image from "next/image";
import { testimonials } from "../data/site";

// "What they say" cards. Demo entries carry a visible badge so they can't pass as real.
export function Testimonials({ full = false }: { full?: boolean }) {
  if (!testimonials.length) return null;
  return (
    <section className={full ? "sec fs tsec" : "sec tsec"}>
      <div className="wrap">
        <span className="kick">What they say</span>
        <h2>From the people I work with.</h2>
        <div className="tgrid">
          {testimonials.map((t, i) => (
            <figure key={i} className="tcard">
              {t.demo && <span className="tdemo">Demo · placeholder</span>}
              <svg className="tq" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V14C0 6 4 1 12 0l1 4c-4 1-6 4-6 8h6v12H0Zm19 0V14c0-8 4-13 12-14l1 4c-4 1-6 4-6 8h6v12H19Z" fill="currentColor" /></svg>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className={t.darkLogo ? "tlogo dark" : "tlogo"}><Image src={t.logo} alt={`${t.company} logo`} width={40} height={40} /></span>
                <span><b>{t.name}</b><small>{t.title}, {t.company}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
