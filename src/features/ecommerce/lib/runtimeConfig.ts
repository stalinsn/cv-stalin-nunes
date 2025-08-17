// Small client-safe runtime config helpers
export type DataSource = 'local' | 'vtexMock' | 'vtexLive';

export const dataSource: DataSource = (process.env.NEXT_PUBLIC_DATA_SOURCE as DataSource) || 'local';

export function isVtexLive() {
  return dataSource === 'vtexLive';
}
