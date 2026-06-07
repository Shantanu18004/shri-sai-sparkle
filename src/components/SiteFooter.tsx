import { Link } from "@tanstack/react-router";
import { Sparkles, Instagram, Facebook, Youtube, Twitter, Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-dark text-dark-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <div className="font-serif text-xl font-bold tracking-wider text-gold">SHRI SAI</div>
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-1 text-[10px] tracking-[0.3em] text-gold-light/70">JEWELLERS · EST. 1995</div>
          <p className="mt-6 text-sm text-dark-foreground/70">
            Crafting elegance and celebrating traditions with certified gold jewellery since 1995.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold-light transition hover:bg-gold hover:text-dark">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.2em] text-gold">QUICK LINKS</h4>
          <ul className="mt-5 space-y-3 text-sm text-dark-foreground/80">
            {[
              ["Home", "/"],
              ["About Us", "/#about"],
              ["Collections", "/#categories"],
              ["Products", "/products"],
              ["Why Choose Us", "/#why-us"],
              ["Contact", "/#contact"],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="flex items-center gap-2 hover:text-gold">
                  <span className="text-gold">›</span> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.2em] text-gold">COLLECTIONS</h4>
          <ul className="mt-5 space-y-3 text-sm text-dark-foreground/80">
            {["Gents Ring", "Ladies Ring", "Tops", "Balla", "UV Bali", "Nath", "Lockets", "Custom Orders"].map((c) => (
              <li key={c}>
                <Link to="/products" className="flex items-center gap-2 hover:text-gold">
                  <span className="text-gold">›</span> {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.2em] text-gold">CONTACT INFO</h4>
          <ul className="mt-5 space-y-4 text-sm text-dark-foreground/80">
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold" /> +91 96517 32538</li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" /> shrisaijewellers@gmail.com</li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <span>43/34, Ram Krishna Market, Chawk Saraffa<br/>Kanpur, Uttar Pradesh 208001</span>
            </li>
          </ul>
          <div className="mt-6 border-t border-gold/20 pt-5">
            <div className="text-xs font-semibold tracking-[0.2em] text-gold">BUSINESS HOURS</div>
            <p className="mt-2 text-sm text-dark-foreground/80">Mon – Sat: 10:00 AM – 8:00 PM<br/>Sunday: 11:00 AM – 5:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-dark-foreground/60">
          <div>© 2026 Shri Sai Jewellers. All rights reserved.</div>
          <div className="flex items-center gap-2 text-gold-light">
            <Sparkles className="h-3 w-3" /> BIS Hallmarked · Certified Purity · Trusted Since 1995
          </div>
        </div>
      </div>
    </footer>
  );
}
