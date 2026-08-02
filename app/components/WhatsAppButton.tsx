import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const href = buildGeneralWhatsAppUrl(
    "Hi Alpoe, I'd like to make an enquiry about...",
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      // White pill with the WhatsApp badge sitting inside its left end.
      className="group fixed bottom-8 right-6 z-[100] flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-lg shadow-black/25 transition-transform duration-200 hover:scale-105 max-md:pr-4"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] max-md:h-10 max-md:w-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-6 w-6 fill-white"
          aria-hidden="true"
        >
          <path d="M16.004 3.2C9.054 3.2 3.4 8.854 3.4 15.804c0 2.222.58 4.39 1.683 6.302L3.2 28.8l6.89-1.808a12.56 12.56 0 0 0 5.914 1.484h.005c6.95 0 12.591-5.654 12.591-12.604S22.954 3.2 16.004 3.2zm0 23.056a10.42 10.42 0 0 1-5.312-1.454l-.381-.226-3.952 1.037 1.055-3.855-.249-.396a10.39 10.39 0 0 1-1.593-5.558c0-5.77 4.696-10.466 10.472-10.466 5.776 0 10.472 4.696 10.472 10.466-.04 5.77-4.736 10.452-10.512 10.452zm5.738-7.84c-.315-.158-1.862-.919-2.15-1.024-.289-.105-.499-.158-.71.158-.21.315-.814 1.024-.998 1.234-.184.21-.368.236-.683.079-.315-.158-1.33-.49-2.533-1.563-.937-.834-1.569-1.865-1.753-2.18-.184-.315-.02-.486.138-.643.142-.142.315-.368.473-.552.158-.184.21-.315.315-.526.105-.21.053-.394-.026-.552-.079-.158-.71-1.711-.973-2.342-.256-.614-.517-.53-.71-.54h-.605c-.21 0-.552.079-.841.394-.289.315-1.103 1.077-1.103 2.627s1.13 3.048 1.287 3.258c.158.21 2.222 3.392 5.384 4.757.752.325 1.34.519 1.798.664.755.24 1.443.206 1.986.125.606-.09 1.862-.762 2.124-1.497.263-.736.263-1.366.184-1.497-.079-.131-.289-.21-.605-.368z" />
        </svg>
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
