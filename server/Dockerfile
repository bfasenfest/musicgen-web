FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

FROM alpine as ngrok

RUN apk add --no-cache --virtual .bootstrap-deps ca-certificates && \
    wget -O /tmp/ngrok.zip https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip && \
    unzip -o /tmp/ngrok.zip -d / && \
    apk del .bootstrap-deps && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*

RUN ngrok config add-authtoken $AUTH_TOKEN

RUN ngrok http 8000

RUN gunicorn api:app 0.0.0.0:8000 --workers=1 --worker-class uvicorn.workers.UvicornWorker
