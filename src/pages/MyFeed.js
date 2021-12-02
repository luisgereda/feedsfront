import Activities from "../components/activities";
import { useEffect, useState } from "react";

export default function MyFeed(props) {
  const client = props.client;
  const userID = props.userID;
  const token = props.token;
  const user = client.feed("user", userID, token);
  const [timeline, setTimeline] = useState("");
  const [post, setPost] = useState("");
  const [url, setURL] = useState("");

  useEffect(() => {
    async function getFeed() {
      const feed = await user.get({
        limit: 5,
        reactions: { counts: true, own: true, recent: true },
      });
      console.log("user", feed.results);
      setTimeline(feed.results);
    }

    getFeed();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setPost("");
    console.log(url);
    const foreignID = Math.random();
    const newActor = "SU:".concat(userID);
    const newPost = await user.addActivity({
      actor: newActor,
      verb: "posted",
      object: "action:1",
      foreign_id: foreignID,
      picture: url,
      message: post,
      likes: 0,
    });
    console.log(newPost);
    setTimeline([newPost, ...timeline]);
  };

  async function getUrl(event) {
    const files = event.target.files;
    const response = await client.images.upload(files[0]);
    console.log(response);
    setURL(response.file);
  }

  const todelete = async (id) => {
    const request = await user.removeActivity(id);
    console.log(request.removed);

    if (request) {
      const newList = timeline.filter((activity) => {
        return activity.id !== id;
      });
      setTimeline(newList);
    }
  };

  return (
    <div>
      <div className="addActivity">
        <form onSubmit={submit}>
          {url ? <img src={url} alt="image" className="imagen" /> : ""}
          <label>Add your favorite player</label>
          <input type="file" onChange={getUrl}></input>
          <textarea
            onChange={(event) => {
              setPost(event.target.value);
            }}
            value={post}
            type="text"
            rows="10"
          />
          <button type="submit">POST</button>
        </form>
      </div>
      <div className="home">
        {timeline &&
          timeline?.map((activity, index) => {
            const time = new Date(activity.time).toDateString();
            return (
              <Activities
                key={index}
                actor={activity.actor?.id}
                picture={activity.picture}
                time={time}
                id={activity.id}
                message={activity.message}
                likes={activity.reaction_counts?.like}
                client={client}
                userID={userID}
                todelete={todelete}
              ></Activities>
            );
          })}
      </div>
    </div>
  );
}
