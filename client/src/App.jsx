import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });

function App() {
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [room, setRoom] = useState("");

  console.log("messages", messages);

  useEffect(() => {
    // When client connected with server first this event trigger
    socket.on("connect", () => {
      console.log(`Conncetion done with Socket id ${socket.id}`);
    });

    // For sending Personal message
    // socket.on("message", (message) => {
    //   console.log(message);
    //   setMessages([...messages, message]);
    // });

    socket.on("receive-message", (data) => {
      console.log("receive-message-data", data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("message", { inputMessage, room });
      setInputMessage("");
      // setRoom("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const joinRoom = (e) => {
    e.preventDefault();
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
      <button type="submit" color="primary" onClick={joinRoom}>
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
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
