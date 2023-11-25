import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "@react-three/drei";

// import { grid } from "ldrs";
// grid.register();

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const LandingNote = () => {
  const [isLoading, setIsLoading] = useState(true);

  const Note = () => {
    const obj = useLoader(OBJLoader, "headphone.obj", (loader) => {
      loader.load("headphone.obj", () => setIsLoading(false));
    });

    const ref = useRef();

    useFrame(({ clock }) => {
      ref.current.rotation.y = clock.getElapsedTime() / 2;
    });

    return (
      <primitive
        ref={ref}
        object={obj}
        scale={[0.4, 0.4, 0.4]} // Change the scale as needed
        position={[0, 0.6, 0]} // Move the object slightly up in space
      />
    );
  };

  return (
    <div className="h-full">
      {/* {isLoading ? (
        <div className="flex justify-center h-full items-center">
          <l-grid size="60" speed="1.5" color="black"></l-grid>
        </div>
      ) : null} */}
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Canvas>
          <OrbitControls />
          <Note />
        </Canvas>
      </motion.div>{" "}
    </div>
  );
};

export default LandingNote;
