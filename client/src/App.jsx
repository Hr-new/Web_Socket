import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    // When client connected with server first this event trigger
    socket.on("connect", () => {
      console.log(`Conncetion done with Socket id ${socket.id}`);
    });

    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });


    return () => {
      socket.off("message");
    };
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("message", {inputMessage,room});
      setInputMessage("");
      setRoom("")
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const joinRoomHandler = () => {
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <div className="App">
      <h1>Simple Chat App</h1>

        <h5>Join Room</h5>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter Room Name"
        />
        <button type="submit" color="primary" onClick={joinRoomHandler}>
          Join
        </button>
      <br />
      <br />
      <br />
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={handleKeyDown}
      />
        <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Type Room Name"
        onKeyDown={handleKeyDown}
      />

      <button onClick={sendMessage}>Send</button>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
