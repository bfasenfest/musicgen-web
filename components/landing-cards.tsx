"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const LandingCards = () => {
  const controls = useAnimation();

  const cards = [
    {
      name: "Compose with AI",
      description:
        "Unleash your creativity with our advanced AI composition tool. Effortlessly create music across various genres. ",
    },
    {
      name: "Melody to Masterpiece",
      description:
        "Transform your melody into a full-fledged song with our AI-driven composition tool. Input your basic melody, and watch as our AI extends it into a complete track.",
    },
    {
      name: "Style and Genre Transfer",
      description:
        "Simply input your style and mood preferences, and let the AI craft a unique piece tailored to your tastes.",
    },

    {
      name: "Immersive Music Creation",
      description:
        "Deep dive into the mechanics of music with our AI-powered analysis tool. Understand complex compositions, explore music theory, and learn from the masters. ",
    },
  ];
  return (
    <div className="px-10 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((item, i) => (
          <motion.div
            key={item.description}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 + i / 4, delay: 2 }}
          >
            <Card
              key={item.description}
              className="bg-[#192339] border-none text-white h-[200px]"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{item.name}</p>
                  </div>
                </CardTitle>
                <CardContent className="pt-4 px-0">
                  {item.description}
                </CardContent>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingCards;
