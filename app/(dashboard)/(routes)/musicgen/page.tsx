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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useVisualizer, models } from "react-audio-viz";

import axios from "axios";

import { useEffect, useState, useRef } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { v4 as uuidv4 } from "uuid";

import { decode } from "base64-arraybuffer";

import { useTrackStore } from "@/lib/store";

import UserTrackHistory from "@/components/tracks/user-track-history";
import TrackHistorySlim from "@/components/tracks/track-history-slim";

import { NextResponse } from "next/server";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

type Track = {
  prompt: string;
  audio: string;
};

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

const API_URL = "https://02fa-206-125-129-213.ngrok-free.app";

const MusicGenPage = () => {
  const { tracks, setTracks } = useTrackStore();
  const [prompt, updatePrompt] = useState();
  const [queue, setQueue] = useState<string[]>([]);

  const [currentTrack, setCurrentTrack] = useState();

  const [trackLength, updateTrackLength] = useState<number>();
  const [loading, updateLoading] = useState(false);
  const [trackPlaying, updateTrackPlaying] = useState(false);

  const audioRef = useRef(null);
  const [AudioViz, init] = useVisualizer(audioRef);

  const user = useUser();
  const supabase = useSupabaseClient();

  const getTracks = async () => {
    if (!tracks) updateLoading(true);

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

      if (tracks !== null) {
        setTracks(tracks);
      }
    } catch (e) {
      alert(e);
    } finally {
      updateLoading(false);
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
    }
  }, [user]);

  const generateTrack = async (prompt: string) => {
    const trial = await checkApiLimit(user, supabase);

    // if (!trial) {
    //   return new NextResponse("Free trial has expired", { status: 403 });
    // }

    updateLoading(true);
    setQueue((oldQueue) => [...oldQueue, prompt]);
    length = Math.round(trackLength) || 5;
    const track = await axios.get(
      `${API_URL}/?prompt=${prompt}&length=${length}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

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
    setQueue((oldQueue) => oldQueue.filter((item) => item !== prompt));

    if (error) {
      alert(error);
    } else {
      getTracks();
    }
    if (queue.length === 0) updateLoading(false);
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
    updateTrackPlaying(true);

    if (audioRef.current) {
      audioRef.current.onended = () => {
        updateTrackPlaying(false);
      };
      audioRef.current.onpause = () => {
        updateTrackPlaying(false);
      };
    }
  };

  const playTrack = (trackSrc: string) => {
    setCurrentTrack(trackSrc);
    init();
    updateTrackPlaying(true);

    if (audioRef.current) {
      audioRef.current.oncanplaythrough = () => {
        audioRef.current.play().catch((error) => console.log(error));
        updateTrackPlaying(true);
      };
      audioRef.current.onended = () => {
        updateTrackPlaying(false);
      };
      audioRef.current.onpause = () => {
        updateTrackPlaying(false);
      };
      audioRef.current.load();
    }
  };

  const saveTrack = (track) => {
    const url = CDNURL + user.id + "/" + track.name;
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
      <div className="flex items-center justify-center">
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
                    onChange={(e) => updateTrackLength(e.target.value)}
                    placeholder="Track length in seconds. For Example: 5"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            {loading
              ? `Working on ${queue[0]} | tracks left: ${queue.length}`
              : null}
            <Button onClick={(e) => generateTrack(prompt || "")}>
              Generate
            </Button>
          </CardFooter>
        </Card>

        <Card className="hidden md:block w-5/12 ml-5">
          <div className=" h-60 relative ">
            {!trackPlaying ? (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2top">
                <l-quantum size="75" speed="3" color="white" />
              </div>
            ) : null}
            <AudioViz
              className="absolute inset-0 "
              model={models.horizontal({
                darkMode: true,
                reversed: false,
                fadeBars: true,
                scale: 0.9,
                color: "#F44E3B",
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
