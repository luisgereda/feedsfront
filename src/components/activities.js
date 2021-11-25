import { useState, useEffect } from "react";

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
  };

  const Onclickdelete = (id) => {
    props.todelete(id);
  };

  return (
    <div className="activity-card">
      <img src={props.picture} alt="image" />
      <p>
        {props.actor} <br />
        {props.verb} <br />
        {props.object} <br />
        {props.time} <br />
      </p>
      {props.likes ? (
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
      ) : (
        <span className="reaction">
          <button
            onClick={(e) => {
              increaselike(props.id);
            }}
          >
            👍
          </button>
          {like}
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
      )}
    </div>
  );
}
