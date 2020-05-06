import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import Moment from "react-moment";

const socket = socketIOClient("http://localhost:5000");

function App() {
  const [chat, setChat] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [name, setName] = useState("unknown");
  const chatLogRef = useRef(chatLog);

  useEffect(() => {
    const user = prompt("Please enter your name");
    setName(user);
    chatConnection(chatLog);
  }, []);

  const chatConnection = () => {
    socket.on("message", (msg) => {
      chatLogRef.current.push(msg);
      setChatLog([...chatLogRef.current]);
    });
  };

  const handleChange = (e) => {
    setChat(e.target.value);
  };

  const submitChat = (e) => {
    e.preventDefault();
    let chatObj = {
      text: chat,
      name: name,
      createdAt: new Date().getTime(),
    };
    console.log(chatObj);
    socket.emit("chat", chatObj, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("message has been sent");
      }
    });
    setChat("");
  };

  const renderChatLog = () => {
    return chatLog.map((el) => (
      <p>
        <strong>{el.name} : </strong> {el.text}
        <div className="createdAt">
          <Moment fromNow>{el.createdAt}</Moment>
        </div>
      </p>
    ));
  };

  return (
    <div>
      <div className="chatbox">
        <form onChange={handleChange} onSubmit={submitChat}>
          <input name="chat" type="text"></input>
          <button type="submit">submit</button>
        </form>
      </div>

      <div className="chat-log">{renderChatLog()}</div>
    </div>
  );
}

export default App;
