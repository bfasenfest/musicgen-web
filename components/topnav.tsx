"use client";

import { Button } from "./ui/button";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import Link from "next/link";

const TopNav = () => {
  const user = useUser();

  const supabase = useSupabaseClient();
  const router = useRouter();

  async function signOut() {
    router.push("/");
    const { error } = await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        {user ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopNav;
