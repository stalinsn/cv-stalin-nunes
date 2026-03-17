import Link from 'next/link';
import { DocsMarkdown } from './DocsMarkdown';
import styles from './DocsShell.module.css';
import { getDocsGroups, getNeighborNotes, type DocsNote } from '@/features/docs/server/source';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function isActiveRoute(activePath: string, targetPath: string): boolean {
  return activePath === targetPath;
}

function getSectionSpotlight(note: DocsNote) {
  if (note.sectionKey === 'guias') {
    return {
      title: 'Guia orientado por fluxo',
      description: 'Leitura pensada para explicar responsabilidades, ordem de execução e trechos reais do código com foco no fluxo da implementação.',
      icon: (
        <svg viewBox="0 0 64 64" aria-hidden="true" className={styles.spotlightGlyph}>
          <path d="M14 18c0-3.3 2.7-6 6-6h18c4.4 0 8 3.6 8 8v28H24c-3.3 0-6 2.7-6 6V18Z" />
          <path d="M24 54c0-3.3 2.7-6 6-6h20V24c0-4.4-3.6-8-8-8" />
          <path d="M23 24h15" />
          <path d="M23 31h17" />
          <path d="M23 38h11" />
        </svg>
      ),
    };
  }

  if (note.sectionKey === 'slides') {
    return {
      title: 'Recorte de apresentação',
      description: 'Bloco mais curto e direto, útil para roteiro, revisão rápida e material de apoio em demonstração ou treinamento.',
      icon: (
        <svg viewBox="0 0 64 64" aria-hidden="true" className={styles.spotlightGlyph}>
          <rect x="12" y="12" width="40" height="28" rx="4" />
          <path d="M32 40v12" />
          <path d="M23 52h18" />
          <path d="M20 20h24" />
          <path d="M20 27h16" />
        </svg>
      ),
    };
  }

  return {
    title: 'Base estrutural do projeto',
    description: 'Nota de referência para contratos, arquitetura, runbook e organização do workspace. É a camada mais estável da documentação.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className={styles.spotlightGlyph}>
        <path d="M16 44V20l16-8 16 8v24l-16 8-16-8Z" />
        <path d="M32 12v40" />
        <path d="M16 20l16 8 16-8" />
        <path d="M16 32l16 8 16-8" />
      </svg>
    ),
  };
}

