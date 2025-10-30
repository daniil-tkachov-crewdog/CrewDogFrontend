import { useState, useEffect } from "react";
import { fetchSearchHistory } from "@/api/account.api";

export function useSearchHistory(userId: string | null) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState<string | undefined>();

  async function load() {
    if (!userId) return;
    const data = await fetchSearchHistory(userId, cursor);
    setItems(data.items);
    setCursor(data.nextCursor);
  }

  useEffect(() => {
    load();
  }, [userId]);

  return { items, cursor, load };
}
