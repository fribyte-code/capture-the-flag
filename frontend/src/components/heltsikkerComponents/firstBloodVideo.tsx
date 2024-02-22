import { SyntheticEvent, useRef, useState } from "react";
import style from "./firstBloodVideo.module.css";

export interface FirstBloodVideoProps {
  teamId: string;
  taskName?: string;
  onClose: () => void;
}
/**
 * Will show a loud video with alternating team names and task names.
 * Called by `toasterSection.tsx` when a team solves a task first.
 * But only if the theme is "heltsikker" and the user is on the leaderboard page.
 *
 * Ordered by Heltsikker for their CTF event, should probably be removed after the event.
 */
const FirstBloodVideo: React.FC<FirstBloodVideoProps> = (props) => {
  const teamNameDivRef = useRef<HTMLDivElement>(null);
  const [teamNameDivText, setTeamNameDivText] = useState<string>(props.teamId);

  const videOnTimeUpdate = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    let video = e.currentTarget;
    if (!teamNameDivRef) {
      return;
    }
    if (!teamNameDivRef.current) {
      return;
    }
    let teamNameDiv = teamNameDivRef.current;
    if (video.currentTime >= 5 && video.currentTime < 11) {
      showTextAndRestartAnimation(props.taskName ?? props.teamId);
    } else if (video.currentTime >= 11 && video.currentTime < 14) {
      teamNameDiv.style.display = "none";
    } else if (video.currentTime >= 14 && video.currentTime < 20) {
      showTextAndRestartAnimation(props.teamId);
    } else if (video.currentTime >= 20 && video.currentTime < 23) {
      teamNameDiv.style.display = "none";
    } else if (video.currentTime >= 23) {
      showTextAndRestartAnimation(props.teamId);
    } else {
      teamNameDiv.style.display = "none"; // Hide the text
    }

    function showTextAndRestartAnimation(textContent: string) {
      setTeamNameDivText(textContent);
      if (teamNameDiv.style.display === "none") {
        teamNameDiv.style.display = "block"; // Show the text again
        teamNameDiv.style.animation = "none"; // Reset animation
        setTimeout(function () {
          // Trigger reflow
          teamNameDiv.style.animation = ""; // Reapply animation
        }, 10);
      }
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key == "Escape") {
      props.onClose();
    }
  };
  return (
    <>
      <dialog
        open
        key={props.teamId}
        className={style.dialog}
        onKeyUp={handleKeyPress}
        autoFocus
      >
        <div className={style.videoContainer}>
          <video
            autoPlay
            onTimeUpdate={(e) => videOnTimeUpdate(e)}
            onEnded={() => props.onClose()}
          >
            <source
              src="https://files.fribyte.no/heltsikker/video.mp4"
              type="video/mp4"
            />
          </video>
          <div ref={teamNameDivRef} className={style.teamName}>
            {teamNameDivText}
          </div>
        </div>
      </dialog>
      <div onClick={() => props.onClose()} className={style.backDrop} />
    </>
  );
};

export default FirstBloodVideo;
