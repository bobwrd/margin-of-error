import CategoryPage from "./CategoryPage";
import VerdictButton from "@/components/VerdictButton";
import LedgerButton from "@/components/LedgerButton";
import ObservatoryButton from "@/components/ObservatoryButton";
import ArenaButton from "@/components/ArenaButton";

export default function WeeklyBriefing() {
  return (
    <CategoryPage
      category="weekly"
      title="Weekly Briefing"
      subtitle="The week's economics, law, and policy signals — written every Monday."
      headingExtra={<span className="flex items-center gap-2"><VerdictButton /><LedgerButton /><ObservatoryButton /><ArenaButton /></span>}
    />
  );
}
