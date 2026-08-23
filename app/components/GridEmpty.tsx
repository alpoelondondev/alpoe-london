/** What a listing grid shows when the filters match nothing. */
export default function GridEmpty() {
  return (
    <div className="py-20 text-center border border-fg/[0.10]">
      <p className="font-serif text-2xl">Nothing matches these filters</p>
      <p className="mt-2 text-dim text-[12px] tracking-[0.14em] uppercase">
        Looking for something specific? Enquire on WhatsApp
      </p>
    </div>
  );
}
