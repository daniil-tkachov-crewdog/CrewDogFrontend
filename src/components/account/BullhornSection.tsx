import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getBullhornStatus,
  startBullhornOAuth,
  disconnectBullhorn,
} from "@/services/bullhorn";

export default function BullhornSection() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [restUrl, setRestUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      const s = await getBullhornStatus();
      setConnected(s.connected);
      setRestUrl(s.restUrl);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleConnect = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { authUrl } = await startBullhornOAuth();
      window.location.href = authUrl;
    } catch (e: any) {
      toast.error(e?.message || "Could not start Bullhorn connection.");
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await disconnectBullhorn();
      setConnected(false);
      setRestUrl(undefined);
      toast.success("Bullhorn disconnected.");
    } catch (e: any) {
      toast.error(e?.message || "Could not disconnect Bullhorn.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <span className="font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.2em] text-[#FF5A1F]">
        // integrations
      </span>

      <div className="mt-5 rounded-md border border-[#E4E1D9] bg-white p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] tracking-[-0.01em]">Bullhorn</h3>
            <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.6] text-[#55525E]">
              Connect your Bullhorn account to push contacts from your search
              results straight into your ATS.
            </p>
          </div>
          <span
            className={
              "mt-1 shrink-0 rounded-full px-3 py-1 font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.08em] " +
              (connected
                ? "bg-[#FF5A1F]/[0.12] text-[#FF5A1F]"
                : "bg-[#F4F2EE] text-[#6F6C78]")
            }
          >
            {loading ? "…" : connected ? "Connected" : "Not connected"}
          </span>
        </div>

        {connected && restUrl && (
          <p className="mt-4 break-all font-['IBM_Plex_Mono',monospace] text-[12px] text-[#6F6C78]">
            Cluster: {restUrl}
          </p>
        )}

        <div className="mt-6">
          {connected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={busy}
              className="rounded-[2px] border border-[#E4E1D9] px-5 py-[12px] font-['Space_Grotesk',sans-serif] text-[14px] font-medium transition-colors hover:border-[#FF5A1F] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Disconnecting…" : "Disconnect"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={busy || loading}
              className="rounded-[2px] bg-[#FF5A1F] px-[22px] py-[13px] font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Redirecting…" : "Connect Bullhorn"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
