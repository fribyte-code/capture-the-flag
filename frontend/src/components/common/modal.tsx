import { ReactNode } from "react";
import style from "./modal.module.css";

interface ModalProps {
  onClose: () => void;
  open: boolean;
  children: ReactNode;
}
export default function Modal({ onClose, children, open }: ModalProps) {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key == "Escape") {
      onClose();
    }
  };
  if (!open) {
    return;
  }
  return (
    <>
      <dialog open className={style.dialog} onKeyUp={handleKeyPress}>
        {children}
      </dialog>
      <div onClick={onClose} className={style.backDrop} />
    </>
  );
}
