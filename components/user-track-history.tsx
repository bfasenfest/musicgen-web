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

import { ArrowDownToLine } from "lucide-react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@/utils/supabase";
import { useEffect, useState } from "react";

type Track = {
  prompt: string;
  audio: string;
};

const UserTrackHistory = () => {
  //   const [tracks, setTracks] = useState<string[]>([]);
  //   const user = useUser();
  //   const supabase = useSupabaseClient();
  //   const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     const getTracks = async () => {
  //       try {
  //         const { data: tracks } = await supabase.storage
  //           .from("tracks")
  //           .list(user?.id + "/", {
  //             limit: 30,
  //             offset: 0,
  //             sortBy: {
  //               column: "created_at",
  //               order: "desc",
  //             },
  //           });
  //         if (tracks !== null) {
  //           setTracks(tracks);
  //         }
  //       } catch (e) {
  //         alert(e);
  //       } finally {
  //       }
  //     };
  //     getTracks();
  //   }, []);
  //   const saveTrack = (track: Track) => {
  //     const url = `data:audio/wav;base64, ${track.audio}`;
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${track.prompt}.wav`;
  //     link.click();
  //   };
  //   return (
  //     <div>
  //       {tracks &&
  //         tracks.map((track) => (
  //           <div className="flex items-center justify-center mt-4 drop-shadow-md ">
  //             <Card className="w-5/6">
  //               <CardHeader className="flex justify-between">
  //                 <CardTitle className="w-4/6">{track.prompt}</CardTitle>
  //                 <Button
  //                   onClick={(e) => saveTrack(track)}
  //                   size="icon"
  //                   variant="outline"
  //                 >
  //                   <ArrowDownToLine />
  //                 </Button>
  //               </CardHeader>
  //               <audio controls key={track.audio} className="w-full h-10">
  //                 <source
  //                   src={`data:audio/wav;base64, ${track.audio}`}
  //                   type="audio/wav"
  //                 />
  //                 Your browser does not support the audio element.
  //               </audio>
  //             </Card>
  //           </div>
  //         ))}
  //     </div>
  //   );
};

export default UserTrackHistory;
