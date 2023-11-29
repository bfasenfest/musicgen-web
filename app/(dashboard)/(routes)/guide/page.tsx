"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const GuidePage = () => {
  const controls = useAnimation();

  const accordionItems = [
    {
      name: "Write Detailed Prompts",
      description:
        "When crafting your request, it's beneficial to include as much detail as possible. Consider mentioning specific genres, evocative descriptions, types of instruments, and the emotional tone you desire. For instance, a well-detailed prompt might be: Imagine a dreamy, ethereal soundscape for a fantasy setting. Think of incorporating harp and flute melodies, gentle chimes, and soft, echoing vocals. Add layers of ambient synthesizer sounds to create a mystical, otherworldly vibe, perfect for a scene of enchantment or a magical journey through an enchanted forest. The mood should be serene, captivating, and filled with wonder. ",
    },
    {
      name: "Define a style",
      description: `When specifying the mood you're aiming for, it's effective to mix musical terms with emotional descriptors.For instance, you might use musical terms like "melodic" or "upbeat" alongside emotional words like "nostalgic" or "joyful." This combination of musical and emotional vocabulary can enrich your description. Don't hesitate to experiment. Try combining terms like "haunting" or "ethereal" for a sound that's mysterious and otherworldly, or "frenetic" and "exhilarating" for music that's fast-paced and thrilling. Each combination of musical and emotional terms you use guides the AI in a unique way, not only in the technical construction of the music but also in creating the emotional narrative you wish to convey.`,
    },
    {
      name: "Selecting Instruments",
      description:
        "Incorporating descriptive adjectives with instrument names can greatly enhance the clarity and effectiveness of your selection.For instance, you might consider options like a 'Whispering Flute', 'Thunderous Drums', or 'Ethereal Synthesizer'. This method of pairing adjectives with instruments can provide a more vivid and specific idea of the desired sound. Additionally, think about the context in which these instruments will be used; for example, a 'Crystalline Piano' might be ideal for evoking a serene, delicate atmosphere, while a 'Roaring Saxophone' could be perfect for a lively, energetic setting. ",
    },

    {
      name: "Set the Tempo",
      description:
        "Determining the beats per minute (BPM) is crucial for maintaining the desired tempo and rhythm consistency in your output. It's important to select a BPM that aligns with the genre you're focusing on. For example, when creating a Jazz piece, you might opt for a relaxed 120 BPM to capture its smooth, laid-back essence. Alternatively, for an upbeat Pop track, a faster tempo around 140 BPM could be ideal to convey its energetic and catchy nature. Remember, the BPM not only sets the pace but also helps in shaping the overall feel and character of the music, making it an integral part of the creative process. Consider experimenting with different BPM ranges to see how they influence the mood and style of your composition.",
    },
    {
      name: "Melody To Song",
      description: `
          In addition to your detailed prompts, in the <strong>Melody to Song</strong> tab you have the option to provide a reference audio clip. You can do this either by pressing the mic to record a short clip with your microphone and press the "save" icon to lock it in or upload a short existing clip with the file dropbox. This allows the AI to extract a broad melody from your chosen audio, which it will then attempt to incorporate into your composition. Here's how to make the most of this feature:
            <br> </br>
          <ul>
            <li><strong>Select Your Reference Audio:</strong> Choose an audio clip that best represents the melody or musical theme you want to include in your composition. This could be a snippet from a song, an instrumental piece, or any audio that captures the essence of the melody you have in mind.</li>
            <li><strong>Optimal Length:</strong> For the AI to effectively extract and interpret the melody, we recommend that your reference audio be approximately 30 seconds long. This duration is ideal for the AI to capture the essence of the melody without being overwhelmed by too much information.</li>
            <li><strong>Melody Extraction:</strong> Upon uploading your audio clip, the AI will analyze and extract the key melodic elements. This process is sophisticated enough to isolate the melody from other musical components in the clip.
            </li>
            <li><strong>Combining Melody and Description:</strong> After the melody is extracted, the AI will use it in conjunction with the descriptive prompt you provide. This dual input approach allows the AI to generate music that not only follows your descriptive guidance but also incorporates elements of your chosen melody.</li>

          </ul>
        `,
    },
    {
      name: "Using Advanced Settings",
      description: `In the <strong>Replicate Playground</strong> tab you have access to a variety of advanced settings that allow you to fine-tune your composition. These settings – top_k, top_p, and temperature – play crucial roles in how the AI selects and generates musical elements. Let's delve deeper into each of these settings:
          <br> </br>
          <strong>Top_k</strong> (Default: 250):
          <hr></hr>
          
          Function: The top_k setting limits the AI's choice to the 'k' most likely tokens or musical elements it predicts next in the sequence.
          <br>
        Impact: A lower top_k value makes the AI's choices more predictable and consistent, focusing on the most likely musical elements. A higher value, like the default 250, allows for a wider variety of choices, offering more diversity in the generated music.
        <br></br>

          <hr></hr>
          <strong>Top_p</strong> (Default: 0):

Function: This setting uses a method called 'nucleus sampling,' where the AI only considers tokens that cumulatively make up a probability 'p'.           <br>

Impact: When set to a value above 0, top_p allows for a dynamic range of token selections based on their cumulative probability, potentially leading to more varied and unexpected musical choices. When set to 0, it defaults to top_k sampling.
<br></br><hr></hr>
<strong>Temperature</strong> (Default: 1):

Function: This setting controls the 'conservativeness' of the AI's token selection. It adjusts the probability distribution used for sampling.           <br>

Impact: A lower temperature (below 1) results in more conservative, predictable selections. A higher temperature increases diversity and the likelihood of unconventional choices.
          
          `,
    },
    {
      name: "Choose a Model",
      description:
        "In the <strong>Replicate Playground</strong> and <strong>Melody to Song</strong> tabs, you have the option to choose from a stereo or a normal model. The stereo model is a fine-tuned version of the normal model that has been trained to generate stereo audio. This means that the stereo model is capable of producing music with a wider, more immersive soundstage. However, this may come at the cost of lower audio variation. The normal model, on the other hand, produces music with a higher variation but a narrower soundstage. We recommend using the stereo model for a more immersive listening experience, especially when using headphones. ",
    },
  ];
  return (
    <div className="px-10 py-5 ">
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-2xl">
            User Guide
          </CardTitle>
          <CardDescription className="text-center text-md md:text-lg">
            Here are some tips for using the models!{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {accordionItems.map((item, i) => (
              <AccordionItem value={`item-${i}`} key={item.name}>
                <AccordionTrigger className="text-xl">
                  {item.name}
                </AccordionTrigger>
                <AccordionContent className="text-lg">
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidePage;
