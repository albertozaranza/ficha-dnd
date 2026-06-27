const DEFAULT_CHARACTER = {
  meta: {
    name: "Skritch Cauda-de-Ferro",
    class: "Ladino",
    subclass: "",
    level: 1,
    background: "Criminoso (Espião)",
    player: "Alberto",
    race: "Ferakh (Rato)",
    subrace: "Herança Sobrevivente",
    alignment: "Caótico Neutro",
    experience: 0,
    inspiration: false,
  },

  appearance: {
    age: "22 anos",
    height: "1,02 m",
    weight: "29 kg",
    eyes: "negros brilhantes",
    skin: "cinza escuro",
    hair: "pelagem curta e desgrenhada",
    description:
      "Pequeno Ferakh-rato de pelagem cinza escura. Possui focinho alongado, longos bigodes sensíveis e uma cauda marcada por cicatrizes. Usa roupas de couro gastas e diversos bolsos escondidos para guardar objetos roubados.",
    portrait: "",
  },

  attributes: {
    str: 8,
    dex: 17,
    con: 14,
    int: 12,
    wis: 14,
    cha: 10,
  },

  savingThrows: {
    str: { proficient: false },
    dex: { proficient: true },
    con: { proficient: false },
    int: { proficient: true },
    wis: { proficient: false },
    cha: { proficient: false },
  },

  skills: {
    acrobatics:    { attr: "dex", proficient: true,  expertise: false, label: "Acrobacia",          abbr: "Des" },
    arcana:        { attr: "int", proficient: false, expertise: false, label: "Arcanismo",           abbr: "Int" },
    athletics:     { attr: "str", proficient: false, expertise: false, label: "Atletismo",           abbr: "For" },
    performance:   { attr: "cha", proficient: false, expertise: false, label: "Atuação",             abbr: "Car" },
    deception:     { attr: "cha", proficient: true,  expertise: false, label: "Blefar",              abbr: "Car" },
    stealth:       { attr: "dex", proficient: true,  expertise: true,  label: "Furtividade",         abbr: "Des" },
    history:       { attr: "int", proficient: false, expertise: false, label: "História",            abbr: "Int" },
    intimidation:  { attr: "cha", proficient: false, expertise: false, label: "Intimidação",         abbr: "Car" },
    insight:       { attr: "wis", proficient: false, expertise: false, label: "Intuição",            abbr: "Sab" },
    investigation: { attr: "int", proficient: true,  expertise: false, label: "Investigação",        abbr: "Int" },
    animalHandling:{ attr: "wis", proficient: false, expertise: false, label: "Lidar com Animais",   abbr: "Sab" },
    medicine:      { attr: "wis", proficient: false, expertise: false, label: "Medicina",            abbr: "Sab" },
    nature:        { attr: "int", proficient: false, expertise: false, label: "Natureza",            abbr: "Int" },
    perception:    { attr: "wis", proficient: true,  expertise: false, label: "Percepção",           abbr: "Sab" },
    persuasion:    { attr: "cha", proficient: false, expertise: false, label: "Persuasão",           abbr: "Car" },
    sleightOfHand: { attr: "dex", proficient: true,  expertise: true,  label: "Prestidigitação",     abbr: "Des" },
    religion:      { attr: "int", proficient: false, expertise: false, label: "Religião",            abbr: "Int" },
    survival:      { attr: "wis", proficient: false, expertise: false, label: "Sobrevivência",       abbr: "Sab" },
  },

  combat: {
    ac: 14,
    speed: "9m",
    hp: { max: 10, current: 10, temp: 0 },
    hitDice: { total: "1d8", remaining: "1d8" },
    deathSaves: { successes: 0, failures: 0 },
  },

  attacks: [
    { name: "Adaga",           bonus: "+5", damage: "1d4 + 3", type: "Perfurante" },
    { name: "Arco Curto",      bonus: "+5", damage: "1d6 + 3", type: "Perfurante" },
    { name: "Ataque Furtivo",  bonus: "",   damage: "+1d6",    type: "Extra (uma vez/turno)" },
  ],

  attacksNotes: "Ataque Furtivo: +1d6 uma vez por turno quando tiver vantagem ou aliado adjacente.",

  equipment: [
    "Armadura de couro",
    "Rapieira",
    "Arco curto",
    "Aljava com 20 flechas",
    "2 adagas",
    "Ferramentas de ladrão",
    "Mochila",
    "Pé de cabra",
    "Martelo pequeno",
    "10 pitões",
    "Lanterna coberta",
    "2 frascos de óleo",
    "Rações (5 dias)",
    "Cantil",
    "50 pés de corda",
    "Kit de disfarce",
    "Roupas escuras com capuz",
  ],

  money: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },

  languages: ["Comum", "Silvestre", "Linguagem dos Ladrões"],

  proficiencies: {
    armor:   ["Armaduras leves"],
    weapons: ["Armas simples", "Espadas curtas", "Bestas de mão", "Espadas longas", "Rapieiras"],
    tools:   ["Ferramentas de ladrão", "Kit de disfarce", "Kit de jogo (dados)"],
  },

  personality: {
    traits: '"Nunca entro por uma porta se existir um buraco na parede."',
    ideals: "Sobrevivência. Os grandes dominam o mundo; os pequenos aprendem a sobreviver nele.",
    bonds:  "Seu clã dos Ratos da Areia foi destruído. Ele viaja procurando descobrir quem foi responsável.",
    flaws:  "Não consegue resistir a roubar objetos brilhantes ou valiosos.",
  },

  features: [
    {
      name: "Sangue da Areia",
      source: "Racial",
      description:
        "Resistência a dano de fogo. Terreno difícil causado por areia, dunas e cascalho não reduz seu deslocamento.",
    },
    {
      name: "Herança Sobrevivente",
      source: "Racial",
      description:
        "Quando for atingido por um ataque que possa ver, pode usar sua reação para mover metade do deslocamento sem provocar ataques de oportunidade. Usos: bônus de proficiência por descanso longo (2 usos).",
    },
    {
      name: "Visão no Escuro",
      source: "Racial",
      description: "18 metros (60 pés).",
    },
    {
      name: "Sentidos Selvagens",
      source: "Racial",
      description: "Proficiência em Percepção.",
    },
    {
      name: "Expertise",
      source: "Ladino",
      description: "Dobra a proficiência em: Furtividade e Prestidigitação.",
    },
    {
      name: "Ataque Furtivo",
      source: "Ladino",
      description:
        "+1d6 uma vez por turno quando tiver vantagem ou aliado adjacente.",
    },
    {
      name: "Linguagem dos Ladrões",
      source: "Ladino",
      description: "Conhece códigos e símbolos do submundo criminal.",
    },
  ],

  backstory:
    "Skritch nasceu entre os Ferakh-rato das ruínas subterrâneas de Arek-Tur, uma antiga cidade soterrada pelas tempestades mágicas do deserto. Desde filhote, aprendeu que sobreviver é mais importante que honra.\n\nEnquanto outros caçavam e protegiam a colônia, Skritch se especializou em exploração, espionagem e pequenos furtos. Sua habilidade de escapar de situações impossíveis lhe rendeu o apelido de \"Cauda-de-Ferro\".\n\nDurante uma expedição às profundezas das ruínas, encontrou uma estranha chave negra feita de um metal desconhecido. Na mesma noite, criaturas surgidas da areia atacaram sua colônia, destruindo tudo o que conhecia.\n\nHoje, Skritch viaja como ladrão, explorador e aventureiro, buscando descobrir: quem destruiu seu povo; qual o segredo da chave negra; e se ainda existem outros Ferakh-rato espalhados pelo mundo.",

  allies:
    "",

  treasure:
    "• 15 peças de ouro\n• Uma chave negra misteriosa (item de história)\n• Um anel de cobre roubado\n• Um dado de osso pertencente ao seu antigo clã",

  spellcasting: {
    class: "",
    ability: "",
    saveDC: 0,
    attackBonus: 0,
    cantrips: [],
    slots: {
      1: { total: 0, used: 0, spells: [] },
      2: { total: 0, used: 0, spells: [] },
      3: { total: 0, used: 0, spells: [] },
      4: { total: 0, used: 0, spells: [] },
      5: { total: 0, used: 0, spells: [] },
      6: { total: 0, used: 0, spells: [] },
      7: { total: 0, used: 0, spells: [] },
      8: { total: 0, used: 0, spells: [] },
      9: { total: 0, used: 0, spells: [] },
    },
  },
};
