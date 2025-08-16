"use client";
import React from 'react';
import Link from 'next/link';

export function PdpBreadcrumbs({
  name,
  categoryPath,
}: {
  name: string;
  categoryPath?: { id: string; name: string }[];
}) {
  const crumbs = [
    { href: '/e-commerce', label: 'Início' },
    ...(categoryPath?.map((c) => ({ href: `/e-commerce?c=${c.id}`, label: c.name })) || []),
    { href: '#', label: name, current: true },
  ];
  return (
    <nav className="container pdp-breadcrumbs" aria-label="breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} aria-current={c.current ? 'page' : undefined}>
            {c.current ? c.label : <Link href={c.href}>{c.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
