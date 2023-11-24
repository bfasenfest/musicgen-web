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

import { Skeleton } from "@/components/ui/skeleton";

import { ArrowDownToLine } from "lucide-react";

import axios from "axios";

import { useState } from "react";

type Track = {
  prompt: string;
  audio: string;
};

const MusicGenPage = () => {
  const [track, updateTrack] = useState<Track>({ prompt: "", audio: "" });
  const [trackArray, updateTrackArray] = useState<string[]>([]);
  const [prompt, updatePrompt] = useState();
  const [trackLength, updateTrackLength] = useState<number>();
  const [loading, updateLoading] = useState(false);

  const generateTrack = async (prompt: string) => {
    updateLoading(true);
    length = Math.round(trackLength * 50) || 5;
    const track = await axios.get(
      `http://127.0.0.1:8000/?prompt=${prompt}&length=${length}`
    );
    let newTrack = { prompt: prompt, audio: track.data };
    updateTrack(newTrack);
    updateLoading(false);

    updateTrackArray([newTrack, ...trackArray]);
  };

  const saveTrack = (track: Track) => {
    const url = `data:audio/wav;base64, ${track.audio}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${track.prompt}.wav`;
    link.click();
  };

  return (
    <div className="dark">
      <div className="flex items-center justify-center">
        <Card className="w-5/6 ">
          <CardHeader>
            <CardTitle>Generate New Track</CardTitle>
            <CardDescription>
              Generate track using the latest music-gen models
            </CardDescription>
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
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={(e) => generateTrack(prompt || "")}>
              Generate
            </Button>
          </CardFooter>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-4 drop-shadow-md">
          <Skeleton className="w-5/6 h-[40px] rounded-full" />{" "}
        </div>
      ) : null}
      {trackArray.map((track) => (
        <div className="flex items-center justify-center mt-4 drop-shadow-md ">
          <Card className="w-5/6">
            <CardHeader className="flex justify-between">
              <CardTitle className="w-4/6">{track.prompt}</CardTitle>
              <Button
                onClick={(e) => saveTrack(track)}
                size="icon"
                variant="outline"
              >
                <ArrowDownToLine />
              </Button>
            </CardHeader>
            <audio controls key={track.audio} className="w-full h-10">
              <source
                src={`data:audio/wav;base64, ${track.audio}`}
                type="audio/wav"
              />
              Your browser does not support the audio element.
            </audio>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default MusicGenPage;
