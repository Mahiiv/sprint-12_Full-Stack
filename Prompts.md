# Prompts.md - Sprint 12 (Socket.io Chat Room)

I used Claude (AI) to help with this sprint. Below is how I used it and what I asked.

## My strategy

1. I first asked for the sprint brief to be explained in simple words, before any code
2. I did one phase at a time (Phase 1, then Phase 2), not everything at once
3. I tested after every step, and when something broke I sent the exact error from the console or terminal
4. I kept the code beginner style (var, function(), simple comments) so I can understand it
5. I decided myself to skip the optional Phase 3

## Prompts

### 1. Understanding the sprint
- Prompt: pasted the Sprint 12 brief and said "this is the sprint 12"
- Prompt: "which track is recommended?"
- Result: I picked Track B (Socket.io) because I already had the Express server and the React app

### 2. Phase 1 - Socket.io setup
- Prompt: asked which folder and file my server is in, and sent my package.json
- Prompt: sent the top lines, the CORS line and the listen lines of server.js
- Result: installed socket.io, wrapped Express in an http server, added the connection log and the send/receive message events
- Prompt: asked how to add the chat page and route in React
- Result: made Chat.jsx with socket.io-client and added the /chat route in App.jsx

### 3. Phase 2 - Names and typing indicator
- Prompt: asked for a name box before joining and messages shown as [Name]: text
- Prompt: asked for the typing indicator (server uses broadcast so the person typing does not see it)
- Result: messages now send an object with name and text, and the typing and stop_typing events work

### 4. Fixing bugs (I sent the exact error each time)
- Blank page, "newSocket is not defined": my typing code was outside useEffect. I replaced the whole Chat.jsx with the correct version
- Typing indicator not showing: I pasted my server.js and found the typing code was inside send_message
- CORS error on localhost:5176: old Vite servers were still running, I closed them and used port 5173
- "uri must be a string" error: I ran node from the wrong folder so .env was not found

### 5. Deployment
- Prompt: asked how to deploy without Git installed
- Result: uploaded files from the GitHub website, with a frontend folder inside the same repo
- Prompt: sent the 401 error on Vercel, which was the missing movie API key (VITE_TMDB_KEY)
- Prompt: sent the CORS error on the live site
- Result: I had put CLIENT_URL in Secret Files on Render, and moved it to Environment Variables

## What I learned

- A WebSocket keeps one connection open, so the server can send data without the browser asking
- io.emit sends to everyone, socket.broadcast.emit sends to everyone except the sender
- Socket.io has its own CORS setting, separate from Express
- Environment variables must be set again on Render and Vercel because .env is not uploaded
