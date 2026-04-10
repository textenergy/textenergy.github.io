// civics-quiz-data.js
// 2025 USCIS Civics Test — shared question data for chapter self-test pages.
//
// CHAPTER_QUESTIONS is derived from qpop references in each chapter/addendum HTML file.
// MULTI_CHAPTER_QUESTIONS lists questions that appear in more than one chapter;
//   these are excluded from review randomization so the review pool only adds
//   questions the learner has not yet seen in the current session.
//
// Questions with variable answers (current officeholders, state-specific) are
// flagged with variable:true; the self-test shows a practice prompt instead of
// a reveal list.

// ── Question data ─────────────────────────────────────────────────────────────
// Keys are zero-padded three-digit strings: "001"–"128".
// Add entries here as new chapter self-tests are created.

const CIVICS_QUESTIONS = {

  "001": {
    en: "What is the form of government of the United States?",
    es: "¿Cuál es la forma de gobierno de los Estados Unidos?",
    answers_en: ["Republic", "Constitution-based federal republic", "Representative democracy"],
    answers_es: ["República", "República federal basada en la Constitución", "Democracia representativa"]
  },
  "002": {
    en: "What is the supreme law of the land?",
    es: "¿Cuál es la ley suprema del país?",
    answers_en: ["(U.S.) Constitution"],
    answers_es: ["(La) Constitución (de los Estados Unidos)"],
    starred: true
  },
  "003": {
    en: "Name one thing the U.S. Constitution does.",
    es: "Nombre una cosa que hace la Constitución de los Estados Unidos.",
    answers_en: ["Forms the government", "Defines powers of government", "Defines the parts of government", "Protects the rights of the people"],
    answers_es: ["Forma el gobierno", "Define los poderes del gobierno", "Define las partes del gobierno", "Protege los derechos del pueblo"]
  },
  "004": {
    en: "The U.S. Constitution starts with the words \"We the People.\" What does \"We the People\" mean?",
    es: "La Constitución de los Estados Unidos comienza con las palabras \"Nosotros el Pueblo\". ¿Qué significa \"Nosotros el Pueblo\"?",
    answers_en: ["Self-government", "Popular sovereignty", "Consent of the governed", "People should govern themselves", "(Example of) social contract"],
    answers_es: ["Autogobierno", "Soberanía popular", "Consentimiento de los gobernados", "El pueblo debe gobernarse a sí mismo", "(Ejemplo de) contrato social"]
  },
  "005": {
    en: "How are changes made to the U.S. Constitution?",
    es: "¿Cómo se hacen cambios a la Constitución de los Estados Unidos?",
    answers_en: ["Amendments", "The amendment process"],
    answers_es: ["Enmiendas", "El proceso de enmiendas"]
  },
  "006": {
    en: "What does the Bill of Rights protect?",
    es: "¿Qué protege la Declaración de Derechos?",
    answers_en: ["(The basic) rights of Americans", "(The basic) rights of people living in the United States"],
    answers_es: ["Los derechos (básicos) de los estadounidenses", "Los derechos (básicos) de las personas que viven en los Estados Unidos"]
  },
  "007": {
    en: "How many amendments does the U.S. Constitution have?",
    es: "¿Cuántas enmiendas tiene la Constitución de los Estados Unidos?",
    answers_en: ["Twenty-seven (27)"],
    answers_es: ["Veintisiete (27)"],
    starred: true
  },
  "013": {
    en: "What is the rule of law?",
    es: "¿Qué es el estado de derecho?",
    answers_en: ["Everyone must follow the law.", "Leaders must obey the law.", "Government must obey the law.", "No one is above the law."],
    answers_es: ["Todos deben seguir la ley.", "Los líderes deben obedecer la ley.", "El gobierno debe obedecer la ley.", "Nadie está por encima de la ley."]
  },
  "015": {
    en: "There are three branches of government. Why?",
    es: "Hay tres ramas del gobierno. ¿Por qué?",
    answers_en: ["So one part does not become too powerful", "Checks and balances", "Separation of powers"],
    answers_es: ["Para que una parte no se vuelva demasiado poderosa", "Controles y contrapesos", "Separación de poderes"]
  },
  "016": {
    en: "Name the three branches of government.",
    es: "Nombre las tres ramas del gobierno.",
    answers_en: ["Legislative, executive, and judicial", "Congress, president, and the courts"],
    answers_es: ["Legislativa, ejecutiva y judicial", "Congreso, presidente y los tribunales"]
  },
  "017": {
    en: "The President of the United States is in charge of which branch of government?",
    es: "¿El Presidente de los Estados Unidos está a cargo de cuál rama del gobierno?",
    answers_en: ["Executive branch"],
    answers_es: ["Rama ejecutiva"]
  },
  "018": {
    en: "What part of the federal government writes laws?",
    es: "¿Qué parte del gobierno federal escribe las leyes?",
    answers_en: ["(U.S.) Congress", "(U.S. or national) legislature", "Legislative branch"],
    answers_es: ["(El) Congreso (de los Estados Unidos)", "(La) legislatura (de los Estados Unidos o nacional)", "Rama legislativa"]
  },
  "019": {
    en: "What are the two parts of the U.S. Congress?",
    es: "¿Cuáles son las dos partes del Congreso de los Estados Unidos?",
    answers_en: ["Senate and House (of Representatives)"],
    answers_es: ["Senado y Cámara (de Representantes)"]
  },
  "021": {
    en: "How many U.S. senators are there?",
    es: "¿Cuántos senadores de los Estados Unidos hay?",
    answers_en: ["One hundred (100)"],
    answers_es: ["Cien (100)"]
  },
  "022": {
    en: "How long is a term for a U.S. senator?",
    es: "¿Cuánto dura el período de un senador de los Estados Unidos?",
    answers_en: ["Six (6) years"],
    answers_es: ["Seis (6) años"]
  },
  "023": {
    en: "Who is one of your state's U.S. senators now?",
    es: "¿Quién es uno de los senadores de los Estados Unidos de su estado ahora?",
    variable: true,
    starred: true
  },
  "024": {
    en: "How many voting members are in the House of Representatives?",
    es: "¿Cuántos miembros con derecho a voto hay en la Cámara de Representantes?",
    answers_en: ["Four hundred thirty-five (435)"],
    answers_es: ["Cuatrocientos treinta y cinco (435)"]
  },
  "025": {
    en: "How long is a term for a member of the House of Representatives?",
    es: "¿Cuánto dura el período de un miembro de la Cámara de Representantes?",
    answers_en: ["Two (2) years"],
    answers_es: ["Dos (2) años"]
  },
  "027": {
    en: "How many senators does each state have?",
    es: "¿Cuántos senadores tiene cada estado?",
    answers_en: ["Two (2)"],
    answers_es: ["Dos (2)"]
  },
  "028": {
    en: "Why does each state have two senators?",
    es: "¿Por qué cada estado tiene dos senadores?",
    answers_en: ["Equal representation (for small states)", "The Great Compromise (Connecticut Compromise)"],
    answers_es: ["Representación igualitaria (para los estados pequeños)", "El Gran Compromiso (Compromiso de Connecticut)"]
  },
  "029": {
    en: "Name your U.S. representative.",
    es: "Nombre a su representante de los Estados Unidos.",
    variable: true
  },
  "030": {
    en: "What is the name of the Speaker of the House of Representatives now?",
    es: "¿Cuál es el nombre del Presidente de la Cámara de Representantes ahora?",
    variable: true,
    starred: true
  },
  "031": {
    en: "Who does a U.S. senator represent?",
    es: "¿A quién representa un senador de los Estados Unidos?",
    answers_en: ["Citizens of their state", "People of their state"],
    answers_es: ["Ciudadanos de su estado", "Personas de su estado"]
  },
  "034": {
    en: "Who elects members of the House of Representatives?",
    es: "¿Quién elige a los miembros de la Cámara de Representantes?",
    answers_en: ["Citizens from their (congressional) district"],
    answers_es: ["Ciudadanos de su distrito (congresional)"]
  },
  "035": {
    en: "Some states have more representatives than other states. Why?",
    es: "Algunos estados tienen más representantes que otros estados. ¿Por qué?",
    answers_en: ["(Because of) the state's population", "(Because) they have more people", "(Because) some states have more people"],
    answers_es: ["(Por) la población del estado", "(Porque) tienen más personas", "(Porque) algunos estados tienen más personas"]
  },
  "036": {
    en: "The President of the United States is elected for how many years?",
    es: "¿El Presidente de los Estados Unidos es elegido por cuántos años?",
    answers_en: ["Four (4) years"],
    answers_es: ["Cuatro (4) años"],
    starred: true
  },
  "037": {
    en: "The President of the United States can serve only two terms. Why?",
    es: "El Presidente de los Estados Unidos solo puede servir dos períodos. ¿Por qué?",
    answers_en: ["(Because of) the 22nd Amendment", "To keep the president from becoming too powerful"],
    answers_es: ["(Por) la 22a Enmienda", "Para evitar que el presidente se vuelva demasiado poderoso"]
  },
  "038": {
    en: "What is the name of the President of the United States now?",
    es: "¿Cuál es el nombre del Presidente de los Estados Unidos ahora?",
    variable: true,
    starred: true
  },
  "039": {
    en: "What is the name of the Vice President of the United States now?",
    es: "¿Cuál es el nombre del Vicepresidente de los Estados Unidos ahora?",
    variable: true,
    starred: true
  },
  "040": {
    en: "If the president can no longer serve, who becomes president?",
    es: "Si el presidente ya no puede servir, ¿quién se convierte en presidente?",
    answers_en: ["The Vice President (of the United States)"],
    answers_es: ["El Vicepresidente (de los Estados Unidos)"]
  },
  "041": {
    en: "Name one power of the president.",
    es: "Nombre un poder del presidente.",
    answers_en: ["Signs bills into law", "Vetoes bills", "Enforces laws", "Commander in Chief (of the military)", "Chief diplomat", "Appoints federal judges"],
    answers_es: ["Firma proyectos de ley para convertirlos en ley", "Veta proyectos de ley", "Hace cumplir las leyes", "Comandante en Jefe (de las fuerzas armadas)", "Diplomático principal", "Nombra jueces federales"]
  },
  "042": {
    en: "Who is Commander in Chief of the U.S. military?",
    es: "¿Quién es el Comandante en Jefe de las fuerzas armadas de los Estados Unidos?",
    answers_en: ["The President (of the United States)"],
    answers_es: ["El Presidente (de los Estados Unidos)"]
  },
  "043": {
    en: "Who signs bills to become laws?",
    es: "¿Quién firma los proyectos de ley para convertirlos en leyes?",
    answers_en: ["The President (of the United States)"],
    answers_es: ["El Presidente (de los Estados Unidos)"]
  },
  "044": {
    en: "Who vetoes bills?",
    es: "¿Quién veta los proyectos de ley?",
    answers_en: ["The President (of the United States)"],
    answers_es: ["El Presidente (de los Estados Unidos)"],
    starred: true
  },
  "046": {
    en: "The executive branch has many parts. Name one.",
    es: "La rama ejecutiva tiene muchas partes. Nombre una.",
    answers_en: ["President (of the United States)", "Cabinet", "Federal departments and agencies"],
    answers_es: ["Presidente (de los Estados Unidos)", "Gabinete", "Departamentos y agencias federales"]
  },
  "047": {
    en: "What does the President's Cabinet do?",
    es: "¿Qué hace el Gabinete del Presidente?",
    answers_en: ["Advises the President (of the United States)"],
    answers_es: ["Asesora al Presidente (de los Estados Unidos)"]
  },
  "048": {
    en: "What are two Cabinet-level positions?",
    es: "¿Cuáles son dos puestos a nivel de Gabinete?",
    answers_en: ["Attorney General", "Secretary of Agriculture", "Secretary of Commerce", "Secretary of Defense", "Secretary of Education", "Secretary of Energy", "Secretary of Health and Human Services", "Secretary of Homeland Security", "Secretary of Housing and Urban Development", "Secretary of the Interior", "Secretary of Labor", "Secretary of State", "Secretary of Transportation", "Secretary of the Treasury", "Secretary of Veterans Affairs", "Vice President"],
    answers_es: ["Procurador General", "Secretario de Agricultura", "Secretario de Comercio", "Secretario de Defensa", "Secretario de Educación", "Secretario de Energía", "Secretario de Salud y Servicios Humanos", "Secretario de Seguridad Nacional", "Secretario de Vivienda y Desarrollo Urbano", "Secretario del Interior", "Secretario del Trabajo", "Secretario de Estado", "Secretario de Transporte", "Secretario del Tesoro", "Secretario de Asuntos de Veteranos", "Vicepresidente"],
    note_en: "Name TWO from the list.",
    note_es: "Nombre DOS de la lista."
  },
  "049": {
    en: "Why is the Electoral College important?",
    es: "¿Por qué es importante el Colegio Electoral?",
    answers_en: ["It decides who is elected president.", "It provides a compromise between the popular election of the president and congressional selection."],
    answers_es: ["Decide quién es elegido presidente.", "Proporciona un compromiso entre la elección popular del presidente y la selección congresional."]
  },
  "051": {
    en: "What does the judicial branch do?",
    es: "¿Qué hace la rama judicial?",
    answers_en: ["Reviews laws", "Explains laws", "Resolves disputes (disagreements) about the law", "Decides if a law goes against the (U.S.) Constitution"],
    answers_es: ["Revisa las leyes", "Explica las leyes", "Resuelve disputas (desacuerdos) sobre la ley", "Decide si una ley va en contra de la Constitución (de los Estados Unidos)"]
  },
  "052": {
    en: "What is the highest court in the United States?",
    es: "¿Cuál es el tribunal más alto de los Estados Unidos?",
    answers_en: ["Supreme Court"],
    answers_es: ["Corte Suprema"],
    starred: true
  },
  "058": {
    en: "Name one power that is only for the federal government.",
    es: "Nombre un poder que es solo para el gobierno federal.",
    answers_en: ["Print paper money", "Mint coins", "Declare war", "Create an army", "Make treaties", "Set foreign policy"],
    answers_es: ["Imprimir papel moneda", "Acuñar monedas", "Declarar la guerra", "Crear un ejército", "Hacer tratados", "Establecer la política exterior"]
  },
  "059": {
    en: "Name one power that is only for the states.",
    es: "Nombre un poder que es solo para los estados.",
    answers_en: ["Provide education and schooling", "Provide protection (police)", "Provide safety (fire departments)", "Give a driver's license", "Approve zoning and land use"],
    answers_es: ["Proveer educación y escolarización", "Proveer protección (policía)", "Proveer seguridad (departamentos de bomberos)", "Dar una licencia de conducir", "Aprobar zonificación y uso de la tierra"]
  },
  "060": {
    en: "What is the purpose of the 10th Amendment?",
    es: "¿Cuál es el propósito de la 10a Enmienda?",
    answers_en: ["(It states that) powers not given to the federal government belong to the states or the people."],
    answers_es: ["(Establece que los) poderes no otorgados al gobierno federal pertenecen a los estados o al pueblo."]
  },
  "061": {
    en: "Who is the governor of your state now?",
    es: "¿Quién es el gobernador de su estado ahora?",
    variable: true,
    starred: true
  },
  "064": {
    en: "Who can vote in federal elections, run for federal office, and serve on a jury in the United States?",
    es: "¿Quién puede votar en elecciones federales, postularse para un cargo federal y servir en un jurado en los Estados Unidos?",
    answers_en: [
      "Citizens",
      "Citizens of the United States",
      "U.S. citizens"
    ],
    answers_es: [
      "Ciudadanos",
      "Ciudadanos de los Estados Unidos",
      "Ciudadanos estadounidenses"
    ]
  },
  "082": {
    en: "What founding document was written in 1787?",
    es: "¿Qué documento fundacional fue escrito en 1787?",
    answers_en: ["(U.S.) Constitution"],
    answers_es: ["Constitución (de los Estados Unidos)"]
  },
  "014": {
    en: "Many documents influenced the U.S. Constitution. Name one.",
    es: "Muchos documentos influyeron en la Constitución de los Estados Unidos. Nombre uno.",
    answers_en: [
      "Declaration of Independence",
      "Articles of Confederation",
      "Federalist Papers",
      "Anti-Federalist Papers",
      "Virginia Declaration of Rights",
      "Fundamental Orders of Connecticut",
      "Mayflower Compact",
      "Iroquois Great Law of Peace"
    ],
    answers_es: [
      "Declaración de Independencia",
      "Artículos de la Confederación",
      "Documentos Federalistas",
      "Documentos Antifederalistas",
      "Declaración de Derechos de Virginia",
      "Órdenes Fundamentales de Connecticut",
      "Pacto del Mayflower",
      "Gran Ley de Paz de los Iroqueses"
    ]
  },
  "021": {
    en: "How many U.S. senators are there?",
    es: "¿Cuántos senadores de los Estados Unidos hay?",
    answers_en: ["One hundred (100)"],
    answers_es: ["Cien (100)"]
  },
  "022": {
    en: "How long is a term for a U.S. senator?",
    es: "¿Cuánto dura el período de un senador de los Estados Unidos?",
    answers_en: ["Six (6) years"],
    answers_es: ["Seis (6) años"]
  },
  "024": {
    en: "How many voting members are in the House of Representatives?",
    es: "¿Cuántos miembros con derecho a voto hay en la Cámara de Representantes?",
    answers_en: ["Four hundred thirty-five (435)"],
    answers_es: ["Cuatrocientos treinta y cinco (435)"]
  },
  "025": {
    en: "How long is a term for a member of the House of Representatives?",
    es: "¿Cuánto dura el período de un miembro de la Cámara de Representantes?",
    answers_en: ["Two (2) years"],
    answers_es: ["Dos (2) años"]
  },
  "027": {
    en: "How many senators does each state have?",
    es: "¿Cuántos senadores tiene cada estado?",
    answers_en: ["Two (2)"],
    answers_es: ["Dos (2)"]
  },
  "028": {
    en: "Why does each state have two senators?",
    es: "¿Por qué cada estado tiene dos senadores?",
    answers_en: [
      "Equal representation (for small states)",
      "The Great Compromise (Connecticut Compromise)"
    ],
    answers_es: [
      "Representación igualitaria (para los estados pequeños)",
      "El Gran Compromiso (Compromiso de Connecticut)"
    ]
  },
  "031": {
    en: "Who does a U.S. senator represent?",
    es: "¿A quién representa un senador de los Estados Unidos?",
    answers_en: [
      "Citizens of their state",
      "People of their state"
    ],
    answers_es: [
      "Ciudadanos de su estado",
      "Personas de su estado"
    ]
  },
  "034": {
    en: "Who elects members of the House of Representatives?",
    es: "¿Quién elige a los miembros de la Cámara de Representantes?",
    answers_en: ["Citizens from their (congressional) district"],
    answers_es: ["Ciudadanos de su distrito (congresional)"]
  },
  "035": {
    en: "Some states have more representatives than other states. Why?",
    es: "Algunos estados tienen más representantes que otros estados. ¿Por qué?",
    answers_en: [
      "(Because of) the state's population",
      "(Because) they have more people",
      "(Because) some states have more people"
    ],
    answers_es: [
      "(Por) la población del estado",
      "(Porque) tienen más personas",
      "(Porque) algunos estados tienen más personas"
    ]
  },
  "043": {
    en: "Who signs bills to become laws?",
    es: "¿Quién firma los proyectos de ley para convertirlos en leyes?",
    answers_en: ["The President (of the United States)"],
    answers_es: ["El Presidente (de los Estados Unidos)"]
  },
  "044": {
    en: "Who vetoes bills?",
    es: "¿Quién veta los proyectos de ley?",
    answers_en: ["The President (of the United States)"],
    answers_es: ["El Presidente (de los Estados Unidos)"],
    starred: true
  },
  "045": {
    en: "Who appoints federal judges?",
    es: "¿Quién nombra a los jueces federales?",
    answers_en: ["The President (of the United States)"],
    answers_es: ["El Presidente (de los Estados Unidos)"]
  },
  "050": {
    en: "What is one part of the judicial branch?",
    es: "¿Cuál es una parte de la rama judicial?",
    answers_en: [
      "Supreme Court",
      "Federal Courts"
    ],
    answers_es: [
      "Corte Suprema",
      "Tribunales Federales"
    ]
  },
  "053": {
    en: "How many seats are on the Supreme Court?",
    es: "¿Cuántos puestos hay en la Corte Suprema?",
    answers_en: ["Nine (9)"],
    answers_es: ["Nueve (9)"]
  },
  "054": {
    en: "How many Supreme Court justices are usually needed to decide a case?",
    es: "¿Cuántos jueces de la Corte Suprema se necesitan usualmente para decidir un caso?",
    answers_en: ["Five (5)"],
    answers_es: ["Cinco (5)"]
  },
  "055": {
    en: "How long do Supreme Court justices serve?",
    es: "¿Cuánto tiempo sirven los jueces de la Corte Suprema?",
    answers_en: [
      "(For) life",
      "Lifetime appointment",
      "(Until) retirement"
    ],
    answers_es: [
      "(De por) vida",
      "Nombramiento vitalicio",
      "(Hasta la) jubilación"
    ]
  },
  "056": {
    en: "Supreme Court justices serve for life. Why?",
    es: "Los jueces de la Corte Suprema sirven de por vida. ¿Por qué?",
    answers_en: [
      "To be independent (of politics)",
      "To limit outside (political) influence"
    ],
    answers_es: [
      "Para ser independientes (de la política)",
      "Para limitar la influencia externa (política)"
    ]
  },
  "057": {
    en: "Who is the Chief Justice of the United States now?",
    es: "¿Quién es el Presidente de la Corte Suprema de los Estados Unidos ahora?",
    variable: true
  },
  "062": {
    en: "What is the capital of your state?",
    es: "¿Cuál es la capital de su estado?",
    variable: true
  },
  "063": {
    en: "There are four amendments to the U.S. Constitution about who can vote. Describe one of them.",
    es: "Hay cuatro enmiendas a la Constitución de los Estados Unidos sobre quién puede votar. Describa una de ellas.",
    answers_en: [
      "Citizens eighteen (18) and older (can vote).",
      "You don't have to pay (a poll tax) to vote.",
      "Any citizen can vote. (Women and men can vote.)",
      "A male citizen of any race (can vote)."
    ],
    answers_es: [
      "Ciudadanos de dieciocho (18) años o mayores (pueden votar).",
      "No tiene que pagar (un impuesto electoral) para votar.",
      "Cualquier ciudadano puede votar. (Las mujeres y los hombres pueden votar.)",
      "Un ciudadano masculino de cualquier raza (puede votar)."
    ]
  },
  "065": {
    en: "What are three rights of everyone living in the United States?",
    es: "¿Cuáles son tres derechos de todas las personas que viven en los Estados Unidos?",
    answers_en: [
      "Freedom of expression",
      "Freedom of speech",
      "Freedom of assembly",
      "Freedom to petition the government",
      "Freedom of religion",
      "The right to bear arms"
    ],
    answers_es: [
      "Libertad de expresión",
      "Libertad de palabra",
      "Libertad de reunión",
      "Libertad de petición al gobierno",
      "Libertad de religión",
      "El derecho a portar armas"
    ],
    note_en: "Name THREE from the list.",
    note_es: "Nombre TRES de la lista."
  },
  "067": {
    en: "Name two promises that new citizens make in the Oath of Allegiance.",
    es: "Nombre dos promesas que los nuevos ciudadanos hacen en el Juramento de Lealtad.",
    answers_en: [
      "Give up loyalty to other countries",
      "Defend the (U.S.) Constitution",
      "Obey the laws of the United States",
      "Serve in the military (if needed)",
      "Serve (help, do important work for) the nation (if needed)",
      "Be loyal to the United States"
    ],
    answers_es: [
      "Renunciar a la lealtad a otros países",
      "Defender la Constitución (de los Estados Unidos)",
      "Obedecer las leyes de los Estados Unidos",
      "Servir en las fuerzas armadas (si es necesario)",
      "Servir (ayudar, hacer trabajo importante para) la nación (si es necesario)",
      "Ser leal a los Estados Unidos"
    ],
    note_en: "Name TWO from the list.",
    note_es: "Nombre DOS de la lista."
  },
  "068": {
    en: "How can people become United States citizens?",
    es: "¿Cómo pueden las personas convertirse en ciudadanos de los Estados Unidos?",
    answers_en: [
      "Be born in the United States, under the conditions set by the 14th Amendment",
      "Naturalize",
      "Derive citizenship (under conditions set by Congress)"
    ],
    answers_es: [
      "Nacer en los Estados Unidos, bajo las condiciones establecidas por la 14a Enmienda",
      "Naturalizarse",
      "Derivar la ciudadanía (bajo condiciones establecidas por el Congreso)"
    ]
  },
  "069": {
    en: "What are two examples of civic participation in the United States?",
    es: "¿Cuáles son dos ejemplos de participación cívica en los Estados Unidos?",
    answers_en: [
      "Vote",
      "Run for office",
      "Join a political party",
      "Help with a campaign",
      "Join a civic group",
      "Join a community group",
      "Give an elected official your opinion (on an issue)",
      "Contact elected officials",
      "Support or oppose an issue or policy",
      "Write to a newspaper"
    ],
    answers_es: [
      "Votar",
      "Postularse para un cargo",
      "Unirse a un partido político",
      "Ayudar con una campaña",
      "Unirse a un grupo cívico",
      "Unirse a un grupo comunitario",
      "Dar su opinión a un funcionario electo (sobre un asunto)",
      "Contactar a funcionarios electos",
      "Apoyar u oponerse a un asunto o política",
      "Escribir a un periódico"
    ],
    note_en: "Name TWO from the list.",
    note_es: "Nombre DOS de la lista."
  },
  "070": {
    en: "What is one way Americans can serve their country?",
    es: "¿Cuál es una manera en que los estadounidenses pueden servir a su país?",
    answers_en: [
      "Vote",
      "Pay taxes",
      "Obey the law",
      "Serve in the military",
      "Run for office",
      "Work for local, state, or federal government"
    ],
    answers_es: [
      "Votar",
      "Pagar impuestos",
      "Obedecer la ley",
      "Servir en las fuerzas armadas",
      "Postularse para un cargo",
      "Trabajar para el gobierno local, estatal o federal"
    ]
  },
  "071": {
    en: "Why is it important to pay federal taxes?",
    es: "¿Por qué es importante pagar impuestos federales?",
    answers_en: [
      "Required by law",
      "All people pay to fund the federal government",
      "Required by the (U.S.) Constitution (16th Amendment)",
      "Civic duty"
    ],
    answers_es: [
      "Requerido por la ley",
      "Todas las personas pagan para financiar al gobierno federal",
      "Requerido por la Constitución (de los Estados Unidos) (16a Enmienda)",
      "Deber cívico"
    ]
  },
  "072": {
    en: "It is important for all men age 18 through 25 to register for the Selective Service. Name one reason why.",
    es: "Es importante que todos los hombres de 18 a 25 años se registren en el Servicio Selectivo. Nombre una razón por qué.",
    answers_en: [
      "Required by law",
      "Civic duty",
      "Makes the draft fair, if needed"
    ],
    answers_es: [
      "Requerido por la ley",
      "Deber cívico",
      "Hace que el reclutamiento sea justo, si es necesario"
    ]
  },

  "008": {
    en: "Why is the Declaration of Independence important?",
    es: "¿Por qué es importante la Declaración de Independencia?",
    answers_en: [
      "It says America is free from British control.",
      "It says all people are created equal.",
      "It identifies inherent rights.",
      "It identifies individual freedoms."
    ],
    answers_es: [
      "Dice que Estados Unidos es libre del control británico.",
      "Dice que todas las personas son creadas iguales.",
      "Identifica derechos inherentes.",
      "Identifica libertades individuales."
    ]
  },
  "009": {
    en: "What founding document said the American colonies were free from Britain?",
    es: "¿Qué documento fundacional dijo que las colonias americanas eran libres de Gran Bretaña?",
    answers_en: ["Declaration of Independence"],
    answers_es: ["Declaración de Independencia"]
  },
  "010": {
    en: "Name two important ideas from the Declaration of Independence and the U.S. Constitution.",
    es: "Nombre dos ideas importantes de la Declaración de Independencia y la Constitución de los Estados Unidos.",
    answers_en: [
      "Equality",
      "Liberty",
      "Social contract",
      "Natural rights",
      "Limited government",
      "Self-government"
    ],
    answers_es: [
      "Igualdad",
      "Libertad",
      "Contrato social",
      "Derechos naturales",
      "Gobierno limitado",
      "Autogobierno"
    ],
    note_en: "Name TWO from the list.",
    note_es: "Nombre DOS de la lista."
  },
  "011": {
    en: "The words \"Life, Liberty, and the pursuit of Happiness\" are in what founding document?",
    es: "¿En qué documento fundacional están las palabras \"Vida, Libertad y la búsqueda de la Felicidad\"?",
    answers_en: ["Declaration of Independence"],
    answers_es: ["Declaración de Independencia"]
  },
  "073": {
    en: "The colonists came to America for many reasons. Name one.",
    es: "Los colonos vinieron a América por muchas razones. Nombre una.",
    answers_en: [
      "Freedom",
      "Political liberty",
      "Religious freedom",
      "Economic opportunity",
      "Escape persecution"
    ],
    answers_es: [
      "Libertad",
      "Libertad política",
      "Libertad religiosa",
      "Oportunidad económica",
      "Escapar de la persecución"
    ]
  },
  "074": {
    en: "Who lived in America before the Europeans arrived?",
    es: "¿Quién vivía en América antes de que los europeos llegaran?",
    answers_en: [
      "American Indians",
      "Native Americans"
    ],
    answers_es: [
      "Indios americanos",
      "Nativos americanos"
    ],
    starred: true
  },
  "075": {
    en: "What group of people was taken and sold as slaves?",
    es: "¿Qué grupo de personas fue tomado y vendido como esclavos?",
    answers_en: [
      "Africans",
      "People from Africa"
    ],
    answers_es: [
      "Africanos",
      "Personas de África"
    ]
  },
  "077": {
    en: "Name one reason why the Americans declared independence from Britain.",
    es: "Nombre una razón por la cual los estadounidenses declararon la independencia de Gran Bretaña.",
    answers_en: [
      "High taxes",
      "Taxation without representation",
      "British soldiers stayed in Americans' houses (boarding, quartering)",
      "They did not have self-government",
      "Boston Massacre",
      "Boston Tea Party (Tea Act)",
      "Stamp Act",
      "Sugar Act",
      "Townshend Acts",
      "Intolerable (Coercive) Acts"
    ],
    answers_es: [
      "Impuestos altos",
      "Impuestos sin representación",
      "Soldados británicos se quedaban en las casas de los estadounidenses (alojamiento, acuartelamiento)",
      "No tenían autogobierno",
      "Masacre de Boston",
      "Motín del Té de Boston (Ley del Té)",
      "Ley del Timbre",
      "Ley del Azúcar",
      "Leyes Townshend",
      "Leyes Intolerables (Coercitivas)"
    ]
  },
  "078": {
    en: "Who wrote the Declaration of Independence?",
    es: "¿Quién escribió la Declaración de Independencia?",
    answers_en: ["(Thomas) Jefferson"],
    answers_es: ["(Thomas) Jefferson"],
    starred: true
  },
  "079": {
    en: "When was the Declaration of Independence adopted?",
    es: "¿Cuándo fue adoptada la Declaración de Independencia?",
    answers_en: ["July 4, 1776"],
    answers_es: ["4 de julio de 1776"]
  },
  "080": {
    en: "The American Revolution had many important events. Name one.",
    es: "La Revolución Americana tuvo muchos eventos importantes. Nombre uno.",
    answers_en: [
      "(Battle of) Bunker Hill",
      "Declaration of Independence",
      "Washington Crossing the Delaware (Battle of Trenton)",
      "(Battle of) Saratoga",
      "Valley Forge (Encampment)",
      "(Battle of) Yorktown (British surrender at Yorktown)"
    ],
    answers_es: [
      "(Batalla de) Bunker Hill",
      "Declaración de Independencia",
      "Washington cruzando el Delaware (Batalla de Trenton)",
      "(Batalla de) Saratoga",
      "Valley Forge (Campamento)",
      "(Batalla de) Yorktown (rendición británica en Yorktown)"
    ]
  },
  "081": {
    en: "There were 13 original states. Name five.",
    es: "Había 13 estados originales. Nombre cinco.",
    answers_en: [
      "New Hampshire", "Massachusetts", "Rhode Island", "Connecticut",
      "New York", "New Jersey", "Pennsylvania", "Delaware",
      "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia"
    ],
    answers_es: [
      "New Hampshire", "Massachusetts", "Rhode Island", "Connecticut",
      "New York", "New Jersey", "Pennsylvania", "Delaware",
      "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia"
    ],
    note_en: "Name FIVE from the list.",
    note_es: "Nombre CINCO de la lista."
  },
  "083": {
    en: "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.",
    es: "Los Documentos Federalistas apoyaron la aprobación de la Constitución de los Estados Unidos. Nombre uno de los escritores.",
    answers_en: [
      "(James) Madison",
      "(Alexander) Hamilton",
      "(John) Jay",
      "Publius"
    ],
    answers_es: [
      "(James) Madison",
      "(Alexander) Hamilton",
      "(John) Jay",
      "Publius"
    ]
  },
  "084": {
    en: "Why were the Federalist Papers important?",
    es: "¿Por qué fueron importantes los Documentos Federalistas?",
    answers_en: [
      "They helped people understand the (U.S.) Constitution.",
      "They supported passing the (U.S.) Constitution."
    ],
    answers_es: [
      "Ayudaron a las personas a entender la Constitución (de los Estados Unidos).",
      "Apoyaron la aprobación de la Constitución (de los Estados Unidos)."
    ]
  },
  "085": {
    en: "Benjamin Franklin is famous for many things. Name one.",
    es: "Benjamin Franklin es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "Founded the first free public libraries",
      "First Postmaster General of the United States",
      "Helped write the Declaration of Independence",
      "Inventor",
      "U.S. diplomat"
    ],
    answers_es: [
      "Fundó las primeras bibliotecas públicas gratuitas",
      "Primer Director General de Correos de los Estados Unidos",
      "Ayudó a escribir la Declaración de Independencia",
      "Inventor",
      "Diplomático estadounidense"
    ]
  },
  "086": {
    en: "George Washington is famous for many things. Name one.",
    es: "George Washington es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "\"Father of Our Country\"",
      "First president of the United States",
      "General of the Continental Army",
      "President of the Constitutional Convention"
    ],
    answers_es: [
      "\"Padre de Nuestro País\"",
      "Primer presidente de los Estados Unidos",
      "General del Ejército Continental",
      "Presidente de la Convención Constitucional"
    ],
    starred: true
  },
  "087": {
    en: "Thomas Jefferson is famous for many things. Name one.",
    es: "Thomas Jefferson es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "Writer of the Declaration of Independence",
      "Third president of the United States",
      "Doubled the size of the United States (Louisiana Purchase)",
      "First Secretary of State",
      "Founded the University of Virginia",
      "Writer of the Virginia Statute on Religious Freedom"
    ],
    answers_es: [
      "Escritor de la Declaración de Independencia",
      "Tercer presidente de los Estados Unidos",
      "Duplicó el tamaño de los Estados Unidos (Compra de Luisiana)",
      "Primer Secretario de Estado",
      "Fundó la Universidad de Virginia",
      "Escritor del Estatuto de Virginia sobre Libertad Religiosa"
    ]
  },
  "117": {
    en: "Name one American Indian tribe in the United States.",
    es: "Nombre una tribu de indios americanos en los Estados Unidos.",
    answers_en: [
      "Apache", "Blackfeet", "Cayuga", "Cherokee", "Cheyenne", "Chippewa",
      "Choctaw", "Creek", "Crow", "Hopi", "Huron", "Inupiat", "Lakota",
      "Mohawk", "Mohegan", "Navajo", "Oneida", "Onondaga", "Pueblo",
      "Seminole", "Seneca", "Shawnee", "Sioux", "Teton", "Tuscarora"
    ],
    answers_es: [
      "Apache", "Blackfeet", "Cayuga", "Cherokee", "Cheyenne", "Chippewa",
      "Choctaw", "Creek", "Crow", "Hopi", "Huron", "Inupiat", "Lakota",
      "Mohawk", "Mohegan", "Navajo", "Oneida", "Onondaga", "Pueblo",
      "Seminole", "Seneca", "Shawnee", "Sioux", "Teton", "Tuscarora"
    ]
  },
  "119": {
    en: "What is the capital of the United States?",
    es: "¿Cuál es la capital de los Estados Unidos?",
    answers_en: ["Washington, D.C."],
    answers_es: ["Washington, D.C."]
  },
  "125": {
    en: "What is Independence Day?",
    es: "¿Qué es el Día de la Independencia?",
    answers_en: [
      "A holiday to celebrate U.S. independence (from Britain)",
      "The country's birthday"
    ],
    answers_es: [
      "Un día festivo para celebrar la independencia de los Estados Unidos (de Gran Bretaña)",
      "El cumpleaños del país"
    ]
  },

  "088": {
    en: "James Madison is famous for many things. Name one.",
    es: "James Madison es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "\"Father of the Constitution\"",
      "Fourth president of the United States",
      "President during the War of 1812",
      "One of the writers of the Federalist Papers"
    ],
    answers_es: [
      "\"Padre de la Constitución\"",
      "Cuarto presidente de los Estados Unidos",
      "Presidente durante la Guerra de 1812",
      "Uno de los escritores de los Documentos Federalistas"
    ]
  },
  "089": {
    en: "Alexander Hamilton is famous for many things. Name one.",
    es: "Alexander Hamilton es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "First Secretary of the Treasury",
      "One of the writers of the Federalist Papers",
      "Helped establish the First Bank of the United States",
      "Aide to General George Washington",
      "Member of the Continental Congress"
    ],
    answers_es: [
      "Primer Secretario del Tesoro",
      "Uno de los escritores de los Documentos Federalistas",
      "Ayudó a establecer el Primer Banco de los Estados Unidos",
      "Asistente del General George Washington",
      "Miembro del Congreso Continental"
    ]
  },
  "090": {
    en: "What territory did the United States buy from France in 1803?",
    es: "¿Qué territorio compraron los Estados Unidos a Francia en 1803?",
    answers_en: [
      "Louisiana Territory",
      "Louisiana"
    ],
    answers_es: [
      "Territorio de Luisiana",
      "Luisiana"
    ]
  },
  "091": {
    en: "Name one war fought by the United States in the 1800s.",
    es: "Nombre una guerra librada por los Estados Unidos en los años 1800.",
    answers_en: [
      "War of 1812",
      "Mexican-American War",
      "Civil War",
      "Spanish-American War"
    ],
    answers_es: [
      "Guerra de 1812",
      "Guerra México-Americana",
      "Guerra Civil",
      "Guerra Hispano-Americana"
    ]
  },
  "092": {
    en: "Name the U.S. war between the North and the South.",
    es: "Nombre la guerra estadounidense entre el Norte y el Sur.",
    answers_en: ["The Civil War"],
    answers_es: ["La Guerra Civil"]
  },
  "093": {
    en: "The Civil War had many important events. Name one.",
    es: "La Guerra Civil tuvo muchos eventos importantes. Nombre uno.",
    answers_en: [
      "(Battle of) Fort Sumter",
      "Emancipation Proclamation",
      "(Battle of) Vicksburg",
      "(Battle of) Gettysburg",
      "Sherman's March",
      "(Surrender at) Appomattox",
      "(Battle of) Antietam/Sharpsburg",
      "Lincoln was assassinated."
    ],
    answers_es: [
      "(Batalla de) Fort Sumter",
      "Proclamación de Emancipación",
      "(Batalla de) Vicksburg",
      "(Batalla de) Gettysburg",
      "Marcha de Sherman",
      "(Rendición en) Appomattox",
      "(Batalla de) Antietam/Sharpsburg",
      "Lincoln fue asesinado."
    ]
  },
  "094": {
    en: "Abraham Lincoln is famous for many things. Name one.",
    es: "Abraham Lincoln es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "Freed the slaves (Emancipation Proclamation)",
      "Saved (or preserved) the Union",
      "Led the United States during the Civil War",
      "16th president of the United States",
      "Delivered the Gettysburg Address"
    ],
    answers_es: [
      "Liberó a los esclavos (Proclamación de Emancipación)",
      "Salvó (o preservó) la Unión",
      "Dirigió a los Estados Unidos durante la Guerra Civil",
      "16º presidente de los Estados Unidos",
      "Pronunció el Discurso de Gettysburg"
    ],
    starred: true
  },
  "095": {
    en: "What did the Emancipation Proclamation do?",
    es: "¿Qué hizo la Proclamación de Emancipación?",
    answers_en: [
      "Freed the slaves",
      "Freed slaves in the Confederacy",
      "Freed slaves in the Confederate states",
      "Freed slaves in most Southern states"
    ],
    answers_es: [
      "Liberó a los esclavos",
      "Liberó esclavos en la Confederación",
      "Liberó esclavos en los estados Confederados",
      "Liberó esclavos en la mayoría de los estados del Sur"
    ]
  },
  "096": {
    en: "What U.S. war ended slavery?",
    es: "¿Qué guerra estadounidense terminó con la esclavitud?",
    answers_en: ["The Civil War"],
    answers_es: ["La Guerra Civil"]
  },
  "099": {
    en: "Name one leader of the women's rights movement in the 1800s.",
    es: "Nombre un líder del movimiento por los derechos de las mujeres en los años 1800.",
    answers_en: [
      "Susan B. Anthony",
      "Elizabeth Cady Stanton",
      "Sojourner Truth",
      "Harriet Tubman",
      "Lucretia Mott",
      "Lucy Stone"
    ],
    answers_es: [
      "Susan B. Anthony",
      "Elizabeth Cady Stanton",
      "Sojourner Truth",
      "Harriet Tubman",
      "Lucretia Mott",
      "Lucy Stone"
    ]
  },
  "126": {
    en: "Name three national U.S. holidays.",
    es: "Nombre tres días festivos nacionales de los Estados Unidos. (No oficial)",

    answers_en: [
      "New Year's Day",
      "Martin Luther King, Jr. Day",
      "Presidents Day (Washington's Birthday)",
      "Memorial Day",
      "Juneteenth",
      "Independence Day",
      "Labor Day",
      "Columbus Day",
      "Veterans Day",
      "Thanksgiving Day",
      "Christmas Day"
    ],
    answers_es: [
      "Día de Año Nuevo",
      "Día de Martin Luther King, Jr.",
      "Día de los Presidentes (Cumpleaños de Washington)",
      "Día de los Caídos",
      "Día de la Independencia",
      "Día del Trabajo",
      "Día de Colón",
      "Día de los Veteranos",
      "Día de Acción de Gracias",
      "Día de Navidad"
    ],
    note_en: "Name THREE from the list.",
    note_es: "Nombre TRES de la lista.",
    starred: true
  },

  "012": {
    en: "What is the economic system of the United States?",
    es: "¿Cuál es el sistema económico de los Estados Unidos?",
    answers_en: [
      "Capitalism",
      "Free market economy"
    ],
    answers_es: [
      "Capitalismo",
      "Economía de libre mercado"
    ],
    starred: true
  },
  "020": {
    en: "Name one power of the U.S. Congress.",
    es: "Nombre un poder del Congreso de los Estados Unidos.",
    answers_en: [
      "Writes laws",
      "Declares war",
      "Makes the federal budget"
    ],
    answers_es: [
      "Escribe las leyes",
      "Declara la guerra",
      "Hace el presupuesto federal"
    ],
    starred: true
  },
  "066": {
    en: "What do we show loyalty to when we say the Pledge of Allegiance?",
    es: "¿A qué mostramos lealtad cuando decimos el Juramento a la Bandera?",
    answers_en: [
      "The United States",
      "The flag"
    ],
    answers_es: [
      "Los Estados Unidos",
      "La bandera"
    ],
    starred: true
  },
  "097": {
    en: "What amendment says all persons born or naturalized in the United States, and subject to the jurisdiction thereof, are U.S. citizens?",
    es: "¿Qué enmienda dice que todas las personas nacidas o naturalizadas en los Estados Unidos, y sujetas a su jurisdicción, son ciudadanos estadounidenses?",
    answers_en: ["14th Amendment"],
    answers_es: ["14a Enmienda"]
  },
  "098": {
    en: "When did all men get the right to vote?",
    es: "¿Cuándo obtuvieron todos los hombres el derecho al voto?",
    answers_en: [
      "After the Civil War",
      "During Reconstruction",
      "(With the) 15th Amendment",
      "1870"
    ],
    answers_es: [
      "Después de la Guerra Civil",
      "Durante la Reconstrucción",
      "(Con la) 15a Enmienda",
      "1870"
    ]
  },
  "100": {
    en: "Name one war fought by the United States in the 1900s.",
    es: "Nombre una guerra librada por los Estados Unidos en los años 1900.",
    answers_en: [
      "World War I",
      "World War II",
      "Korean War",
      "Vietnam War",
      "(Persian) Gulf War"
    ],
    answers_es: [
      "Primera Guerra Mundial",
      "Segunda Guerra Mundial",
      "Guerra de Corea",
      "Guerra de Vietnam",
      "Guerra del Golfo (Pérsico)"
    ]
  },
  "101": {
    en: "Why did the United States enter World War I?",
    es: "¿Por qué entraron los Estados Unidos a la Primera Guerra Mundial?",
    answers_en: [
      "Because Germany attacked U.S. (civilian) ships",
      "To support the Allied Powers (England, France, Italy, and Russia)",
      "To oppose the Central Powers (Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria)"
    ],
    answers_es: [
      "Porque Alemania atacó barcos estadounidenses (civiles)",
      "Para apoyar a las Potencias Aliadas (Inglaterra, Francia, Italia y Rusia)",
      "Para oponerse a las Potencias Centrales (Alemania, Austria-Hungría, el Imperio Otomano y Bulgaria)"
    ]
  },
  "102": {
    en: "When did all women get the right to vote?",
    es: "¿Cuándo obtuvieron todas las mujeres el derecho al voto?",
    answers_en: [
      "1920",
      "After World War I",
      "(With the) 19th Amendment"
    ],
    answers_es: [
      "1920",
      "Después de la Primera Guerra Mundial",
      "(Con la) 19a Enmienda"
    ]
  },
  "103": {
    en: "What was the Great Depression?",
    es: "¿Qué fue la Gran Depresión?",
    answers_en: ["Longest economic recession in modern history"],
    answers_es: ["La recesión económica más larga de la historia moderna"]
  },
  "104": {
    en: "When did the Great Depression start?",
    es: "¿Cuándo comenzó la Gran Depresión?",
    answers_en: [
      "The Great Crash (1929)",
      "Stock market crash of 1929"
    ],
    answers_es: [
      "La Gran Caída (1929)",
      "Crash del mercado de valores de 1929"
    ]
  },
  "105": {
    en: "Who was president during the Great Depression and World War II?",
    es: "¿Quién fue presidente durante la Gran Depresión y la Segunda Guerra Mundial?",
    answers_en: ["(Franklin) Roosevelt"],
    answers_es: ["(Franklin) Roosevelt"]
  },
  "106": {
    en: "Why did the United States enter World War II?",
    es: "¿Por qué entraron los Estados Unidos a la Segunda Guerra Mundial?",
    answers_en: [
      "(Bombing of) Pearl Harbor",
      "Japanese attacked Pearl Harbor",
      "To support the Allied Powers (England, France, and Russia)",
      "To oppose the Axis Powers (Germany, Italy, and Japan)"
    ],
    answers_es: [
      "(Bombardeo de) Pearl Harbor",
      "Los japoneses atacaron Pearl Harbor",
      "Para apoyar a las Potencias Aliadas (Inglaterra, Francia y Rusia)",
      "Para oponerse a las Potencias del Eje (Alemania, Italia y Japón)"
    ]
  },
  "107": {
    en: "Dwight Eisenhower is famous for many things. Name one.",
    es: "Dwight Eisenhower es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "General during World War II",
      "President at the end of (during) the Korean War",
      "34th president of the United States",
      "Signed the Federal-Aid Highway Act of 1956 (Created the Interstate System)"
    ],
    answers_es: [
      "General durante la Segunda Guerra Mundial",
      "Presidente al final de (durante) la Guerra de Corea",
      "34º presidente de los Estados Unidos",
      "Firmó la Ley de Ayuda Federal para Carreteras de 1956 (Creó el Sistema Interestatal)"
    ]
  },
  "108": {
    en: "Who was the United States' main rival during the Cold War?",
    es: "¿Quién fue el principal rival de los Estados Unidos durante la Guerra Fría?",
    answers_en: [
      "Soviet Union",
      "USSR",
      "Russia"
    ],
    answers_es: [
      "Unión Soviética",
      "URSS",
      "Rusia"
    ]
  },
  "109": {
    en: "During the Cold War, what was one main concern of the United States?",
    es: "Durante la Guerra Fría, ¿cuál fue una preocupación principal de los Estados Unidos?",
    answers_en: [
      "Communism",
      "Nuclear war"
    ],
    answers_es: [
      "Comunismo",
      "Guerra nuclear"
    ]
  },
  "110": {
    en: "Why did the United States enter the Korean War?",
    es: "¿Por qué entraron los Estados Unidos a la Guerra de Corea?",
    answers_en: ["To stop the spread of communism"],
    answers_es: ["Para detener la expansión del comunismo"]
  },
  "111": {
    en: "Why did the United States enter the Vietnam War?",
    es: "¿Por qué entraron los Estados Unidos a la Guerra de Vietnam?",
    answers_en: ["To stop the spread of communism"],
    answers_es: ["Para detener la expansión del comunismo"]
  },
  "112": {
    en: "What did the civil rights movement do?",
    es: "¿Qué hizo el movimiento por los derechos civiles?",
    answers_en: ["Fought to end racial discrimination"],
    answers_es: ["Luchó para terminar la discriminación racial"]
  },
  "113": {
    en: "Martin Luther King, Jr. is famous for many things. Name one.",
    es: "Martin Luther King, Jr. es famoso por muchas cosas. Nombre una.",
    answers_en: [
      "Fought for civil rights",
      "Worked for equality for all Americans",
      "Worked to ensure that people would not be judged by the color of their skin, but by the content of their character"
    ],
    answers_es: [
      "Luchó por los derechos civiles",
      "Trabajó por la igualdad para todos los estadounidenses",
      "Trabajó para asegurar que las personas no fueran juzgadas por el color de su piel, sino por el contenido de su carácter"
    ],
    starred: true
  },
  "115": {
    en: "What major event happened on September 11, 2001 in the United States?",
    es: "¿Qué evento importante ocurrió el 11 de septiembre de 2001 en los Estados Unidos?",
    answers_en: [
      "Terrorists attacked the United States",
      "Terrorists took over two planes and crashed them into the World Trade Center in New York City",
      "Terrorists took over a plane and crashed into the Pentagon in Arlington, Virginia",
      "Terrorists took over a plane originally aimed at Washington, D.C., and crashed in a field in Pennsylvania"
    ],
    answers_es: [
      "Terroristas atacaron a los Estados Unidos",
      "Terroristas tomaron dos aviones y los estrellaron contra el World Trade Center en la Ciudad de Nueva York",
      "Terroristas tomaron un avión y lo estrellaron contra el Pentágono en Arlington, Virginia",
      "Terroristas tomaron un avión originalmente dirigido a Washington, D.C., y lo estrellaron en un campo en Pensilvania"
    ],
    starred: true
  },
  "116": {
    en: "Name one U.S. military conflict after the September 11, 2001 attacks.",
    es: "Nombre un conflicto militar estadounidense después de los ataques del 11 de septiembre de 2001.",
    answers_en: [
      "(Global) War on Terror",
      "War in Afghanistan",
      "War in Iraq"
    ],
    answers_es: [
      "Guerra (Global) contra el Terrorismo",
      "Guerra en Afganistán",
      "Guerra en Irak"
    ]
  },
  "118": {
    en: "Name one example of an American innovation.",
    es: "Nombre un ejemplo de una innovación estadounidense.",
    answers_en: [
      "Light bulb",
      "Automobile (cars, internal combustion engine)",
      "Skyscrapers",
      "Airplane",
      "Assembly line",
      "Landing on the moon",
      "Integrated circuit (IC)"
    ],
    answers_es: [
      "Bombilla",
      "Automóvil (autos, motor de combustión interna)",
      "Rascacielos",
      "Avión",
      "Línea de ensamblaje",
      "Aterrizaje en la luna",
      "Circuito integrado (CI)"
    ]
  },
  "120": {
    en: "Where is the Statue of Liberty?",
    es: "¿Dónde está la Estatua de la Libertad? (No oficial)",
    answers_en: [
      "New York (Harbor)",
      "Liberty Island",
      "New Jersey",
      "near New York City",
      "on the Hudson (River)"
    ],
    answers_es: [
      "Puerto de Nueva York",
      "Isla de la Libertad",
      "Nueva Jersey",
      "cerca de la Ciudad de Nueva York",
      "en el (Río) Hudson"
    ]
  },
  "121": {
    en: "Why does the flag have 13 stripes?",
    es: "¿Por qué tiene la bandera 13 rayas? (No oficial)",
    answers_en: [
      "(Because there were) 13 original colonies",
      "(Because the stripes) represent the original colonies"
    ],
    answers_es: [
      "(Porque había) 13 colonias originales",
      "(Porque las rayas) representan las colonias originales"
    ],
    starred: true
  },
  "122": {
    en: "Why does the flag have 50 stars?",
    es: "¿Por qué tiene la bandera 50 estrellas? (No oficial)",
    answers_en: [
      "(Because there is) one star for each state",
      "(Because) each star represents a state",
      "(Because there are) 50 states"
    ],
    answers_es: [
      "(Porque hay) una estrella por cada estado",
      "(Porque) cada estrella representa un estado",
      "(Porque hay) 50 estados"
    ]
  },
  "123": {
    en: "What is the name of the national anthem?",
    es: "¿Cuál es el nombre del himno nacional? (No oficial)",
    answers_en: ["The Star-Spangled Banner"],
    answers_es: ["The Star-Spangled Banner"]
  },
  "124": {
    en: "The Nation's first motto was \"E Pluribus Unum.\" What does that mean?",
    es: "El primer lema de la Nación fue \"E Pluribus Unum\". ¿Qué significa eso? (No oficial)",
    answers_en: [
      "Out of many, one",
      "We all become one"
    ],
    answers_es: [
      "De muchos, uno",
      "Todos nos convertimos en uno"
    ]
  },
  "127": {
    en: "What is Memorial Day?",
    es: "¿Qué es el Día de los Caídos? (No oficial)",
    answers_en: ["A holiday to honor soldiers who died in military service"],
    answers_es: ["Un día festivo para honrar a los soldados que murieron en servicio militar"]
  },
  "128": {
    en: "What is Veterans Day?",
    es: "¿Qué es el Día de los Veteranos? (No oficial)",
    answers_en: [
      "A holiday to honor people in the (U.S.) military",
      "A holiday to honor people who have served (in the U.S. military)"
    ],
    answers_es: [
      "Un día festivo para honrar a las personas en las fuerzas armadas (de los Estados Unidos)",
      "Un día festivo para honrar a las personas que han servido (en las fuerzas armadas de los Estados Unidos)"
    ]
  }

};

