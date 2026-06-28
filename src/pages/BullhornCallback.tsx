// src/pages/BullhornCallback.tsx
// Bullhorn redirects here (?code=...&state=...). We forward the pair to the
// edge function to exchange for tokens, then return the user to their account.
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { completeBullhornOAuth } from "@/services/bullhorn";

export default function BullhornCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard React 18 StrictMode double-invoke
    ran.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const oauthError = params.get("error");

    if (oauthError) {
      setError(oauthError);
      return;
    }
    if (!code || !state) {
      setError("Missing authorization code from Bullhorn.");
      return;
    }

    (async () => {
      try {
        await completeBullhornOAuth(code, state);
        toast.success("Bullhorn connected.");
        navigate("/account?bullhorn=connected", { replace: true });
      } catch (e: any) {
        setError(e?.message || "Could not complete the Bullhorn connection.");
      }
    })();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0B0B0F] font-['Space_Grotesk',system-ui,sans-serif]">
      <Topbar />
      <main className="flex-1 grid place-items-center py-14">
        <div className="rounded-md border border-[#E4E1D9] bg-white px-9 py-10 text-center">
          {error ? (
            <>
              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#FF5A1F]">
                Connection failed
              </span>
              <h1 className="mt-2 text-[20px] tracking-[-0.01em]">
                Couldn’t connect Bullhorn
              </h1>
              <p className="mt-2 max-w-[44ch] text-[14px] leading-[1.6] text-[#55525E]">
                {error}
              </p>
              <button
                type="button"
                onClick={() => navigate("/account", { replace: true })}
                className="mt-5 rounded-[2px] bg-[#FF5A1F] px-5 py-[11px] text-[14px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5"
              >
                Back to account
              </button>
            </>
          ) : (
            <>
              <div className="relative mx-auto mb-6 h-[88px] w-[88px] rounded-full border border-[#FF5A1F]/30">
                <span className="absolute inset-4 animate-ping rounded-full border border-[#FF5A1F]/[0.22]" />
                <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]" />
              </div>
              <h1 className="text-[20px] tracking-[-0.01em]">
                Connecting Bullhorn…
              </h1>
              <p className="mt-2 text-[14px] text-[#55525E]">
                Finishing the secure handshake.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
