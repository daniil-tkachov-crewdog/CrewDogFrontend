// src/components/account/AccountHeader.tsx
import type { AccountUser } from "@/types/account";
import type { NormalizedSummary } from "@/services/account";

export default function AccountHeader({
  user,
  summary,
}: {
  user: AccountUser;
  summary: NormalizedSummary | null | undefined;
}) {
  const pro = summary?.pro ?? false;
  const unlimited = summary?.unlimited ?? false;

  const planLabel = unlimited
    ? "Admin"
    : summary?.planLabel ?? (pro ? "Pro" : "Free");

  const searchesUsed = summary?.used ?? user.quota?.used ?? 0;

  return (
    <div className="rounded-md border border-[#E4E1D9] bg-white px-7 py-7 sm:px-8">
      <span className="font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.2em] text-[#FF5A1F]">
        // your account
      </span>

      <div className="mt-5 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#0B0B0F] font-['IBM_Plex_Mono',monospace] text-[30px] font-bold text-[#FF5A1F]">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] tracking-[-0.02em]">{user.name}</h1>
              <span className="rounded-[2px] border border-[#FF5A1F]/[0.35] px-[10px] py-[4px] font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#FF5A1F]">
                {planLabel}
              </span>
            </div>
            <p className="mt-1 text-[15px] text-[#55525E]">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
          {[
            { label: "Searches", value: searchesUsed },
            { label: "Tier", value: planLabel },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[4px] border border-[#E4E1D9] bg-[#F4F2EE] px-6 py-4 text-center"
            >
              <div className="font-['IBM_Plex_Mono',monospace] text-[24px] font-semibold text-[#0B0B0F]">
                {s.value}
              </div>
              <div className="mt-1 font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.08em] text-[#6F6C78]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
