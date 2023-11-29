"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mb-8 space-y-4 p-5">
      <Card className="w-full shadow-xl ">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-2xl">
            About Us
          </CardTitle>
          <CardDescription className="text-center text-md md:text-lg">
            Learn about the team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            <Image
              alt="logo"
              src="/logo.png"
              width={270}
              height={120}
              className="rounded float-left mr-4"
            />
            <p>
              Welcome to{" "}
              <span className="text-cyan-600 font-bold">
                <span className="font-extrabold text-cyan-900">Music</span>
                Gen
              </span>
              , where our small yet vibrant team shares a profound passion for
              revolutionizing music creation through Artificial Intelligence. We
              are a group of innovators, musicians, engineers, and dreamers
              committed to pushing the boundaries of what's possible in AI music
              generation and development.
            </p>
            <br />
            <p>
              Our journey began with a simple yet powerful idea: to harness the
              incredible potential of AI in order to democratize music creation.
              We believe that everyone, regardless of their musical background,
              should have the opportunity to express themselves through music.
              This belief fuels our dedication to creating an AI platform that
              is not only advanced and sophisticated but also accessible and
              user-friendly.
            </p>
            <br />
            <p>
              Each member of our team brings a unique set of skills and
              experiences, united by a common love for music and technology.
              From seasoned software developers and AI specialists to talented
              composers and music producers, our diverse expertise allows us to
              approach AI music generation from both a technical and artistic
              perspective.
            </p>
            <br />
            <p>
              At the heart of our work is a commitment to continuous learning
              and innovation. We are constantly exploring new techniques,
              refining our algorithms, and staying abreast of the latest
              developments in the field of AI and music. This relentless pursuit
              of excellence ensures that our platform remains at the cutting
              edge, providing our users with a tool that is always evolving and
              improving.
            </p>
            <br />
            <p>
              Our vision extends beyond just creating an AI music tool. We aim
              to build a community of artists, creators, and enthusiasts who
              share our passion for AI and music. We believe in collaboration,
              sharing ideas, and learning from each other. This community-driven
              approach is what makes our platform not just a tool, but a
              creative ecosystem where inspiration and innovation flourish.
            </p>
            <br />
            <p>
              Thank you for visiting{" "}
              <span className="text-cyan-600 font-bold">
                <span className="font-extrabold text-cyan-900">Music</span>
                Gen
              </span>
              . We are thrilled to have you join us on this exciting journey of
              musical exploration and discovery. Let's create something amazing
              together!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
