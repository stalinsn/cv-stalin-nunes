import { CvData } from "@/types/cv";
import React from "react";
import "@/styles/components/section-toggler.css";

interface ExperienceProps {
  data: CvData;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Experience({
  data,
  title,
  open,
  setOpen,
}: ExperienceProps) {
  return (
    <section className="card">
      <button
        className="section-toggler"
        aria-expanded={open}
        title={open ? "Minimizar" : "Expandir"}
        onClick={() => setOpen(!open)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 9L11 13L15 9"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h2
        className="text-lg font-semibold experience-title"
        style={{ paddingRight: 32 }}
      >
        {title}
      </h2>
      <div className={`section-content${open ? " open" : " closed"}`}>
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
      </div>
    </section>
  );
}
