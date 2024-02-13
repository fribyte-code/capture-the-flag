import React, { useEffect, useState } from "react";

export interface DateSelectorProps {
  onChange: (value: Date) => void;
  defaultDate: string | null | undefined;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  onChange,
  defaultDate,
}) => {
  const [releaseDate, setReleaseDate] = useState<Date | null>(
    defaultDate ? new Date(defaultDate) : null,
  );
  const [releaseTime, setReleaseTime] = useState<Date | null>(
    defaultDate ? new Date(defaultDate) : null,
  );

  const [userChangedDate, setUserChangedDate] = useState<boolean>(false);
  useEffect(() => {
    if (userChangedDate && releaseDate && releaseTime) {
      let newReleaseDateTime = releaseDate;
      newReleaseDateTime.setHours(releaseTime.getUTCHours());
      newReleaseDateTime.setMinutes(releaseTime.getUTCMinutes());
      newReleaseDateTime.setSeconds(releaseTime.getUTCSeconds());
      onChange(newReleaseDateTime);
      console.log(newReleaseDateTime);
    }
  }, [releaseDate, releaseTime]);

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
        <span className="label-text">Date</span>
      </label>

      <input
        type="date"
        defaultValue={defDate?.split("T")[0]}
        onChange={(event) => {
          setReleaseDate(new Date(event.target.value));
          setUserChangedDate(true);
        }}
        className="input input-bordered"
      />
      <label>
        <span className="label-text">Time</span>
      </label>
      <input
        type="time"
        defaultValue={defDate?.split("T")[1]}
        onChange={(event) => {
          setReleaseTime(event.target.valueAsDate);
          setUserChangedDate(true);
        }}
        className="input input-bordered"
      />
    </>
  );
};

export default DateSelector;
