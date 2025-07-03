import React from 'react';
import '@/styles/components/section-toggler.css';
import { CvData } from '@/types/cv';

interface SummaryProps {
  data: CvData;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Summary({ data, title, open, setOpen }: SummaryProps) {
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
      <h2 className="text-xl font-semibold mb-2" style={{ paddingRight: 32 }}>{title}</h2>
      <div className={`section-content${open ? ' open' : ' closed'}`}
        dangerouslySetInnerHTML={{ __html: data?.summary }}
      />
    </section>
  );
}
