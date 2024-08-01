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

    return { weekDay, day, monthName, year };
  };

  if (!time) {
    return <div>Loading...</div>;
  }

  const formatedTime = formatTime(time);
  const formatedDate = formatDate(time);

  return (
    <div className="flex flex-col items-center ml-[4vw]">
      <p className="text-[10vw]">
        <span className="font-bold">{formatedTime.hours}</span>
        <span className="text-neutral-400">:</span>
        <span className="font-bold">{formatedTime.minutes}</span>
        <span className="text-neutral-400">:</span>
        <span className="inline-block text-neutral-400 font-bold w-[12vw]">
          {formatedTime.seconds}
        </span>
      </p>
      <p className="text-[4.5vw] font-bold">
        {formatedDate.weekDay}, {formatedDate.day} {formatedDate.monthName}
      </p>
    </div>
  );
};

export default Clock;
