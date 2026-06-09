import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import type { Pattern } from "@/lib/qr-types";

const dotsType: Record<Pattern, "square" | "dots" | "rounded" | "classy" | "classy-rounded" | "extra-rounded"> = {
  square: "square",
  rounded: "dots",
  classy: "classy",
  diamond: "extra-rounded",
  dots: "dots",
};

interface Props {
  data: string;
  fg: string;
  bg: string;
  pattern: Pattern;
  size?: number;
}

export function QRPreview({ data, fg, bg, pattern, size = 320 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data: data || " ",
        margin: 8,
        qrOptions: { errorCorrectionLevel: "H" },
        dotsOptions: { type: dotsType[pattern], color: fg },
        backgroundOptions: { color: bg },
        cornersSquareOptions: { type: pattern === "square" ? "square" : "extra-rounded", color: fg },
        cornersDotOptions: { type: pattern === "square" ? "square" : "dot", color: fg },
      });
      if (ref.current) {
        ref.current.innerHTML = "";
        qrRef.current.append(ref.current);
      }
    } else {
      qrRef.current.update({
        width: size,
        height: size,
        data: data || " ",
        dotsOptions: { type: dotsType[pattern], color: fg },
        backgroundOptions: { color: bg },
        cornersSquareOptions: { type: pattern === "square" ? "square" : "extra-rounded", color: fg },
        cornersDotOptions: { type: pattern === "square" ? "square" : "dot", color: fg },
      });
    }
  }, [data, fg, bg, pattern, size]);

  return <div ref={ref} className="flex items-center justify-center" />;
}

export async function downloadQR(opts: {
  data: string;
  fg: string;
  bg: string;
  pattern: Pattern;
  size: number;
  filename?: string;
}) {
  const qr = new QRCodeStyling({
    width: opts.size,
    height: opts.size,
    type: "canvas",
    data: opts.data,
    margin: 24,
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions: { type: dotsType[opts.pattern], color: opts.fg },
    backgroundOptions: { color: opts.bg },
    cornersSquareOptions: { type: opts.pattern === "square" ? "square" : "extra-rounded", color: opts.fg },
    cornersDotOptions: { type: opts.pattern === "square" ? "square" : "dot", color: opts.fg },
  });
  await qr.download({ name: opts.filename ?? "qr-code", extension: "png" });
}
