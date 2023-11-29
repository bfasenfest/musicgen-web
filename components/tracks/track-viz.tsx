import { Card } from "@/components/ui/card";
//@ts-ignore
import { models } from "react-audio-viz";
import { motion, AnimatePresence } from "framer-motion";

const TrackVisualizer = ({
  trackPlaying,
  audioRef,
  initTrack,
  currentTrack,
  loadingSpeed,
  AudioViz,
  height = "240",
}: {
  trackPlaying: boolean;
  audioRef: any;
  initTrack: any;
  currentTrack: string;
  loadingSpeed: number;
  AudioViz: any;
  height?: string;
}) => {
  return (
    <Card className="hidden md:block w-5/12 ml-5">
      <div
        className={` relative  rounded-lg ${trackPlaying ? "" : "bg-black"}`}
        style={{ height: `${height}px` }}
      >
        <AnimatePresence>
          {!trackPlaying && (
            <motion.div
              key="audio-viz"
              className="absolute top-[40%] left-[45%] transform -translate-y-1/2top"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ ease: "easeIn", duration: 0.3 }}
            >
              <l-quantum size="75" speed={loadingSpeed} color="white" />
            </motion.div>
          )}
        </AnimatePresence>

        <AudioViz
          className="absolute inset-0 rounded-lg"
          model={models.horizontal({
            darkMode: true,
            reversed: false,
            fadeBars: true,
            scale: 0.9,
            color: "#39A7FF",
            binSize: 25,
            frequencyRange: [0, 16000],
          })}
        />
      </div>
      <div className="flex justify-center">
        <audio
          className="w-5/6 h-10 mb-5 mt-4"
          controls={true}
          ref={audioRef}
          onPlay={initTrack}
          crossOrigin="anonymous"
          src={currentTrack}
        />
      </div>
    </Card>
  );
};

export default TrackVisualizer;
