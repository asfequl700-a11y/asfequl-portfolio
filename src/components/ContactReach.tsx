import { site } from "../data/site";
import MailChip from "./MailChip";
import { LinkedInIcon, XIcon } from "./ui";

// Contact page only: same email chip as the other pages, then LinkedIn and X as matching rows.
export default function ContactReach() {
  return (
    <div className="ctc-alt">
      <span className="ctc-alt-l">Or reach me directly</span>
      <div className="ctc-rows">
        <MailChip />
        <a className="mailchip ctc-row" href={site.linkedin} target="_blank" rel="noopener noreferrer">
          <span><LinkedInIcon />Reach out on LinkedIn</span><span className="go">Open</span>
        </a>
        <a className="mailchip ctc-row" href={site.x} target="_blank" rel="noopener noreferrer">
          <span><XIcon />Reach out on X</span><span className="go">Open</span>
        </a>
      </div>
    </div>
  );
}
