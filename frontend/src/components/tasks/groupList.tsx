import classNames from "classnames";
import type { GroupedTasks } from "../../pages/Tasks";
import style from "./groupList.module.css";
import { useEffect, useState } from "react";
import { onChange } from "react-toastify/dist/core/store";

interface GroupListProps<T extends string> {
  onChange: (value: T) => void;
  groups: T[];
}
export default function GroupList<T extends string>({
  groups,
  onChange,
}: GroupListProps<T>) {
  const [selectedGroup, setSelectedGroup] = useState(groups[0] || null);

  useEffect(() => {
    if (selectedGroup) onChange(selectedGroup);
  }, []);

  const handleGroupClick = (groupName: T) => {
    setSelectedGroup(groupName);
    onChange(groupName);
  };

  return (
    <ul className={style.categoryList}>
      {groups.map((groupName) => (
        <li key={groupName}>
          <button
            className={classNames(style.chip, {
              [style.selected]: groupName === selectedGroup,
            })}
            onClick={() => handleGroupClick(groupName)}
          >
            {groupName}
          </button>
        </li>
      ))}
    </ul>
  );
}