export function DocsShell({ note }: { note: DocsNote }) {
  const groups = getDocsGroups();
  const neighbors = getNeighborNotes(note);
  const toc = note.headings.filter((heading) => heading.level >= 2 && heading.level <= 3);
  const isHome = note.routePath === '/docs';
  const totalNotes = groups.reduce((total, group) => total + group.notes.length, 0);
  const spotlight = getSectionSpotlight(note);
  const spotlightToneClass =
    note.sectionKey === 'guias'
      ? styles.spotlightGuias
      : note.sectionKey === 'slides'
        ? styles.spotlightSlides
        : styles.spotlightBase;

  return (
    <main className={`${styles.docsApp} panel-root`}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <Link href="/docs" className={styles.brandMark}>
            Developer Atlas
          </Link>
          <p className={styles.brandCopy}>Arquitetura, APIs, operação e trilhas técnicas do workspace em um único lugar.</p>
        </div>
        <div className={styles.topbarActions}>
          <Link href="/docs/guia" className={styles.topbarPill}>
            Guia
          </Link>
          <Link href="/docs/guias" className={styles.topbarPill}>
            Guias
          </Link>
          <Link href="/docs/slides" className={styles.topbarPill}>
            Slides
          </Link>
          <span className={styles.topbarStatus}>{totalNotes} notas</span>
        </div>
      </header>

      <div className={styles.frame}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarEyebrow}>Navegação</span>
              <h2 className={styles.sidebarTitle}>Mapa da documentação</h2>
            </div>
            <div className={styles.sidebarScroll}>
              {groups.map((group) => (
                <section key={group.key} className={styles.navGroup}>
                  <div className={styles.navGroupHeader}>
                    <span className={styles.navGroupTitle}>{group.label}</span>
                    <p className={styles.navGroupDescription}>{group.description}</p>
                  </div>
                  <div className={styles.navLinks}>
                    {group.notes.map((item) => (
                      <Link
                        key={item.routePath}
                        href={item.routePath}
                        className={`${styles.navLink} ${isActiveRoute(note.routePath, item.routePath) ? styles.navLinkActive : ''}`}
                      >
                        <span className={styles.navLinkTitle}>{item.shortTitle}</span>
                        <span className={styles.navLinkMeta}>{item.sectionLabel}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </aside>

        <section className={`${styles.contentColumn} ${isHome ? styles.contentColumnWide : ''}`}>
          <article className={styles.articleCard}>
            <div className={styles.articleHero}>
              <div className={styles.articleMetaRow}>
                <span className={styles.sectionBadge}>{note.sectionLabel}</span>
                <span className={styles.sourceBadge}>{note.routePath}</span>
              </div>
              <h1 className={styles.articleTitle}>{note.title}</h1>
              {note.description ? <p className={styles.articleLead}>{note.description}</p> : null}
              {!isHome ? (
                <div className={`${styles.sectionSpotlight} ${spotlightToneClass}`}>
                  <div className={styles.spotlightIconShell}>{spotlight.icon}</div>
                  <div className={styles.spotlightCopy}>
                    <span className={styles.spotlightEyebrow}>Recorte da seção</span>
                    <strong className={styles.spotlightTitle}>{spotlight.title}</strong>
                    <p className={styles.spotlightText}>{spotlight.description}</p>
                  </div>
                </div>
              ) : null}
              <div className={styles.articleStats}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>{isHome ? 'Notas' : 'Atualizado'}</span>
                  <strong className={styles.statValue}>{isHome ? totalNotes : formatDate(note.updatedAt)}</strong>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>{isHome ? 'Trilhas' : 'Seções'}</span>
                  <strong className={styles.statValue}>{isHome ? groups.length : toc.length || 1}</strong>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Tags</span>
                  <strong className={styles.statValue}>{note.tags.length || 0}</strong>
                </div>
              </div>
              {note.tags.length ? (
                <div className={styles.tagRow}>
                  {note.tags.map((tag) => (
                    <span key={tag} className={styles.tagPill}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {isHome ? (
              <section className={styles.homeBoard}>
                {groups.map((group) => {
                  const featuredNotes = group.notes.filter((item) => item.routePath !== '/docs').slice(0, 4);
                  return (
                    <article key={group.key} className={styles.homeCard}>
                      <div className={styles.homeCardHeader}>
                        <div>
                          <span className={styles.sidebarEyebrow}>{group.label}</span>
                          <h2 className={styles.homeCardTitle}>{group.description}</h2>
                        </div>
                        <span className={styles.homeCardStat}>{group.notes.length} notas</span>
                      </div>
                      <div className={styles.homeLinkList}>
                        {featuredNotes.map((item) => (
                          <Link key={item.routePath} href={item.routePath} className={styles.homeLink}>
                            <strong>{item.shortTitle}</strong>
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : null}

            <DocsMarkdown blocks={note.blocks} lead={note.description} currentInternalKey={note.internalKey} />

            {!isHome ? (
              <footer className={styles.articleFooter}>
                {neighbors.previous ? (
                  <Link href={neighbors.previous.routePath} className={styles.pagerCard}>
                    <span className={styles.pagerLabel}>Anterior</span>
                    <strong className={styles.pagerTitle}>{neighbors.previous.shortTitle}</strong>
                  </Link>
                ) : (
                  <span className={styles.pagerGhost} />
                )}
                {neighbors.next ? (
                  <Link href={neighbors.next.routePath} className={styles.pagerCard}>
                    <span className={styles.pagerLabel}>Próximo</span>
                    <strong className={styles.pagerTitle}>{neighbors.next.shortTitle}</strong>
                  </Link>
                ) : (
                  <span className={styles.pagerGhost} />
                )}
              </footer>
            ) : null}
          </article>
        </section>

        {!isHome ? (
          <aside className={styles.tocColumn}>
            <div className={styles.tocCard}>
              <span className={styles.sidebarEyebrow}>Nesta página</span>
              <h2 className={styles.tocTitle}>Sumário rápido</h2>
              {toc.length ? (
                <nav className={styles.tocNav}>
                  {toc.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`${styles.tocLink} ${heading.level === 3 ? styles.tocLinkNested : ''}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className={styles.tocEmpty}>Esta nota é curta e não precisa de sumário lateral.</p>
              )}
              <div className={styles.tocDivider} />
              <div className={styles.contextCard}>
                <span className={styles.contextLabel}>Uso sugerido</span>
                <p className={styles.contextCopy}>
                  Use esta área como base de onboarding, guia técnico ou consulta interna de arquitetura.
                </p>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
