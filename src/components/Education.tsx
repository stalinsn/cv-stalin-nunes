import { CvData } from "@/types/cv";

interface EducationProps {
  data: CvData;
  title: string;
}

export default function Education({ data, title }: EducationProps) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold">{title}</h2>
      {data.education?.map((ed) => (
        <div key={ed.institution} className="mb-4">
          <div className="font-semibold">{ed.institution}</div>
          <div className="text-sm text-muted">
            {ed.degree} · {ed.period}
          </div>
          {ed.details && <p className="mt-1">{ed.details}</p>}
        </div>
      ))}
    </section>
  );
}
