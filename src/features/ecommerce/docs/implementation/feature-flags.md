# Flags de Funcionalidade

Arquivo: `config/featureFlags.ts`

## Chaves disponíveis
- `ecom.header`, `ecom.footer`, `ecom.heroBanner`, `ecom.servicesBar`, `ecom.carousel`
- `ecom.showcaseDaily`, `ecom.showcaseGrocery`
- `ecom.demoBanners`, `ecom.demoShelves`
- `ecom.cart`

## API
- `isOn(key: FlagKey): boolean`
- `isOff(key: FlagKey): boolean`

## Ambiente
- `NEXT_PUBLIC_IS_DEMO` habilita features puramente de demonstração em desenvolvimento.
- Em produção, as demos permanecem desativadas por padrão.

Decisões de projeto:
- `featureFlags` é imutável (`Object.freeze`) e tipado com `satisfies` para evitar drift.
- `isOn/isOff` expõem uma API mínima e legível.
- Parser de booleano de env aceita `1,true,yes,on` (case-insensitive) para DX.

## Adicionando uma nova flag
1) Adicione a chave ao tipo `FlagKey`.
2) Inclua o valor padrão no objeto `featureFlags` (mantido imutável com `Object.freeze`).
3) Opcional: controle por env var seguindo o padrão existente.

Exemplo de uso:
```ts
import { isOn } from '@/features/ecommerce/config/featureFlags';
if (isOn('ecom.carousel')) {
	// renderiza carrossel
}
```
