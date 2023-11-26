from fastapi import APIRouter
from fastapi.responses import JSONResponse
from celery.result import AsyncResult
from musicgen import generate
from fastapi import File, UploadFile
from transformers import pipeline


device = "cuda"
synthesiser = pipeline("text-to-audio", "facebook/musicgen-small", device=device)

router = APIRouter()

@router.get('/')
def touch():
    return 'MusicGen API'

# @router.post('/generate', status_code=202)
# async def generate_track(prompt: str, length: int = 256, synthesiser):
#     task_id = generate.delay(prompt, length, synthesiser)
#     return {'task_id': str(task_id), 'status': 'Processing'}

@router.get('/generate', status_code=200)
async def generate_track(prompt: str, length: int = 256, synthesiser):
    task_id = generate.delay(prompt, length, synthesiser)
    task = AsyncResult(task_id)
    if not task.ready():
        return JSONResponse(status_code=202, content={'task_id': str(task_id), 'status': 'Processing'})
    result = task.get()
    return {'task_id': task_id, 'status': str(result)}