import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

require("dotenv").config({ path: __dirname + "/.env" });

const stream = require("getstream");

const app_key = process.env["APP_KEY"];
const app_id = process.env["APP_ID"];

function App() {
  const [userId, setId] = useState("");
  const [token, setToken] = useState("");
  const [client, setClient] = useState("");

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

  return (
    <div className="App">
      <header>
        <nav>
          <ul>
            <li className="navlinks">My Feed</li>
            <li className="navlinks">Timeline</li>
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
          <p>hola</p>
        </div>
      )}
    </div>
  );
}

export default App;
