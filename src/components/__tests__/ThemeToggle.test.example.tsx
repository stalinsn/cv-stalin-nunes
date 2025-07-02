/*
Modelo de teste unitário avançado para componente React com props, lógica e interação.
Este exemplo usa o componente ThemeToggle, que alterna o tema ao ser clicado.
Use este modelo para componentes com lógica de estado e eventos.
*/

import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('deve alternar o tema ao clicar', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Simula clique e verifica mudança de estado/ícone/texto
    fireEvent.click(button);
    // Exemplo: verifica se o botão mudou de ícone ou texto
    // Ajuste conforme a implementação real do ThemeToggle
    // expect(screen.getByLabelText('Tema escuro')).toBeInTheDocument();
  });
});
