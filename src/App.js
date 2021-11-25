import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "../src/pages/Home";
import MyFeed from "../src/pages/MyFeed";

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

  console.log(app_key);
  console.log(app_id);

  async function Connect() {
    const response = await axios.get(`http://localhost:4000/${userId}`);
    setToken(response.data);
    console.log("token", response);
  }

  useEffect(() => {
    function Start() {
      if (token) {
        const getclient = stream.connect(app_key, token, app_id);
        console.log("client", getclient);
        setClient(getclient);
      }
    }
    // eslint-disable-next-line no-unused-expressions
    token ? Start() : "";
  }, [token]);

  function change1() {
    setHome("home");
    setMyfeed("");
  }

  function change2() {
    setHome("");
    setMyfeed("feed");
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
            <li className="navlinks">Global</li>
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
          {home ? (
            <Home client={client} userID={userId} />
          ) : myFeed ? (
            <MyFeed client={client} userID={userId} token={token} />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

export default App;
