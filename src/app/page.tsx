"use client";
import React from 'react';
import type { AppEntry } from '@/data/apps';
import Link from 'next/link';
import Image from 'next/image';
import apps from '@/data/apps';
import '@/styles/gallery.css';

export default function HomeGallery() {
  function AppCard({ app }: { app: AppEntry }) {
    const features = app.features || [];

    return (
      <Link
        href={app.comingSoon ? '#' : app.path}
  className={`app-card ${app.comingSoon ? 'disabled' : ''}`}
  aria-label={app.title}
      >
  <div className="card-inner">
          <div className="media-top">
            <div className="media">
              {app.previewImage ? (
                <>
                  <div className="bg">
                    <Image src={app.previewImage} alt="" fill sizes="(max-width: 1200px) 90vw, 360px" style={{ objectFit: 'cover' }} priority />
                  </div>
                  <div className="shot">
                    <Image src={app.previewImage} alt={app.title} fill sizes="(max-width: 1200px) 90vw, 360px" style={{ objectFit: 'cover' }} />
                  </div>
                </>
              ) : app.image ? (
                <Image src={app.image} alt={app.title} fill sizes="(max-width: 1200px) 90vw, 360px" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="placeholder" />
              )}
            </div>
            <div className="front-tag">
              <span className="title">{app.title}</span>
            </div>
          </div>
          <div className="card-body">
            <p className="desc">{app.description}</p>
            {features.length > 0 && (
              <ul className="features">
                {features.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
  </Link>
    );
  }

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Laboratório de Apps — plug, play e reutilize</h1>
        <p className="lead">
          Um hub modular com apps independentes (CV, MOTD e E‑commerce). Cada um pode viver sozinho ou ser copiado para outros projetos. Explore abaixo.
        </p>
      </header>
      <section className="gallery-grid">
        {apps.map((app) => {
          return (
            <div key={app.slug} className="app-item">
              <AppCard app={app} />
            </div>
          );
        })}
      </section>
      <footer className="gallery-footer">
        <Link href="/cv" className="pill">CV</Link>
        <Link href="/motd" className="pill">MOTD</Link>
        <Link href="/e-commerce" className="pill">E-commerce</Link>
      </footer>
    </div>
  );
}
