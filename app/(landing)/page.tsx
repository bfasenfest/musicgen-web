"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LandingNote from "@/components/landing-note";
import LandingCards from "@/components/landing-cards";

const LandingPage = () => {
  const noteOptions = ["note1.svg", "note2.svg", "note3.svg"];

  const notes = Array(10)
    .fill(null)
    .map(() => ({
      src: noteOptions[Math.floor(Math.random() * noteOptions.length)],
      size: 40,
    }));

  const yValues = notes.map(() => 100);
  const durationValues = notes.map(() => 2 + Math.random() * 5);

  return (
    <div className="bg-blue-100 h-full">
      <h1 className="text-6xl md:text-8xl font-bold text-purple-600 text-center py-12">
        <span className="font-extrabold text-purple-900">Music</span>Gen
        <div className="text-sm md:text-xl font-light text-black mt-4">
          Create beautiful music tracks with the latest AI models.
        </div>
      </h1>
      <motion.div
        className="h-[300px]"
        // initial={{ opacity: 0, y: -100 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 1 }}
      >
        <LandingNote />
      </motion.div>
      <LandingCards />
      <div className="absolute right-5 top-5">
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
