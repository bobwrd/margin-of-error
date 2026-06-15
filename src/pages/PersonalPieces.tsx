import CategoryPage from "./CategoryPage";
import VerdictButton from "@/components/VerdictButton";
import LedgerButton from "@/components/LedgerButton";
import ObservatoryButton from "@/components/ObservatoryButton";

export default function PersonalPieces() {
  return (
    <CategoryPage
      category="personal"
      title="Personal Pieces"
      subtitle="My own essays, with PDF and bibliography."
      headingExtra={<span className="flex items-center gap-2"><VerdictButton /><LedgerButton /><ObservatoryButton /></span>}
    />
  );
}
