import Activities from "../components/activities";
import { useEffect, useState } from "react";
import { users } from "../components/const";

export default function Home(props) {
  const client = props.client;
  const userID = props.userID;
  const user = client.feed("timeline", userID);
  const [timeline, setTimeline] = useState("");
  const [follows, setFollows] = useState([]);
  const [toFollow, setTofollows] = useState([]);

  useEffect(() => {
    async function getFeed() {
      const feed = await user.get({
        reactions: { counts: true, own: true, recent: true },
        ranking: "new_Ranking",
      });
      setTimeline(feed.results);
      const following = await user.following();
      const response2 = following.results;
      const getFollows = response2.map((ids) => {
        const newArray = Object.values(ids)[1];
        const newArray2 = newArray.split(":");
        return newArray2[1];
      });
      const getFollows2 = [userID, ...getFollows];

      const toFollow = users.filter((user) => {
        return getFollows2.every((ids) => {
          return ids !== user;
        });
      });
      setFollows(getFollows);
      setTofollows(toFollow);
    }

    getFeed();
  }, []);

  const setFollow = async (person) => {
    await user.follow("user", person);
    setFollows([person, ...follows]);
    const newSet = toFollow.filter((id) => {
      return id !== person;
    });
    setTofollows(newSet);
  };

  const setUnfollow = async (id) => {
    await user.unfollow("user", id);
    setTofollows([id, ...toFollow]);
    const newSet = follows.filter((person) => {
      return person !== id;
    });
    setFollows(newSet);
  };

  console.log(timeline);

  return (
    <div className="principal">
      <span className="follows">
        <h1>Unfollow:</h1>
        {follows?.map((id) => {
          return (
            <span>
              <p>{id}</p>
              <button
                onClick={(e) => {
                  setUnfollow(id);
                }}
              >
                ❌
              </button>
            </span>
          );
        })}
        <h1>Follow:</h1>
        {toFollow?.map((person) => {
          return (
            <span>
              <p>{person}</p>
              <button
                onClick={(e) => {
                  setFollow(person);
                }}
              >
                ✅
              </button>
            </span>
          );
        })}
      </span>
      <div className="home">
        {timeline &&
          timeline.map((activity, index) => {
            const time = new Date(activity.time).toDateString();
            return (
              <Activities
                key={index}
                actor={activity.actor?.id}
                picture={activity.picture}
                time={time}
                id={activity.id}
                message={activity.message}
                likes={activity.reaction_counts.like}
                client={client}
                userID={userID}
                time2={activity.time}
                foreignID={activity.foreign_id}
              ></Activities>
            );
          })}
      </div>
    </div>
  );
}
