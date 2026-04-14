import PageShell from "@/shared/components/layout/PageShell";
import WorkshopConfigContainer from "@/features/training/components/smart/WorkshopConfigContainer";

export const metadata = {
  title: "Workshop Configuration · The Atelier",
  description: "Configure your ear training session — select harmonic base, target notes and exercise mode.",
};

export default function TrainingPage() {
  return (
    <PageShell>
      <WorkshopConfigContainer />
    </PageShell>
  );
}
