import Activities from "../components/activities";
import { useEffect, useState } from "react";

export default function Home(props) {
  const client = props.client;
  const userID = props.userID;
  const user = client.feed("timeline", userID);
  const [timeline, setTimeline] = useState("");

  useEffect(() => {
    async function getFeed() {
      const feed = await user.get({
        reactions: { counts: true, own: true, recent: true },
      });
      console.log("time", feed.results);
      setTimeline(feed.results);
    }

    getFeed();
  }, []);

  // const likeAction = async (id) => {
  //   const request = await client.reactions.add("like", id, {}, userID);
  //   setLikes(likes + 1);
  // };

  return (
    <div className="home">
      {timeline &&
        timeline.map((activity, index) => {
          return (
            <Activities
              key={index}
              actor={activity.actor?.id}
              object={activity.object}
              picture={activity.picture}
              time={activity.time}
              verb={activity.verb}
              id={activity.id}
              likes={activity.reaction_counts.like}
              client={client}
              userID={userID}
            ></Activities>
          );
        })}
    </div>
  );
}
