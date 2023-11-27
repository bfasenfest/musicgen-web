import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { MAX_FREE_COUNTS } from "@/constants";

export const incrementApiLimit = async (user, supabase) => {
  if (!user.id) {
    return;
  }

  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .select("api_limit");

  const userApiLimit = data[0].api_limit;

  if (userApiLimit) {
    await supabase
      .from("users")
      .update({ api_limit: userApiLimit + 1 })
      .eq("id", user.id);
  } else {
    await supabase.from("users").update({ api_limit: 1 }).eq("id", user.id);
  }
};

export const checkApiLimit = async (user, supabase) => {
  if (!user.id) {
    return false;
  }

  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .select("api_limit");

  const userApiLimit = data[0].api_limit;

  console.log(userApiLimit);

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async (user, supabase) => {
  if (!user.id) {
    return 0;
  }

  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .select("api_limit");

  const userApiLimit = data[0].api_limit;

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit;
};
