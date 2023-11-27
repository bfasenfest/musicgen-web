"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { headers } from "next/headers";

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

import { useVisualizer, models } from "react-audio-viz";

import { useEffect, useState, useRef, useCallback } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useTrackStore } from "@/lib/store";

import UserTrackHistory from "@/components/tracks/user-track-history";

import TrackHistorySlim from "@/components/tracks/track-history-slim";

import { NextResponse } from "next/server";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ReplicatePage = () => {
  //force dynamic rendering to bypass POST 405 bug
  const headersList = headers();

  const { tracks, setTracks } = useTrackStore();
  const [prompt, updatePrompt] = useState(
    "Classic Rock, Drum Kit, Electric Guitar, Bass, Raw, Uplifting, Anthem"
  );
  const [error, setError] = useState<string>();
  const [prediction, setPrediction] = useState();
  const [queue, setQueue] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState();

  const [trackLength, updateTrackLength] = useState<number>(5);
  const [selectedModel, updateSelectedModel] = useState("large");
  const [topK, updateTopK] = useState<number>(250);
  const [topP, updateTopP] = useState<number>(0);
  const [temp, updateTemp] = useState<number>(1);

  const [loading, updateLoading] = useState(false);
  const [trackPlaying, updateTrackPlaying] = useState(false);

  const audioRef = useRef(null);

  const [AudioViz, init] = useVisualizer(audioRef);

  const user = useUser();
  const supabase = useSupabaseClient();

  const getTracks = async () => {
    if (!tracks) updateLoading(true);

    try {
      const { data: tracks } = await supabase
        .from("replicate-tracks")
        .select()
        .order("created_at", { ascending: false })
        .eq("id", user.id)
        .eq("type", "basic");

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

    setQueue((oldQueue) => oldQueue.filter((item) => item !== prompt));

    if (error) {
      alert(error);
    } else {
      getTracks();
    }
    if (queue.length === 0) updateLoading(false);
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
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">top_k (integer)</Label>
                  <Input
                    id="name"
                    value={topK}
                    onChange={(e) => updateTopK(e.target.value)}
                    placeholder="Reduces sampling to the k most likely tokens."
                  />
                  <Label htmlFor="name">top_p (number)</Label>
                  <Input
                    id="name"
                    value={topP}
                    onChange={(e) => updateTopP(e.target.value)}
                    placeholder="Reduces sampling to tokens with cumulative probability of p. When set to `0` (default), top_k sampling is used."
                  />
                  <Label htmlFor="name">Temperature (number)</Label>
                  <Input
                    id="name"
                    value={temp}
                    onChange={(e) => updateTemp(e.target.value)}
                    placeholder="Controls the 'conservativeness' of the sampling process. Higher temperature means more diversity."
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
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
          <div className=" h-[400px] relative ">
            {!trackPlaying ? (
              <div className="absolute top-[180px] left-1/2 transform -translate-x-1/2 -translate-y-1/2top">
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
        height={200}
      />
    </div>
  );
};

export default ReplicatePage;