// ── Chapter-to-question mapping ───────────────────────────────────────────────
// Source: qpop references extracted from each chapter/addendum HTML file.
// Keys match chapter numbers (integers) or addendum letters (strings).
// Update this object when a new chapter self-test is added.

const CHAPTER_QUESTIONS = {
  1:    [1,2,3,4,5,6,7,13,15,16,17,18,19,41,46,47,51,52,58,59,60,61,82],
  2:    [16,18,19,21,22,23,24,25,27,28,29,30,31,34,35,43,44,64],
  3:    [13,16,17,30,36,37,38,39,40,41,42,46,47,48,49],
  4:    [2,15,16,45,50,51,52,53,54,55,56,57],
  5:    [5,6,13,14,63,64,65,67,68,69,70,71,72],
  6:    [62,81,86,119],
  7:    [73,74,75,79],
  8:    [8,9,10,11,77,78,79,80,81,85,86,87,125],
  9:    [79,82,83,84,86,88,89,90,91,117],
  10:   [5,91,92,93,94,95,96,99,126],
  11:   [5,12,20,97,98,100,101,102,103,104,105,106,107,108,109,110,111,112,113,115,118,126,128],
  12:   [9,18,65,66,78,79,86,87,91,93,94,100,113,120,121,122,123,124,125,126,127,128],
  "A":  [99],
  "B":  [100,110,111,115,116],
  "C":  [118]
};

// ── Multi-chapter questions ───────────────────────────────────────────────────
// Questions that appear in more than one chapter/addendum.
// These are included in each chapter's primary question set as authored,
// but are excluded from review randomization so that the review pool
// only draws questions the learner has not already seen in this session.
// Generated from CHAPTER_QUESTIONS; do not edit manually.

const MULTI_CHAPTER_QUESTIONS = (function () {
  const count = {};
  for (const qs of Object.values(CHAPTER_QUESTIONS)) {
    for (const q of qs) {
      count[q] = (count[q] || 0) + 1;
    }
  }
  return new Set(Object.keys(count).filter(q => count[q] > 1).map(Number));
})();
