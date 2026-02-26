import { useState, useEffect } from "react";

interface CountdownTimerProps {
  expiryTimestamp: bigint;
  compact?: boolean;
}

function getTimeLeft(expiryNs: bigint) {
  const nowMs = Date.now();
  const expiryMs = Number(expiryNs) / 1_000_000;
  const diffMs = expiryMs - nowMs;

  if (diffMs <= 0) return null;

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export default function CountdownTimer({ expiryTimestamp, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(expiryTimestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiryTimestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  if (!timeLeft) {
    return (
      <span
        className="text-xs font-semibold"
        style={{ color: "oklch(0.55 0.18 25)" }}
      >
        Ended
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  if (compact) {
    return (
      <span
        className="text-xs font-semibold font-mono tracking-wider"
        style={{ color: "oklch(0.58 0.20 25)" }}
      >
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {[
        { value: timeLeft.hours, label: "hrs" },
        { value: timeLeft.minutes, label: "min" },
        { value: timeLeft.seconds, label: "sec" },
      ].map(({ value, label }) => (
        <div key={label} className="countdown-unit">
          <span className="countdown-number">{pad(value)}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
