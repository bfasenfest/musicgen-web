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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Skeleton } from "@/components/ui/skeleton";

import { ArrowDownToLine, Trash } from "lucide-react";

import axios from "axios";

import { useEffect, useState } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { v4 as uuidv4 } from "uuid";

import { decode } from "base64-arraybuffer";

import { useTrackStore } from "@/lib/store";

type Track = {
  prompt: string;
  audio: string;
};

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

const MusicGenPage = () => {
  // const [tracks, setTracks] = useState<string[]>([]);
  const { tracks, setTracks } = useTrackStore();
  const [prompt, updatePrompt] = useState();
  const [trackLength, updateTrackLength] = useState<number>();
  const [loading, updateLoading] = useState(false);

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
    if (user) {
      getTracks();
    }
  }, [user]);

  const generateTrack = async (prompt: string) => {
    updateLoading(true);
    length = Math.round(trackLength * 50) || 5;
    const track = await axios.get(
      `http://127.0.0.1:8000/?prompt=${prompt}&length=${length}`
    );
    const { data, error } = await supabase.storage
      .from("tracks")
      .upload(
        user?.id + "/" + `${prompt}-${uuidv4()}.wav`,
        decode(track.data),
        {
          contentType: "audio/wav",
        }
      );

    if (error) {
      alert(error);
    } else {
      getTracks();
    }

    updateLoading(false);
  };

  const deleteTrack = async (trackName: String) => {
    const { error } = await supabase.storage
      .from("tracks")
      .remove([user?.id + "/" + trackName]);

    if (error) {
      alert(error);
    } else {
      getTracks();
    }
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
      {tracks.map((track) => (
        <div className="flex items-center justify-center mt-4 drop-shadow-md ">
          <Card className="w-5/6  relative">
            <CardHeader className="flex justify-between">
              <CardTitle className="w-4/6">
                {track.name.split("-")[0]}
              </CardTitle>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="absolute top- right-0 m-4"
                    size="icon"
                    variant="destructive"
                  >
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent classnName="relative">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this track from your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => deleteTrack(track.name)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                className="absolute top- right-12 m-4"
                onClick={(e) => saveTrack(track)}
                size="icon"
                variant="outline"
              >
                <ArrowDownToLine />
              </Button>
            </CardHeader>
            <div className="flex justify-center">
              <audio
                className="w-5/6 h-10 mb-5 mt-4"
                controls
                key={CDNURL + user.id + "/" + track.name}
              >
                <source src={CDNURL + user.id + "/" + track.name} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default MusicGenPage;
