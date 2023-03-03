import Layout from "./layout";
import { fetchLogin } from "../api/backendComponents";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SolveTasks() {
  const navigate = useNavigate();
  let [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetchLogin({
        body: {
          username: event.currentTarget.username.value,
          password: event.currentTarget.password.value,
        },
      });
      console.debug("Logged in");
      setErrorMsg("");
      navigate("/");
    } catch (error) {
      setErrorMsg("Wrong username or password!");
      console.debug("Wrong password");
    }
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="TeamName" name="username" />
        <input type="password" placeholder="Password" name="password" />
        <input type="submit" value="Login" />
      </form>
      {errorMsg ? <p>{errorMsg}</p> : ""}
    </Layout>
  );
}
