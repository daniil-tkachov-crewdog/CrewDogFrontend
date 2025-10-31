import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gaPageview } from "./gtm";
import { readConsent } from "./consent";

export default function usePageViews() {
  const loc = useLocation();
  useEffect(() => {
    const consent = readConsent();
    if (consent?.analytics_storage === "granted") {
      gaPageview(loc.pathname + loc.search);
    }
  }, [loc]);
}
