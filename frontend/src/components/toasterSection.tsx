import { useContext, useEffect } from "react";
import { useFirstBloodNotification } from "../hooks/useFirstBloodNotification";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { ThemeContext, ToastContext } from "../App";

function ToasterSection() {
  const firstBloodNotification = useFirstBloodNotification();
  const { message: toastMessage, toast: setMessage } = useContext(ToastContext);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (toastMessage == null) {
      return;
    }
    toast.success(toastMessage);
    setMessage(null);
  }, [toastMessage]);

  useEffect(() => {
    if (firstBloodNotification && firstBloodNotification.task) {
      setMessage(
        `🩸First Blood: ${firstBloodNotification.task.name} solved by ${firstBloodNotification.teamId}🩸`,
      );
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
    </div>
  );
}
export default ToasterSection;
