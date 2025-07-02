import { CvData } from "@/types/cv";

interface ExperienceProps {
  data: CvData;
  title: string;
}

export default function Experience({ data, title }: ExperienceProps) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold">{title}</h2>
      {data.experience?.map((exp) => (
        <div key={exp.company}>
          <span>
            {exp.role} · {exp.company}
          </span>
          <span>
            {exp.period} | {exp.location}
          </span>
          <ul>
            {exp.bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )) || <p>Nenhuma experiência cadastrada.</p>}
    </section>
  );
}
