import CategoryPage from "./CategoryPage";
import VerdictButton from "@/components/VerdictButton";

export default function Others() {
  return (
    <CategoryPage
      category="other"
      title="Others"
      subtitle="Everything that doesn't fit the weekly briefing or a personal piece."
      headingExtra={<VerdictButton />}
    />
  );
}
