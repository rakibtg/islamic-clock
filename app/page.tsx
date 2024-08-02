import Clock from "./components/Clock";
import KeepAwake from "./components/KeepAwake";
import PrayerTimeComponent from "./components/PrayerTime";
import FullScreenToggler from "./components/FullScreenToggler";

export default function Home() {
  return (
    <FullScreenToggler>
      <KeepAwake>
        <main className="flex min-h-screen">
          <div className="h-screen flex items-center justify-center w-[66vw]">
            <Clock />
          </div>
          <div className="h-screen flex items-center justify-center w-[34vw]">
            <PrayerTimeComponent />
          </div>
        </main>
      </KeepAwake>
    </FullScreenToggler>
  );
}
