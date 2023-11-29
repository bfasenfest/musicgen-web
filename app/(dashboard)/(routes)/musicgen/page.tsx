"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// @ts-ignore
import { useVisualizer, models } from "react-audio-viz";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

import axios from "axios";

import { useEffect, useState, useRef } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { decode } from "base64-arraybuffer";

import { useTrackStore } from "@/lib/store";

import TrackHistorySlim from "@/components/tracks/track-history-slim";

import TrackVisualizer from "@/components/tracks/track-viz";

import { NextResponse } from "next/server";

import { useApiStore } from "@/lib/api-store";

import { useProModal } from "@/lib/pro-modal";

import { Track, FileObject } from "@/types_db";

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

// Temporary API URL for testing
const API_URL = "https://3bd7-149-36-0-187.ngrok-free.app";

const MusicGenPage = () => {
  const { tracks, setTracks } = useTrackStore();
  const [prompt, updatePrompt] = useState<string>();
  const [queue, setQueue] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string>();
  const [trackLength, updateTrackLength] = useState<number>();
  const [loading, updateLoading] = useState(false);
  const [trackPlaying, updateTrackPlaying] = useState(false);
  const [loadingSpeed, updateLoadingSpeed] = useState(4);

  const audioRef = useRef(null);
  const [AudioViz, init] = useVisualizer(audioRef);

  const user = useUser();
  const supabase = useSupabaseClient();

  const proModal = useProModal();

  const {
    apiLimit,
    subscription,
    incrementApiLimit,
    checkApiLimit,
    getApiLimitCount,
    checkSubscription,
  } = useApiStore();

  const getTracks = async () => {
    try {
      const { data: tracks } = await supabase.storage
        .from("tracks")
        .list(user?.id + "/", {
          limit: 30,
          offset: 0,
          sortBy: {
            column: "created_at",
            order: "desc",
          },
        });

      const tracksAny: any = tracks;

      if (tracks !== null) {
        setTracks(tracksAny);
      }
    } catch (e) {
      alert(e);
    } finally {
    }
  };

  useEffect(() => {
    async function getLoader() {
      const { quantum } = await import("ldrs");
      quantum.register();
    }
    getLoader();
  }, []);

  useEffect(() => {
    if (user) {
      getTracks();
      getApiLimitCount(user, supabase);
      checkSubscription(user, supabase);
    }
  }, [user]);

  const generateTrack = async (prompt: string) => {
    if (subscription !== "active") {
      const trial = await checkApiLimit(user, supabase);

      if (!trial) {
        proModal.onOpen();
        return new NextResponse("Free trial has expired", { status: 403 });
      }
    }

    updateLoading(true);
    setQueue((oldQueue) => [...oldQueue, prompt]);

    length = Math.round(trackLength || 5);
    prompt = prompt || "Classic Rock Anthem";

    const track = await axios.get(
      `${API_URL}/?prompt=${prompt}&length=${length}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    // const track = await axios.post("/api/musicgen", {
    //   user: user,
    //   prompt: prompt,
    //   length: length,
    // });

    await incrementApiLimit(user, supabase);

    const { data, error } = await supabase.storage
      .from("tracks")
      .upload(
        user?.id + "/" + `${prompt}-${uuidv4()}.wav`,
        decode(track.data),
        {
          contentType: "audio/wav",
        }
      );

    setQueue((oldQueue) => {
      const newQueue = oldQueue.slice(1);
      if (newQueue.length === 0) {
        updateLoading(false);
      }
      return newQueue;
    });

    if (error) {
      alert(error);
    } else {
      getTracks();
    }
  };

  const deleteTrack = async (trackUrl: String) => {
    console.log("Deleting track: ", trackUrl);
    let trackName = trackUrl.split("/")[trackUrl.split("/").length - 1];
    console.log("Deleting track: ", trackName);
    const { error } = await supabase.storage
      .from("tracks")
      .remove([user?.id + "/" + trackName]);

    if (error) {
      alert(error);
    } else {
      getTracks();
    }
  };

  const initTrack = () => {
    init();
    updateLoadingSpeed(1.5);
    updateTrackPlaying(true);

    if (audioRef.current) {
      const audioElement = audioRef.current as HTMLAudioElement;

      audioElement.onended = () => {
        updateLoadingSpeed(4);
        updateTrackPlaying(false);
      };
      audioElement.onpause = () => {
        updateLoadingSpeed(4);
        updateTrackPlaying(false);
      };
    }
  };

  const playTrack = (trackSrc: string) => {
    updateTrackPlaying(false);
    setCurrentTrack(trackSrc);
    init();
    updateLoadingSpeed(1.5);

    if (audioRef.current) {
      const audioElement = audioRef.current as HTMLAudioElement;

      audioElement.oncanplaythrough = () => {
        audioElement.play().catch((error) => console.log(error));
        updateTrackPlaying(true);
      };
      audioElement.onended = () => {
        updateLoadingSpeed(4);
        updateTrackPlaying(false);
      };
      audioElement.onpause = () => {
        updateLoadingSpeed(4);
        updateTrackPlaying(false);
      };
      audioElement.load();
    }
  };

  const saveTrack = (track: Track) => {
    const url = CDNURL + user!.id + "/" + track.name;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${track.name}.wav`;
    link.click();
  };

  return (
    <div
      className="dark flex flex-col"
      style={{ height: "calc(100vh - 140px)" }}
    >
      <div className="flex items-center justify-center mt-2">
        <Card className=" w-5/6 md:w-3/6 ">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Generate New Track</CardTitle>
                <CardDescription>
                  Generate track using the latest music-gen models
                </CardDescription>
              </div>

              {loading ? (
                <div className="">
                  <l-quantum size="45" speed="1.75" color="white"></l-quantum>
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Prompt</Label>
                  <Input
                    id="name"
                    value={prompt}
                    onChange={(e) => updatePrompt(e.target.value)}
                    placeholder="Description of your music track. For Example: Classic Rock, Drum Kit, Electric Guitar, Bass, Raw, Uplifting, Anthem"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Track Length (in seconds)</Label>
                  <Input
                    id="name"
                    value={trackLength}
                    onChange={(e) => updateTrackLength(Number(e.target.value))}
                    placeholder="Track length in seconds. For Example: 5"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setQueue([]);
                updateLoading(false);
              }}
            >
              Cancel
            </Button>
            <div className="m-5">
              {loading
                ? `Working on ${queue[0]} | tracks left: ${queue.length}`
                : null}
            </div>
            <Button onClick={(e) => generateTrack(prompt || "")}>
              Generate
            </Button>
          </CardFooter>
        </Card>

        <TrackVisualizer
          trackPlaying={trackPlaying}
          audioRef={audioRef}
          initTrack={initTrack}
          currentTrack={currentTrack!}
          loadingSpeed={loadingSpeed}
          AudioViz={AudioViz}
        />
      </div>
      <TrackHistorySlim
        tracks={tracks}
        loading={loading}
        playTrack={playTrack}
        deleteTrack={deleteTrack}
        saveTrack={saveTrack}
      />
    </div>
  );
};

export default MusicGenPage;
