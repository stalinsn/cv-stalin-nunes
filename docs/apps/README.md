# Apps

Este diretório concentra o manual funcional de cada app do monorepo.

## Índice

- [CV](./cv.md)
- [MOTD](./motd.md)
- [E-commerce](./ecommerce.md)
- [EcommPanel](./ecommpanel.md)
- [Runtime de Conteúdo do E-commerce](../ECOM_CONTENT_RUNTIME.md)

## Relação entre apps

- `CV` e `MOTD` são independentes.
- `E-commerce` roda sozinho, mas pode consumir páginas dinâmicas e template publicado pelo `EcommPanel`.
- `EcommPanel` administra usuários/permissões, tema, template, mega menu e publicação de conteúdo dinâmico do e-commerce.

## Fluxo operacional recomendado

1. Suba o projeto raiz para desenvolvimento completo (`yarn dev`).
2. Configure e teste criação/edição/publicação no `EcommPanel`.
3. Valide template, tema, mega menu e renderização dinâmica no `E-commerce`.
4. Exporte apps independentes quando precisar deploy desacoplado.
