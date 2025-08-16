"use client";
import React from 'react';
import { Dropdown } from '../atoms/Dropdown';
import { DropdownMenu } from '../molecules/DropdownMenu';
import { MegaMenu, type MegaCategory } from './MegaMenu';

const categories: MegaCategory[] = [
  {
    key: 'mercearia',
    label: 'Mercearia',
    sections: [
      {
        title: 'Grãos e Massas',
        items: [
          { name: 'Arroz' },
          { name: 'Feijão' },
          { name: 'Macarrão' },
          { name: 'Molhos' },
          { name: 'Ver mais', isHighlighted: true },
        ],
      },
      {
        title: 'Cafés e Matinais',
        items: [
          { name: 'Café' },
          { name: 'Achocolatado' },
          { name: 'Biscoitos' },
          { name: 'Cereais' },
        ],
      },
      {
        title: 'Óleos e Temperos',
        items: [
          { name: 'Óleo' },
          { name: 'Azeite' },
          { name: 'Temperos' },
        ],
      },
      {
        title: 'Enlatados',
        items: [ { name: 'Atum e Sardinha' }, { name: 'Milho e Ervilha' } ],
      },
    ],
  },
  {
    key: 'bebidas-nao-alcoolicas',
    label: 'Bebida Não Alcoólica',
    sections: [
      { title: 'Água', items: [{ name: 'Água de Coco' }, { name: 'Com Gás' }, { name: 'Sem Gás' }, { name: 'Ver mais', isHighlighted: true }] },
      { title: 'Refrigerante', items: [{ name: 'Convencional' }, { name: 'Zero e Diet' }] },
      { title: 'Suco', items: [{ name: 'Concentrado' }, { name: 'Integral' }, { name: 'Néctar' }] },
      { title: 'Chá Pronto', items: [{ name: 'Chá Pronto' }] },
    ],
  },
  { key: 'carnes', label: 'Carnes e Aves', sections: [ { title: 'Bovinos', items: [{ name: 'Cortes' }] }, { title: 'Aves', items: [{ name: 'Cortes' }] } ] },
  { key: 'frios', label: 'Frios e Laticínios', sections: [ { title: 'Queijos', items: [{ name: 'Muçarela' }] }, { title: 'Iogurtes', items: [{ name: 'Tradicionais' }] } ] },
  { key: 'limpeza', label: 'Limpeza', sections: [ { title: 'Banheiro', items: [{ name: 'Desinfetante' }] }, { title: 'Lavanderia', items: [{ name: 'Sabão Líquido' }] } ] },
  { key: 'hortifruti', label: 'Hortifruti', sections: [ { title: 'Frutas', items: [{ name: 'Cítricas' }] }, { title: 'Verduras', items: [{ name: 'Folhosas' }] } ] },
  { key: 'higiene', label: 'Higiene e Beleza', sections: [ { title: 'Cabelos', items: [{ name: 'Shampoo' }] }, { title: 'Corpo', items: [{ name: 'Sabonetes' }] } ] },
  { key: 'alcoolica', label: 'Bebida Alcoólica', sections: [ { title: 'Cervejas', items: [{ name: 'Lager' }] }, { title: 'Vinhos', items: [{ name: 'Tintos' }] } ] },
  { key: 'peixaria', label: 'Peixaria', sections: [ { title: 'Peixes', items: [{ name: 'Brancos' }] } ] },
  { key: 'congelados', label: 'Congelados', sections: [ { title: 'Pratos Prontos', items: [{ name: 'Lasanhas' }] } ] },
  { key: 'padaria', label: 'Padaria', sections: [ { title: 'Pães', items: [{ name: 'Francês' }] } ] },
  { key: 'utilidades', label: 'Utilidades e Casa', sections: [ { title: 'Cozinha', items: [{ name: 'Utensílios' }] } ] },
  { key: 'automotivo', label: 'Automotivo', sections: [ { title: 'Manutenção', items: [{ name: 'Líquidos' }] } ] },
  { key: 'saudaveis', label: 'Saudáveis', sections: [ { title: 'Diet/Light', items: [{ name: 'Snacks' }] } ] },
  { key: 'pet', label: 'Pet Shop', sections: [ { title: 'Cães', items: [{ name: 'Rações' }] } ] },
  { key: 'bazar', label: 'Bazar', sections: [ { title: 'Festas', items: [{ name: 'Descartáveis' }] } ] },
];

