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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// @ts-ignore
import { useVisualizer, models } from "react-audio-viz";

import { useEffect, useState, useRef, useCallback } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useTrackStore } from "@/lib/store";

import TrackHistorySlim from "@/components/tracks/track-history-slim";

import TrackVisualizer from "@/components/tracks/track-viz";

import { NextResponse } from "next/server";

import { useApiStore } from "@/lib/api-store";

import { useProModal } from "@/lib/pro-modal";

import { RefreshCw } from "lucide-react";

import generateMusicPrompt from "@/components/tracks/generate-prompt";

type Track = {
  created_at: string;
  id: string;
  title: string;
  type: string;
  url: string;
};

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

const API_URL = "https://3140-185-158-179-210.ngrok.io";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ReplicatePage = () => {
  const { tracks, setTracks } = useTrackStore();
  const [prompt, updatePrompt] = useState(
    "Classic Rock, Drum Kit, Electric Guitar, Bass, Raw, Uplifting, Anthem"
  );
  const [error, setError] = useState<string>();
  const [prediction, setPrediction] = useState();
  const [queue, setQueue] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string>();

  const [trackLength, updateTrackLength] = useState<number>(5);
  const [selectedModel, updateSelectedModel] = useState("large");
  const [topK, updateTopK] = useState<number>(250);
  const [topP, updateTopP] = useState<number>(0);
  const [temp, updateTemp] = useState<number>(1);

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
    // if (!tracks) updateLoading(true);

    try {
      const { data: tracks } = await supabase
        .from("replicate-tracks")
        .select()
        .order("created_at", { ascending: false })
        .eq("id", user!.id)
        .eq("type", "basic");

      if (tracks !== null) {
        setTracks(tracks);
      }
    } catch (e) {
      alert(e);
    } finally {
      // updateLoading(false);
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
    console.log("generating...");

    if (subscription !== "active") {
      const trial = await checkApiLimit(user, supabase);

      if (!trial) {
        proModal.onOpen();
        return new NextResponse("Free trial has expired", { status: 403 });
      }
    }

    updateLoading(true);
    setQueue((oldQueue) => [...oldQueue, prompt]);
    length = Math.round(trackLength) || 5;

    const metadata = JSON.stringify({
      prompt: prompt,
      duration: length,
      model_version: selectedModel,
      top_k: topK,
      top_p: topP,
      temperature: temp,
    });

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: metadata,
    });

    await incrementApiLimit(user, supabase);

    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
    const blob = await fetch(prediction.output).then((r) => r.blob());

    const { data, error } = await supabase.from("replicate-tracks").insert({
      title: prompt,
      url: prediction.output,
      type: "basic",
      metadata: metadata,
    });

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

  const deleteTrack = async (trackSrc: String) => {
    const { error } = await supabase
      .from("replicate-tracks")
      .delete()
      .eq("url", trackSrc);

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
    const url = track.url;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${track.title}.wav`;
    link.click();
  };

  return (
    <div
      className="dark flex flex-col"
      style={{ height: "calc(100vh - 140px)" }}
    >
      {" "}
      <div className="flex items-center justify-center mt-2">
        <Card className=" w-5/6 md:w-3/6  ">
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
                <div>
                  <Label htmlFor="name">Prompt</Label>
                  <button
                    className="ml-2 translate-y-0.5 hover:scale-105 transition duration-300 ease-in-out"
                    onClick={(e) => {
                      e.preventDefault();
                      updatePrompt(generateMusicPrompt());
                    }}
                  >
                    <div className="flex">
                      <RefreshCw className="w-4 h-4 mr-2 " />{" "}
                    </div>
                  </button>
                  <Input
                    id="name"
                    value={prompt}
                    onChange={(e) => updatePrompt(e.target.value)}
                    placeholder="Description of your music track. For Example: Classic Rock, Drum Kit, Electric Guitar, Bass, Raw, Uplifting, Anthem"
                  />
                </div>
                <div className="flex">
                  <div className="flex flex-col flex-grow space-y-1.5 mr-10">
                    <Label htmlFor="name">Track Length (in seconds)</Label>
                    <Input
                      id="name"
                      value={trackLength}
                      onChange={(e) =>
                        updateTrackLength(Number(e.target.value))
                      }
                      placeholder="Track length in seconds. For Example: 5"
                    />
                  </div>
                  <div className="flex flex-col flex-grow space-y-1.5">
                    <Label htmlFor="name">top_k (integer)</Label>
                    <Input
                      id="name"
                      value={topK}
                      onChange={(e) => updateTopK(Number(e.target.value))}
                      placeholder="Reduces sampling to the k most likely tokens."
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col flex-grow space-y-1.5 mr-10">
                    <Label htmlFor="name">top_p (number)</Label>
                    <Input
                      id="name"
                      value={topP}
                      onChange={(e) => updateTopP(Number(e.target.value))}
                      placeholder="Reduces sampling to tokens with cumulative probability of p. When set to `0` (default), top_k sampling is used."
                    />
                  </div>
                  <div className="flex flex-col flex-grow space-y-1.5">
                    <Label htmlFor="name">Temperature (number)</Label>
                    <Input
                      id="name"
                      value={temp}
                      onChange={(e) => updateTemp(Number(e.target.value))}
                      placeholder="Controls the 'conservativeness' of the sampling process. Higher temperature means more diversity."
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex flex-col space-y-1.5 w-[200px]">
              <Label htmlFor="framework">Select Model</Label>
              <Select
                onValueChange={(e) => updateSelectedModel(e)}
                defaultValue={selectedModel}
              >
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="stereo-large">Stereo Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          height="335"
        />
      </div>
      <TrackHistorySlim
        tracks={tracks}
        loading={loading}
        playTrack={playTrack}
        deleteTrack={deleteTrack}
        saveTrack={saveTrack}
        height={200}
      />
    </div>
  );
};

export default ReplicatePage;
