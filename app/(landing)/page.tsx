"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LandingNote from "@/components/landing/landing-note";
import LandingCards from "@/components/landing/landing-cards";
import TypewriterComponent from "typewriter-effect";

import { useUser } from "@supabase/auth-helpers-react";

const LandingPage = () => {
  const user = useUser();

  // const noteOptions = ["note1.svg", "note2.svg", "note3.svg"];

  // const notes = Array(10)
  //   .fill(null)
  //   .map(() => ({
  //     src: noteOptions[Math.floor(Math.random() * noteOptions.length)],
  //     size: 40,
  //   }));

  // const yValues = notes.map(() => 100);
  // const durationValues = notes.map(() => 2 + Math.random() * 5);

  return (
    <div className="bg-slate-700 h-full">
      <motion.div
        className="h-full w-full absolute z-0 hidden h-md:block"
        // initial={{ opacity: 0, y: -100 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 1 }}
      >
        <LandingNote />
      </motion.div>
      <h1 className="text-6xl md:text-8xl font-bold text-purple-600 text-center py-12 ">
        <span className="font-extrabold text-purple-200">Music</span>Gen
        <div className="flex justify-center">
          <div className="text-sm md:text-xl mt-4 flex items-center text-white">
            <span>Create beautiful </span>
            <span className=" bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 ml-1">
              <TypewriterComponent
                options={{
                  strings: ["Songs", "Melodies", "Ideas", "Art"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
            <span className="mb-[1px]">with the latest AI models.</span>
          </div>
        </div>
      </h1>

      <div className="absolute z-20 bottom-[200px] lg:bottom-2 w-full ">
        <motion.div
          className="flex justify-center "
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="">
            <Link href={user ? "/musicgen" : "/sign-in"}>
              <Button
                variant="outline"
                className=" text-2xl rounded-full font-semibold p-6 h-lg:text-lg "
              >
                Start Generating For Free
              </Button>
            </Link>
          </div>
        </motion.div>

        <LandingCards />
      </div>

      <div className="absolute right-5 top-5 hidden md:block ">
        {user ? (
          <Link href="/musicgen">
            <Button>Get Started!</Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
