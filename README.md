# MusicGen Web UI

This is a SaaS web app and basic backend server for generating tracks using MusicGen and Replicate's MusicGen API. It is currently being hosted at [MusicGen.xyz](https://www.musicgen.xyz/).

## Main App Architecture

The app is built using Next.js for the frontend, and Supabase for backend auth, database, and object storage. All files generated with text to song are made with the self-hosted backend server and then uploaded to each user's supabase storage, while text to melody and replicate playground generations are stored in a supabase table.

## Server

For cost efficiency, the MusicGen small model is being run on a Vast.AI server using gunicorn to manage a single uvicorn worker for FastAPI. ngrok is used to create a static ip for use in the main app.

You can view the server components as well as a Docker file for easy setup at `/server` as well as the basic FastAPI app at `/server/app`

## Roadmap

- [x] Visualize api limit in the app interface
- [x] Implement Stripe and a "pro" account to bypass api limit
- [x] Add account pages / stripe billing portal
- [ ] Add user guide
- [ ] Move from vast
