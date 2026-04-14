import PageShell from "@/shared/components/layout/PageShell";
import ExerciseContainer from "@/features/training/components/smart/ExerciseContainer";

export const metadata = {
  title: "Exercise · The Atelier",
  description: "Identify the note or melodic sequence in the given harmonic context.",
};

export default function SessionPage() {
  return (
    <PageShell>
      <ExerciseContainer />
    </PageShell>
  );
}
