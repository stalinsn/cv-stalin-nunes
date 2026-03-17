'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PanelPermission, PanelRole, PanelUser } from '@/features/ecommpanel/types/auth';

type UsersApiResponse = {
  users?: PanelUser[];
  roles?: PanelRole[];
  permissions?: PanelPermission[];
  error?: string;
};

type MeApiResponse = {
  csrfToken?: string;
};

type UserForm = {
  name: string;
  email: string;
  roleIds: string[];
  permissionsAllow: string[];
  permissionsDeny: string[];
  temporaryPassword: string;
};

const INITIAL_FORM: UserForm = {
  name: '',
  email: '',
  roleIds: ['viewer'],
  permissionsAllow: [],
  permissionsDeny: [],
  temporaryPassword: '',
};

function toggleString(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

export default function AdminUsersManager() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<PanelUser[]>([]);
  const [roles, setRoles] = useState<PanelRole[]>([]);
  const [permissions, setPermissions] = useState<PanelPermission[]>([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [form, setForm] = useState<UserForm>(INITIAL_FORM);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.roleIds.some((role) => role.toLowerCase().includes(term))
      );
    });
  }, [search, users]);

  const activeUsers = useMemo(() => users.filter((user) => user.active).length, [users]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [meRequest, usersRequest] = await Promise.all([
        fetch('/api/ecommpanel/auth/me', { cache: 'no-store' }),
        fetch('/api/ecommpanel/admin/users', { cache: 'no-store' }),
      ]);

      const mePayload = (await meRequest.json().catch(() => null)) as MeApiResponse | null;
      if (mePayload?.csrfToken) {
        setCsrfToken(mePayload.csrfToken);
      }

      const usersPayload = (await usersRequest.json().catch(() => null)) as UsersApiResponse | null;
      if (!usersRequest.ok) {
        setError(usersPayload?.error || 'Não foi possível carregar usuários.');
        return;
      }

      setUsers(usersPayload?.users || []);
      setRoles(usersPayload?.roles || []);
      setPermissions(usersPayload?.permissions || []);
    } catch {
      setError('Erro de rede ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const request = await fetch('/api/ecommpanel/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          ...form,
          roleIds: form.roleIds,
          permissionsAllow: form.permissionsAllow,
          permissionsDeny: form.permissionsDeny,
          temporaryPassword: form.temporaryPassword.trim() || undefined,
        }),
      });

      const payload = (await request.json().catch(() => null)) as {
        error?: string;
        user?: PanelUser;
        temporaryPassword?: string;
      } | null;

      if (!request.ok) {
        setError(payload?.error || 'Falha ao criar usuário.');
        return;
      }

      setForm(INITIAL_FORM);
      setSuccess(`Usuário criado com sucesso. Senha temporária: ${payload?.temporaryPassword || '(gerada)'}.`);
      await loadData();
    } catch {
      setError('Erro de rede ao criar usuário.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel-users panel-grid" aria-labelledby="panel-users-title">
      <div className="panel-card panel-card-hero">
        <p className="panel-kicker">Controle de Acesso</p>
        <h1 id="panel-users-title">Gestão de usuários e permissões</h1>
        <p className="panel-muted">Modelo RBAC com overrides por usuário, pronto para migrar para persistência real.</p>
      </div>

      <div className="panel-stats">
        <article className="panel-stat">
          <span className="panel-muted">Usuários cadastrados</span>
          <strong>{users.length}</strong>
          <span>Total no ambiente mock</span>
        </article>

        <article className="panel-stat">
          <span className="panel-muted">Usuários ativos</span>
          <strong>{activeUsers}</strong>
          <span>{users.length ? `${Math.round((activeUsers / users.length) * 100)}% da base` : 'Sem usuários'}</span>
        </article>

        <article className="panel-stat">
          <span className="panel-muted">Visíveis no filtro</span>
          <strong>{filteredUsers.length}</strong>
          <span>Busca por nome, e-mail ou perfil</span>
        </article>
      </div>

      <div className="panel-users-layout">
        <aside className="panel-card panel-users-form-card">
          <h2>Novo usuário</h2>

          <form className="panel-form" onSubmit={onSubmit}>
            <div className="panel-field">
              <label htmlFor="panel-user-name">Nome</label>
              <input
                id="panel-user-name"
                className="panel-input"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>

            <div className="panel-field">
              <label htmlFor="panel-user-email">E-mail</label>
              <input
                id="panel-user-email"
                className="panel-input"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>

            <div className="panel-field">
              <label htmlFor="panel-user-temp-pass">Senha temporária (opcional)</label>
              <input
                id="panel-user-temp-pass"
                className="panel-input"
                type="text"
                value={form.temporaryPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, temporaryPassword: event.target.value }))}
                placeholder="Se vazio, será gerada automaticamente"
              />
            </div>

            <section className="panel-form-section" aria-labelledby="panel-role-section">
              <h3 id="panel-role-section">Perfis de acesso</h3>
              <div className="panel-role-list" role="group" aria-label="Perfis de acesso">
                {roles.map((role) => (
                  <label className="panel-role-item" key={role.id}>
                    <input
                      type="checkbox"
                      checked={form.roleIds.includes(role.id)}
                      onChange={() => setForm((prev) => ({ ...prev, roleIds: toggleString(prev.roleIds, role.id) }))}
                    />
                    <span>
                      <strong>{role.name}</strong>
                      <small>{role.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="panel-form-section" aria-labelledby="panel-perm-allow-section">
              <h3 id="panel-perm-allow-section">Permissões adicionais</h3>
              <div className="panel-permission-list" role="group" aria-label="Permissões allow">
                {permissions.map((permission) => (
                  <label className="panel-role-item" key={`allow-${permission}`}>
                    <input
                      type="checkbox"
                      checked={form.permissionsAllow.includes(permission)}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          permissionsAllow: toggleString(prev.permissionsAllow, permission),
                          permissionsDeny: prev.permissionsDeny.filter((item) => item !== permission),
                        }))
                      }
                    />
                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="panel-form-section" aria-labelledby="panel-perm-deny-section">
              <h3 id="panel-perm-deny-section">Permissões bloqueadas</h3>
              <div className="panel-permission-list" role="group" aria-label="Permissões deny">
                {permissions.map((permission) => (
                  <label className="panel-role-item" key={`deny-${permission}`}>
                    <input
                      type="checkbox"
                      checked={form.permissionsDeny.includes(permission)}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          permissionsDeny: toggleString(prev.permissionsDeny, permission),
                          permissionsAllow: prev.permissionsAllow.filter((item) => item !== permission),
                        }))
                      }
                    />
                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            </section>

            <button className="panel-btn panel-btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Criando...' : 'Criar usuário'}
            </button>
          </form>

          {error ? (
            <p className="panel-feedback panel-feedback-error" role="alert">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="panel-feedback panel-feedback-success" role="status">
              {success}
            </p>
          ) : null}
        </aside>

        <div className="panel-card">
          <div className="panel-users-toolbar">
            <h2>Usuários existentes</h2>
            <input
              className="panel-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, e-mail ou perfil"
              aria-label="Buscar usuários"
            />
          </div>

          {loading ? <p className="panel-muted">Carregando usuários...</p> : null}

          {!loading && filteredUsers.length === 0 ? <p className="panel-table-empty">Nenhum usuário encontrado para o filtro atual.</p> : null}

          {!loading && filteredUsers.length > 0 ? (
            <div className="panel-table-wrap">
              <table className="panel-table" aria-label="Tabela de usuários">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Perfis</th>
                    <th>Permissões allow</th>
                    <th>Permissões deny</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                        <br />
                        <span className="panel-muted">{user.email}</span>
                      </td>
                      <td>
                        {user.roleIds.map((role) => (
                          <span className="panel-badge" key={`${user.id}-${role}`}>
                            {role}
                          </span>
                        ))}
                      </td>
                      <td>
                        {user.permissionsAllow.length ? (
                          user.permissionsAllow.map((permission) => (
                            <span className="panel-badge" key={`${user.id}-allow-${permission}`}>
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="panel-muted">-</span>
                        )}
                      </td>
                      <td>
                        {user.permissionsDeny.length ? (
                          user.permissionsDeny.map((permission) => (
                            <span className="panel-badge" key={`${user.id}-deny-${permission}`}>
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="panel-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`panel-badge ${user.active ? 'panel-badge-success' : 'panel-badge-neutral'}`}>{user.active ? 'Ativo' : 'Inativo'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
