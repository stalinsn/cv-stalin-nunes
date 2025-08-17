import type { PLPQuery } from './plp';
import { queryPLP as queryLocalPLP } from './plp';
import { queryVtexPLP } from './vtexPlpBridge';
import type { UIProduct } from '../types/product';
import rawCategories from '../data/categories.json';

type Category = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  productIds: string[];
  children?: { id: string; slug: string; name: string }[];
};

const allCategories = rawCategories as Category[];

function getCategoryBySlug(slug?: string) {
  if (!slug) return undefined;
  return allCategories.find((c) => c.slug === slug);
}

function applyFilters(products: UIProduct[], filters?: PLPQuery['filters']) {
  if (!filters) return products;
  let filteredProducts = products;
  if (filters.price) {
    const [min, max] = filters.price;
    filteredProducts = filteredProducts.filter((p) => p.price >= min && p.price <= max);
  }
  if (filters.brand?.length) {
    const set = new Set(filters.brand.map((b) => b.toLocaleLowerCase()));
    filteredProducts = filteredProducts.filter((p) => (p.brand ? set.has(p.brand.toLocaleLowerCase()) : false));
  }
  if (filters.dept?.length) {
    const set = new Set(filters.dept.map((d) => d.toLocaleLowerCase()));
    filteredProducts = filteredProducts.filter((p) => p.categories?.some((c) => set.has(c.toLocaleLowerCase())));
  }
  return filteredProducts;
}

function sortProducts(products: UIProduct[], sort?: PLPQuery['sort']) {
  if (!sort || sort === 'relevance') return products;
  const arr = [...products];
  switch (sort) {
    case 'price-asc':
      arr.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      arr.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      arr.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      arr.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  return arr;
}

function buildFacets(products: UIProduct[]) {
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[];
  const depts = Array.from(new Set(products.flatMap((p) => p.categories || [])));
  const prices = products.map((p) => p.price);
  const min = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const max = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  return [
    { type: 'range', key: 'price', label: 'Faixa de preço', min, max, step: Math.max(1, Math.round((max - min) / 10)) },
    { type: 'multi', key: 'brand', label: 'Marca', options: brands },
    { type: 'multi', key: 'dept', label: 'Subcategoria', options: depts },
  ] as NonNullable<ReturnType<typeof queryLocalPLP>['facets']>;
}

export async function queryPLPUnified(params: PLPQuery) {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE || 'local';
  if (source === 'local') {
    return queryLocalPLP(params);
  }

  const cat = getCategoryBySlug(params.categorySlug);
  const categoryIds = cat ? [String(cat.id)] : undefined;
  const pageSize = params.pageSize ?? 24;
  const page = params.page ?? 1;
  const term = params.searchTerm;
  const { products } = await queryVtexPLP({ term, categoryIds, page, pageSize, sort: params.sort });

  let result = products;
  result = applyFilters(result, params.filters);
  result = sortProducts(result, params.sort);

  const total = result.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    products: result.slice(start, end),
    total,
    page,
    pageSize,
    category: cat,
    facets: buildFacets(result),
  } as ReturnType<typeof queryLocalPLP>;
}
