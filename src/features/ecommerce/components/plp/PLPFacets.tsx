"use client";
import React from 'react';
import type { Category } from '../../lib/plp';

export type FacetState = {
  price?: [number, number];
  brand?: string[];
  dept?: string[];
};

export function PLPFacets({ facets, value, onChange }: { facets: Category['facets']; value: FacetState; onChange: (v: FacetState) => void }) {
  if (!facets || facets.length === 0) return null;
  return (
    <aside className="plp-facets" aria-label="Filtros">
      {facets.map((facet, idx) => {
        if (facet.type === 'range') {
          const rangeValue = value.price || [facet.min, facet.max];
          return (
            <div className="facet" key={idx}>
              <h4>{facet.label}</h4>
              <div className="facet-range">
                <input
                  type="range"
                  min={facet.min}
                  max={facet.max}
                  step={facet.step || 1}
                  value={rangeValue[0]}
                  onChange={(e) => onChange({ ...value, price: [Number(e.target.value), rangeValue[1]] })}
                />
                <input
                  type="range"
                  min={facet.min}
                  max={facet.max}
                  step={facet.step || 1}
                  value={rangeValue[1]}
                  onChange={(e) => onChange({ ...value, price: [rangeValue[0], Number(e.target.value)] })}
                />
                <div className="facet-range__values">
                  <span>R$ {rangeValue[0].toFixed(2)}</span>
                  <span>R$ {rangeValue[1].toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        }
        if (facet.type === 'multi') {
          const key = facet.key;
          const selected = new Set((value[key as keyof FacetState] as string[] | undefined) || []);
          return (
            <div className="facet" key={idx}>
              <h4>{facet.label}</h4>
              <ul>
                {facet.options.map((opt) => (
                  <li key={opt}>
                    <label className="facet-check">
            <input
                        type="checkbox"
                        checked={selected.has(opt)}
                        onChange={(e) => {
              const nextSelected = new Set((value[key as keyof FacetState] as string[] | undefined) || []);
                          if (e.target.checked) nextSelected.add(opt); else nextSelected.delete(opt);
              onChange({ ...value, [key]: Array.from(nextSelected) } as FacetState);
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </aside>
  );
}
