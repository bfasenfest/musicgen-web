import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }
  let input = {
    top_k: 250,
    top_p: 0,
    prompt: req.body.prompt,
    duration: req.body.duration,
    temperature: 1,
    continuation: false,
    model_version: req.body.model_version,
    output_format: "wav",
    continuation_start: 0,
    multi_band_diffusion: false,
    normalization_strategy: "peak",
    classifier_free_guidance: 3,
  };

  if (req.body.input_audio) {
    input.input_audio = req.body.input_audio;
  }

  const prediction = await replicate.predictions.create({
    version: "7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7",
    input,
    // This is the text prompt that will be submitted by a form on the frontend
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
