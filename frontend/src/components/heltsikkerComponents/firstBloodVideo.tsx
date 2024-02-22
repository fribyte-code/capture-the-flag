import { SyntheticEvent, useEffect, useRef, useState } from "react";
import style from "./firstBloodVideo.module.css";

export interface FirstBloodVideoProps {
  teamId: string;
  onClose: () => void;
}
const FirstBloodVideo: React.FC<FirstBloodVideoProps> = (props) => {
  const video = useRef(null);
  const teamNameDivRef = useRef<HTMLDivElement>(null);
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
      if (teamNameDiv.style.display === "none") {
        teamNameDiv.style.display = "block"; // Show the text
        teamNameDiv.style.animation = "none"; // Reset animation
        setTimeout(function () {
          // Trigger reflow
          teamNameDiv.style.animation = ""; // Reapply animation
        }, 10);
      }
    } else if (video.currentTime >= 11 && video.currentTime < 14) {
      teamNameDiv.style.display = "none";
    } else if (video.currentTime >= 14 && video.currentTime < 20) {
      if (teamNameDiv.style.display === "none") {
        teamNameDiv.style.display = "block"; // Show the text again
        teamNameDiv.style.animation = "none"; // Reset animation
        setTimeout(function () {
          // Trigger reflow
          teamNameDiv.style.animation = ""; // Reapply animation
        }, 10);
      }
    } else if (video.currentTime >= 20 && video.currentTime < 23) {
      teamNameDiv.style.display = "none";
    } else if (video.currentTime >= 23) {
      if (teamNameDiv.style.display === "none") {
        teamNameDiv.style.display = "block"; // Show the text again
        teamNameDiv.style.animation = "none"; // Reset animation
        setTimeout(function () {
          // Trigger reflow
          teamNameDiv.style.animation = ""; // Reapply animation
        }, 10);
      }
    } else {
      teamNameDiv.style.display = "none"; // Hide the text
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
            ref={video}
            onEnded={() => props.onClose()}
          >
            <source
              src="https://files.fribyte.no/heltsikker/video.mp4"
              type="video/mp4"
            />
          </video>
          <div ref={teamNameDivRef} className={style.teamName}>
            {props.teamId}
          </div>
        </div>
      </dialog>
      <div onClick={() => props.onClose()} className={style.backDrop} />
    </>
  );
};

export default FirstBloodVideo;
