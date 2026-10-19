# Sprint 12 - Real-Time Chat Room (Socket.io)

A live chat room built with Socket.io, Express and React. Messages show up instantly in every open browser window, and you can see when someone else is typing.

**Track:** Fullstack (Track B)

## Live Links

- Frontend (Vercel): https://sprint-12-full-stack.vercel.app/chat
- Backend (Render): https://sprint-12-full-stack.onrender.com
- GitHub: https://github.com/Mahiiv/sprint-12_Full-Stack

Note: the backend is on Render's free plan, so it sleeps when nobody uses it. The first time you open the chat it can take up to 50 seconds to wake up.

## What it does

### Phase 1 (done)
- Socket.io is added to the Node/Express server and logs a message when a client connects
- The React app connects to the server with socket.io-client
- You type a message, the server catches it and sends it back to everyone, so it shows up live on the screen

### Phase 2 (done)
- The page asks for your name before you can join the chat
- Messages show with the name, like `[Mohit]: hello`
- While you type, other people see "Mohit is typing..." and it goes away when you stop

## Tech used

- Node.js and Express (backend)
- Socket.io (server) and socket.io-client (React)
- React with Vite (frontend)
- MongoDB Atlas with Mongoose (from the earlier sprints, the posts API is still in the same server)
- Render (backend hosting) and Vercel (frontend hosting)

## Folder structure

```
sprint-12_Full-Stack
  server.js        the express + socket.io server
  models/          mongoose Post model
  package.json
  frontend/        the React app (Vite)
    src/Chat.jsx   the chat page
```

## How to run it on my computer

Backend (in the main folder):

1. Run `npm install`
2. Make a `.env` file with `MONGO_URI=your mongodb connection string`
3. Run `node server.js` (it runs on port 5000)

Frontend (in the `frontend` folder):

1. Run `npm install`
2. Make a `.env` file with `VITE_SOCKET_URL=http://localhost:5000`
3. Run `npm run dev` and open http://localhost:5173/chat

## Environment variables

Render (backend):
- `MONGO_URI` - my MongoDB Atlas connection string
- `CLIENT_URL` - the Vercel link, so the server allows the frontend (CORS)

Vercel (frontend):
- `VITE_SOCKET_URL` - the Render backend link
- `VITE_TMDB_KEY` - key for the movie pages from Sprint 8

## How to test it

1. Open the chat link in two browser tabs side by side
2. Join with two different names
3. Send a message from one tab, it shows in both
4. Type in one tab without sending, the other tab shows "is typing..."

## Problems I ran into

- CORS error: the server only allowed localhost, so I added a list of allowed addresses that also reads `CLIENT_URL`
- The typing events did nothing because I had put them inside the send message code by mistake
- Vite kept changing ports (5174, 5176) because old dev servers were still running
- On Render I first added `CLIENT_URL` under Secret Files instead of Environment Variables, so the server could not see it
