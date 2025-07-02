/*
Modelo de teste unitário simples para componente funcional React.
Este exemplo usa o componente Footer, que apenas renderiza um texto fixo.
Use este modelo para componentes sem props ou lógica complexa.
*/

import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('deve renderizar o texto do rodapé', () => {
    expect.assertions(1);
    render(<Footer />);
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });
});
