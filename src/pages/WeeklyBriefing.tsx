import CategoryPage from "./CategoryPage";
import VerdictButton from "@/components/VerdictButton";

export default function WeeklyBriefing() {
  return (
    <CategoryPage
      category="weekly"
      title="Weekly Briefing"
      subtitle="The week's economics, law, and policy signals — written every Monday."
      headingExtra={<VerdictButton />}
    />
  );
}
