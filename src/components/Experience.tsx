import { CvData } from "@/types/cv";

interface ExperienceProps {
  data: CvData;
  title: string;
}

export default function Experience({ data, title }: ExperienceProps) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold experience-title">{title}</h2>
      {data.experience?.map((exp) => (
        <div key={exp.company} className="experience-item">
          <div className="experience-header">
            <span className="experience-role">{exp.role}</span>
            <span className="experience-sep">|</span>
            <span className="experience-company">{exp.company}</span>
            <span className="experience-dot">·</span>
            <span className="experience-period">{exp.period}</span>
            <span className="experience-dot">·</span>
            <span className="experience-location">{exp.location}</span>
          </div>
          <ul className="experience-bullets">
            {exp.bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )) || <p>Nenhuma experiência cadastrada.</p>}
    </section>
  );
}
