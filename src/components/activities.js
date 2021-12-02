import { useState, useEffect } from "react";
import axios from "axios";

export default function Activities(props) {
  const [like, setLikes] = useState(0);
  const [owner, setOwner] = useState(false);
  const client = props.client;
  const userID = props.userID;

  useEffect(() => {
    async function getFeed() {
      const likes = props.likes;
      likes && setLikes(likes);
    }
    if (userID === props.actor) {
      setOwner(true);
    }

    getFeed();
  }, []);

  const increaselike = async (id) => {
    const request = await client.reactions.add("like", id, {}, userID);
    request && setLikes(like + 1);
    const response = await axios.post(`http://localhost:4000/update`, {
      like,
      id,
    });
    console.log(response);
  };

  const Onclickdelete = (id) => {
    props.todelete(id);
  };

  return (
    <div className="activity-card">
      <img src={props.picture} alt="image" />
      <h4>{props.message}</h4>
      <p>
        {props.actor} <br />
        {props.time} <br />
      </p>

      <span className="reaction">
        <button
          onClick={(e) => {
            increaselike(props.id);
          }}
        >
          👍{like}
        </button>

        {owner && (
          <button
            onClick={(e) => {
              Onclickdelete(props.id);
            }}
          >
            🗑️
          </button>
        )}
      </span>
    </div>
  );
}
