import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Topics from "./components/Topics.jsx";
import TopicDetails from "./components/TopicDetails.jsx";
import { useEffect, useState } from "react";

function App() {
  const navigate = useNavigate();
  const [page, setPage] = useState("login");
  const [redirect, setRedirect] = useState(false);
  const [topic, setTopic] = useState(() => {
    try {
      const item = sessionStorage.getItem("topic");
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const item = sessionStorage.getItem("user");
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("topic", JSON.stringify(topic));
    } catch (error) {
      console.log(error);
    }
  }, [user, topic]);
  useEffect(() => {
    if (redirect) {
      if (page === "login") {
        navigate("/login", { replace: true });
      }
      if (page === "succeed") {
        navigate("/topics", { replace: true });
      }
      if (page === "detail") {
        navigate("/topic-detail", { replace: true });
      }
      setRedirect(false);
    }
  }, [page, redirect]);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Login setPage={setPage} setRedirect={setRedirect} user={user} />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setPage={setPage}
              setRedirect={setRedirect}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/sign-up"
          element={
            <SignUp
              setPage={setPage}
              setRedirect={setRedirect}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/topics"
          element={
            <Topics
              setPage={setPage}
              setRedirect={setRedirect}
              user={user}
              setTopic={setTopic}
            />
          }
        />
        <Route
          path="/topic-detail"
          element={
            <TopicDetails
              setPage={setPage}
              setRedirect={setRedirect}
              user={user}
              topic={topic}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
