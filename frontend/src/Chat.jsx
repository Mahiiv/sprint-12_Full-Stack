import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// timer for knowing when i stopped typing (outside the component so it doesn't reset)
var typingTimer;

function Chat() {
  // socket = my phone line to the server
  const [socket, setSocket] = useState(null);
  // what i'm typing right now
  const [text, setText] = useState("");
  // all the messages on screen
  const [messages, setMessages] = useState([]);
  // nameInput = what's in the name box, name = the name after i click join
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");
  // name of the other person who is typing right now
  const [typingUser, setTypingUser] = useState("");

  useEffect(
    function () {
      // no name yet means don't connect
      if (name === "") {
        return;
      }

     const newSocket = io(import.meta.env.VITE_SOCKET_URL);
      setSocket(newSocket);

      // server now sends an object with name and text
      newSocket.on("receive_message", function (data) {
        setMessages(function (old) {
          return old.concat(data);
        });
      });

      // someone else is typing
      newSocket.on("user_typing", function (typerName) {
        setTypingUser(typerName);
      });

      // they stopped
      newSocket.on("user_stop_typing", function () {
        setTypingUser("");
      });

      // cleanup, hang up the phone so react doesn't connect twice
      return function () {
        newSocket.disconnect();
      };
    },
    [name]
  );

  function joinChat() {
    if (nameInput === "") {
      return;
    }
    setName(nameInput);
  }

  function sendMessage() {
    if (text === "") {
      return;
    }
    // sending name and text together
    socket.emit("send_message", { name: name, text: text });
    setText("");
    socket.emit("stop_typing");
  }

  // step 1 of the page, ask for the name first
  if (name === "") {
    return (
      <div id="chat-page">
        <h1>Join the Chat</h1>
        <input
          id="name-input"
          type="text"
          value={nameInput}
          placeholder="your name..."
          onChange={function (e) {
            setNameInput(e.target.value);
          }}
        />
        <button id="join-button" onClick={joinChat}>
          Join
        </button>
      </div>
    );
  }

  // step 2, the actual chat
  return (
    <div id="chat-page">
      <h1>Chat Room</h1>

      <div id="chat-box">
        {messages.map(function (m, index) {
          return (
            <p key={index}>
              [{m.name}]: {m.text}
            </p>
          );
        })}
      </div>

      {typingUser !== "" && <p id="typing-text">{typingUser} is typing...</p>}

      <input
        id="chat-input"
        type="text"
        value={text}
        placeholder="type a message..."
        onChange={function (e) {
          setText(e.target.value);

          // telling the server i'm typing
          socket.emit("typing", name);

          // if i don't type for 1 second, tell the server i stopped
          clearTimeout(typingTimer);
          typingTimer = setTimeout(function () {
            socket.emit("stop_typing");
          }, 1000);
        }}
      />
      <button id="chat-send" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default Chat;