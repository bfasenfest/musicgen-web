from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch import autocast
from transformers import pipeline
from io import BytesIO
import base64
import scipy

import os
os.environ["CUDA_LAUNCH_BLOCKING"] = "1"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda"
synthesiser = pipeline("text-to-audio", "facebook/musicgen-small", device=device)
@app.get("/")

def generate(prompt: str, length: int = 5):
    print("Prompt: " + prompt)
    print("Length: " + str(length))
    music = synthesiser(prompt, forward_params={"do_sample": True, "max_new_tokens": length * 50})
    print("finishing generating")
    scipy.io.wavfile.write("musicgen_out.wav", rate=music["sampling_rate"], data=music["audio"])

    return Response(content=base64.b64encode(open("musicgen_out.wav", "rb").read()), media_type="audio/wav")

# {"audio": base64.b64encode(open("musicgen_out.wav", "rb").read())}