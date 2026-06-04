// ═══════════════════════════════════════════
//  DATA.JS — Catálogo completo do estúdio
// ═══════════════════════════════════════════

const STUDIO = {
  whatsapp: '5519993801112',
  instagram: 'estudiogiselecardoso',
  nome: 'Gisele Souza Cardoso'
};

const PROFISSIONAIS = [
  {
    id: 'gisele',
    nome: 'Gisele',
    avatar: 'G',
    especialidades: ['nago','fulani','box','knotless','twist','ghana','entrelace','boxeadora','lemonade','abacaxi','cristal','mohawk','french','masc','finalizacao','tratamento','manutencao'],
    horarios: {
      'seg': { inicio: '18:00', fim: '21:00' },
      'ter': { inicio: '18:00', fim: '21:00' },
      'qua': { inicio: '18:00', fim: '21:00' },
      'qui': { inicio: '18:00', fim: '21:00' },
      'sex': { inicio: '18:00', fim: '21:00' },
      'sab': { inicio: '08:00', fim: '17:00' },
      'dom': { inicio: '09:00', fim: '13:00' },
    }
  },
  {
    id: 'emanuelly',
    nome: 'Emanuelly',
    avatar: 'E',
    especialidades: ['nago'],
    horarios: {
      'seg': { inicio: '15:00', fim: '21:00' },
      'ter': { inicio: '15:00', fim: '21:00' },
      'qua': { inicio: '15:00', fim: '21:00' },
      'qui': { inicio: '15:00', fim: '21:00' },
      'sex': { inicio: '15:00', fim: '21:00' },
      'sab': { inicio: '08:00', fim: '17:00' },
      'dom': { inicio: '09:00', fim: '13:00' },
    }
  },
  {
    id: 'sophia',
    nome: 'Sophia',
    avatar: 'S',
    especialidades: ['nago'],
    feminino_only: true,
    horarios: {
      'seg': { inicio: '15:00', fim: '21:00' },
      'ter': { inicio: '15:00', fim: '21:00' },
      'qua': { inicio: '15:00', fim: '21:00' },
      'qui': { inicio: '15:00', fim: '21:00' },
      'sex': { inicio: '15:00', fim: '21:00' },
      'sab': { inicio: '08:00', fim: '15:00' },
      'dom': null,
    }
  }
];

// Imagens placeholder por categoria (trocar pelas fotos reais)
const IMAGENS = {
  nago:       ['https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop'],
  fulani:     ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1594311431310-de3a7a6c3a4f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop'],
  box:        ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1614644147724-2d4785d69962?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=600&h=800&fit=crop'],
  knotless:   ['https://images.unsplash.com/photo-1624174776296-b7b08a3e7f3f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=800&fit=crop'],
  twist:      ['https://images.unsplash.com/photo-1596215143886-c5a78bfed9d6?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1612833609776-39e5b79e5e20?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop'],
  ghana:      ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop'],
  entrelace:  ['https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop'],
  boxeadora:  ['https://images.unsplash.com/photo-1614644147724-2d4785d69962?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=800&fit=crop'],
  lemonade:   ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1594311431310-de3a7a6c3a4f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1612833609776-39e5b79e5e20?w=600&h=800&fit=crop'],
  abacaxi:    ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1596215143886-c5a78bfed9d6?w=600&h=800&fit=crop'],
  cristal:    ['https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1624174776296-b7b08a3e7f3f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'],
  mohawk:     ['https://images.unsplash.com/photo-1612833609776-39e5b79e5e20?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1594311431310-de3a7a6c3a4f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop'],
  french:     ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1596215143886-c5a78bfed9d6?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=800&fit=crop'],
  masc:       ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1614644147724-2d4785d69962?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=800&fit=crop'],
  finalizacao:['https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1612833609776-39e5b79e5e20?w=600&h=800&fit=crop'],
  tratamento: ['https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1624174776296-b7b08a3e7f3f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop'],
  manutencao: ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1594311431310-de3a7a6c3a4f?w=600&h=800&fit=crop'],
};

