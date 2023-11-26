"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@/utils/supabase";
import { useEffect, useState } from "react";

type Track = {
  prompt: string;
  audio: string;
};

const CDNURL =
  "https://qdciohgpchihhkgxlygz.supabase.co/storage/v1/object/public/tracks/";

const UserTrackHistory = ({
  loading,
  tracks,
  playTrack,
  deleteTrack,
  saveTrack,
}) => {
  const user = useUser();
  console.log("Tracks: ", tracks);
  if (!tracks) {
    tracks = [];
  }

  return (
    <div className="flex flex-wrap items-center justify-center mt-4 drop-shadow-md">
      {loading ? (
        <div className="flex items-center justify-center drop-shadow-md">
          <Skeleton className="h-[150px] w-[300px] m-2 " />{" "}
        </div>
      ) : null}
      {tracks.map((track) => (
        <Card
          className="h-[150px] w-[300px] m-2 relative"
          key={CDNURL + user!.id + "/" + track.name}
        >
          <CardHeader className="flex justify-between">
            <CardTitle className="text-md">
              {track.title || track.name.split("-")[0]}
            </CardTitle>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="  m-4" size="icon" variant="destructive">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
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
                className=" m-4"
                onClick={(e) => playTrack(CDNURL + user!.id + "/" + track.name)}
                size="icon"
                variant="outline"
              >
                <Play />
              </Button>
              <Button
                className=" m-4"
                onClick={(e) => saveTrack(track)}
                size="icon"
                variant="outline"
              >
                <ArrowDownToLine />
              </Button>
            </div>
          </CardHeader>

          {/* <div className="flex justify-center">
        <audio
          className="w-5/6 h-10 mb-5 mt-4"
          controls
          key={CDNURL + user.id + "/" + track.name}
        >
          <source src={CDNURL + user.id + "/" + track.name} />
          Your browser does not support the audio element.
        </audio>
      </div> */}
        </Card>
      ))}
    </div>
  );
};

export default UserTrackHistory;
