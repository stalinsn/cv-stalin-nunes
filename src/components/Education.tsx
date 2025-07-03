import { CvData } from "@/types/cv";
import React from "react";
import "@/styles/components/section-toggler.css";

interface EducationProps {
  data: CvData;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Education({ data, title, open, setOpen }: EducationProps) {
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
      <h2 className="text-lg font-semibold" style={{ paddingRight: 32 }}>
        {title}
      </h2>
      <div className={`section-content${open ? " open" : " closed"}`}>
        {data.education?.map((ed) => (
          <div key={ed.institution} className="mb-4">
            <div className="font-semibold">{ed.institution}</div>
            <div className="text-sm text-muted">
              {ed.degree} · {ed.period}
            </div>
            {ed.details && <p className="mt-1">{ed.details}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
