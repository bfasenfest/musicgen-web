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

const generateTrackCard = () => {
  return (
    <div className="flex items-center justify-left">
      <Card className="w-3/6 ml-5 ">
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
          <Button onClick={(e) => generateTrack(prompt || "")}>Generate</Button>
        </CardFooter>
      </Card>

      <Card className="w-2/6 ml-5 "></Card>
    </div>
  );
};

export default generateTrackCard;
