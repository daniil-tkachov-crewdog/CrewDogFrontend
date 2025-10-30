const API = import.meta.env.VITE_API_URL || "/api";

export function startCheckout(data: { userId: string; email: string }) {
  return fetch(`${API}/stripe/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  }).then((r) => r.json());
}

export function openPortal(data: { userId: string; email: string }) {
  return fetch(`${API}/stripe/portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  }).then((r) => r.json());
}

export function cancelSubscription(data: { userId: string }) {
  return fetch(`${API}/stripe/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export function submitCancelFeedback(data: any) {
  return fetch(`${API}/stripe/cancel/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
