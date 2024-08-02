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

function addActiveStatus(prayerTimes: PrayerTime[]): PrayerTime[] {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Convert current time to minutes since midnight
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  // Map through the prayer times to determine active status
  return prayerTimes.map((prayer, index) => {
    // Split prayer time into hours and minutes
    const [prayerHours, prayerMinutes] = prayer.time.split(":").map(Number);

    // Calculate total minutes since midnight for this prayer time
    const prayerTotalMinutes = prayerHours * 60 + prayerMinutes;

    // Calculate the total minutes for the next prayer time
    let nextPrayerTotalMinutes;
    if (index < prayerTimes.length - 1) {
      const [nextPrayerHours, nextPrayerMinutes] = prayerTimes[index + 1].time
        .split(":")
        .map(Number);
      nextPrayerTotalMinutes = nextPrayerHours * 60 + nextPrayerMinutes;
    } else {
      // If it's the last prayer, assume next prayer time is next day's Fajr
      const [firstPrayerHours, firstPrayerMinutes] = prayerTimes[0].time
        .split(":")
        .map(Number);
      nextPrayerTotalMinutes =
        firstPrayerHours * 60 + firstPrayerMinutes + 24 * 60; // Add 24 hours
    }

    // Determine if the current time is within the range of this prayer
    const isActive =
      currentTotalMinutes >= prayerTotalMinutes &&
      currentTotalMinutes < nextPrayerTotalMinutes;

    // Return a new object with the active status
    return {
      ...prayer,
      active: isActive,
    };
  });
}

const PrayerTimeComponent: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);

  useEffect(() => {
    // Function to fetch prayer times
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch("/prayertime");

        // Check if the response is okay
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: ApiResponse = await response.json();

        // Check if the response indicates success and if data is valid
        if (data.success && Array.isArray(data.times)) {
          setPrayerTimes(addActiveStatus(data.times));
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
              <span className="text-[3.5vw]">{prayer.name}</span>{" "}
              <span className="font-bold text-[6vw]">{prayer.time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PrayerTimeComponent;
