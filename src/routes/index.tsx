import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { submitInquiry } from "@/lib/api/inquiries";
import {
  Sparkles, ShieldCheck, Clock, Palette, IndianRupee, Gem, HeartHandshake,
  Award, Users, Star, Quote, Phone, Mail, MapPin, Send, MessageCircle, Filter,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shri Sai Jewellers — Certified Gold Jewellery Since 1995" },
      { name: "description", content: "Crafting elegance, celebrating traditions. Exquisite handcrafted gold jewellery, BIS hallmarked and trusted by thousands of families since 1995." },
      { property: "og:title", content: "Shri Sai Jewellers" },
      { property: "og:description", content: "Crafting elegance, celebrating traditions since 1995." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <About />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <Contact />
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark text-dark-foreground">
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-gold">
            <span className="h-px w-12 bg-gold" />
            EST. 1995 · TRUSTED JEWELLERS
          </div>
          <h1 className="mt-6 font-serif text-6xl font-bold leading-[1.05] md:text-7xl">
            Shri Sai<br />
            <span className="italic text-gold">Jewellers</span>
          </h1>
          <p className="mt-6 font-script text-2xl italic text-dark-foreground/90">
            Crafting Elegance, Celebrating Traditions
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-dark-foreground/70">
            Exquisite handcrafted gold jewelry, certified for purity, designed to honour your most cherished moments.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/products" className="rounded bg-gold px-8 py-3.5 text-sm font-semibold tracking-[0.15em] text-dark transition hover:bg-gold-light">
              VIEW COLLECTION
            </Link>
            <a href="#contact" className="rounded border border-gold/60 px-8 py-3.5 text-sm font-semibold tracking-[0.15em] text-gold-light transition hover:bg-gold hover:text-dark">
              CONTACT US
            </a>
          </div>

          <div className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-gold/20 pt-8">
            <Stat value="30+" label="Years of Trust" />
            <Stat value="10K+" label="Happy Families" />
            <Stat value="BIS" label="Hallmarked Gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl font-bold text-gold">{value}</div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-dark-foreground/60">{label}</div>
    </div>
  );
}


