import TopicCard from "./TopicCard";
import TopicCreate from "./TopicCreate";
import { PATH } from "../config.mjs";
import { useEffect, useState } from "react";

function Topics({ setPage, setRedirect, user, setTopic }) {
  const [cards, setCards] = useState([]);
  const [refresh, setRefresh] = useState(0);

  function createCard(array) {
    let i = 0;
    return array.map((topic) => (
      <TopicCard
        key={i++}
        topic={topic}
        setTopic={setTopic}
        setPage={setPage}
        setRedirect={setRedirect}
      />
    ));
  }

  useEffect(() => {
    async function generaetTopicCard() {
      try {
        const response = await fetch(PATH + "topics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCards(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    generaetTopicCard();
  }, [refresh]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-10"></div>
          <div className="col">
            {user === undefined ? (
              <a href="/login" className="btn btn-primary">
                LOGIN
              </a>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col"></div>
          <div className="col-6 text-center mt-5">
            {user === undefined ? (
              <h1>Welcome !</h1>
            ) : (
              <h1>Welcome {user.name} !</h1>
            )}
            <h1>Here are all topics!</h1>
          </div>
          <div className="col"></div>
        </div>
        {user === undefined ? (
          <></>
        ) : (
          <TopicCreate user={user} trigger={setRefresh} />
        )}
        <div className="row">
          <div className="col"></div>
          <div className="col-6 text-center mt-5">{createCard(cards)}</div>
          <div className="col"></div>
        </div>
      </div>
    </>
  );
}

export default Topics;
