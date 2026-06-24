import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const MONO_LABEL =
  "block font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] text-[#6F6C78] mb-[10px]";
const INPUT =
  "w-full font-['Space_Grotesk',sans-serif] text-[15px] text-[#0B0B0F] bg-[#F4F2EE] border border-[#E4E1D9] rounded-[3px] px-[14px] py-[12px] transition-colors focus:outline-none focus:border-[#FF5A1F]";

export default function SecuritySection() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (busy) return;

    const form = e.currentTarget;
    const cur = (
      form.querySelector("#currentPassword") as HTMLInputElement
    )?.value?.trim();
    const next = (
      form.querySelector("#newPassword") as HTMLInputElement
    )?.value?.trim();
    const confirm = (
      form.querySelector("#confirmPassword") as HTMLInputElement
    )?.value?.trim();

    if (!cur || !next) return toast.error("Both fields are required.");
    if (next !== confirm) return toast.error("Passwords do not match.");
    if (next.length < 6)
      return toast.error("New password must be at least 6 characters.");

    setBusy(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email;
      if (!email) throw new Error("Unable to get user email.");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: cur,
      });
      if (signInError) throw new Error("Incorrect current password.");

      const { error: updateError } = await supabase.auth.updateUser({
        password: next,
      });
      if (updateError) throw updateError;

      (form.querySelector("#currentPassword") as HTMLInputElement).value = "";
      (form.querySelector("#newPassword") as HTMLInputElement).value = "";
      (form.querySelector("#confirmPassword") as HTMLInputElement).value = "";
      toast.success("Password updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <span className="font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.2em] text-[#FF5A1F]">
        // security
      </span>

      <div className="mt-5 rounded-md border border-[#E4E1D9] bg-white p-6 sm:p-7">
        <h3 className="mb-5 text-[18px] tracking-[-0.01em]">Change password</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className={MONO_LABEL}>
              Current password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={show ? "text" : "password"}
                className={INPUT + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6C78] hover:text-[#0B0B0F]"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className={MONO_LABEL}>
              New password
            </label>
            <input id="newPassword" type="password" className={INPUT} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={MONO_LABEL}>
              Confirm new password
            </label>
            <input id="confirmPassword" type="password" className={INPUT} />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[2px] bg-[#FF5A1F] px-[22px] py-[13px] font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}
