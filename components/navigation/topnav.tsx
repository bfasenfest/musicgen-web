"use client";

import { Button } from "../ui/button";
import * as React from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import MobileSidebar from "./mobile-sidebar";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

import ApiCounter from "@/components/api/ApiCounter";
// import { useApiLimit } from "@/lib/api-limit";
import { useApiStore } from "@/lib/api-store";
import { MAX_FREE_COUNTS } from "@/constants";
// import { checkSubscription } from "@/lib/subscription";

import { useEffect, useState } from "react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Account",
    href: "/settings",
    description:
      "Manage your personal details, preferences, and access your user history",
  },
  {
    title: "Billing",
    href: "/settings",
    description:
      "View and manage your current plan, payment methods, and transaction history.",
  },
  {
    title: "About Us",
    href: "",
    description:
      "Discover our company's history, mission, and the team behind our services.",
  },
  {
    title: "Contact",
    href: "",
    description: "Get in touch with us for support, inquiries, or feedback.",
  },
];

const TopNav = () => {
  const user = useUser();

  const supabase = useSupabaseClient();
  const router = useRouter();

  const { apiLimit, subscription } = useApiStore();

  async function signOut() {
    router.push("/");
    const { error } = await supabase.auth.signOut();
  }

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";
  return (
    <div className="flex flex-wrap justify-between items-center p-4">
      <div className="m4 flex w-[45px] md:w-[60px] ">
        <Image
          alt="logo"
          src="/logo.svg"
          width={120}
          height={120}
          className="rounded "
        />
        <h1 className=" hidden md:block text-2xl font-bold mt-4 ml-2 text-cyan-600">
          <span className="font-extrabold text-cyan-900">Music</span>Gen
        </h1>
      </div>

      <div className="md:hidden">
        <h1 className="text-2xl font-bold text-cyan-600">
          <span className="font-extrabold text-cyan-900">Music</span>Gen
        </h1>
      </div>

      <NavigationMenu className="hidden md:block justify-center ml-[100px]">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Generation</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Image
                        alt="logo"
                        src="/logo.svg"
                        width={80}
                        height={80}
                        className="rounded "
                      />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        MusicGen
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Generate creative music using the latest machine
                        learning models.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>

                <ListItem href="/musicgen" title="Text To Song">
                  Generate music from text prompts.
                </ListItem>
                <ListItem href="melodygen" title="Melody to Song">
                  Generate music from a recorded melody.
                </ListItem>
                <ListItem href="/replicate" title="Replicate Playground">
                  Experiment with different audio models from replicate
                </ListItem>
                {/* <ListItem href="/dashboard" title="Dashboard">
                  View the site dashboard and your generated tracks.
                </ListItem> */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden lg:block">
            <Link href="/guide" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                User Guide
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
              {subscription === "active" ? (
                <div>Subscription</div>
              ) : (
                <div>
                  Api Usage {apiLimit} / {MAX_FREE_COUNTS}
                </div>
              )}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[500px] ">
                <ApiCounter subStatus={subscription} apiLimitCount={apiLimit} />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex ">
        <div className="md:hidden ">
          <MobileSidebar />
        </div>
        <div className="">
          {user ? (
            <Button onClick={() => signOut()}>Sign Out</Button>
          ) : (
            <Link href="/sign-in">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
