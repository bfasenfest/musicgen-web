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

import { useTrackStore } from "@/lib/store";

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

import { useUser } from "@supabase/auth-helpers-react";

export default function DashboardPage() {
  const { tracks, setTracks } = useTrackStore();
  const user = useUser();

  const saveTrack = (track: { name: string }) => {
    if (user) {
      const url = CDNURL + user.id + "/" + track.name;
      const link = document.createElement("a");
      link.href = url;
      link.download = `${track.name}.wav`;
      link.click();
    }
  };

  return (
    <div className="mb-8 space-y-4 p-5">
      <Card className="w-full h-[200px]">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-2xl">
            Welcome to MusicGen!
          </CardTitle>
          <CardDescription className="text-center text-md md:text-lg">
            MusicGen is a web app that generates music using machine learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            Below are the tracks you have generated. You can download them by
            clicking the download button on the right. To the left you can
            access the various different models and settings.
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-center mt-4 drop-shadow-md ">
        {tracks.map((track) => (
          <Card className=" w-[300px] h-[150px] relative m-2" key={track.name}>
            <CardHeader className="flex justify-between">
              <CardTitle className="w-4/6 text-md">
                {track.name.split("-")[0]}
              </CardTitle>

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
                className="w-5/6 h-10 mb-5 absolute bottom-0"
                controls
                key={CDNURL + user!.id + "/" + track.name}
              >
                <source src={CDNURL + user!.id + "/" + track.name} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
