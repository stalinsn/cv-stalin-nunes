import PanelAuthFrame from '@/features/ecommpanel/components/PanelAuthFrame';
import LoginForm from '@/features/ecommpanel/components/LoginForm';

export default function EcommPanelLoginPage() {
  return (
    <PanelAuthFrame
      title="Operação segura da sua loja"
      subtitle="Acesse o painel para configurar catálogo, conteúdo, logística e regras críticas de forma controlada."
      highlights={[
        'Autenticação por sessão e proteção CSRF.',
        'RBAC com papéis e permissões granulares.',
        'Base pronta para integração com API REST e banco.',
      ]}
    >
      <LoginForm />
    </PanelAuthFrame>
  );
}
