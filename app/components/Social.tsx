import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const instagramPosts: { src: string; href: string }[] = [
  { src: "/instagram/1.jpg", href: "https://www.instagram.com/p/DMYWPg7I1w_/" },
  { src: "/instagram/2.jpg", href: "https://www.instagram.com/p/DWXBfUGDv1W/?img_index=1" },
  { src: "/instagram/3.jpg", href: "https://www.instagram.com/p/DWW3pKnijSC/" },
  { src: "/instagram/4.jpg", href: "https://www.instagram.com/p/DTdhp15CHRX/" },
  { src: "/instagram/5.jpg", href: "https://www.instagram.com/p/DQow0ZHiLoz/?img_index=1" },
  { src: "/instagram/6.jpg", href: "https://www.instagram.com/p/DR7YdBKiIu-/" },
];

export default function Social() {
  return (
    <section
      id="social"
      className="px-[52px] py-24 border-t border-white/[0.05] max-md:px-6 max-md:py-16"
    >
      <ScrollReveal>
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
          <a
            href="https://www.instagram.com/alpoelondon/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group flex flex-col items-center gap-3"
          >
            <svg
              className="w-12 h-12 text-white/50 transition hover:scale-110 hover:text-white/80 max-md:w-10 max-md:h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="text-white/50 text-xs tracking-wide transition group-hover:text-white/80">
              @alpoelondon
            </span>
          </a>
          <a
            href="https://www.tiktok.com/@alpoelondon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="group flex flex-col items-center gap-3"
          >
            <svg
              className="w-12 h-12 text-white/50 transition hover:scale-110 hover:text-white/80 max-md:w-10 max-md:h-10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
            </svg>
            <span className="text-white/50 text-xs tracking-wide transition group-hover:text-white/80">
              @alpoelondon
            </span>
          </a>
        </div>
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-3 gap-2 max-md:mt-10 max-md:grid-cols-2">
          {instagramPosts.map((post) => (
            <a
              key={post.src}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-white/[0.02]"
            >
              <Image
                src={post.src}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
