import { CvData } from '@/types/cv';

type HeaderProps = {
  data: CvData;
};

export default function Header({ data }: HeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold text-accent">{data.name}</h1>
      <h2 className="text-lg text-foreground-light">{data.title}</h2>
      <p>{data.location}</p>
      <p className="text-sm">
        <a href={`tel:${data.contact.phone.replace(/\D/g, '')}`}>{data.contact.phone}</a> ·{' '}
        <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a> ·{' '}
        <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    </header>
  );
}
