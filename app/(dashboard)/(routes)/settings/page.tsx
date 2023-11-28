"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { ArrowDownToLine, Trash } from "lucide-react";

import ApiCounter from "@/components/api/ApiCounter";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useApiStore } from "@/lib/api-store";

import { useEffect } from "react";

export default function SettingsPage() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const { apiLimit, subscription, getApiLimitCount, checkSubscription } =
    useApiStore();

  useEffect(() => {
    if (user) {
      getApiLimitCount(user, supabase);
      checkSubscription(user, supabase);
    }
  }, [user]);

  return (
    <div className="mb-8 space-y-4 p-5">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-2xl">
            Settings
          </CardTitle>
          <CardDescription className="text-center text-md md:text-lg">
            Manage your account settings here{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <div className=" flex justify-center items-center">
            <div className="w-1/2">
              <ApiCounter subStatus={subscription} apiLimitCount={apiLimit} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
