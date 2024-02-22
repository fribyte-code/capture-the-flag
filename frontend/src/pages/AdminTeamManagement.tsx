import Layout from "./layout";
import {
  fetchAddTeam,
  fetchPostInvitationLink,
  useAllTeams,
  useGetInvitationLink,
} from "../api/backendComponents";
import { useEffect, useState } from "react";
import { InvitationWriteModel } from "../api/backendSchemas";
import DateSelector from "../components/dateSelector";

import { toast } from "react-toastify";

export default function AdminTeamManagement() {
  const { data: teams, isLoading, refetch } = useAllTeams({});
  const [showPassword, setShowPassword] = useState(false);
  const [newTeams, setNewTeams] = useState("");
  const [teamPasswordToShow, setTeamPasswordToShow] = useState("");

  const { data: invitationCodeData } = useGetInvitationLink({});
  const [invitation, setInvitation] = useState<InvitationWriteModel>({
    invitationCode: "",
    expires: null,
  });

  useEffect(() => {
    if (invitationCodeData?.invitationCode) {
      setInvitation({
        invitationCode: invitationCodeData.invitationCode,
        expires: invitationCodeData.expires,
      });
    }
  }, [invitationCodeData]);

  async function handleInvitationUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetchPostInvitationLink({
      body: invitation,
    });

    toast("Invitation code updated");
  }

  async function handleAddNewTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await Promise.all(
      newTeams.split("\n").map(async (teamName) => {
        if (teamName) {
          await fetchAddTeam({
            body: {
              username: teamName,
            },
          });
        }
      }),
    );

    await refetch();
  }

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div style={{ maxWidth: "1200px" }}>
          <form onSubmit={handleInvitationUpdate}>
            <h2>Edit invitation code</h2>
            <p>
              Allow teams to register their own name using an invitation code.
              Send this url to participants for easy access:{" "}
              <a href={"/login?invitationCode=" + invitation.invitationCode}>
                {"/login?invitationCode=" + invitation.invitationCode}
              </a>
            </p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Invitation code:</span>
                <input
                  type="text"
                  value={invitation.invitationCode}
                  onChange={(e) =>
                    setInvitation({
                      ...invitation,
                      invitationCode: e.target.value,
                    })
                  }
                  name="invitationCode"
                  placeholder="Invitation code"
                  className="input"
                  required
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Invitation expiry (empty for never, must fill both date and
                  time):
                </span>
              </label>
              <DateSelector
                onChange={(e) =>
                  setInvitation({
                    ...invitation,
                    expires: e.toISOString(),
                  })
                }
                defaultDate={invitation.expires}
              />
            </div>
            <input
              type="submit"
              className="button solid"
              value="Add or update"
            />
          </form>
          <form onSubmit={handleAddNewTeam}>
            <h2>Add new teams</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Team-names</span>
              </label>
              <textarea
                value={newTeams}
                onChange={(e) => setNewTeams(e.target.value)}
                name="usernames"
                placeholder="Usernames, one per line"
                className="textarea textarea-bordered"
                rows={8}
                cols={10}
              />
            </div>
            <input type="submit" className="button solid" value="Submit" />
          </form>
          <div className="form-control w-64">
            <label className="label cursor-pointer">
              <span className="label-text">Toggle Show password</span>
              <input
                type="checkbox"
                className="toggle"
                checked={showPassword}
                onClick={(e) => setShowPassword(!showPassword)}
              />
            </label>
          </div>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password (Click to show)</th>
              </tr>
            </thead>
            <tbody>
              {teams?.map((t) => (
                <tr key={t.id} className="hover">
                  <td>{t.userName}</td>
                  <td
                    className="cursor-pointer"
                    onClick={(e) =>
                      setTeamPasswordToShow(
                        teamPasswordToShow == t.userName ? "" : t.userName!,
                      )
                    }
                  >
                    {teamPasswordToShow == t.userName || showPassword
                      ? t.teamPassword
                      : "***"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
