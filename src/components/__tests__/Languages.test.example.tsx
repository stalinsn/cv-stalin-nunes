/*
Modelo de teste unitário intermediário para componente React com props.
Este exemplo usa o componente Languages, que recebe uma lista de idiomas e renderiza cada um.
Use este modelo para componentes que recebem props simples.
*/

import { render, screen } from '@testing-library/react';
import Languages from '../Languages';

const mockLanguages = [
  { name: 'Português', level: 'Nativo' },
  { name: 'Inglês', level: 'Avançado' },
];

describe('Languages', () => {
  it('deve renderizar todos os idiomas e níveis', () => {
    render(<Languages languages={mockLanguages} />);
    expect(screen.getByText('Português')).toBeInTheDocument();
    expect(screen.getByText('Nativo')).toBeInTheDocument();
    expect(screen.getByText('Inglês')).toBeInTheDocument();
    expect(screen.getByText('Avançado')).toBeInTheDocument();
  });
});
