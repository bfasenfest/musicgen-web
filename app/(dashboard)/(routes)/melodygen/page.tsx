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

import { ArrowDownToLine, Trash, Play } from "lucide-react";

import { useVisualizer, models } from "react-audio-viz";

import { useEffect, useState, useRef, useCallback } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { AudioRecorder } from "react-audio-voice-recorder";

import { useTrackStore } from "@/lib/store";

import { useDropzone } from "react-dropzone";

// import { promises as fs } from "fs";

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

const MelodyGenPage = () => {
  const { tracks, setTracks } = useTrackStore();
  const [prompt, updatePrompt] = useState();
  const [error, setError] = useState<string>();
  const [prediction, setPrediction] = useState();
  const [queue, setQueue] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [trackLength, updateTrackLength] = useState<number>();
  const [selectedModel, updateSelectedModel] = useState("melody-large");
  const [loading, updateLoading] = useState(false);
  const [trackPlaying, updateTrackPlaying] = useState(false);
  const [recording, setRecording] = useState("");

  const audioRef = useRef(null);
  const recordingRef = useRef(null);

  const [AudioViz, init] = useVisualizer(audioRef);

  const user = useUser();
  const supabase = useSupabaseClient();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        file.data = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setRecording(url);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const blobUrlToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return await blobToBase64(blob);
  };

  const getTracks = async () => {
    if (!tracks) updateLoading(true);

    try {
      const { data: tracks } = await supabase
        .from("replicate-tracks")
        .select()
        .order("created_at", { ascending: false })
        .eq("id", user.id)
        .eq("type", "melody");

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
    updateLoading(true);
    setQueue((oldQueue) => [...oldQueue, prompt]);
    length = Math.round(trackLength) || 5;
    let audio = "";

    if (recording) {
      audio = await blobUrlToBase64(recording);
    } else {
      audio = acceptedFiles[0].data;
    }
    console.log(acceptedFiles[0].data);

    if (!audio) {
      alert("Please provide an audio file");
      return;
    }
    console.log(audio);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: length,
        model_version: selectedModel,
        input_audio: audio,
      }),
    });
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
      type: "melody",
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
    <div className="dark">
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
                <div className="flex ">
                  <div>
                    <AudioRecorder
                      onRecordingComplete={addAudioElement}
                      audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: true,
                        autoGainControl: true,
                      }}
                      onNotAllowedOrFound={(err) => console.table(err)}
                      downloadOnSavePress={false}
                      downloadFileExtension="webm"
                      mediaRecorderOptions={{
                        audioBitsPerSecond: 128000,
                      }}
                      showVisualizer={true}
                    />
                  </div>
                  {recording ? (
                    <div className="flex w-full">
                      <audio
                        className="w-3/6 h-10 ml-10"
                        controls={true}
                        ref={recordingRef}
                        crossOrigin="anonymous"
                        src={recording}
                      />
                      <Button
                        className="ml-10"
                        variant="destructive"
                        onClick={(e) => setRecording("")}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ) : null}
                </div>
                <section className="container outline-dashed hover:outline-blue-500 p-5 m-2 mt-3 w-5/6 cursor-pointer">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>
                      Drag and drop some files here, or click to select files
                    </p>
                  </div>
                  <aside>
                    {files.length > 0 ? (
                      <div>
                        <h4 className="font-bold mt-4">Files</h4>
                        <ul>{files}</ul>
                      </div>
                    ) : null}
                  </aside>
                </section>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Select Model</Label>
                  <Select
                    onValueChange={(e) => updateSelectedModel(e.value)}
                    defaultValue={selectedModel}
                  >
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="melody-large">Melody Large</SelectItem>
                      <SelectItem value="stereo-melody-large">
                        Stereo Melody Large
                      </SelectItem>
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
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2top">
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

      <div className="flex flex-wrap items-center justify-center mt-4 drop-shadow-md">
        {loading ? (
          <div className="flex items-center justify-center drop-shadow-md">
            <Skeleton className="h-[150px] w-[300px] m-2 " />
          </div>
        ) : null}
        {tracks.map((track) => (
          <Card className="h-[150px] w-[300px] m-2 relative" key={track.url}>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-md">{track.title}</CardTitle>
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
                  className=" m-4"
                  onClick={(e) => playTrack(track.url)}
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
    </div>
  );
};

export default MelodyGenPage;