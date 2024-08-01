import Clock from "./components/Clock";
import PrayerTimeComponent from "./components/PrayerTime";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="flex-1 h-screen flex items-center justify-center ">
        <Clock />
      </div>
      <div className="flex-1 h-screen flex items-center justify-center ">
        <PrayerTimeComponent />
      </div>
    </main>
  );
}
