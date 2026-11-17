import { initials } from "@/lib/blog-shared";

// Round author picture; without a photo, a round badge with their initials.
export default function Avatar({ name, photo, size, decorative }: { name: string; photo: string | null; size: number; decorative?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (photo) return <img src={photo} alt={decorative ? "" : name} width={size} height={size} className="av" />;
  return <span className="av av-i" style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }} aria-hidden="true">{initials(name)}</span>;
}
