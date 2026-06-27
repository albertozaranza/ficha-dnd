import { useEffect } from "react";
import { useCampaignStore } from "../store/campaignStore";
import { useUIStore } from "../store/uiStore";
import { Storage } from "../storage";
import type { Campaign } from "../types";

export function useAutoSave() {
  useEffect(() => {
    let prev: Campaign | null = null;

    const unsub = useCampaignStore.subscribe((state) => {
      const current = state.campaign;
      if (current === prev) return;
      prev = current;

      useUIStore.getState().setSaveStatus("saving");
      Storage.scheduleSave(current, (ok: boolean) => {
        useUIStore.getState().setSaveStatus(ok ? "saved" : "error");
        setTimeout(() => useUIStore.getState().setSaveStatus("idle"), 1800);
      });
    });

    return unsub;
  }, []);
}
