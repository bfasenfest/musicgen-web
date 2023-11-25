"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const LandingCards = () => {
  const controls = useAnimation();

  const cards = [
    {
      name: "Joel",
      avatar: "J",
      title: "Software Engineer",
      description: "This is the best application I've ever used!",
    },
    {
      name: "Antonio",
      avatar: "A",
      title: "Designer",
      description: "I use this daily for generating new photos!",
    },
    {
      name: "Mark",
      avatar: "M",
      title: "CEO",
      description:
        "This app has changed my life, cannot imagine working without it!",
    },
    {
      name: "Mary",
      avatar: "M",
      title: "CFO",
      description:
        "The best in class, definitely worth the premium subscription!",
    },
  ];
  return (
    <div className="px-10 pb-20 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((item, i) => (
          <motion.div
            key={item.description}
            initial={{ opacity: 0, y: -75 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 + i / 8, delay: 1 }}
          >
            <Card
              key={item.description}
              className="bg-[#192339] border-none text-white h-[200px]"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-zinc-400 text-sm">{item.title}</p>
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
