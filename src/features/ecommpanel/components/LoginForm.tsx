'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LoginState = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginState>({
    email: 'main@ecommpanel.local',
    password: 'Admin@123456',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/ecommpanel/auth/me', { cache: 'no-store' })
      .then((res) => {
        if (!mounted || !res.ok) return;
        router.replace('/ecommpanel/admin');
      })
      .catch(() => {
        // no-op
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch('/api/ecommpanel/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setIsError(true);
        setMessage(payload?.error || 'Falha ao autenticar.');
        return;
      }

      router.replace('/ecommpanel/admin');
    } catch {
      setIsError(true);
      setMessage('Erro de rede ao autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-auth" aria-labelledby="panel-login-title">
      <header className="panel-auth-header">
        <h2 id="panel-login-title">Entrar no painel</h2>
        <p>Use seu usuário administrativo para acessar as configurações da operação.</p>
      </header>

      <form className="panel-form" onSubmit={onSubmit} noValidate>
        <div className="panel-field">
          <label htmlFor="panel-login-email">E-mail</label>
          <input
            id="panel-login-email"
            className="panel-input"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </div>

        <div className="panel-field">
          <label htmlFor="panel-login-password">Senha</label>
          <input
            id="panel-login-password"
            className="panel-input"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </div>

        <button className="panel-btn panel-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="panel-links">
        <Link href="/ecommpanel/forgot-password" className="panel-link">
          Esqueci minha senha
        </Link>
        <Link href="/" className="panel-link">
          Voltar para galeria
        </Link>
      </div>

      {message ? (
        <p className={`panel-feedback ${isError ? 'panel-feedback-error' : 'panel-feedback-success'}`} role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
