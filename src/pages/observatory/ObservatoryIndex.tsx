import { useEffect, useState } from "react";
import Intro from "./sections/Intro";
import Walkthrough from "./sections/Walkthrough";
import Atlas from "./sections/Atlas";
import Lab from "./sections/Lab";
import Methodology from "./sections/Methodology";
import { fetchObservatory, type ObservatoryData } from "./types";

export default function ObservatoryIndex() {
  const [data, setData] = useState<ObservatoryData | null>(null);
  const [country, setCountry] = useState("USA");
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Margin of Error — AI, Productivity and Prices";
    fetchObservatory()
      .then((d) => {
        setData(d);
        setCountry(d.default_country || "USA");
      })
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <Intro />
      <Walkthrough data={data} country={country} />
      <Atlas data={data} country={country} setCountry={setCountry} />
      <Lab />
      <Methodology data={data} />
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <p className="text-xs font-mono" style={{ color: "var(--obs-warn)" }}>
            Live data is temporarily unavailable; the walkthrough and lab still work.
          </p>
        </div>
      )}
    </>
  );
}
