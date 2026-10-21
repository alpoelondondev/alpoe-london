import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const cards = [
  {
    title: "Create your own ring",
    detail: "Your stone. Your setting. Your design.",
    action: "Start creating",
    href: ROUTES.ringBuilder,
    image: "/ring-experience/create-ring.webp",
    alt: "Close-up three-quarter view of a diamond ring from the ring builder",
    imageClass: "object-contain object-right md:pr-10",
  },
  {
    title: "See it on your hand",
    detail: "Discover your ring with Virtual try-on.",
    action: "Try a ring on",
    href: `${ROUTES.ringBuilder}?experience=try-on`,
    image: "/ring-experience/virtual-try-on.webp",
    alt: "Illustration of a model's hand wearing a platinum diamond ring",
    imageClass: "object-cover object-[70%_center]",
  },
];

export default function RingBuilderCards() {
  return (
    <section aria-label="Create your ring and try it on" className="bg-bg px-[52px] py-12 max-md:px-6 max-md:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group relative isolate flex min-h-[340px] items-end overflow-hidden bg-black p-7 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:min-h-[420px] md:items-center md:p-12">
            <div className="absolute inset-0 -z-20 transition-transform duration-700 motion-safe:group-hover:scale-[1.025]">
              <Image src={card.image} alt={card.alt} fill sizes="(max-width: 768px) 100vw, 90vw" className={card.imageClass} />
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/25 to-transparent md:bg-gradient-to-r md:from-black/95 md:via-black/40 md:to-transparent" />
            <div className="max-w-md">
              <h2 className="font-playfair text-3xl leading-tight md:text-5xl">{card.title}</h2>
              <p className="mt-3 text-sm font-light text-white/80 md:text-base">{card.detail}</p>
              <span className="mt-6 inline-flex items-center gap-5 border-b border-white/60 pb-2 text-[11px] uppercase tracking-[0.18em]">{card.action}<span aria-hidden="true">↗</span></span>
              <p className="mt-5 text-[10px] tracking-wide text-white/65">Powered by softwarebosh.com</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
