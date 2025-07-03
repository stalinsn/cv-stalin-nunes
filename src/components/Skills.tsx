import React from 'react';
import '@/styles/components/section-toggler.css';

interface SkillsProps {
  titleMain: string;
  titleTech: string;
  data: {
    coreSkills: string[];
    technicalSkills: Record<string, string>;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Skills({ data, titleMain, titleTech, open, setOpen }: SkillsProps) {
  return (
    <section className="card">
      <button
        className="section-toggler"
        aria-expanded={open}
        title={open ? 'Minimizar' : 'Expandir'}
        onClick={() => setOpen(!open)}
      >
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 9L11 13L15 9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <h2 className="text-xl font-semibold mb-4" style={{ paddingRight: 32 }}>{titleMain}</h2>
      <div className={`section-content${open ? ' open' : ' closed'}`}> 
        <div className="tag-list mb-6">
          {data.coreSkills.map((item, index) => (
            <span key={index} className="tag">
              {item}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-medium mb-2">{titleTech}</h3>
        <table className="w-full">
          <tbody>
            {Object.entries(data.technicalSkills).map(([key, value]) => (
              <tr key={key}>
                <th className="pr-4 text-left align-top">{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
