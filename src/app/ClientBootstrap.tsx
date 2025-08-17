"use client";
import { useEffect } from 'react';
import { safeGet, safeSet, safeRemove } from '@/utils/safeStorage';
import { LEGACY_KEYS, STORAGE_KEYS } from '@/utils/storageKeys';

export default function ClientBootstrap() {
  useEffect(() => {
    // Migrate theme
    try {
      if (!safeGet(STORAGE_KEYS.theme)) {
        const legacy = safeGet(LEGACY_KEYS.theme);
        if (legacy) {
          safeSet(STORAGE_KEYS.theme, legacy);
          safeRemove(LEGACY_KEYS.theme);
        }
      }
    } catch {}

    // Migrate lastLang
    try {
      if (!safeGet(STORAGE_KEYS.lastLang)) {
        const legacy = safeGet(LEGACY_KEYS.lastLang);
        if (legacy) {
          safeSet(STORAGE_KEYS.lastLang, legacy);
          safeRemove(LEGACY_KEYS.lastLang);
        }
      }
    } catch {}

    // Migrate CEP
    try {
      if (!safeGet(STORAGE_KEYS.cep)) {
        const legacy = safeGet(LEGACY_KEYS.cep);
        if (legacy) {
          safeSet(STORAGE_KEYS.cep, legacy);
          safeRemove(LEGACY_KEYS.cep);
        }
      }
    } catch {}
  }, []);

  return null;
}
