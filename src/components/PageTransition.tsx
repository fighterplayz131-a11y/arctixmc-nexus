import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const [key, setKey] = useState(loc.pathname);
  const [wiping, setWiping] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setWiping(true);
    const t1 = window.setTimeout(() => {
      setKey(loc.pathname);
      setWiping(false);
    }, 120);
    return () => window.clearTimeout(t1);
  }, [loc.pathname]);

  return (
    <>
      <div key={key} className="page-anim">{children}</div>
      <div className={`block-wipe ${wiping ? "wiping" : ""}`} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} style={{ animationDelay: `${(i % 4) * 10}ms` }} />)}
      </div>
    </>
  );
}
