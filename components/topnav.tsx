"use client";

import { Button } from "./ui/button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";

const TopNav = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
};

export default TopNav;
