import { useEffect, useState } from "react";

const LOG_LINES = [
  "Parsing advert structure…",
  "Extracting location + discipline…",
  "Cross-referencing live demand…",
  "Matching likely end client…",
  "Surfacing direct contact…",
];

export default function LoadingCard() {
  const [shown, setShown] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setShown((n) => (n < LOG_LINES.length ? n + 1 : n));
    }, 520);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full min-h-[340px] flex-col justify-center rounded-md bg-[#0B0B0F] px-9 py-11 text-white">
      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.18em] text-[#FF5A1F]">
        Scanning
      </span>
      <h3 className="my-[14px] mb-[26px] text-[22px] tracking-[-0.01em]">
        Reading the signals…
      </h3>
      <div className="radar-scanline mb-4" />
      <div className="font-['IBM_Plex_Mono',monospace] text-[12px] leading-[2]">
        {LOG_LINES.slice(0, shown).map((line, i) => (
          <div
            key={line}
            className={i < shown - 1 ? "text-[#FF5A1F]" : "text-[#B9B6C0]"}
          >
            › {line}
          </div>
        ))}
      </div>
    </div>
  );
}
