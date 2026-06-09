import type { Pattern } from "@/lib/qr-types";

export function PatternThumb({ pattern }: { pattern: Pattern }) {
  // 5x5 mini pattern preview
  const cells = [
    [1,1,1,0,1],
    [1,0,1,1,0],
    [0,1,1,0,1],
    [1,1,0,1,1],
    [1,0,1,1,0],
  ];
  const shape = (filled: number, x: number, y: number, key: string) => {
    if (!filled) return null;
    if (pattern === "square") return <rect key={key} x={x} y={y} width="4" height="4" fill="currentColor" />;
    if (pattern === "diamond") return <rect key={key} x={x+0.5} y={y+0.5} width="3" height="3" rx="0.5" fill="currentColor" />;
    if (pattern === "classy") return <rect key={key} x={x} y={y} width="4" height="4" rx="1.5" fill="currentColor" />;
    // rounded / dots
    const r = pattern === "dots" ? 1.4 : 1.8;
    return <circle key={key} cx={x+2} cy={y+2} r={r} fill="currentColor" />;
  };
  return (
    <svg viewBox="0 0 24 24" className="size-7 text-foreground">
      {cells.flatMap((row, y) => row.map((c, x) => shape(c, x*4+2, y*4+2, `${x}-${y}`)))}
    </svg>
  );
}
