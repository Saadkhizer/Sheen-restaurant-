export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-12 text-sm sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Sheen</p>
          <p className="leading-relaxed text-muted">
            Shop 1, Escape Heights, Plaza 61
            <br />
            Sector G, Avenue 1, Bahria Enclave
            <br />
            Islamabad
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Hours</p>
          <p className="leading-relaxed text-muted">
            Mon–Thu, Sat, Sun · 2pm – 12am
            <br />
            Friday from 3pm
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Follow</p>
          <div className="flex flex-col gap-1">
            <a
              className="text-accent-text hover:underline"
              href="https://www.instagram.com/sheen4shawarma/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </a>
            <a
              className="text-accent-text hover:underline"
              href="https://www.foodpanda.pk/restaurant/wgrb/sheen-wgrb"
              target="_blank"
              rel="noreferrer noopener"
            >
              foodpanda
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
