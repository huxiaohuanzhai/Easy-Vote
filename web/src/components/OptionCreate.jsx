import { PATH } from "../config.mjs";

function OptionCreate({ slug, setRefresh, user }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      option: event.target.option.value,
      user: user,
    };
    try {
      await fetch(PATH + "topics/" + slug, {
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
    event.target.option.value = "";
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
                Option
              </label>
              <input
                type="text"
                name="option"
                className="form-control"
                id="inputOption"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>
        </div>
        <div className="col"></div>
      </div>
    </>
  );
}

export default OptionCreate;
