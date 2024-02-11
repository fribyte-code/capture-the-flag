import style from "./toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}
export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <input
      className={style.element}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
  );
}