/* ─── About ──────────────────────────────────────────────────────── */
function About() {
  const features = [
    { icon: ShieldCheck, title: "Certified Purity", desc: "Every piece is BIS hallmarked and certified for gold purity." },
    { icon: Award, title: "Master Craftsmanship", desc: "Handcrafted by artisans with decades of expertise in traditional goldsmithing." },
    { icon: HeartHandshake, title: "Customer First", desc: "Your satisfaction is our legacy — thousands of families trust us." },
    { icon: Users, title: "Family Legacy", desc: "Three generations of jewellers serving the community since 1995." },
  ];
  return (
    <section id="about" className="bg-background py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80"
            alt="Gold jewellery collection"
            className="aspect-square w-full rounded-sm object-cover"
          />
          <div className="absolute -bottom-6 -right-6 grid h-32 w-32 place-items-center bg-gold text-center text-primary-foreground md:-bottom-8 md:-right-8 md:h-40 md:w-40">
            <div>
              <div className="text-[10px] tracking-[0.2em]">SINCE</div>
              <div className="font-serif text-4xl font-bold leading-none md:text-5xl">1995</div>
              <div className="mt-1 text-[10px] tracking-[0.2em]">ESTABLISHED</div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold" /> ABOUT US
          </div>
          <h2 className="mt-4 font-serif text-5xl font-bold leading-tight">
            A Legacy of Gold,<br />
            <span className="font-script italic text-gold">A Promise of Purity</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Shri Sai Jewellers has been the trusted name for fine gold jewellery across generations.
            Founded in 1995, we blend ancient craftsmanship with contemporary design to bring you pieces
            that last a lifetime and beyond.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            From bridal sets to everyday elegance, each ornament is crafted with reverence for tradition
            and an eye for detail that sets us apart.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded border border-gold/30 bg-gold/10 text-gold">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-serif text-base font-bold">{f.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Categories ─────────────────────────────────────────────────── */
function Categories() {
  const cats = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  return (
    <section id="categories" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionEyebrow>OUR COLLECTIONS</SectionEyebrow>
        <h2 className="mt-4 text-center font-serif text-5xl font-bold">Shop by Category</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Discover our carefully curated collections, each crafted to celebrate the beauty of gold.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {cats.data?.map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.slug, q: "" }}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-dark">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-dark/60 text-gold">
                    <Gem className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/95 to-transparent p-4">
                  <div className="font-serif text-lg font-bold text-white">{c.name}</div>
                  <div className="mt-0.5 text-[11px] text-gold-light/80">{c.description ?? "Fine Jewellery"}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground">View →</span>
              </div>
            </Link>
          ))}
          {cats.data?.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground">No categories yet.</p>}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Products ──────────────────────────────────────────── */
function FeaturedProducts() {
  const cats = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const all = useQuery({ queryKey: ["products", "all-active"], queryFn: () => getProducts() });
  const [activeCat, setActiveCat] = useState<string>("");

  const list = useMemo(() => {
    const items = all.data ?? [];
    if (!activeCat) return items.slice(0, 8);
    return items.filter((p: any) => p.categories?.slug === activeCat).slice(0, 8);
  }, [all.data, activeCat]);

  const badges = ["BEST SELLER", "NEW ARRIVAL", "FEATURED", "NEW ARRIVAL"];
  const badgeStyles: Record<string, string> = {
    "BEST SELLER": "bg-gold text-dark",
    "NEW ARRIVAL": "bg-success text-success-foreground",
    "FEATURED": "bg-purple-600 text-white",
  };

  return (
    <section id="products" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-serif text-5xl font-bold">Featured Products</h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <div className="mr-2 grid h-9 w-9 place-items-center rounded border border-gold/30 text-gold">
            <Filter className="h-4 w-4" />
          </div>
          <FilterPill active={!activeCat} onClick={() => setActiveCat("")}>ALL</FilterPill>
          {cats.data?.map((c) => (
            <FilterPill key={c.id} active={activeCat === c.slug} onClick={() => setActiveCat(c.slug)}>
              {c.name.toUpperCase()}
            </FilterPill>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p: any, i) => {
            const img = p.product_images?.find((x: any) => x.is_primary) ?? p.product_images?.[0];
            const badge = badges[i % badges.length];
            return (
              <div key={p.id} className="overflow-hidden rounded-sm border border-border bg-card shadow-sm transition hover:shadow-lg">
                <Link to="/products/$id" params={{ id: p.id }} className="block">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <span className={`absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold tracking-wider ${badgeStyles[badge]}`}>
                      {badge}
                    </span>
                    {img?.image_url ? (
                      <img src={img.image_url} alt={p.product_name} className="h-full w-full object-cover transition hover:scale-105" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground"><Gem className="h-10 w-10" /></div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {p.categories?.name ?? "Jewellery"}
                  </div>
                  <Link to="/products/$id" params={{ id: p.id }} className="mt-1 block font-serif text-lg font-bold hover:text-gold">
                    {p.product_name}
                  </Link>
                  <div className="mt-2 flex gap-2 text-[11px]">
                    <span className="rounded bg-muted px-2 py-0.5">{p.gold_weight}g</span>
                    {p.gold_purity && <span className="rounded bg-muted px-2 py-0.5">{p.gold_purity}</span>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link to="/products/$id" params={{ id: p.id }} className="font-serif text-sm font-semibold text-gold hover:underline">
                      View Details
                    </Link>
                    <a
                      href={`https://wa.me/919651732538?text=Inquiry%20about%20${encodeURIComponent(p.product_name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground hover:opacity-90"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Inquire
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          {list.length === 0 && !all.isLoading && (
            <p className="col-span-full text-center text-sm text-muted-foreground">No products yet.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products" className="inline-block rounded border border-gold px-8 py-3 text-sm font-semibold tracking-[0.15em] text-gold hover:bg-gold hover:text-dark">
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded border px-4 py-2 text-xs font-semibold tracking-[0.15em] transition ${
        active ? "border-gold bg-gold text-dark" : "border-gold/30 text-foreground hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Why Us ─────────────────────────────────────────────────────── */
function WhyUs() {
  const items = [
    { icon: ShieldCheck, title: "Certified Purity", desc: "Every ornament carries BIS hallmarking, guaranteeing the exact gold purity stated — no compromises." },
    { icon: Clock, title: "Trusted Since 1995", desc: "Over three decades of serving families with integrity, building trust that spans generations." },
    { icon: Palette, title: "Custom Designs", desc: "Bring your dream design to life. Our master artisans craft bespoke pieces tailored to your vision." },
    { icon: IndianRupee, title: "Transparent Pricing", desc: "Daily gold rates + making charges displayed openly. No hidden fees, no surprises." },
    { icon: Gem, title: "Premium Craftsmanship", desc: "Handcrafted by skilled goldsmiths with 20+ years of experience in traditional and modern designs." },
    { icon: HeartHandshake, title: "Excellent Service", desc: "From selection to after-sales care, we ensure every customer leaves with a smile and a treasure." },
  ];
  return (
    <section id="why-us" className="bg-dark py-24 text-dark-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold" /> OUR PROMISE <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-serif text-5xl font-bold">
            Why Choose <span className="font-script italic text-gold-light">Shri Sai Jewellers?</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-sm border border-gold/25 bg-dark/50 p-7 transition hover:border-gold/60 hover:bg-dark/80">
              <div className="grid h-12 w-12 place-items-center rounded border border-gold/40 text-gold">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-foreground/70">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: "Priya Sharma", loc: "Pune", item: "Bridal Wedding Set", text: "I bought my wedding set from Shri Sai Jewellers and the experience was unforgettable. The craftsmanship is extraordinary and the staff is incredibly knowledgeable. Every piece is exactly as described — pure gold, beautifully crafted." },
    { name: "Rajesh Mehta", loc: "Mumbai", item: "Custom Gents Ring", text: "Purchased a custom gents ring for my anniversary. They listened to every detail I wanted and delivered a masterpiece. The BIS hallmark gives real confidence about purity. Will definitely return for more!" },
    { name: "Sunita Patil", loc: "Nashik", item: "Traditional Necklace Set", text: "Shri Sai Jewellers has been our family's trusted jeweller for 15 years. The quality never disappoints and the pricing is always transparent. Their traditional designs are simply stunning!" },
    { name: "Amit Joshi", loc: "Aurangabad", item: "UV Bali Earrings", text: "The UV Bali earrings I ordered for my daughter's engagement are absolutely gorgeous. Everyone at the ceremony asked where we got them. The WhatsApp inquiry feature made it so easy to place my order!" },
  ];
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-serif text-5xl font-bold">What Our Customers Say</h2>
        <p className="mt-4 text-center text-muted-foreground">Thousands of families trust us with their most precious moments.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <div key={r.name} className="relative rounded-sm border border-border bg-card p-8 shadow-sm">
              <Quote className="absolute right-6 top-6 h-12 w-12 text-gold/15" />
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 font-script text-lg italic leading-relaxed text-foreground/85">"{r.text}"</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/20 font-serif font-bold text-gold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.loc} · {r.item}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-gold">
                  <Sparkles className="h-3 w-3" /> Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const mut = useMutation({
    mutationFn: () => submitInquiry({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
    onSuccess: () => {
      toast.success("Message sent! We'll be in touch shortly.");
      setForm({ name: "", phone: "", email: "", message: "" });
    },
    onError: (e: any) => toast.error(e.message ?? "Could not send"),
  });

  return (
    <section id="contact" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-serif text-5xl font-bold">Visit Us or Reach Out</h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <ContactRow icon={Phone} title="Call Us">
              <div>+91 9651732538</div>
              <div>+91 9925243448</div>
            </ContactRow>
            <ContactRow icon={Mail} title="Email Us">
              <div>info@shrisaijewellers.com</div>
              <div>orders@shrisaijewellers.com</div>
            </ContactRow>
            <ContactRow icon={MapPin} title="Visit Our Showroom">
              <div>43/34, Ram Krishna Market, Chawk Saraffa</div>
              <div>Kanpur, Uttar Pradesh 208001</div>
            </ContactRow>
            <ContactRow icon={Clock} title="Business Hours">
              <div>Mon – Sat: 10:00 AM – 8:00 PM</div>
            </ContactRow>

            <a
              href="https://wa.me/919651732538"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded bg-success p-5 text-success-foreground hover:opacity-95"
            >
              <MessageCircle className="h-6 w-6" />
              <div>
                <div className="font-bold">Chat on WhatsApp</div>
                <div className="text-xs opacity-90">Instant response during business hours</div>
              </div>
            </a>
          </div>

          {/* Right column: map + form */}
          <div>
            <div className="aspect-video overflow-hidden rounded-sm border border-border bg-muted">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Chawk+Saraffa+Kanpur&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>

            <div className="mt-8 rounded-sm bg-card p-6 shadow-sm">
              <h3 className="font-serif text-2xl font-bold">Send us a message</h3>
              <form
                className="mt-5 space-y-4"
                onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="YOUR NAME *">
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-sm border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-gold" />
                  </Field>
                  <Field label="PHONE NUMBER">
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-sm border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-gold" />
                  </Field>
                </div>
                <Field label="EMAIL ADDRESS">
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-sm border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-gold" />
                </Field>
                <Field label="MESSAGE">
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="I'm interested in a custom bridal set..."
                    className="w-full rounded-sm border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-gold" />
                </Field>
                <button
                  disabled={mut.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold py-3.5 text-sm font-semibold tracking-[0.15em] text-dark transition hover:bg-gold-light disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {mut.isPending ? "SENDING…" : "SEND MESSAGE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-sm bg-gold text-dark">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-serif text-lg font-bold">{title}</div>
        <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ─── Floating WhatsApp ──────────────────────────────────────────── */
function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919651732538"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.3em] text-gold">
      <span className="h-px w-10 bg-gold" />
      {children}
      <span className="h-px w-10 bg-gold" />
    </div>
  );
}
