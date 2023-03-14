import Layout from "./layout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, errorMsg } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(
      event.currentTarget.username.value,
      event.currentTarget.password.value
    );
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">TeamName:</span>
          </label>
          <input
            type="text"
            placeholder="TeamName"
            name="username"
            className="input input-bordered"
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
            className="input input-bordered"
          />
        </div>
        <input
          type="submit"
          value="Login"
          className="btn btn-outline btn-primary mt-4"
        />
      </form>
      {errorMsg ? <p>{errorMsg}</p> : ""}
    </Layout>
  );
}
