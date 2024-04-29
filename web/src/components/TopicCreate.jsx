import { PATH } from "../config.mjs";

function TopicCreate({ user, trigger }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      topic: event.target.topic.value,
      user: user,
    };
    try {
      const response = await fetch(PATH + "topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await JSON.stringify(formData),
      });
      const data = await response.json();
      trigger(Math.random());
      if (response.ok) {
        if (data.message !== "Succeed") {
          console.log(data.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    event.target.topic.value = "";
    return null;
  }

  return (
    <>
      <div className="row">
        <div className="col"></div>
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="inputTopic" className="form-label">
                Topic
              </label>
              <input
                type="text"
                name="topic"
                className="form-control"
                id="inputTopic"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
        <div className="col"></div>
      </div>
    </>
  );
}

export default TopicCreate;
