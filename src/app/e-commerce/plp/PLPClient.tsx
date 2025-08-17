"use client";
import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const PLPHeader = dynamic(() => import('../../../features/ecommerce/components/plp/PLPHeader').then(m => m.PLPHeader));
const PLPToolbar = dynamic(() => import('../../../features/ecommerce/components/plp/PLPToolbar').then(m => m.PLPToolbar));
const PLPFacets = dynamic(() => import('../../../features/ecommerce/components/plp/PLPFacets').then(m => m.PLPFacets));
type FacetState = import('../../../features/ecommerce/components/plp/PLPFacets').FacetState;
const PLPGrid = dynamic(() => import('../../../features/ecommerce/components/plp/PLPGrid').then(m => m.PLPGrid), { ssr: false });
const PLPEmpty = dynamic(() => import('../../../features/ecommerce/components/plp/PLPEmpty').then(m => m.PLPEmpty));
import { queryPLP, PLPQuery } from '../../../features/ecommerce/lib/plp';
import { queryPLPUnified } from '../../../features/ecommerce/lib/plpDataSource';
import { PLPPagination } from '../../../features/ecommerce/components/plp/PLPPagination';

export default function PLPClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categorySlug = params.get('categoria') || undefined;
  const searchTerm = params.get('q') || undefined;
  const sortParam = (params.get('sort') as PLPQuery['sort']) || 'relevance';
  const pageParam = Math.max(1, Number(params.get('page') || '1')) || 1;

  // Parse filters from URL
  const parseMulti = (key: string): string[] => {
    const all = params.getAll(key);
    if (all.length > 0) return all;
    const one = params.get(key);
    return one ? one.split(',').filter(Boolean) : [];
  };
  const parsePrice = (): [number, number] | undefined => {
    const raw = params.get('price');
    if (!raw) return undefined;
    const [minPrice, maxPrice] = raw.split('-').map((value) => Number(value));
    if (Number.isFinite(minPrice) && Number.isFinite(maxPrice)) return [minPrice, maxPrice];
    return undefined;
  };

  const [sort, setSort] = React.useState<PLPQuery['sort']>(sortParam);
  const [filters, setFilters] = React.useState<FacetState>({
    brand: parseMulti('brand'),
    dept: parseMulti('dept'),
    price: parsePrice(),
  });
  const [page, setPage] = React.useState(pageParam);
  const pageSize = 24;

  // Use a unified data source so we can switch between local and VTEX via env flag
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE || 'local';
  const localData = source === 'local' ? queryPLP({ categorySlug, searchTerm, sort, page, pageSize, filters }) : undefined;

  type LocalPLPResult = ReturnType<typeof queryPLP>;
  const [remoteData, setRemoteData] = React.useState<LocalPLPResult | null>(null);
  const [loading, setLoading] = React.useState(source !== 'local');

  React.useEffect(() => {
    if (source === 'local') return;
    let alive = true;
    setLoading(true);
    queryPLPUnified({ categorySlug, searchTerm, sort, page, pageSize, filters })
      .then((data) => {
        if (!alive) return;
        setRemoteData(data as LocalPLPResult);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [source, categorySlug, searchTerm, sort, page, pageSize, filters]);

  const derived = source === 'local' && localData ? localData : remoteData;
  const products = derived?.products ?? [];
  const total = derived?.total ?? 0;
  const category = derived?.category;
  const facets = derived?.facets;

  const title = category?.name || (searchTerm ? `Resultados para "${searchTerm}"` : 'Resultados');
  const breadcrumbs = [
    category
      ? { href: `/e-commerce/plp?categoria=${category.slug}`, label: category.name }
      : { href: '#', label: 'Busca' },
  ];

  // Update URL when state changes
  React.useEffect(() => {
    const queryParams = new URLSearchParams();
    if (categorySlug) queryParams.set('categoria', categorySlug);
    if (searchTerm) queryParams.set('q', searchTerm);
    if (sort && sort !== 'relevance') queryParams.set('sort', sort);
    if (page && page > 1) queryParams.set('page', String(page));
    if (filters.brand?.length) filters.brand.forEach((brand) => queryParams.append('brand', brand));
    if (filters.dept?.length) filters.dept.forEach((department) => queryParams.append('dept', department));
    if (filters.price) queryParams.set('price', `${filters.price[0]}-${filters.price[1]}`);
    const next = `${pathname}?${queryParams.toString()}`;
    // Avoid redundant pushes
    const current = `${pathname}?${params.toString()}`;
    if (next !== current) router.replace(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page, filters, categorySlug, searchTerm, pathname, router]);

  // Reset page when filters or sort change
  const brandKey = React.useMemo(() => (filters.brand || []).join(','), [filters.brand]);
  const deptKey = React.useMemo(() => (filters.dept || []).join(','), [filters.dept]);
  const priceKey = React.useMemo(() => (filters.price ? filters.price.join('-') : ''), [filters.price]);
  React.useEffect(() => {
    setPage(1);
  }, [sort, brandKey, deptKey, priceKey]);

  return (
    <section className="plp-container">
      <div className="plp-layout">
        <PLPHeader title={title} breadcrumbs={breadcrumbs} />
        <PLPToolbar total={total} sort={sort || 'relevance'} onSort={setSort} />
        <div className="plp-main">
          <PLPFacets facets={facets} value={filters} onChange={setFilters} />
          {loading ? (
            <div style={{ padding: 16 }}>Carregando…</div>
          ) : products.length ? (
            <div>
              <PLPGrid products={products} />
              <PLPPagination page={page} pageSize={24} total={total} onPageChange={setPage} />
            </div>
          ) : (
            <PLPEmpty term={searchTerm || category?.name} />
          )}
        </div>
      </div>
    </section>
  );
}
