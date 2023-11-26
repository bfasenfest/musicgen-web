from transformers import pipeline
import torchaudio
from celery.utils.log import get_task_logger
import scipy

celery_log = get_task_logger(__name__)


def generate(prompt: str, length: int = 5, synthesiser):
    print("Prompt: " + prompt)
    print("Length: " + str(length))
    music = synthesiser(prompt, forward_params={"do_sample": True, "max_new_tokens": length*50})
    print("finishing generating")
    scipy.io.wavfile.write("musicgen_out.wav", rate=music["sampling_rate"], data=music["audio"])
    celery_log.info(f"Celery task completed!")

    return Response(content=base64.b64encode(open("musicgen_out.wav", "rb").read()), media_type="audio/wav"