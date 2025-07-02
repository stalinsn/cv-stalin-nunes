import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { CvData } from '@/types/cv';

describe('Summary', () => {
  it('deve renderizar o título e o resumo corretamente', () => {
    const mockData: CvData = {
      name: 'Teste',
      title: 'Dev',
      location: 'SP',
      contact: { phone: '', email: '', linkedin: '' },
      summary: '<strong>Resumo de Teste</strong>',
      coreSkills: [],
      technicalSkills: {},
      languages: [],
      experience: [],
      education: [],
      interests: [],
    };
    render(<Summary data={mockData} title="Resumo Profissional" />);
    expect(screen.getByText('Resumo Profissional')).toBeInTheDocument();
    expect(screen.getByText('Resumo de Teste', { selector: 'strong' })).toBeInTheDocument();
  });
});
