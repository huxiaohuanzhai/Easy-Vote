import { useState } from "react";
import { PATH } from "../config.mjs";

function Login({ setPage, setRedirect, user, setUser }) {
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      password: event.target.password.value,
    };
    try {
      const response = await fetch(PATH + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.message === "Succeed") {
          setPage("succeed");
          setUser(data.user);
          setRedirect(true);
        }
        setError(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    return null;
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col"></div>
          <div className="col-6 text-center mt-5">
            <h1>Welcome!</h1>
            <p>{error}</p>
          </div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col"></div>
          <div className="col-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="inputAccount" className="form-label">
                  Account
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="inputAccount"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="inputPassword"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <a href="/sign-up" className="btn btn-primary">
                Create Account
              </a>
              <a href="/topics" className="btn btn-primary">
                View Topics
              </a>
            </form>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
