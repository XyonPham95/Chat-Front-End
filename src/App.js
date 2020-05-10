import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Moment from "react-moment";
import Header from "./components/Header";
import Rooms from "./components/Rooms";
import socket from "./utils/socket.js";

function App() {
  const [chat, setChat] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [user, setUser] = useState(null);
  const chatLogRef = useRef(chatLog);

  useEffect(() => {
    askUser();
    chatConnection(chatLog);
  }, []);

  const askUser = () => {
    const user = prompt("Please enter your");
    if (!user) return askUser();

    socket.emit("login", (userName, cb) => {
      if (cb && !cb.ok) return alert("Cannot Login");
      else {
        setUser(cb.data);
      }
    });
  };

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
      name: user.name,
      createdAt: new Date().getTime(),
    };
    console.log(chatObj);
    socket.emit("chat", chatObj, (res, err) => {
      console.log("RES", res);
      if (err) {
        console.log(err);
      } else {
        if (res && res.ok) chatLogRef.current.push(res.data);
        setChatLog([...chatLogRef.current]);
      }
    });
    setChat("");
    document.getElementById("input-text").reset();
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

  const leaveRoom = (e) => {
    e.preventDefault();
    socket.emit("leaveRoom", null, (res) => {
      if (res && !res.ok) {
        console.log(res.error);
      }
    });
  };

  return (
    <div>
      <Header user={user} />
      <Rooms />
      <div className="chatbox">
        <form onChange={handleChange} onSubmit={submitChat}>
          <input name="chat" type="text"></input>
          <button type="submit">submit</button>
        </form>
      </div>

      <button onClick={leaveRoom}>Leave Room</button>

      <div className="chat-log">{renderChatLog()}</div>
    </div>
  );
}

export default App;
