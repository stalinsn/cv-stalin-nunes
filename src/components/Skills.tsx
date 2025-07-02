import React from 'react';

interface SkillsProps {
  titleMain: string;
  titleTech: string;
  data: {
    coreSkills: string[];
    technicalSkills: Record<string, string>;
  };
}

export default function Skills({ data, titleMain, titleTech }: SkillsProps) {
  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-4">{titleMain}</h2>

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
    </section>
  );
}
