import React, { useState } from "react";
import { useSession } from "next-auth/react";
import TeamMemberLeader from "./TeamMemberLeader";
import styles from "../../styles/Dashboard.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaderDashboard = ({ teamData,handleTeamDelete,teamToken,handleMemberRemove }) => {
  console.log(teamData)
  console.log(teamData.teamId)
  console.log("team id leaderdashboard")
  console.log(teamData.teamId._id)

  const [teamId,setTeamId] = useState(teamData.teamId._id)
  
  const [isCopied, setIsCopied] = useState(false);
  const { data: session } = useSession();

  const showToastMessage = () => {
    toast('Copied to Clipboard!', {
      position: toast.POSITION.BOTTOM_CENTER,
      className: 'toast-message'
    });
  };



  const onCopyText = () => {
    //alert("Copied");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleDelete = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/team/${teamData.teamId._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessTokenBackend}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then(data => data.json())
    .then(data => {
      console.log(data)
      handleTeamDelete(false)
    })
  }

  return (
    <div className={styles.team_member_section}>
      <div className={styles.team_member_section_wrapper}>

        <h2 className={styles.team_name}>
          Team - {teamData?.teamId?.teamName}
        </h2>
        <h2 className={styles.invite_link_container}>
          <label >Team Link:</label>
          <input
            type="text"
            value={`http://localhost:3000/join-team-link/${teamToken}`}
            placeholder="Type some text here"
            onChange={(event) => setText(event.target.value)}
            className={styles.input}
          />
          <CopyToClipboard text={`http://localhost:3000/join-team-link/${teamToken}`} onCopy={onCopyText}>
            <div className="copy-area">
              <button onClick={showToastMessage}>copy</button>
              <ToastContainer />
            </div>
          </CopyToClipboard>
        </h2>
        <div className={`${styles.team_row} ${styles.align_centre}`}>

          {teamData?.teamId?.members?.map((team) => {
            return (
              <TeamMemberLeader
                key={team._id}
                teamName={team.name}
                mobileNumber={team.mobileNumber}
                email={team.email}
                teamId={teamId}
                userId={team._id}
                handleMemberRemove={handleMemberRemove}
                teamRole={team.teamRole}
                //teamRole={team.teamId.teamRole} //pass down team role,if team role === 0 disable remove button 
              ></TeamMemberLeader>
            );
          })}
        </div>
      </div>
      <button
        className={`${styles.leave_team_btn} ${styles.team_leader_btn} ${styles.w_button}`}
        onClick={handleDelete}
      >
        Delete Team
      </button>

      <button className={`${styles.start_quiz} ${styles.w_button}`}>
        Start Quiz
      </button>
    </div>
  );
};

export default LeaderDashboard;
