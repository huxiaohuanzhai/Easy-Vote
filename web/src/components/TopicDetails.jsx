import OptionCreate from "./OptionCreate";
import { useEffect, useState } from "react";
import { PATH } from "../config.mjs";

function TopicDetails({ setPage, setRedirect, user, topic }) {
  const [options, setOptions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      option: selectedOption,
      user: user,
    };
    try {
      await fetch(PATH + "topics/" + topic.slug, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await JSON.stringify(formData),
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setRefresh(Math.random());
    return null;
  }

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }

  function generateOptions(array) {
    return array.map((option) => (
      <div key={option.answer}>
        <li className="list-group-item">
          <input
            className="form-check-input me-1"
            type="radio"
            name="listGroupRadio"
            value={option.answer}
            id={option.answer}
            onChange={handleOptionChange}
            checked={selectedOption === option.answer}
          />
          <label className="form-check-label" htmlFor={option.answer}>
            {option.answer} * {option.voter.length}
          </label>
        </li>
      </div>
    ));
  }

  useEffect(() => {
    async function getDetails() {
      try {
        const response = await fetch(PATH + "topics/" + topic.slug, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setOptions(data.topic.options);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    getDetails();
  }, [refresh]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col" />
          <div className="col">
            <a href="/topics" className="btn btn-primary">
              Topics
            </a>
          </div>
          <div className="col-8"></div>
          <div className="col">
            {user === undefined ? (
              <a href="/login" className="btn btn-primary">
                LOGIN
              </a>
            ) : (
              <></>
            )}
          </div>
          <div className="col" />
        </div>
        <div className="row">
          <div className="col"></div>
          <div className="col-6 text-center mt-5">
            <h1>{topic.topic}</h1>
          </div>
          <div className="col"></div>
        </div>
        {user === undefined ? (
          <></>
        ) : (
          <OptionCreate slug={topic.slug} setRefresh={setRefresh} user={user} />
        )}
        <div className="row">
          <div className="col"></div>
          <div className="col-6">
            <form onSubmit={handleSubmit}>
              <ul className="list-group">{generateOptions(options)}</ul>
              {user === undefined ? (
                <></>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Vote
                </button>
              )}
            </form>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </>
  );
}

export default TopicDetails;
