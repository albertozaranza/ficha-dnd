import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Storage } from "../storage";
import type { Campaign, Character, Session } from "../types";

interface CampaignStore {
  campaign: Campaign;
  updateCharacter: (updater: (char: Character) => void) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updater: (s: Session) => void) => void;
  deleteSession: (id: string) => void;
  importCampaign: (data: Campaign) => void;
  resetCampaign: () => void;
}

export const useCampaignStore = create<CampaignStore>()(
  immer((set) => ({
    campaign: Storage.load(),

    updateCharacter: (updater) =>
      set((state) => {
        updater(state.campaign.character);
        state.campaign.updatedAt = new Date().toISOString();
      }),

    addSession: (session) =>
      set((state) => {
        state.campaign.sessions.push(session);
        state.campaign.updatedAt = new Date().toISOString();
      }),

    updateSession: (id, updater) =>
      set((state) => {
        const s = state.campaign.sessions.find((s) => s.id === id);
        if (s) {
          updater(s);
          s.updatedAt = new Date().toISOString();
          state.campaign.updatedAt = new Date().toISOString();
        }
      }),

    deleteSession: (id) =>
      set((state) => {
        state.campaign.sessions = state.campaign.sessions.filter((s) => s.id !== id);
        state.campaign.updatedAt = new Date().toISOString();
      }),

    importCampaign: (data) =>
      set((state) => {
        state.campaign = data;
      }),

    resetCampaign: () =>
      set((state) => {
        state.campaign = Storage.reset();
      }),
  }))
);
