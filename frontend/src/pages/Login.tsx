import Layout from "./layout";
import { useAuth } from "../hooks/useAuth";
import style from "./login.module.css";

export default function Login() {
  const { login, errorMsg } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(
      event.currentTarget.username.value,
      event.currentTarget.password.value,
    );
  };
  return (
    <Layout narrow>
      <div className={style.container}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">TeamName:</span>
            </label>
            <input
              type="text"
              placeholder="TeamName"
              name="username"
              className="input"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password:</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="input"
            />
          </div>
          <input type="submit" value="Login" className="button solid" />
        </form>
        {errorMsg ? <p>{errorMsg}</p> : ""}
      </div>
    </Layout>
  );
}
