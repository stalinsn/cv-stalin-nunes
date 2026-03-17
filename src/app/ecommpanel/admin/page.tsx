import { redirect } from 'next/navigation';
import { getPanelUserFromCookies } from '@/features/ecommpanel/server/auth';

const SECURITY_LAYERS = [
  {
    key: 'password-hash',
    title: 'Hash de senha com scrypt + salt',
    description:
      'A senha nunca é armazenada em texto puro. Aplicamos derivação criptográfica com salt aleatório por usuário, reduzindo impacto de vazamento de credenciais.',
  },
  {
    key: 'session-cookie',
    title: 'Sessão com cookie httpOnly + SameSite',
    description:
      'A sessão é mantida em cookie protegido contra leitura por JavaScript e com controle de contexto de envio. Isso mitiga vetores comuns de roubo de sessão no navegador.',
  },
  {
    key: 'csrf-token',
    title: 'Token CSRF para mutações',
    description:
      'Toda operação sensível de escrita exige token de anti-CSRF validado em header e cookie, impedindo execução de ações administrativas por requisições forjadas.',
  },
  {
    key: 'rate-limit',
    title: 'Rate limit por rota e fingerprint',
    description:
      'Rotas de autenticação e administração possuem limitação de taxa por janela de tempo e fingerprint da requisição, reduzindo abuso automatizado e brute force.',
  },
  {
    key: 'lockout',
    title: 'Lockout por tentativas de login',
    description:
      'Falhas consecutivas no login acionam bloqueio temporário da conta. A medida dificulta tentativa massiva de senhas e protege usuários privilegiados.',
  },
  {
    key: 'rbac',
    title: 'RBAC com permissões granulares e allow/deny',
    description:
      'As permissões efetivas são resolvidas por papel + overrides por usuário. Isso permite delegação precisa por área e bloqueio explícito de capacidades críticas.',
  },
  {
    key: 'audit',
    title: 'Auditoria de eventos críticos',
    description:
      'Eventos relevantes de autenticação e administração são registrados para rastreabilidade operacional, investigação de incidentes e governança de alterações.',
  },
] as const;

export default async function EcommPanelDashboardPage() {
  const user = await getPanelUserFromCookies();

  if (!user) {
    redirect('/ecommpanel/login');
  }

  return (
    <section className="panel-dashboard panel-grid" aria-labelledby="panel-dashboard-title">
      <div className="panel-card panel-card-hero">
        <p className="panel-kicker">Visão Geral</p>
        <h1 id="panel-dashboard-title">Painel administrativo do e-commerce</h1>
        <p className="panel-muted">
          Estrutura modular para gerenciar layout, catálogo, conteúdo e operação da loja com governança de acesso.
        </p>
        <div className="panel-tag-row" aria-label="Princípios do painel">
          <span className="panel-tag">Modular</span>
          <span className="panel-tag">Seguro</span>
          <span className="panel-tag">Escalável</span>
        </div>
      </div>

      <div className="panel-stats">
        <article className="panel-stat">
          <span className="panel-muted">Usuário atual</span>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </article>

        <article className="panel-stat">
          <span className="panel-muted">Perfis ativos</span>
          <strong>{user.roleIds.length}</strong>
          <span>{user.roleIds.join(', ')}</span>
        </article>

        <article className="panel-stat">
          <span className="panel-muted">Permissões efetivas</span>
          <strong>{user.permissions.length}</strong>
          <span>resolvidas por role + allow/deny</span>
        </article>
      </div>

      <article className="panel-card">
        <h2>Camadas de segurança implementadas</h2>
        <div className="panel-layer-accordion">
          {SECURITY_LAYERS.map((layer, index) => (
            <details className="panel-layer-item" key={layer.key} open={index === 0}>
              <summary>
                <span className="panel-layer-title">{layer.title}</span>
                <span className="panel-layer-hint">Ver detalhe técnico</span>
              </summary>
              <div className="panel-layer-content">
                <p>{layer.description}</p>
              </div>
            </details>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <h2>Próximos passos para o painel modular</h2>
        <p className="panel-muted">
          Conectar configurações do e-commerce (feature flags, catálogo, pricing, logística e conteúdo) via endpoints versionados (`/api/ecommpanel/*`)
          com persistência em banco e trilha de auditoria permanente.
        </p>
      </article>
    </section>
  );
}
