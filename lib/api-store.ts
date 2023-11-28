import { create } from "zustand";
import { MAX_FREE_COUNTS } from "@/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@supabase/gotrue-js";

type State = {
  apiLimit: number;
  subscription: string;
  setApiLimit: (apiLimit: number) => void;
  incrementApiLimit: (
    user: User | null,
    supabase: SupabaseClient
  ) => Promise<void>;
  checkApiLimit: (
    user: User | null,
    supabase: SupabaseClient
  ) => Promise<boolean>;
  getApiLimitCount: (
    user: User | null,
    supabase: SupabaseClient
  ) => Promise<void>;
  checkSubscription: (
    user: User | null,
    supabase: SupabaseClient
  ) => Promise<boolean>;
};

export const useApiStore = create<State>((set) => ({
  apiLimit: 0,
  subscription: "trial",
  setApiLimit: (apiLimit) => set({ apiLimit }),
  incrementApiLimit: async (user, supabase) => {
    if (!user) {
      return;
    }

    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .select("api_limit");

    const userApiLimit = data![0].api_limit;

    if (userApiLimit) {
      await supabase
        .from("users")
        .update({ api_limit: userApiLimit + 1 })
        .eq("id", user.id);
    } else {
      await supabase.from("users").update({ api_limit: 1 }).eq("id", user.id);
    }

    set({ apiLimit: userApiLimit + 1 });
  },
  checkApiLimit: async (user, supabase) => {
    if (!user) {
      return false;
    }

    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .select("api_limit");

    const userApiLimit = data![0].api_limit;

    console.log(userApiLimit);

    if (!userApiLimit || userApiLimit < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  },
  checkSubscription: async (user, supabase) => {
    if (!user) {
      return false;
    }

    const { data: status } = await supabase
      .from("subscriptions")
      .select()
      .eq("user_id", user.id)
      .select("status")
      .single();

    const userSubscription = status!.status;

    console.log(userSubscription);

    set({ subscription: userSubscription });
  },
  getApiLimitCount: async (user, supabase) => {
    if (!user) {
      return 0;
    }

    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .select("api_limit");

    const userApiLimit = data![0].api_limit;

    if (!userApiLimit) {
      return 0;
    }

    set({ apiLimit: userApiLimit });

    return userApiLimit;
  },
}));
