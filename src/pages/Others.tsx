import CategoryPage from "./CategoryPage";
import VerdictButton from "@/components/VerdictButton";
import LedgerButton from "@/components/LedgerButton";

export default function Others() {
  return (
    <CategoryPage
      category="other"
      title="Others"
      subtitle="Everything that doesn't fit the weekly briefing or a personal piece."
      headingExtra={<span className="flex items-center gap-2"><VerdictButton /><LedgerButton /></span>}
    />
  );
}
