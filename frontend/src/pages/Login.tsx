import Layout from "./layout";
import { useAuth } from "../hooks/useAuth";
import style from "./login.module.css";
import { useState } from "react";
import { fetchRegisterWithInvitationLink } from "../api/backendComponents";
import { toast } from "react-toastify";

export default function Login() {
  const { login, errorMsg: loginErrorMsg } = useAuth();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(
      event.currentTarget.username.value,
      event.currentTarget.password.value,
    );
  };

  const [newTeamPassword, setNewTeamPassword] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [invitationCode, setInvitationCode] = useState(
    new URLSearchParams(window.location.search).get("invitationCode") ?? "",
  );
  async function handleRegisterWithInvitation(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    try {
      if (!newTeamName) {
        toast.error("Team name is required");
        return;
      }
      const response = await fetchRegisterWithInvitationLink({
        body: {
          username: newTeamName,
          invitationCode: invitationCode,
        },
      });

      setNewTeamPassword(response.teamPassword as string);
      toast.success("Successfully registered teamName: " + response.userName);
    } catch (e) {
      console.debug(e);
      toast.error(
        "Failed to register with invitation code: " + (e as any).stack ??
          JSON.stringify(e),
      );
    }
  }

  return (
    <Layout narrow>
      <div className={style.container}>
        <div>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">TeamName:</span>
              </label>
              <input
                type="text"
                placeholder="TeamName"
                name="username"
                className="input"
                required
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
                required
              />
            </div>
            <input type="submit" value="Login" className="button solid" />
          </form>
          {loginErrorMsg ? <p>{loginErrorMsg}</p> : ""}
        </div>
        <div>
          <h1>Register</h1>
          <form onSubmit={handleRegisterWithInvitation}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Invitation code:</span>
                <input
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  name="invitationCode"
                  placeholder="Invitation code"
                  className="input"
                  required
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Team name:</span>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  name="teamName"
                  placeholder="Team name"
                  className="input"
                  required
                />
              </label>
            </div>
            <input
              type="submit"
              value="Register with invitation code"
              className="button solid"
            />
            {newTeamPassword ? (
              <p>
                Your new team password is: <strong>{newTeamPassword}</strong>
                <br />
                Please note it down. You will not be able to see it again.
              </p>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
