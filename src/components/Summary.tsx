import { CvData } from '@/types/cv';

interface SummaryProps {
  data: CvData;
  title: string;
}

export default function Summary({ data, title }: SummaryProps) {
  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: data?.summary }} />
    </section>
  );
}
