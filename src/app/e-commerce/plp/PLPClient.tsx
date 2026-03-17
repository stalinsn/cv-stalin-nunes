"use client";
import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useOrderForm } from '../../../features/ecommerce/state/OrderFormContext';
import { PLPSkeleton } from '../../../features/ecommerce/components/plp/PLPSkeleton';

const PLPHeader = dynamic(() => import('../../../features/ecommerce/components/plp/PLPHeader').then(m => m.PLPHeader));
const PLPToolbar = dynamic(() => import('../../../features/ecommerce/components/plp/PLPToolbar').then(m => m.PLPToolbar));
const PLPFacets = dynamic(() => import('../../../features/ecommerce/components/plp/PLPFacets').then(m => m.PLPFacets));
type FacetState = import('../../../features/ecommerce/components/plp/PLPFacets').FacetState;
const PLPGrid = dynamic(() => import('../../../features/ecommerce/components/plp/PLPGrid').then(m => m.PLPGrid), { ssr: false });
const PLPEmpty = dynamic(() => import('../../../features/ecommerce/components/plp/PLPEmpty').then(m => m.PLPEmpty));
import { queryPLP, PLPQuery } from '../../../features/ecommerce/lib/plp';
import { queryPLPUnified } from '../../../features/ecommerce/lib/plpDataSource';
import { PLPPagination } from '../../../features/ecommerce/components/plp/PLPPagination';
import { isOn } from '../../../features/ecommerce/config/featureFlags';

export default function PLPClient() {
  const { orderForm } = useOrderForm();
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
    collection: parseMulti('collection'),
    price: parsePrice(),
  });
  const [page, setPage] = React.useState(pageParam);
  const pageSize = 24;
  const regionalization = React.useMemo(() => {
    const selectedOption = orderForm.shipping.deliveryOptions[orderForm.shipping.deliveryOptions.length - 1];
    const mode = selectedOption?.id?.startsWith('pickup') ? 'pickup' : 'delivery';
    return {
      postalCode: orderForm.shipping.selectedAddress?.postalCode,
      mode,
    } as const;
  }, [orderForm.shipping.deliveryOptions, orderForm.shipping.selectedAddress?.postalCode]);
  const regionKey = `${regionalization.mode || 'delivery'}:${regionalization.postalCode || ''}`;

  // Use a unified data source so we can switch between local and VTEX via env flag
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE || 'local';
  const localData = source === 'local' ? queryPLP({ categorySlug, searchTerm, sort, page, pageSize, filters, regionalization }) : undefined;

  type LocalPLPResult = ReturnType<typeof queryPLP>;
  const [remoteData, setRemoteData] = React.useState<LocalPLPResult | null>(null);
  const [loading, setLoading] = React.useState(source !== 'local');

  React.useEffect(() => {
    if (source === 'local') return;
    let alive = true;
    setLoading(true);
    queryPLPUnified({ categorySlug, searchTerm, sort, page, pageSize, filters, regionalization })
      .then((data) => {
        if (!alive) return;
        setRemoteData(data as LocalPLPResult);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [source, categorySlug, searchTerm, sort, page, pageSize, filters, regionKey, regionalization]);

  const derived = source === 'local' && localData ? localData : remoteData;
  const products = derived?.products ?? [];
  const total = derived?.total ?? 0;
  const category = derived?.category;
  const facets = derived?.facets;

  const title = category?.name || (searchTerm ? `Resultados para "${searchTerm}"` : 'Resultados');
  const showHeader = isOn('ecom.plp.header');
  const showToolbar = isOn('ecom.plp.toolbar');
  const showFacets = isOn('ecom.plp.facets');
  const showGrid = isOn('ecom.plp.grid');
  const showPagination = isOn('ecom.plp.pagination');
  const showEmptyState = isOn('ecom.plp.emptyState');
  const showLoadingSkeleton = isOn('ecom.plp.loadingSkeleton');
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
    if (filters.collection?.length) filters.collection.forEach((collection) => queryParams.append('collection', collection));
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
  const collectionKey = React.useMemo(() => (filters.collection || []).join(','), [filters.collection]);
  const priceKey = React.useMemo(() => (filters.price ? filters.price.join('-') : ''), [filters.price]);
  React.useEffect(() => {
    setPage(1);
  }, [sort, brandKey, deptKey, collectionKey, priceKey]);

  return (
    <section className="plp-container">
      <div className="plp-layout">
        {showHeader ? <PLPHeader title={title} breadcrumbs={breadcrumbs} /> : null}
        {showToolbar ? <PLPToolbar total={total} sort={sort || 'relevance'} onSort={setSort} /> : null}
        <div className="plp-main" aria-busy={loading}>
          {showFacets ? <PLPFacets facets={facets} value={filters} onChange={setFilters} /> : null}
          {loading ? (
            showLoadingSkeleton ? <PLPSkeleton cards={12} /> : null
          ) : products.length ? (
            <div>
              {showGrid ? <PLPGrid products={products} /> : null}
              {showGrid && showPagination ? <PLPPagination page={page} pageSize={24} total={total} onPageChange={setPage} /> : null}
            </div>
          ) : (
            showEmptyState ? <PLPEmpty term={searchTerm || category?.name} /> : null
          )}
        </div>
      </div>
    </section>
  );
}
