import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "../src/pages/Home";
import MyFeed from "../src/pages/MyFeed";
import GlobalFeed from "../src/pages/global";

require("dotenv").config();

const stream = require("getstream");

const app_key = process.env.APP_KEY;
const app_id = process.env.APP_ID;

function App() {
  const [userId, setId] = useState("");
  const [token, setToken] = useState("");
  const [client, setClient] = useState("");
  const [home, setHome] = useState("home");
  const [myFeed, setMyfeed] = useState("");
  const [global, setGlobal] = useState("");
  const [notification, setNotification] = useState(false);

  async function Connect() {
    const response = await axios.get(`http://localhost:4000/${userId}`);
    setToken(response.data);
    console.log("token", response);
  }

  useEffect(() => {
    async function Start() {
      if (token) {
        const getclient = stream.connect("zetdfqptqych", token, "1145734");
        console.log("client", getclient);
        setClient(getclient);
      }
      // if (token) {
      //   const notification = client.feed("notification", userId);
      //   const notificationFeed = await notification.get();
      //   console.log("notification", notificationFeed);
      // }
    }

    // eslint-disable-next-line no-unused-expressions
    token ? Start() : "";
  }, [token]);

  useEffect(() => {
    async function Start() {
      if (client) {
        const notification = client.feed("notification", userId);
        const notificationFeed = await notification.get();
        console.log("notification", notificationFeed?.results[0]?.activities);
        setNotification(notificationFeed?.results[0]?.activities);
      }
    }

    // eslint-disable-next-line no-unused-expressions
    client ? Start() : "";
  }, [client]);

  function change1() {
    setHome("home");
    setMyfeed("");
    setGlobal("");
  }

  function change2() {
    setHome("");
    setMyfeed("feed");
    setGlobal("");
  }

  function change3() {
    setHome("");
    setMyfeed("");
    setGlobal("global");
  }

  function change4() {
    setNotification(!notification);
  }

  return (
    <div className="App">
      <header>
        <nav>
          <ul>
            <button onClick={change1}>
              <li className="navlinks">Timeline</li>
            </button>
            <button onClick={change2}>
              <li className="navlinks">My Feed</li>
            </button>
            <button onClick={change3}>
              <li className="navlinks">Global</li>
            </button>
            {client && <button onClick={change4}>☆</button>}
          </ul>
        </nav>
      </header>
      {!client ? (
        <div className="start">
          <h1>User ID:</h1>
          <input
            onChange={(event) => {
              setId(event.target.value);
            }}
            value={userId}
          ></input>
          <button onClick={Connect}>Connect!</button>
        </div>
      ) : (
        <div>
          {notification && (
            <div className="notificationBox">
              {notification.map((noti, index) => {
                return (
                  <span>
                    <p>
                      {noti.actor.id} likes your post {noti.object.message}
                    </p>
                  </span>
                );
              })}
            </div>
          )}
          {home ? (
            <Home client={client} userID={userId} />
          ) : myFeed ? (
            <MyFeed client={client} userID={userId} token={token} />
          ) : global ? (
            <GlobalFeed client={client} userID={userId} token={token} />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

export default App;
