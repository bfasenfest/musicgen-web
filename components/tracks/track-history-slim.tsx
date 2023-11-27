"use client";

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

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

import { ArrowDownToLine, Trash, Play } from "lucide-react";

import { useUser } from "@supabase/auth-helpers-react";

import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

type Track = {
  prompt: string;
  audio: string;
};

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

const TrackHistorySlim = ({
  loading,
  tracks,
  playTrack,
  deleteTrack,
  saveTrack,
  height = 400,
}) => {
  const user = useUser();
  if (!tracks) {
    tracks = [];
  }

  tracks.forEach((element) => {
    if (!element.url) {
      element.url = CDNURL + user!.id + "/" + element.name;
    }
    if (!element.title) {
      element.title = element.name.split("-")[0];
    }

    // if element.metadata is a string (not an object), parse it
    if (typeof element.metadata === "string") {
      element.metadata = JSON.parse(element.metadata);
    }
    if (element.metadata && !element.metadata.duration) {
      element.metadata.duration = Math.round(
        element.metadata.contentLength / 127237
      );
    }

    if (element.metadata === null) {
      element.metadata = {
        duration: 5,
      };
    }
  });

  const getTrackTime = (date: string) => {
    const futureDate = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.abs(
      (futureDate.getTime() - now.getTime()) / 1000
    );
    let timeLeft = diffInSeconds;

    const days = Math.floor(timeLeft / 86400);
    timeLeft %= 86400;

    const hours = Math.floor(timeLeft / 3600) % 24;
    timeLeft %= 3600;

    const minutes = Math.floor(timeLeft / 60) % 60;
    timeLeft %= 60;

    const seconds = Math.floor(timeLeft % 60);

    let result = "";
    if (days > 0) result = days === 1 ? `${days} day` : `${days} days`;
    else if (hours > 0)
      result = hours === 1 ? `${hours} hour` : `${hours} hours`;
    else if (minutes > 0)
      result = minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
    else result = seconds === 1 ? `${seconds} second` : `${seconds} seconds`;

    return result;
  };

  const formatTrackLength = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div
      className="flex justify-center flex-grow "
      style={{ height: "calc(100vh - 800px)" }}
    >
      <div
        className={`flex flex-col items-start justify-left   outline-slate-400 outline outline-1 p-2 shadow-2xl rounded-lg w-5/6  mt-4 overflow-auto scrollbar-hide`}
      >
        {loading ? (
          <div className="flex items-center justify-center drop-shadow-md w-full">
            <Skeleton className="h-[50px] w-full m-2 " />
          </div>
        ) : null}

        {tracks.map((track) => (
          <div className=" w-full 3xl:w-[48%] m-2" key={track.url}>
            <div className="flex items-center justify-between border-b mr-4 ">
              <div className="flex items-center">
                <Button
                  className="m-4"
                  onClick={(e) => playTrack(track.url)}
                  size="icon"
                  variant="ghost"
                >
                  <Play />
                </Button>
                <div>
                  <div className="text-sm font-bold text-gray-800  block md:hidden">
                    {track.title.length > 30
                      ? `${track.title.substring(0, 30)}...`
                      : track.title}
                  </div>
                  <div className="text-sm font-bold text-gray-800  hidden md:block lg:hidden">
                    {track.title.length > 60
                      ? `${track.title.substring(0, 60)}...`
                      : track.title}
                  </div>
                  <div className="text-sm font-bold text-gray-800 hidden lg:block">
                    {track.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatTrackLength(track.metadata.duration)} /{" "}
                    {getTrackTime(track.created_at)} ago
                  </div>
                </div>
              </div>
              <div className="text-gray-500 text-xs hidden md:block">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="m-2" size="icon" variant="destructive">
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this track from your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => deleteTrack(track.url)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className=" m-2"
                  onClick={(e) => saveTrack(track)}
                  size="icon"
                  variant="ghost"
                >
                  <ArrowDownToLine />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackHistorySlim;
