import type { QRType } from "@/lib/qr-types";

const gradients: Record<QRType, string> = {
  url: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
  text: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
  wifi: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
  email: "linear-gradient(135deg, #fef3c7, #fde68a)",
  sms: "linear-gradient(135deg, #fee2e2, #fecaca)",
  image: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
  pdf: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
  docs: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
  mp3: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
  app: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
};

export function QRTypeIcon({ type }: { type: QRType }) {
  const inner = () => {
    switch (type) {
      case "url":
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-0.5"><span className="size-1 rounded-full bg-red-300"/><span className="size-1 rounded-full bg-yellow-300"/><span className="size-1 rounded-full bg-green-300"/></div>
            <div className="h-1.5 rounded bg-white/80"/>
            <div className="h-1 rounded bg-white/60 w-3/4"/>
          </div>
        );
      case "text":
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="h-1 rounded bg-violet-400/70"/>
            <div className="h-1 rounded bg-violet-400/70 w-4/5"/>
            <div className="h-1 rounded bg-violet-400/70 w-3/5"/>
          </div>
        );
      case "wifi":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <svg viewBox="0 0 24 24" className="size-6 text-emerald-600/70" fill="currentColor"><path d="M12 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-5-4a7 7 0 0110 0l-1.5 1.5a5 5 0 00-7 0L7 14zm-3-3a11 11 0 0116 0l-1.5 1.5a9 9 0 00-13 0L4 11z"/></svg>
          </div>
        );
      case "email":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-full h-4 rounded bg-white/80 border border-amber-300/50 relative">
              <div className="absolute inset-x-1 top-1 h-0.5 bg-amber-300/60"/>
              <div className="absolute bottom-0.5 right-0.5 h-1 w-2 rounded-sm bg-amber-400"/>
            </div>
          </div>
        );
      case "sms":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-full h-4 rounded-lg bg-white/80 p-0.5 flex flex-col gap-0.5">
              <div className="h-0.5 rounded bg-rose-300 w-2/3"/>
              <div className="h-0.5 rounded bg-rose-300 w-full"/>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <svg viewBox="0 0 24 24" className="size-6 text-sky-600/70" fill="currentColor"><path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm-9 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 8H5l3.5-4.5 2.5 3 3.5-4.5L19 17z"/></svg>
          </div>
        );
      case "pdf":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="bg-white/90 rounded-sm px-1 py-0.5 text-[6px] font-bold text-rose-500">PDF</div>
          </div>
        );
      case "docs":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="bg-white/90 rounded-sm px-1 py-0.5 text-[6px] font-bold text-teal-600">DOC</div>
          </div>
        );
      case "mp3":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <svg viewBox="0 0 24 24" className="size-6 text-violet-600/70" fill="currentColor"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>
          </div>
        );
      case "app":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-3 h-5 rounded-md border-2 border-sky-600/60 bg-white/60"/>
          </div>
        );
    }
  };
  return (
    <div className="size-12 rounded-xl shrink-0 flex items-center justify-center p-1.5 shadow-sm" style={{ background: gradients[type] }}>
      {inner()}
    </div>
  );
}
