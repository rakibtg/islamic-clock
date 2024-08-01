"use client";

import React, { useState, useEffect } from "react";

// Define the PrayerTime interface
interface PrayerTime {
  name: string;
  time: string;
  active: boolean;
}

// Define the API response interface
interface ApiResponse {
  success: boolean;
  times: PrayerTime[];
}

const PrayerTimeComponent: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);

  useEffect(() => {
    // Function to fetch prayer times
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch("http://localhost:4040/prayertime");

        // Check if the response is okay
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: ApiResponse = await response.json();

        // Check if the response indicates success and if data is valid
        if (data.success && Array.isArray(data.times)) {
          setPrayerTimes(data.times);
        } else {
          console.warn("Invalid data format or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch prayer times:", error);
      }
    };

    // Fetch prayer times on initial render
    fetchPrayerTimes();

    // Set up interval to fetch prayer times every 24 hours (86400000 milliseconds)
    const intervalId = setInterval(fetchPrayerTimes, 86400000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* <p className="">Prayer Times</p> */}
      <ul className="">
        {prayerTimes.map((prayer) => {
          if (prayer.name === "Shuruk") return null;

          return (
            <li
              key={prayer.name}
              className={`${
                prayer.active ? "text-green-300" : "text-neutral-300"
              } flex items-center gap-[1.5vw]`}
            >
              <span className="text-[3vw]">{prayer.name}</span>{" "}
              <span className="font-bold text-[5.5vw]">{prayer.time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PrayerTimeComponent;
