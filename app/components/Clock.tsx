"use client";

import React, { useState, useEffect, use } from "react";

const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
  }, []);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerID);
  }, []);

  const tick = () => {
    setTime(new Date());
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const [weekDay, day, monthName, year] = date
      // @ts-ignore
      .toLocaleDateString(undefined, options)
      .split(" ");

    const weekDayWithoutComma = weekDay.trim().endsWith(",")
      ? weekDay.slice(0, -1)
      : weekDay;

    return {
      weekDay: weekDayWithoutComma,
      day: day.trim(),
      monthName: monthName.trim(),
      year: year.trim(),
    };
  };

  if (!time) {
    return <div>Loading...</div>;
  }

  const formatedTime = formatTime(time);
  const formatedDate = formatDate(time);

  return (
    <div className="">
      <p className="text-[14.5vw] text-center">
        <span className="font-bold">{formatedTime.hours}</span>
        <span className="text-neutral-400">:</span>
        <span className="font-bold">{formatedTime.minutes}</span>
        <span className="text-neutral-400">:</span>
        <span className="inline-block text-neutral-400 font-bold w-[18vw]">
          {formatedTime.seconds}
        </span>
      </p>
      <p className="text-[5.5vw] font-bold text-center">
        {formatedDate.weekDay}, {formatedDate.day} {formatedDate.monthName}
      </p>
    </div>
  );
};

export default Clock;
