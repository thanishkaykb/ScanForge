export type QRType = "url" | "text" | "wifi" | "email" | "sms" | "image" | "pdf" | "mp3" | "app";

export const QR_TYPES: { id: QRType; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "email", label: "E-mail" },
  { id: "sms", label: "SMS" },
  { id: "image", label: "Image" },
  { id: "pdf", label: "PDF" },
  { id: "mp3", label: "MP3" },
  { id: "app", label: "App" },
];

export type Theme = "paper" | "midnight" | "pastel";
export type Pattern = "square" | "rounded" | "classy" | "diamond" | "dots";
export type SizePreset = "social" | "card" | "print";

export const SIZE_PX: Record<SizePreset, number> = {
  social: 1080,
  card: 1050, // 3.5x2in @ 300dpi -> use 1050 square-ish
  print: 2400, // 8x10in -> 2400 square at 300dpi
};

export const THEMES: Record<Theme, { bg: string; fg: string; label: string }> = {
  paper: { bg: "#f5ead2", fg: "#3a2a1a", label: "Paper" },
  midnight: { bg: "#0f1226", fg: "#ffffff", label: "Midnight" },
  pastel: { bg: "#f8e4f0", fg: "#5b3a6b", label: "Pastel" },
};

export const QR_COLORS = ["#000000", "#3a2a1a", "#0b1a3a", "#1e57f5", "#10b981", "#7c3aed", "#ec4899"];
export const BG_COLORS = ["#ffffff", "#fff3c4", "#d1fae5", "#cffafe", "#dbeafe", "#ede9fe", "#fce7f3", "#f5ead2"];
