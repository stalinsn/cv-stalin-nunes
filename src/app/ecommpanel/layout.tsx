import '@/styles/ecommpanel/index.css';

export const metadata = {
  title: 'EcommPanel',
  description: 'Painel administrativo mock para gerenciamento do e-commerce.',
};

export default function EcommPanelLayout({ children }: { children: React.ReactNode }) {
  return <main className="panel-root">{children}</main>;
}
