import Clock from "./components/Clock";
import PrayerTimeComponent from "./components/PrayerTime";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="h-screen flex items-center justify-center w-[66vw]">
        <Clock />
      </div>
      <div className="h-screen flex items-center justify-center w-[34vw]">
        <PrayerTimeComponent />
      </div>
    </main>
  );
}
