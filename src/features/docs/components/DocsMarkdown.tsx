import Link from 'next/link';
import type { MarkdownBlock } from '@/features/docs/server/markdown';
import { resolveDocsReference } from '@/features/docs/server/source';
import styles from './DocsShell.module.css';

function renderInline(text: string, currentInternalKey: string): React.ReactNode[] {
  const tokens = text.split(/(\[\[[^\]]+\]\]|\[[^\]]+\]\([^\)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (token.startsWith('[[') && token.endsWith(']]')) {
      const raw = token.slice(2, -2);
      const [target, label] = raw.split('|').map((part) => part.trim());
      const href = resolveDocsReference(target, currentInternalKey);
      if (href) {
        return (
          <Link key={`${token}-${index}`} href={href} className={styles.inlineLink}>
            {label || target.split('/').pop()}
          </Link>
        );
      }
      return <span key={`${token}-${index}`}>{label || target}</span>;
    }

    const markdownLink = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (markdownLink) {
      const [, label, href] = markdownLink;
      const isExternal = /^https?:\/\//.test(href);
      return isExternal ? (
        <a
          key={`${token}-${index}`}
          href={href}
          className={styles.inlineLink}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      ) : (
        <a key={`${token}-${index}`} href={href} className={styles.inlineLink}>
          {label}
        </a>
      );
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={`${token}-${index}`} className={styles.inlineCode}>
          {token.slice(1, -1)}
        </code>
      );
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
    }

    return <span key={`${token}-${index}`}>{token}</span>;
  });
}

function getCalloutTitle(tone: string, title: string): string {
  if (title && title !== tone.toUpperCase()) return title;
  switch (tone) {
    case 'info':
      return 'Contexto';
    case 'tip':
      return 'Dica';
    case 'warning':
      return 'Atenção';
    case 'note':
      return 'Nota';
    default:
      return tone.toUpperCase();
  }
}

export function DocsMarkdown({
  blocks,
  lead,
  currentInternalKey,
}: {
  blocks: MarkdownBlock[];
  lead: string;
  currentInternalKey: string;
}) {
  const renderBlocks = [...blocks];
  if (renderBlocks[0]?.type === 'heading' && renderBlocks[0].level === 1) {
    renderBlocks.shift();
  }
  if (lead && renderBlocks[0]?.type === 'paragraph' && renderBlocks[0].text === lead) {
    renderBlocks.shift();
  }

  return (
    <div className={styles.markdown}>
      {renderBlocks.map((block, index) => {
        switch (block.type) {
          case 'heading': {
            if (block.level === 2) {
              return (
                <h2 id={block.id} key={`${block.id}-${index}`} className={styles.h2}>
                  {block.text}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3 id={block.id} key={`${block.id}-${index}`} className={styles.h3}>
                  {block.text}
                </h3>
              );
            }
            return (
              <h4 id={block.id} key={`${block.id}-${index}`} className={styles.h4}>
                {block.text}
              </h4>
            );
          }
          case 'paragraph':
            return (
              <p key={`paragraph-${index}`} className={styles.paragraph}>
                {renderInline(block.text, currentInternalKey)}
              </p>
            );
          case 'unordered-list':
            return (
              <ul key={`ul-${index}`} className={styles.list}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{renderInline(item, currentInternalKey)}</li>
                ))}
              </ul>
            );
          case 'ordered-list':
            return (
              <ol key={`ol-${index}`} className={styles.orderedList}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{renderInline(item, currentInternalKey)}</li>
                ))}
              </ol>
            );
          case 'code':
            return (
              <div key={`code-${index}`} className={styles.codeShell}>
                <div className={styles.codeHeader}>{block.language || 'text'}</div>
                <pre className={styles.codeBlock}>
                  <code>{block.code}</code>
                </pre>
              </div>
            );
          case 'blockquote':
            return (
              <blockquote key={`quote-${index}`} className={styles.blockquote}>
                {renderInline(block.text, currentInternalKey)}
              </blockquote>
            );
          case 'callout': {
            const toneClassName = styles[`callout${block.tone.charAt(0).toUpperCase()}${block.tone.slice(1)}`] || '';
            return (
              <aside key={`callout-${index}`} className={`${styles.callout} ${toneClassName}`}>
                <strong className={styles.calloutTitle}>{getCalloutTitle(block.tone, block.title)}</strong>
                <p className={styles.calloutText}>{renderInline(block.text, currentInternalKey)}</p>
              </aside>
            );
          }
          case 'rule':
            return <hr key={`rule-${index}`} className={styles.rule} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
