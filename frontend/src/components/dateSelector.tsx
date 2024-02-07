import React, { useEffect, useState } from "react";

export interface DateSelectorProps {
  onChange: (value: Date) => void;
  defaultDate: string | null | undefined;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  onChange,
  defaultDate,
}) => {
  const [releaseDateTime, setReleaseDateTime] = useState<Date | null>(
    new Date(),
  );

  //This is absolutely vile and cursed, but i honestly cannot look at dates again wihtout going absolutely apeshit
  //Besides, it only shows it to the user :)
  const defaultDateAsDate =
    defaultDate != null ? new Date(defaultDate) : undefined;
  const defDate =
    defaultDateAsDate != undefined
      ? new Date(
          defaultDateAsDate.getTime() -
            defaultDateAsDate.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, -8)
      : undefined;

  return (
    <>
      <label>
        <span className="label-text">Format: mm/dd/yyy hh:mm</span>
      </label>

      <input
        type="datetime-local"
        value={defDate}
        onChange={(event) => {
          setReleaseDateTime(new Date(event.target.value));
          if (releaseDateTime) {
            onChange(releaseDateTime);
          }
        }}
        className="input input-bordered"
      />
    </>
  );
};

export default DateSelector;
