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

    socket.on("message", (data) => {
      console.log("receive-message-data", data);
      setMessages((messages) => [...messages, data]);
    });

    // cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // send message to group
  const sendMessage = () => {
    if (inputMessage.trim() !== "" && room.trim() !== "") {
      socket.emit("messageToRoom", { inputMessage, room });
      setInputMessage("");
    } else {
      alert("Please Enter Message and Room Name");
    }
  };

  // Broadcast the message
  const broadCastMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("broadCastMessage", inputMessage);
      setInputMessage("");
    }
    else {
      alert("Please Enter Message");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // Join the particular Room
  const joinRoom = (e) => {
    e.preventDefault();
    if (roomName.trim() !== "") {
      socket.emit("join-room", roomName);
      setRoomName("");
    } else {
      alert("Please Enter Room Name");
    }
  };

  // Leave the particular Room
  const leaveRoom = (e) => {
    if (roomName.trim() !== "") {
      e.preventDefault();
      socket.emit("leaveRoom", roomName);
      setRoomName("");
    } else {
      alert("Please Enter Room Name");
    }
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
        Join Room
      </button>
      <button type="submit" color="primary" onClick={leaveRoom}>
        Leave Room
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

      <button onClick={sendMessage}>Send To Room</button>
      <button onClick={broadCastMessage}>BroadCast</button>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
