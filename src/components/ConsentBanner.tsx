import { useEffect, useState } from "react";
import { grantAll, denyAll, readConsent } from "@/analytics/consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if no stored choice
    const saved = readConsent();
    setVisible(!saved);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="gc-consent"
      className="fixed left-0 right-0 bottom-0 z-[9999] backdrop-blur-md"
      style={{
        background: "var(--card, #12161c)",
        color: "var(--text, #e6eaf2)",
        borderTop: "1px solid var(--border, #1f2937)",
      }}
    >
      <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <div className="min-w-[220px]">
          We use Google Analytics only if you consent. You can change this later
          in Privacy.
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              grantAll();
              setVisible(false);
            }}
            className="px-3 py-2 rounded-lg text-white"
            style={{ background: "#3b82f6", border: "1px solid #3b82f6" }}
          >
            Accept
          </button>
          <button
            onClick={() => {
              denyAll();
              setVisible(false);
            }}
            className="px-3 py-2 rounded-lg"
            style={{ border: "1px solid var(--border, #1f2937)" }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
