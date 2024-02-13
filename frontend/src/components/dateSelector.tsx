import React, { useEffect, useState } from "react";

export interface DateSelectorProps {
  onChange: (value: Date) => void;
  defaultDate: string | null | undefined;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  onChange,
  defaultDate,
}) => {
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [releaseTime, setReleaseTime] = useState<Date | null>(null);

  useEffect(() => {
    if (releaseDate) {
      if (releaseTime) {
        let newReleaseDateTime = releaseDate;
        newReleaseDateTime.setHours(releaseTime.getUTCHours());
        newReleaseDateTime.setMinutes(releaseTime.getUTCMinutes());
        newReleaseDateTime.setSeconds(releaseTime.getUTCSeconds());
        onChange(newReleaseDateTime);
      } else {
        let newReleaseDateTime = releaseDate;
        newReleaseDateTime.setHours(0);
        newReleaseDateTime.setMinutes(0);
        newReleaseDateTime.setSeconds(0);
      }
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
        }}
        className="input input-bordered"
      />
    </>
  );
};

export default DateSelector;