const CATALOGO = {
  nago: {
    label: 'Nagô',
    cor: true, tamanho: true,
    subtipo_sexo: true,
    feminino: {
      itens: [
        { nome: 'Lateral Comum', preco: 30, duracao: '30 min' },
        { nome: 'Lateral Freestyle', preco: 35, duracao: '45 min' },
        { nome: 'Topo Comum', preco: 35, duracao: '1h' },
        { nome: 'Topo Freestyle', preco: 40, duracao: '1h15min' },
        { nome: 'Frontal Comum', preco: 50, duracao: '1h' },
        { nome: 'Frontal Freestyle', preco: 55, duracao: '1h30min' },
      ],
      adicionais: [
        { nome: 'Rabo', preco: 5 },
        { nome: 'BUBLLE', preco: 5 },
        { nome: 'Babyliss', preco: 30 },
        { nome: 'Escova', preco: 50 },
        { nome: 'Fitagem', preco: 50 },
      ]
    },
    masculino: {
      itens: [
        { nome: 'Comum', preco: 100, duracao: '1h15min' },
        { nome: 'Freestyle', preco: 115, duracao: '2h' },
      ],
      profissionais: ['gisele','emanuelly']
    }
  },
  boxeadora: {
    label: 'Boxeadora',
    cor: false, tamanho: false,
    itens_sem_jumbo: [
      { nome: 'Comum s/ Jumbo', preco: 90, duracao: '1h' },
      { nome: 'Freestyle s/ Jumbo', preco: 95, duracao: '1h15min' },
    ],
    itens_com_jumbo: [
      { nome: 'Comum c/ Jumbo', preco: 100, duracao: '1h' },
      { nome: 'Freestyle c/ Jumbo', preco: 105, duracao: '1h30min' },
    ],
    adicional_cachos: 25,
    nota: 'Adicional de cachos: +R$ 25,00'
  },
  ghana: {
    label: 'Ghana Braids',
    cor: false, tamanho: false,
    itens_sem_jumbo: [
      { nome: 'Comum s/ Jumbo', preco: 100, duracao: '1h' },
      { nome: 'Freestyle s/ Jumbo', preco: 105, duracao: '1h30min' },
    ],
    itens_com_jumbo: [
      { nome: 'Comum c/ Jumbo', preco: 115, duracao: '1h' },
      { nome: 'Freestyle c/ Jumbo', preco: 130, duracao: '2h' },
    ],
    adicional_cachos: 30,
    nota: 'Adicional de cachos: +R$ 30,00'
  },
  entrelace: {
    label: 'Entrelace',
    cor: true, tamanho: true,
    itens: [
      { nome: 'Cacheado', preco: 390, duracao: '3h30min' },
      { nome: 'Liso', preco: 400, duracao: '4h' },
    ]
  },
  fulani: {
    label: 'Fulani',
    cor: true, tamanho: true,
    subtipo_sexo: true,
    feminino: {
      itens: [
        { nome: 'Cacheado', preco: 390, duracao: '4h30min' },
        { nome: 'Liso', preco: 400, duracao: '4h30min' },
        { nome: 'Trança', preco: 385, duracao: '5h' },
      ]
    },
    masculino: {
      itens: [
        { nome: 'Comum', preco: 160, duracao: '2h' },
        { nome: 'Freestyle', preco: 190, duracao: '3h' },
      ],
      profissionais: ['gisele']
    }
  },
  box: {
    label: 'Box Braids',
    cor: true, tamanho: true,
    subtipo_sexo: true,
    feminino: {
      itens: [
        { nome: 'Tradicional', preco: 460, duracao: '7h' },
        { nome: 'Goods Braids', preco: 490, duracao: '7h' },
      ]
    },
    masculino: {
      itens: [
        { nome: 'Soltas Box Braids', preco: 210, duracao: '3h' },
      ],
      profissionais: ['gisele']
    }
  },
  knotless: {
    label: 'Knoutless',
    cor: true, tamanho: true,
    subtipo_sexo: true,
    feminino: {
      itens: [
        { nome: 'Tradicional', preco: 370, duracao: '5h' },
        { nome: 'Cachos', preco: 390, duracao: '5h' },
      ]
    },
    masculino: {
      itens: [
        { nome: 'Soltas Knoutless', preco: 200, duracao: '3h' },
      ],
      profissionais: ['gisele']
    }
  },
  twist: {
    label: 'Twist',
    cor: true, tamanho: true,
    itens: [
      { nome: 'Tradicional', preco: 500, duracao: '6h' },
      { nome: 'Cachos', preco: 550, duracao: '7h' },
    ]
  },
  french: {
    label: 'French Curly',
    cor: true, tamanho: true,
    itens: [
      { nome: 'French Curly', preco: 400, duracao: '7h' },
    ]
  },
  mohawk: {
    label: 'Mohawk',
    cor: true, tamanho: true,
    itens: [
      { nome: 'Mohawk', preco: 360, duracao: '5h' },
    ]
  },
  cristal: {
    label: 'Fio de Cristal',
    cor: false, tamanho: false,
    nota_especial: '⚠️ Fio feito manualmente — agendamento com mínimo 48h de antecedência',
    itens: [
      { nome: 'Pequeno', preco: 35, duracao: '30min' },
      { nome: 'Médio', preco: 45, duracao: '30min' },
      { nome: 'Grande', preco: 55, duracao: '30min' },
    ]
  },
  lemonade: {
    label: 'Lemonade',
    cor: true, tamanho: true,
    itens: [
      { nome: 'Lemonade', preco: null, duracao: 'Consulte' },
    ]
  },
  abacaxi: {
    label: 'Abacaxi Braids',
    cor: true, tamanho: true,
    itens: [
      { nome: 'Abacaxi Braids', preco: null, duracao: 'Consulte' },
    ]
  },
  finalizacao: {
    label: 'Finalizações',
    cor: false, tamanho: false,
    itens: [
      { nome: 'Finalização', preco: 50, duracao: '40min' },
      { nome: 'Corte', preco: 50, duracao: '40min' },
      { nome: 'Escova', preco: 50, duracao: 'Consulte' },
      { nome: 'Babyliss', preco: 30, duracao: 'Consulte' },
      { nome: 'Fitagem', preco: 50, duracao: 'Consulte' },
    ]
  },
  tratamento: {
    label: 'Tratamentos',
    cor: false, tamanho: false,
    itens: [
      { nome: 'Tratamento Capilar', preco: 80, duracao: '60min' },
      { nome: 'Pacote Mensal (4 sessões)', preco: 250, duracao: '4x 60min no mês', pacote: true },
    ]
  },
  manutencao: {
    label: 'Manutenções',
    cor: false, tamanho: false,
    itens: [
      { nome: 'Man. Box Braids', preco: 200, duracao: '2h' },
      { nome: 'Man. Knoutless', preco: 150, duracao: '2h' },
      { nome: 'Man. Fulani', preco: 130, duracao: '1h30min' },
      { nome: 'Man. Entrelace', preco: 130, duracao: '2h' },
    ]
  },
  masc: {
    label: 'Tranças Masculinas',
    cor: false, tamanho: false,
    profissional_only: 'gisele',
    itens: [
      { nome: 'Nagô Comum', preco: 100, duracao: '1h15min' },
      { nome: 'Nagô Freestyle', preco: 115, duracao: '2h' },
      { nome: 'Fulani Comum', preco: 160, duracao: '2h' },
      { nome: 'Fulani Freestyle', preco: 190, duracao: '3h' },
      { nome: 'Soltas Box Braids', preco: 210, duracao: '3h' },
      { nome: 'Soltas Knoutless', preco: 200, duracao: '3h' },
    ]
  },
};

// Categorias que NÃO precisam de tela de cor/tamanho
const SEM_COR_TAMANHO = ['cristal','finalizacao','tratamento','manutencao','masc'];

// Tipagem dos nomes dos dias
const DIAS_SEMANA = ['dom','seg','ter','qua','qui','sex','sab'];
const DIAS_LABEL  = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
