import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

function extractPrayerTimes(html: string): { name: string; time: string }[] {
  // Load the HTML into cheerio
  const $ = cheerio.load(html);

  // Initialize an object to store prayer times
  const prayerTimes: Record<string, string> = {};

  // Select each list item and extract prayer names and times
  $("ul > li").each((_, element) => {
    const prayerName = $(element).contents().first().text().trim();
    const prayerTime = $(element).find("span").text().trim();

    if (prayerName && prayerTime) {
      prayerTimes[prayerName] = prayerTime;
    }
  });

  const timesArray = Object.entries(prayerTimes).map(([name, time]) => ({
    name,
    time,
  }));

  return timesArray;
}

function getFormattedDate(): string {
  const date = new Date();

  // Array of weekday names
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extracting day, date, month, and year
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Formatting the date as "Weekday Day Month Year"
  return `${weekday} ${day} ${month} ${year}`;
}

async function fetchPrayerTimes(): Promise<Response> {
  const url =
    "https://www.islamiskaforbundet.se/wp-content/plugins/bonetider/Bonetider_Widget.php";

  const headers = {
    Accept: "*/*",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://www.islamiskaforbundet.se",
    Priority: "u=1, i",
    Referer: "https://www.islamiskaforbundet.se/bonetider/",
    "Sec-CH-UA": '"Chromium";v="127", "Not)A;Brand";v="99"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"macOS"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
  };

  // Use URLSearchParams to create form data
  const formData = new URLSearchParams();
  formData.append("ifis_bonetider_widget_city", "Södertälje, SE");
  formData.append("ifis_bonetider_widget_date", getFormattedDate());

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: formData.toString(),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Return the response
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

interface PrayerTime {
  name: string;
  time: string;
  active?: boolean;
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

export async function GET(req: Request) {
  let times = [];
  try {
    const res = await fetchPrayerTimes();
    const rawData = await res.text();
    const prayerTimeArray = extractPrayerTimes(rawData);
    const withActiveStatus = addActiveStatus(prayerTimeArray);
    times = withActiveStatus;
  } catch (error) {
    return NextResponse.json({ success: false, times: [] });
  }
  return NextResponse.json({ success: true, times });
}
