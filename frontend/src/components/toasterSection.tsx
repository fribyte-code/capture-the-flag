import { ReactNode, useContext, useEffect, useState } from "react";
import { useFirstBloodNotification } from "../hooks/useFirstBloodNotification";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { ThemeContext, ToastContext } from "../App";
import config from "../config";
import FirstBloodVideo from "./heltsikkerComponents/firstBloodVideo";
import { useLocation } from "react-router-dom";
function ToasterSection() {
  const firstBloodNotification = useFirstBloodNotification();
  const { message: toastMessage, toast: setMessage } = useContext(ToastContext);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const [toRenderVideo, setToRenderVideo] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (toastMessage == null) {
      return;
    }
    toast.success(toastMessage);
    setMessage(null);
  }, [toastMessage]);

  useEffect(() => {
    if (firstBloodNotification && firstBloodNotification.task) {
      if (
        config.APP_COLOR_SCHEME == "heltsikker" &&
        location.pathname == "/leaderboard"
      ) {
        if (toRenderVideo == null) {
          setToRenderVideo(
            <FirstBloodVideo
              teamId={firstBloodNotification.teamId ?? ""}
              onClose={() => setToRenderVideo(null)}
            />,
          );
        }
      } else {
        setMessage(
          `🩸First Blood: ${firstBloodNotification.task.name} solved by ${firstBloodNotification.teamId}🩸`,
        );
      }
    }
  }, [firstBloodNotification]);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
      />
      {toRenderVideo}
    </div>
  );
}
export default ToasterSection;
