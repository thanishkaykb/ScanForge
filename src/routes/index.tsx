import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Sparkles, Wifi, Mail, FileText, Image as ImageIcon, History, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScanForge — Forge beautiful, scannable QR codes" },
      { name: "description", content: "ScanForge is the modern QR studio: design styled QR codes for links, Wi-Fi, files, email and more — saved to your personal history." },
      { property: "og:title", content: "ScanForge — Forge beautiful QR codes" },
      { property: "og:description", content: "Design, save and re-download styled QR codes from any device." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Logo({ size = 56 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center rounded-2xl shadow-lg shadow-primary/30"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #5b21b6 100%)",
      }}
    >
      <div className="absolute inset-[14%] rounded-md bg-white/95 grid grid-cols-4 grid-rows-4 gap-[2px] p-[6px]">
        {[1,0,1,1, 0,1,0,1, 1,1,1,0, 0,1,0,1].map((v, i) => (
          <span key={i} className={v ? "bg-[#5b21b6] rounded-[1px]" : ""} />
        ))}
      </div>
      <Sparkles className="absolute -right-1 -top-1 size-4 text-amber-300 drop-shadow" />
    </div>
  );
}

const USES = [
  { icon: QrCode, title: "Links & URLs", desc: "Share your site, portfolio, menu or campaign with a tap." },
  { icon: Wifi, title: "Wi-Fi access", desc: "Let guests join your network without typing a password." },
  { icon: Mail, title: "Email & SMS", desc: "Pre-fill messages so people can reach you instantly." },
  { icon: FileText, title: "PDFs & Docs", desc: "Distribute menus, brochures and resumes on paper or screen." },
  { icon: ImageIcon, title: "Images & MP3", desc: "Turn photos and audio into shareable, scannable links." },
  { icon: History, title: "Personal history", desc: "Every QR you forge is saved to your account to re-download anytime." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-background to-[#ece2ff]">
      <header className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="font-bold text-lg tracking-tight">ScanForge</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/auth" className="px-4 h-10 rounded-full text-sm font-medium hover:bg-primary/10 transition flex items-center">Sign in</Link>
          <Link to="/auth" className="px-4 h-10 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition flex items-center shadow-md shadow-primary/30">Get started</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-24">
        <section className="text-center flex flex-col items-center">
          <Logo size={88} />
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-[#5b21b6] via-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
            ScanForge
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The lavender-bright QR studio. Forge beautiful, scannable codes for everything you share —
            links, Wi-Fi, files, email — then keep them all in your personal history, ready to download anytime.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" className="px-6 h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30 flex items-center">
              Start forging — it's free
            </Link>
            <Link to="/auth" className="px-6 h-12 rounded-full border border-primary/30 bg-white/60 backdrop-blur hover:bg-white transition font-medium flex items-center text-primary">
              Sign in
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5"><Shield className="size-3.5" /> Private to you · Saved to your account</p>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-2xl md:text-3xl font-bold">What you can do with ScanForge</h2>
          <p className="text-center text-muted-foreground mt-2">Every kind of QR you'll ever need, in one studio.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card border border-primary/10 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition">
                <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/10 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ScanForge — forged with lavender.
      </footer>
    </div>
  );
}
