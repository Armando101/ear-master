import PageShell from "@/shared/components/layout/PageShell";
import ResultsContainer from "@/features/training/components/smart/ResultsContainer";

export const metadata = {
  title: "Session Results · The Atelier",
  description: "Review your performance from the completed ear training session.",
};

export default function ResultsPage() {
  return (
    <PageShell>
      <ResultsContainer />
    </PageShell>
  );
}
