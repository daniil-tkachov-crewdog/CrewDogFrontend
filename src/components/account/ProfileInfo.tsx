import { useState } from "react";
import { toast } from "sonner";
import type { AccountUser } from "../data/account.types";

const MONO_LABEL =
  "font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] text-[#6F6C78]";
const INPUT =
  "w-full font-['Space_Grotesk',sans-serif] text-[15px] text-[#0B0B0F] bg-[#F4F2EE] border border-[#E4E1D9] rounded-[3px] px-[14px] py-[12px] transition-colors focus:outline-none focus:border-[#FF5A1F]";
const BTN_PRIMARY =
  "rounded-[2px] bg-[#FF5A1F] px-[18px] py-[10px] font-['Space_Grotesk',sans-serif] text-[14px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5";
const BTN_GHOST =
  "rounded-[2px] border border-[#E4E1D9] px-[18px] py-[10px] text-[14px] font-medium transition-colors hover:border-[#FF5A1F]";

export default function ProfileInfo({ user }: { user: AccountUser }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSaveName = () => {
    // TODO: call API to update name
    toast.success("Name updated successfully!");
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    // TODO: call API to update email (send verification)
    toast.success("Email updated — please verify.");
    setIsEditingEmail(false);
  };

  return (
    <section>
      <span className="font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.2em] text-[#FF5A1F]">
        // profile information
      </span>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {/* Name */}
        <div className="group rounded-md border border-[#E4E1D9] bg-white p-6">
          <div className={MONO_LABEL + " mb-3"}>Full name</div>

          {isEditingName ? (
            <div className="space-y-3">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={user.name}
                className={INPUT}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveName} className={BTN_PRIMARY + " flex-1"}>
                  Save
                </button>
                <button onClick={() => setIsEditingName(false)} className={BTN_GHOST}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-medium">{user.name}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#6F6C78] opacity-0 transition-opacity hover:text-[#FF5A1F] group-hover:opacity-100"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="group rounded-md border border-[#E4E1D9] bg-white p-6">
          <div className={MONO_LABEL + " mb-3"}>Email address</div>

          {isEditingEmail ? (
            <div className="space-y-3">
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder={user.email}
                type="email"
                className={INPUT}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEmail} className={BTN_PRIMARY + " flex-1"}>
                  Save
                </button>
                <button onClick={() => setIsEditingEmail(false)} className={BTN_GHOST}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-[17px] font-medium">{user.email}</span>
              <button
                onClick={() => setIsEditingEmail(true)}
                className="flex-shrink-0 font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#6F6C78] opacity-0 transition-opacity hover:text-[#FF5A1F] group-hover:opacity-100"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
