import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, Upload, Check, History, LogOut, Trash2, Download, Save, Power, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRPreview, downloadQR } from "@/components/QRPreview";
import { QRTypeIcon } from "@/components/QRTypeIcon";
import { PatternThumb } from "@/components/PatternThumb";
import { supabase } from "@/integrations/supabase/client";
import {
  QR_TYPES,
  THEMES,
  QR_COLORS,
  BG_COLORS,
  SIZE_PX,
  type QRType,
  type Theme,
  type Pattern,
  type SizePreset,
} from "@/lib/qr-types";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "ScanForge — Generator" },
      { name: "description", content: "Generate styled, print-ready QR codes for URLs, Wi-Fi, files, and more." },
    ],
  }),
  component: ScanForge,
});

const PATTERNS: Pattern[] = ["square", "rounded", "classy", "diamond", "dots"];

function escapeWifi(s: string) {
  return s.replace(/([\\;,":])/g, "\\$1");
}

interface HistoryRow {
  id: string;
  qr_type: QRType;
  title: string | null;
  data: string;
  fg: string;
  bg: string;
  pattern: Pattern;
  theme: Theme;
  size_preset: SizePreset;
  created_at: string;
  active?: boolean;
}

function ScanForge() {
  const navigate = useNavigate();
  const [type, setType] = useState<QRType>("url");
  const [theme, setTheme] = useState<Theme>("white");
  const [pattern, setPattern] = useState<Pattern>("square");
  const [fg, setFg] = useState<string>(THEMES.white.fg);
  const [bg, setBg] = useState<string>(THEMES.white.bg);
  const [size, setSize] = useState<SizePreset>("social");
  const [copied, setCopied] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [email_user, setEmailUser] = useState<string>("");

  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", enc: "WPA" as "WPA" | "WEP" | "nopass", password: "" });
  const [email, setEmail] = useState({ address: "", subject: "", body: "" });
  const [sms, setSms] = useState({ phone: "", message: "" });
  const [fileData, setFileData] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmailUser(data.user?.email ?? ""));
  }, []);

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from("qr_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setHistory(data as HistoryRow[]);
  }, []);

  useEffect(() => {
    if (historyOpen) loadHistory();
  }, [historyOpen, loadHistory]);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    setFg(THEMES[t].fg);
    setBg(THEMES[t].bg);
  };

  const data = useMemo(() => {
    switch (type) {
      case "url": return url.trim();
      case "text": return text;
      case "wifi":
        if (!wifi.ssid) return "";
        return `WIFI:T:${wifi.enc};S:${escapeWifi(wifi.ssid)};${wifi.enc === "nopass" ? "" : `P:${escapeWifi(wifi.password)};`};`;
      case "email": {
        if (!email.address) return "";
        const parts: string[] = [];
        if (email.subject) parts.push(`subject=${encodeURIComponent(email.subject)}`);
        if (email.body) parts.push(`body=${encodeURIComponent(email.body)}`);
        return `mailto:${email.address}${parts.length ? `?${parts.join("&")}` : ""}`;
      }
      case "sms":
        if (!sms.phone) return "";
        return `SMSTO:${sms.phone}:${sms.message}`;
      case "image":
      case "pdf":
      case "docs":
      case "mp3":
        return fileData?.url ?? "";
      case "app":
        return url.trim();
    }
  }, [type, url, text, wifi, email, sms, fileData]);

  const hasData = !!data && data.length > 0;

  const [uploading, setUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleFile = useCallback(async (f: File) => {
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id ?? "anon";
      const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${uid}/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from("qr-files").upload(path, f, {
        cacheControl: "31536000",
        upsert: false,
        contentType: f.type || undefined,
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("qr-files").getPublicUrl(path);
      setFileData({ url: pub.publicUrl, name: f.name });
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const onSave = async () => {
    if (!hasData) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const title =
      type === "url" || type === "app" ? url.trim().slice(0, 80) :
      type === "text" ? text.slice(0, 80) :
      type === "wifi" ? wifi.ssid :
      type === "email" ? email.address :
      type === "sms" ? sms.phone :
      fileData?.name ?? type;
    const { error } = await supabase.from("qr_history").insert({
      user_id: u.user.id,
      qr_type: type,
      title,
      data,
      fg, bg, pattern, theme, size_preset: size,
    });
    if (!error) {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 1500);
      if (historyOpen) loadHistory();
    }
  };

  const onDownload = async () => {
    if (!hasData) return;
    await downloadQR({ data, fg, bg, pattern, size: SIZE_PX[size], filename: `scanforge-${type}` });
  };

  const onCopy = async () => {
    if (!hasData) return;
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const downloadFromHistory = async (h: HistoryRow) => {
    await downloadQR({
      data: h.data, fg: h.fg, bg: h.bg, pattern: h.pattern,
      size: SIZE_PX[h.size_preset], filename: `scanforge-${h.qr_type}`,
    });
  };

  const toggleActive = async (h: HistoryRow) => {
    await supabase.from("qr_history").update({ active: !(h.active ?? true) } as never).eq("id", h.id);
    loadHistory();
  };

  const deleteFromHistory = async (id: string) => {
    await supabase.from("qr_history").delete().eq("id", id);
    loadHistory();
  };

  return (
    <div className="min-h-screen bg-navbar">
      <header className="h-14 px-6 flex items-center justify-between bg-navbar text-navbar-foreground">
        <h1 className="text-lg font-bold">
          ScanForge <span className="text-white/50 font-normal">by you</span>
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60 hidden sm:inline">{email_user}</span>
          <button
            onClick={handleSignOut}
            className="px-3 h-9 text-sm rounded-md border border-white/15 text-white/80 hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="bg-background rounded-t-3xl min-h-[calc(100vh-3.5rem)] p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr_1fr] gap-4 max-w-[1500px] mx-auto">
          <section className="bg-card rounded-2xl shadow-sm p-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Select QR type</h2>
            <ul className="flex flex-col gap-2">
              {QR_TYPES.map((t) => {
                const active = type === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => { setType(t.id); setFileData(null); }}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-xl border transition text-left",
                        active ? "bg-selected border-selected-border" : "border-transparent hover:bg-muted",
                      )}
                    >
                      <QRTypeIcon type={t.id} />
                      <span className="font-medium">{t.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="bg-card rounded-2xl shadow-sm p-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Live preview</h2>
            <div
              className="rounded-2xl p-6 flex items-center justify-center transition-colors"
              style={{ backgroundColor: bg }}
            >
              <QRPreview data={data || "https://example.com"} fg={fg} bg={bg} pattern={pattern} size={320} />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={onDownload}
                disabled={!hasData}
                className={cn(
                  "flex-1 h-11 rounded-full font-medium transition",
                  hasData ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              >
                Download QR code
              </button>
              <button
                onClick={() => setHistoryOpen(true)}
                className="h-11 px-4 rounded-xl border border-border flex items-center gap-1.5 hover:bg-muted transition text-sm font-medium"
                aria-label="History"
                title="History"
              >
                <History className="size-4" /> History
              </button>
              <button
                onClick={onCopy}
                disabled={!hasData}
                className="size-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition disabled:opacity-50"
                aria-label="Copy QR content"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </button>
            </div>

            <div className="mt-6">
              <DynamicForm
                type={type}
                url={url} setUrl={setUrl}
                text={text} setText={setText}
                wifi={wifi} setWifi={setWifi}
                email={email} setEmail={setEmail}
                sms={sms} setSms={setSms}
                fileData={fileData}
                onFile={handleFile}
              />
              <p className="text-sm text-primary/80 mt-3">Your QR code will generate automatically</p>
            </div>
          </section>

          <section className="bg-card rounded-2xl shadow-sm p-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Style your QR</h2>

            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(Object.keys(THEMES) as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => applyTheme(t)}
                  className={cn(
                    "rounded-xl border p-3 flex flex-col items-center gap-2 transition",
                    theme === t ? "bg-selected border-selected-border" : "border-border hover:bg-muted",
                  )}
                >
                  <div
                    className="size-12 rounded-full border border-black/10"
                    style={{
                      background:
                        t === "white" ? "radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb)" :
                        t === "black" ? "radial-gradient(circle at 30% 30%, #4a4a4a, #050505)" :
                        t === "paper" ? "radial-gradient(circle at 30% 30%, #fffbe6, #e6d9a8)" :
                        t === "midnight" ? "radial-gradient(circle at 30% 30%, #4a5bd8, #0a0a1f)" :
                        "radial-gradient(circle at 30% 30%, #fff, #f3c7e0 60%, #c7b8e8)",
                    }}
                  />
                  <span className="text-xs font-medium">{THEMES[t].label}</span>
                </button>
              ))}
            </div>

            <Label>Pattern</Label>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {PATTERNS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  className={cn(
                    "aspect-square rounded-xl border flex items-center justify-center transition bg-white",
                    pattern === p ? "border-selected-border bg-selected" : "border-border hover:bg-muted",
                  )}
                >
                  <PatternThumb pattern={p} />
                </button>
              ))}
            </div>

            <Label>Colors</Label>
            <div className="text-xs text-muted-foreground mt-1 mb-2">QR Code</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {QR_COLORS.map((c) => (
                <ColorSwatch key={c} color={c} selected={fg === c} onClick={() => setFg(c)} />
              ))}
              <ColorPicker value={fg} onChange={setFg} rainbow />
            </div>
            <div className="text-xs text-muted-foreground mt-1 mb-2">Background</div>
            <div className="flex flex-wrap gap-2 mb-5">
              {BG_COLORS.slice(0, 7).map((c) => (
                <ColorSwatch key={c} color={c} selected={bg === c} onClick={() => setBg(c)} bordered />
              ))}
              <ColorPicker value={bg} onChange={setBg} />
            </div>

            <Label>Download Size</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["social", "card", "print"] as SizePreset[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-10 rounded-xl border text-sm font-medium capitalize transition",
                    size === s ? "bg-selected border-selected-border text-foreground" : "border-border hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {historyOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-end" onClick={() => setHistoryOpen(false)}>
          <div
            className="bg-card w-full sm:max-w-md h-full sm:h-[90vh] sm:mr-6 sm:rounded-2xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2"><History className="size-5" /> History</h3>
              <button onClick={() => setHistoryOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No history yet. Download a QR code to save it here.</p>
              )}
              {history.map((h) => (
                <div key={h.id} className="border border-border rounded-xl p-3 flex items-center gap-3">
                  <div className="size-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: h.bg }}>
                    <QRTypeIcon type={h.qr_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm capitalize">{h.qr_type}</div>
                    <div className="text-xs text-muted-foreground truncate">{h.title || h.data.slice(0, 40)}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(h.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => downloadFromHistory(h)}
                    className="size-8 rounded-lg border border-border hover:bg-muted flex items-center justify-center"
                    title="Download"
                  >
                    <Download className="size-3.5" />
                  </button>
                  <button
                    onClick={() => deleteFromHistory(h.id)}
                    className="size-8 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="font-semibold mb-2">{children}</div>;
}

function ColorSwatch({ color, selected, onClick, bordered }: { color: string; selected: boolean; onClick: () => void; bordered?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "size-8 rounded-full flex items-center justify-center transition",
        selected ? "ring-2 ring-offset-2 ring-primary" : bordered ? "ring-1 ring-border" : "",
      )}
      style={{ backgroundColor: color }}
      aria-label={color}
    >
      {selected && <Check className="size-4" style={{ color: isLight(color) ? "#000" : "#fff" }} />}
    </button>
  );
}

function ColorPicker({ value, onChange, rainbow }: { value: string; onChange: (v: string) => void; rainbow?: boolean }) {
  return (
    <label
      className="size-8 rounded-full cursor-pointer ring-1 ring-border overflow-hidden relative flex items-center justify-center"
      style={{
        background: rainbow ? "conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)" : "white",
      }}
    >
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
      {!rainbow && <Check className="size-4 text-primary" />}
    </label>
  );
}

function isLight(hex: string) {
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function DynamicForm(props: any) {
  const { type } = props;
  const input = "w-full h-11 px-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const textarea = "w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none";

  if (type === "url" || type === "app") {
    return (
      <div>
        <FieldLabel>{type === "app" ? "App Store URL" : "Website URL"}</FieldLabel>
        <input className={input} placeholder="https://example.com" value={props.url} onChange={(e) => props.setUrl(e.target.value)} />
      </div>
    );
  }
  if (type === "text") {
    return (
      <div>
        <FieldLabel>Your Text</FieldLabel>
        <textarea rows={4} className={textarea} placeholder="Type anything..." value={props.text} onChange={(e) => props.setText(e.target.value)} />
      </div>
    );
  }
  if (type === "wifi") {
    return (
      <div className="space-y-4">
        <div>
          <FieldLabel>Network Name</FieldLabel>
          <input className={input} placeholder="My WiFi Network" value={props.wifi.ssid} onChange={(e) => props.setWifi({ ...props.wifi, ssid: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Encryption</FieldLabel>
          <div className="flex gap-2">
            {(["WPA", "WEP", "nopass"] as const).map((enc) => (
              <button
                key={enc}
                onClick={() => props.setWifi({ ...props.wifi, enc })}
                className={cn(
                  "px-4 h-9 rounded-lg text-sm font-medium border transition",
                  props.wifi.enc === enc ? "bg-selected border-selected-border" : "border-transparent hover:bg-muted",
                )}
              >
                {enc === "nopass" ? "None" : enc}
              </button>
            ))}
          </div>
        </div>
        {props.wifi.enc !== "nopass" && (
          <div>
            <FieldLabel>Password</FieldLabel>
            <input type="password" className={input} placeholder="Enter password" value={props.wifi.password} onChange={(e) => props.setWifi({ ...props.wifi, password: e.target.value })} />
          </div>
        )}
      </div>
    );
  }
  if (type === "email") {
    return (
      <div className="space-y-4">
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <input className={input} type="email" placeholder="email@example.com" value={props.email.address} onChange={(e) => props.setEmail({ ...props.email, address: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Subject <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
          <input className={input} placeholder="Email subject" value={props.email.subject} onChange={(e) => props.setEmail({ ...props.email, subject: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Message <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
          <textarea rows={3} className={textarea} placeholder="Email body..." value={props.email.body} onChange={(e) => props.setEmail({ ...props.email, body: e.target.value })} />
        </div>
      </div>
    );
  }
  if (type === "sms") {
    return (
      <div className="space-y-4">
        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <input className={input} placeholder="+1234567890" value={props.sms.phone} onChange={(e) => props.setSms({ ...props.sms, phone: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Message <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
          <textarea rows={3} className={textarea} placeholder="Your message..." value={props.sms.message} onChange={(e) => props.setSms({ ...props.sms, message: e.target.value })} />
        </div>
      </div>
    );
  }
  const spec: Record<string, { label: string; accept: string; help: string }> = {
    image: { label: "Upload Image", accept: "image/*", help: "Any image file — no size limit" },
    pdf: { label: "Upload PDF", accept: "application/pdf", help: "Any PDF file — no size limit" },
    docs: { label: "Upload Document", accept: ".doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain", help: "DOC, DOCX, TXT, XLS, PPT and more — no size limit" },
    mp3: { label: "Upload MP3", accept: "audio/mpeg,audio/mp3", help: "Any MP3 file — no size limit" },
  };
  const s = spec[type];
  return (
    <div>
      <FieldLabel>{s.label}</FieldLabel>
      <label
        className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) props.onFile(f);
        }}
      >
        <Upload className="size-5 text-muted-foreground" />
        <div className="font-medium">{props.fileData ? props.fileData.name : "Click or drag to upload"}</div>
        <div className="text-xs text-muted-foreground">{s.help}</div>
        <input
          type="file"
          accept={s.accept}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) props.onFile(f); }}
        />
      </label>
      <p className="text-sm text-primary/80 mt-2">
        Note: very large files may exceed QR capacity. For big files, host them and use a URL QR instead.
      </p>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-semibold mb-2">{children}</div>;
}
