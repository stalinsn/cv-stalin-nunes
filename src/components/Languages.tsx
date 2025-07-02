import { CvData } from '@/types/cv';

interface LanguagesProps {
  data: CvData;
  title: string;
}

export default function Languages({ data, title }: LanguagesProps) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="list-disc pl-6 space-y-1">
        {data.languages.map((lang) => (
          <li key={lang.name}>
            {lang.name}: <strong>{lang.level}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
