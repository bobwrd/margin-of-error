import CategoryPage from "./CategoryPage";
import VerdictButton from "@/components/VerdictButton";

export default function PersonalPieces() {
  return (
    <CategoryPage
      category="personal"
      title="Personal Pieces"
      subtitle="My own essays, with PDF and bibliography."
      headingExtra={<VerdictButton />}
    />
  );
}