const limpezaSections = [
  {
    title: 'Banheiro',
    items: [
      { name: 'Desinfetante', href: '/e-commerce/limpeza/desinfetante' },
      { name: 'Desinfetante Sanitário', href: '/e-commerce/limpeza/desinfetante-sanitario' },
      { name: 'Limpador Sanitário', href: '/e-commerce/limpeza/limpador-sanitario' },
      { name: 'Saco De Lixo', href: '/e-commerce/limpeza/saco-lixo' },
      { name: 'Tira Limo', href: '/e-commerce/limpeza/tira-limo' },
      { name: 'Ver mais', href: '/e-commerce/limpeza/banheiro', isHighlighted: true }
    ]
  },
  {
    title: 'Casa Em Geral',
    items: [
      { name: 'Água Sanitária', href: '/e-commerce/limpeza/agua-sanitaria' },
      { name: 'Álcool Líquido', href: '/e-commerce/limpeza/alcool-liquido' },
      { name: 'Bacias E Baldes', href: '/e-commerce/limpeza/bacias-baldes' },
      { name: 'Ceras', href: '/e-commerce/limpeza/ceras' },
      { name: 'Desodorizadores', href: '/e-commerce/limpeza/desodorizadores' },
      { name: 'Inseticida', href: '/e-commerce/limpeza/inseticida' },
      { name: 'Limpa Vidros', href: '/e-commerce/limpeza/limpa-vidros' },
      { name: 'Limpadores', href: '/e-commerce/limpeza/limpadores' },
      { name: 'Lustra Móveis', href: '/e-commerce/limpeza/lustra-moveis' },
      { name: 'Panos E Flanelas', href: '/e-commerce/limpeza/panos-flanelas' },
      { name: 'Pás', href: '/e-commerce/limpeza/pas' },
      { name: 'Prendedores De Roupas', href: '/e-commerce/limpeza/prendedores-roupas' },
      { name: 'Removedor', href: '/e-commerce/limpeza/removedor' },
      { name: 'Rodos', href: '/e-commerce/limpeza/rodos' },
      { name: 'Varais', href: '/e-commerce/limpeza/varais' },
      { name: 'Vassouras', href: '/e-commerce/limpeza/vassouras' },
      { name: 'Outros', href: '/e-commerce/limpeza/outros' },
      { name: 'Álcool Gel', href: '/e-commerce/limpeza/alcool-gel' },
      { name: 'Ver mais', href: '/e-commerce/limpeza/casa-geral', isHighlighted: true }
    ]
  },
  {
    title: 'Cozinha',
    items: [
      { name: 'Desengordurante', href: '/e-commerce/limpeza/desengordurante' },
      { name: 'Detergente', href: '/e-commerce/limpeza/detergente' },
      { name: 'Esponja', href: '/e-commerce/limpeza/esponja' },
      { name: 'Lã De Aço', href: '/e-commerce/limpeza/la-aco' },
      { name: 'Sabão Em Barra', href: '/e-commerce/limpeza/sabao-barra' },
      { name: 'Sabão Em Pasta', href: '/e-commerce/limpeza/sabao-pasta' },
      { name: 'Saco De Lixo', href: '/e-commerce/limpeza/saco-lixo-cozinha' },
      { name: 'Saponáceo', href: '/e-commerce/limpeza/saponaceo' },
      { name: 'Saco de Lixo Para Pia', href: '/e-commerce/limpeza/saco-lixo-pia' },
      { name: 'Ver mais', href: '/e-commerce/limpeza/cozinha', isHighlighted: true }
    ]
  },
  {
    title: 'Roupa',
    items: [
      { name: 'Alvejante', href: '/e-commerce/limpeza/alvejante' },
      { name: 'Amaciante', href: '/e-commerce/limpeza/amaciante' },
      { name: 'Anti Mofo', href: '/e-commerce/limpeza/anti-mofo' },
      { name: 'Passa Roupa', href: '/e-commerce/limpeza/passa-roupa' },
      { name: 'Sabão Em Pó', href: '/e-commerce/limpeza/sabao-po' },
      { name: 'Sabão Líquido', href: '/e-commerce/limpeza/sabao-liquido' },
      { name: 'Tira Mancha', href: '/e-commerce/limpeza/tira-mancha' },
      { name: 'Ver mais', href: '/e-commerce/limpeza/roupa', isHighlighted: true }
    ]
  }
];

const servicesSections = [
  {
    title: 'Serviços Online',
    items: [
      { name: 'App Oficial', href: '/e-commerce/servicos/app' },
      { name: 'Encartes', href: '/e-commerce/servicos/encartes' },
      { name: 'Cartão Fidelidade', href: '/e-commerce/servicos/cartao' },
      { name: 'Blog Empresarial', href: '/e-commerce/servicos/blog' },
      { name: 'Whatsapp', href: '/e-commerce/servicos/whatsapp' },
      { name: 'Mais Serviços', href: '/e-commerce/servicos/mais', isHighlighted: true }
    ]
  }
];

export function DepartmentsDropdown() {
  return (
    <Dropdown 
      trigger={
        <button className="ecom-nav__btn ecom-nav__btn--departments">
          ☰ Departamentos
        </button>
      }
      className="dropdown--departments"
    >
  <MegaMenu categories={categories} />
    </Dropdown>
  );
}

export function ServicesDropdown() {
  return (
    <Dropdown 
      trigger={
        <button className="ecom-nav__btn">
          ☰ Serviços
        </button>
      }
      className="dropdown--services"
    >
      <DropdownMenu sections={servicesSections} className="dropdown-menu--services" />
    </Dropdown>
  );
}

export function LimpezaDropdown() {
  return (
    <Dropdown 
      trigger={
        <span className="dropdown-trigger-link">Limpeza</span>
      }
      className="dropdown--limpeza"
    >
      <DropdownMenu sections={limpezaSections} className="dropdown-menu--limpeza" />
    </Dropdown>
  );
}
