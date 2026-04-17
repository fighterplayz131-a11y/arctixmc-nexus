import { useState, useRef, type ReactNode, type MouseEvent } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = ButtonProps & { children: ReactNode };

/** Button with Minecraft-style gem burst (gold + diamond + emerald) on click. */
export function GemBurstButton({ children, className, onClick, ...rest }: Props) {
  const [bursting, setBursting] = useState(false);
  const timer = useRef<number | null>(null);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    setBursting(false);
    requestAnimationFrame(() => setBursting(true));
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBursting(false), 800);
    onClick?.(e);
  }

  return (
    <Button {...rest} onClick={handleClick} className={cn("mc-btn relative overflow-visible", className)}>
      <span className="relative z-10 inline-flex items-center gap-1">{children}</span>
      <span aria-hidden className={cn("gem-burst", bursting && "burst")}>
        <span className="gem diamond" />
        <span className="gem gold" />
        <span className="gem emerald" />
        <span className="gem diamond" />
        <span className="gem gold" />
      </span>
    </Button>
  );
}
