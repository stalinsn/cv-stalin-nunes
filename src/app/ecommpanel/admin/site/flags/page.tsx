import { redirect } from 'next/navigation';
import { getPanelUserFromCookies } from '@/features/ecommpanel/server/auth';

const INITIAL_FLAGS = [
  'home.banner.principal',
  'home.prateleira.ofertas',
  'plp.filtros.lateral',
  'pdp.bloco.avaliacoes',
  'institucional.quem-somos.hero',
] as const;

export default async function SiteFlagsAdminPage() {
  const user = await getPanelUserFromCookies();
  if (!user) redirect('/ecommpanel/login');

  return (
    <section className="panel-grid">
      <article className="panel-card panel-card-hero">
        <p className="panel-kicker">Experiência do Site</p>
        <h1>Feature Flags</h1>
        <p className="panel-muted">Próxima etapa: painel visual para ativação por página/rota. Nesta fase mostramos o catálogo inicial de chaves.</p>
      </article>

      <article className="panel-card">
        <h2>Catálogo inicial</h2>
        <ul className="panel-layer-list">
          {INITIAL_FLAGS.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
