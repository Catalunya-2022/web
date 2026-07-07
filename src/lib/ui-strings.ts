// Trilingual UI strings — plain TypeScript, zero runtime overhead.
// Only for hardcoded UI text (buttons, labels, page headers).
// MDX content titles come from the content-manifest (H1/H2 headings).

import type { Locale } from "@/i18n/routing";

type UiStrings = {
  previous: string;
  next: string;
  home: string;
  homeDescription: string;
  introductionTitle: string;
  executiveSummaryTitle: string;
  trainOfProsperityTitle: string;
  actionPlan: string;
  actionPlanShort: string;
  search: string;
  searchPlaceholder: string;
  searchGoalsActions: string;
  searchOrganizations: string;
  copyPage: string;
  pageCopied: string;
  linkCopied: string;
  citationCopied: string;
  copyAsMarkdown: string;
  openInChatGPT: string;
  openInClaude: string;
  askQuestions: string;
  skipToContent: string;
  pageNavigation: string;
  memberNavigation: string;
  callToReactivate: string;
  exploreAllActions: string;
  learnMoreAbout: string;
  downloadDocument: string;
  chatWithDocument: string;
  pdfDescription: string;
  epubDescription: string;
  heroContextP1: string;
  heroContextP2: string;
  heroOfficiallyConvened: string;
  heroContextConvened: string;
  heroNinetyOneActions: string;
  heroContextActions: string;
  pdfHref: string;
  epubHref: string;
  actionPlanSubtitle: string;
  actionPlanTitle: string;
  actionPlanDescription: string;
  sphere: string;
  goal: string;
  action: string;
  taskForceSubtitle: string;
  taskForceTitle: string;
  taskForceDescription: string;
  organizationsSubtitle: string;
  organizationsTitle: string;
  organizationsDescription: string;
  showingOf: string;
  copying: string;
  moreCopyOptions: string;
  peopleConsultedSubtitle: string;
  peopleConsultedTitle: string;
  peopleConsultedDescription: string;
  peopleConsultedOpenCall: string;
  peopleConsultedOpenCallContext: string;
  searchPeople: string;
  showingOfPeople: string;
  noResultsPeople: string;
  pressSubtitle: string;
  pressTitle: string;
  pressDescription: string;
  featuredVideo: string;
  resourcesSubtitle: string;
  resourcesTitle: string;
  resourcesDescription: string;
  peopleConsultedCopySampleLabel: string;
  organizationsCopySampleLabel: string;
  copyFullListLabel: string;
  noResults: string;
  searchErrorTitle: string;
  searchErrorBody: string;
  resultCount: string;
  spheres: string;
  goals: string;
  actions: string;
  documents: string;
  taskForceCategory: string;
  colorTheme: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  openGPTApp: string;
  chatCardDescription: string;
  homeOgSubtitle: string;
  ogTagline: string;
  notFoundHeading: string;
  notFoundBody: string;
  goHome: string;
  exploreActionPlan: string;
  copySource: string;
  copyLlmPrompt: string;
  siteDescription: string;
  opensInNewTab: string;
  orientationBodyAction: string;
  orientationBodyGoal: string;
  orientationBodySphere: string;
  orientationCtaPrefix: string;
  orientationCtaIntro: string;
  orientationCtaMiddle: string;
  orientationCtaSummary: string;
  orientationCtaSuffix: string;
  orientationDismiss: string;
  close: string;
  toggleSidebar: string;
  navigation: string;
  breadcrumbNav: string;
  errorHeading: string;
  errorBody: string;
  errorRetry: string;
  mcpSubtitle: string;
  mcpTitle: string;
  mcpPageTitle: string;
  mcpDescription: string;
  mcpCardTitle: string;
  mcpCardDescription: string;
  mcpCopyCommand: string;
  mcpCopyQuestion: string;
  mcpTryAsking: string;
  printPage: string;
  printPageDescription: string;
  share: string;
  copyLink: string;
  copyLinkDescription: string;
  tagline: string;
  actionPlanMetaDescription: string;
  taskForceMetaDescription: string;
  organizationsMetaDescription: string;
  pressMetaDescription: string;
};

export const uiStrings: Record<Locale, UiStrings> = {
  ca: {
    previous: "Anterior",
    next: "Següent",
    home: "Inici",
    homeDescription:
      "Pla estratègic per reactivar Catalunya: 3 àmbits de transformació, 12 objectius i 91 accions concretes elaborades per 30 experts de la societat civil.",
    introductionTitle: "Introducció",
    executiveSummaryTitle: "Resum Executiu",
    trainOfProsperityTitle: "El Tren de la Prosperitat",
    actionPlan: "Pla d'Acció",
    actionPlanShort: "Pla",
    search: "Cercar Catalunya 2022...",
    searchPlaceholder: "Cercar àmbits, objectius, accions...",
    searchGoalsActions: "Cercar objectius i accions...",
    searchOrganizations: "Cercar organitzacions...",
    copyPage: "Copiar pàgina",
    pageCopied: "Pàgina copiada!",
    linkCopied: "Enllaç copiat!",
    citationCopied: "Citació copiada!",
    copyAsMarkdown: "Copiar pàgina en Markdown per a LLMs",
    openInChatGPT: "Obrir a ChatGPT",
    openInClaude: "Obrir a Claude",
    askQuestions: "Fer preguntes sobre aquesta pàgina",
    skipToContent: "Anar al contingut principal",
    pageNavigation: "Navegació de pàgina",
    memberNavigation: "Navegació de membres",
    callToReactivate: "Crida per reactivar el país",
    exploreAllActions: "Explorar totes les accions",
    learnMoreAbout: "Saber-ne més sobre",
    downloadDocument: "Descarregar el document",
    chatWithDocument: "Conversar amb el document",
    pdfDescription: "Document complet",
    epubDescription: "Format e-reader",
    heroContextP1:
      "La història ens diu que sempre que el món ha emprès processos de transformació, Catalunya s'hi ha incorporat amb decisió, gràcies a l'empenta de la societat civil. El juny del 2020, enmig de la commoció de la pandèmia, el Govern de la Generalitat de Catalunya",
    heroContextP2:
      "El resultat: tres àmbits de transformació, dotze objectius i",
    heroOfficiallyConvened: "va convocar oficialment",
    heroContextConvened:
      "un grup de treball de trenta experts que abasta l'acadèmia, l'empresa, la ciència, la cultura i l'administració pública amb l'objectiu de llançar una crida a un debat nacional centrat en l'acció.",
    heroNinetyOneActions: "noranta-una accions concretes",
    heroContextActions:
      "que abasten la societat, l'economia i el sector públic, plasmades per gairebé 400 experts col·laboradors i més de 1.400 propostes ciutadanes. Desenvolupat al llarg de dues legislatures, per sobre de les línies de partit, el document ja ha inspirat accions governamentals posteriors. Un full de ruta per a una Catalunya més justa, més competitiva i millor governada.",
    pdfHref: "/documents/catalunya-2022-ca.pdf",
    epubHref: "/documents/catalunya-2022-ca.epub",
    actionPlanSubtitle: "Pla d'Acció",
    actionPlanTitle: "Reset: Crida per reactivar el país",
    actionPlanDescription:
      "El pla d'acció Catalunya 2022 s'organitza en tres àmbits (societat, economia i sector públic), amb 12 objectius i 91 accions concretes. Exploreu l'estructura completa a continuació o cerqueu un tema específic.",
    sphere: "Àmbit",
    goal: "Objectiu",
    action: "Acció",
    taskForceSubtitle: "30 experts de la societat civil",
    taskForceTitle: "Grup de Treball",
    taskForceDescription:
      "El 2 de juny del 2020, el Govern de la Generalitat de Catalunya va crear el Grup de Treball Catalunya 2022, un organisme independent de 30 experts de la societat civil, coordinat per Victòria Alsina i Genís Roca. Treballant de manera voluntària, els seus membres van definir polítiques per assegurar la competitivitat i el desenvolupament de Catalunya després de la Covid-19. Van dialogar amb centenars de persones i organitzacions, van rebre més de 1.400 propostes del públic i van lliurar 12 objectius i 91 accions concretes al nou Govern de la Generalitat.",
    organizationsSubtitle: "Més de 230 organitzacions de la societat civil",
    organizationsTitle: "Organitzacions Consultades",
    organizationsDescription:
      "El grup de treball va enviar cartes a més de 400 entitats (administracions, partits polítics, empreses, agents socials i econòmics, organitzacions culturals, universitats i fundacions) de tots els sectors i territoris de Catalunya, convidant-les a compartir propostes de recuperació i reflexions estratègiques. Més de 230 organitzacions van respondre, contribuint als 12 objectius i 91 accions que formen aquest document. El llistat següent és no exhaustiu i per ordre alfabètic.",
    showingOf: "Mostrant {count} de {total} organitzacions",
    copying: "Copiant...",
    moreCopyOptions: "Més opcions de còpia",
    peopleConsultedSubtitle: "Més de 1.400 propostes rebudes",
    peopleConsultedTitle: "Persones Consultades",
    peopleConsultedDescription:
      "El Grup de Treball Catalunya 2022 va dialogar amb centenars de persones del món acadèmic, empresarial, cultural, l'administració pública i la societat civil. Una",
    peopleConsultedOpenCall: "crida oberta",
    peopleConsultedOpenCallContext:
      "va convidar tothom a Catalunya a contribuir amb idees, amb el resultat de més de 1.400 propostes d'accions concretes. El que va començar com un grup de 30 experts es va convertir en un esforç col·laboratiu que va involucrar més de 500 col·laboradors. El llistat següent és no exhaustiu i per ordre alfabètic.",
    searchPeople: "Cercar persones...",
    showingOfPeople: "Mostrant {count} de {total} persones",
    noResultsPeople: "Cap resultat per a \u201c{query}\u201d.",
    pressSubtitle: "2020–2021",
    pressTitle: "Cobertura de Premsa",
    pressDescription:
      "El projecte Catalunya 2022 va atreure cobertura dels principals mitjans de comunicació catalans i espanyols, des de la formació del grup de treball i la crida oberta de propostes el 2020, fins a la presentació del document final al Govern de Catalunya el juny del 2021.",
    featuredVideo: "Vídeo destacat",
    resourcesSubtitle: "Descàrregues i enllaços",
    resourcesTitle: "Recursos",
    resourcesDescription:
      "Accediu al document complet Catalunya 2022 en diversos formats i idiomes, registres oficials del govern, presentacions i enllaços de projectes de codi obert.",
    peopleConsultedCopySampleLabel:
      "{total} persones consultades. Mostra (primeres {sample}):",
    organizationsCopySampleLabel:
      "{total} organitzacions van participar. Mostra (primeres {sample}):",
    copyFullListLabel: "Per a la llista completa, visiteu: {url}",
    noResults: "Cap resultat",
    searchErrorTitle: "La cerca no està disponible ara mateix",
    searchErrorBody:
      "No hem pogut carregar l'índex de cerca. Torneu-ho a provar.",
    resultCount: "{n} resultats",
    spheres: "Àmbits",
    goals: "Objectius",
    actions: "Accions",
    documents: "Documents",
    taskForceCategory: "Grup de Treball",
    colorTheme: "Tema de color",
    lightMode: "Mode clar",
    darkMode: "Mode fosc",
    systemMode: "Mode del sistema",
    openGPTApp: "Custom GPT",
    chatCardDescription: "Xateja sobre el document a ChatGPT",

    homeOgSubtitle: "3 àmbits · 12 objectius · 91 accions",
    ogTagline: "Crida per reactivar el país",
    notFoundHeading: "404 — Aquesta acció encara no s'ha proposat",
    notFoundBody: "No hem trobat aquest àmbit, objectiu o acció al document Catalunya 2022. Potser el podríeu proposar per a la pròxima iteració?",
    goHome: "Anar a l'inici",
    exploreActionPlan: "Explorar el pla d'acció",
    copySource: "Font: Catalunya 2022",
    copyLlmPrompt: "Si us plau, analitza i resumeix aquest contingut de Catalunya 2022",
    siteDescription: "Un pla estratègic per reactivar Catalunya, creat pel Grup de Treball Catalunya 2022",
    opensInNewTab: "(s'obre en una pestanya nova)",
    orientationBodyAction:
      "Estàs llegint una de les **91 accions** de **{title}**, un full de ruta elaborat per un grup de treball de 30 experts de la societat civil.",
    orientationBodyGoal:
      "Estàs llegint un dels **12 objectius** de **{title}**, un full de ruta elaborat per un grup de treball de 30 experts de la societat civil.",
    orientationBodySphere:
      "Estàs llegint un dels **3 àmbits** de **{title}**, un full de ruta elaborat per un grup de treball de 30 experts de la societat civil.",
    orientationCtaPrefix: "Comença per la",
    orientationCtaIntro: "introducció",
    orientationCtaMiddle: "o el",
    orientationCtaSummary: "resum executiu",
    orientationCtaSuffix: "per tenir la visió completa.",
    orientationDismiss: "No ho tornis a mostrar",
    close: "Tancar",
    toggleSidebar: "Alternar barra lateral",
    navigation: "Navegació",
    breadcrumbNav: "Fil d'Ariadna",
    errorHeading: "Alguna cosa ha anat malament",
    errorBody: "S'ha produït un error inesperat. Si us plau, torneu-ho a provar.",
    errorRetry: "Torna-ho a provar",
    mcpSubtitle: "Conversa amb el document via IA",
    mcpTitle: "Servidor MCP Catalunya 2022",
    mcpPageTitle: "Servidor MCP",
    mcpDescription:
      "Connecta qualsevol assistent d'IA compatible amb MCP al document Catalunya 2022. Sense autenticació, obert a tothom, persones i agents d'IA.",
    mcpCardTitle: "Servidor MCP",
    mcpCardDescription: "Connecta qualsevol assistent d'IA al document",
    mcpCopyCommand: "Copiar comanda",
    mcpCopyQuestion: "Copiar pregunta",
    mcpTryAsking:
      "Un cop connectat, pots preguntar qualsevol cosa sobre el document al teu assistent d'IA. Comença amb preguntes senzilles per explorar l'estructura, o aprofundeix amb anàlisis i referències creuades entre àmbits, objectius i propostes.",
    printPage: "Imprimir pàgina",
    printPageDescription: "Imprimir en format net sense navegació",
    share: "Compartir",
    copyLink: "Copiar l'enllaç",
    copyLinkDescription: "Copiar l'enllaç per compartir per xarxes socials, missatgeria o correu",
    tagline: "Crida per reactivar el país",

    actionPlanMetaDescription:
      "3 àmbits, 12 objectius i 91 accions concretes per reactivar Catalunya. Exploreu l'estructura del pla d'acció Catalunya 2022.",
    taskForceMetaDescription:
      "30 experts de la societat civil, coordinats per Victòria Alsina i Genís Roca, van elaborar 12 objectius i 91 accions per reactivar Catalunya.",
    organizationsMetaDescription:
      "Més de 230 organitzacions de tots els sectors de Catalunya van contribuir amb propostes als 12 objectius i 91 accions del document.",
    pressMetaDescription:
      "Cobertura dels principals mitjans de comunicació catalans i espanyols sobre el projecte Catalunya 2022, del 2020 al 2021.",
  },
  en: {
    previous: "Previous",
    next: "Next",
    home: "Home",
    homeDescription:
      "A strategic plan to reactivate Catalonia: 3 spheres of transformation, 12 goals, and 91 concrete actions by a task force of 30 civil society experts.",
    introductionTitle: "Introduction",
    executiveSummaryTitle: "Executive Summary",
    trainOfProsperityTitle: "The Train of Prosperity",
    actionPlan: "Action Plan",
    actionPlanShort: "Plan",
    search: "Search Catalunya 2022...",
    searchPlaceholder: "Search spheres, goals, actions...",
    searchGoalsActions: "Search goals and actions...",
    searchOrganizations: "Search organizations...",
    copyPage: "Copy page",
    pageCopied: "Page copied!",
    linkCopied: "Link copied!",
    citationCopied: "Citation copied!",
    copyAsMarkdown: "Copy page as Markdown for LLMs",
    openInChatGPT: "Open in ChatGPT",
    openInClaude: "Open in Claude",
    askQuestions: "Ask questions about this page",
    skipToContent: "Skip to main content",
    pageNavigation: "Page navigation",
    memberNavigation: "Member navigation",
    callToReactivate: "Call to reactivate Catalonia",
    exploreAllActions: "Explore All Actions",
    learnMoreAbout: "Learn more about",
    downloadDocument: "Download the Document",
    chatWithDocument: "Chat with the Document",
    pdfDescription: "Full document",
    epubDescription: "E-reader format",
    heroContextP1:
      "History tells us that whenever the world has embraced processes of transformation, Catalonia has joined in resolutely, thanks to the drive of civil society. In June 2020, amid the pandemic's upheaval, the Government of Catalonia",
    heroContextP2:
      "The result: three spheres of transformation, twelve goals, and",
    heroOfficiallyConvened: "officially convened",
    heroContextConvened:
      "a task force of thirty experts spanning academia, business, science, culture, and public administration to issue a call for a national debate centred on action.",
    heroNinetyOneActions: "ninety-one concrete actions",
    heroContextActions:
      "spanning society, economy, and the public sector, shaped by nearly 400 contributing experts and over 1,400 citizen proposals. Developed across two terms of office, beyond party lines, the document has already inspired subsequent government action. A blueprint for a fairer, more competitive, and better-governed Catalonia.",
    pdfHref: "/documents/catalunya-2022-en.pdf",
    epubHref: "/documents/catalunya-2022-en.epub",
    actionPlanSubtitle: "Action Plan",
    actionPlanTitle: "Reset: Call to reactivate Catalonia",
    actionPlanDescription:
      "The Catalunya 2022 action plan is organized into three spheres (Society, Economy, and the Public Sector), with 12 goals and 91 concrete actions. Explore the full structure below or search for a specific topic.",
    sphere: "Sphere",
    goal: "Goal",
    action: "Action",
    taskForceSubtitle: "30 Experts from Civil Society",
    taskForceTitle: "Task Force",
    taskForceDescription:
      "On 2 June 2020, the Government of Catalonia established the 2022 Catalonia Task Force, an independent body of 30 experts from civil society, coordinated by Victòria Alsina and Genís Roca. Working on a voluntary basis, its members defined policies to assure Catalonia's competitiveness and development in the aftermath of Covid-19. They engaged in dialogue with hundreds of individuals and organizations, received more than 1,400 proposals from the public, and delivered 12 goals and 91 concrete actions to the incoming Government of Catalonia.",
    organizationsSubtitle: "Over 230 Civil Society Organizations",
    organizationsTitle: "Organizations Consulted",
    organizationsDescription:
      "The task force sent letters to over 400 entities (administrations, political parties, businesses, social and economic agents, cultural organizations, universities, and foundations) from all sectors and territories of Catalonia, inviting them to share recovery proposals and strategic reflections. Over 230 organizations responded, contributing to the 12 goals and 91 actions that form this document. The following is a non-exhaustive list in alphabetical order.",
    showingOf: "Showing {count} of {total} organizations",
    copying: "Copying...",
    moreCopyOptions: "More copy options",
    peopleConsultedSubtitle: "Over 1,400 Proposals Received",
    peopleConsultedTitle: "People Consulted",
    peopleConsultedDescription:
      "The 2022 Catalonia Task Force engaged in dialogue with hundreds of individuals across academia, business, culture, public administration, and civil society. An",
    peopleConsultedOpenCall: "open call",
    peopleConsultedOpenCallContext:
      "invited anyone in Catalonia to contribute ideas, resulting in more than 1,400 proposals for specific actions. What began as a group of 30 experts grew into a collaborative effort involving over 500 contributors. The following is a non-exhaustive list in alphabetical order.",
    searchPeople: "Search people...",
    showingOfPeople: "Showing {count} of {total} people",
    noResultsPeople: "No results found for \u201c{query}\u201d.",
    pressSubtitle: "2020–2021",
    pressTitle: "Press Coverage",
    pressDescription:
      "The Catalunya 2022 project attracted coverage from major Catalan and Spanish media outlets, from the task force's formation and open call for proposals in 2020, to the presentation of the final document to the Government of Catalonia in June 2021.",
    featuredVideo: "Featured Video",
    resourcesSubtitle: "Downloads & links",
    resourcesTitle: "Resources",
    resourcesDescription:
      "Access the complete Catalunya 2022 document in multiple formats and languages, official government records, presentations, and open-source project links.",
    peopleConsultedCopySampleLabel:
      "{total} individuals consulted. Sample (first {sample}):",
    organizationsCopySampleLabel:
      "{total} organizations participated. Sample (first {sample}):",
    copyFullListLabel: "For the complete list, visit: {url}",
    noResults: "No results",
    searchErrorTitle: "Search is temporarily unavailable",
    searchErrorBody: "We couldn't load the search index. Please try again.",
    resultCount: "{n} results",
    spheres: "Spheres",
    goals: "Goals",
    actions: "Actions",
    documents: "Documents",
    taskForceCategory: "Task Force",
    colorTheme: "Color theme",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    systemMode: "System mode",
    openGPTApp: "Custom GPT",
    chatCardDescription: "Chat about the document in ChatGPT",

    homeOgSubtitle: "3 spheres · 12 goals · 91 actions",
    ogTagline: "Call to reactivate Catalonia",
    notFoundHeading: "404 — This action hasn't been proposed yet",
    notFoundBody: "We couldn't find this sphere, goal, or action in the Catalunya 2022 document. Perhaps you could propose it for the next iteration?",
    goHome: "Go home",
    exploreActionPlan: "Explore the action plan",
    copySource: "Source: Catalunya 2022",
    copyLlmPrompt: "Please analyze and summarize this content from Catalunya 2022",
    siteDescription: "A strategic plan to reactivate Catalonia, created by the 2022 Catalonia Task Force",
    opensInNewTab: "(opens in a new tab)",
    orientationBodyAction:
      "You're reading one of the **91 actions** of **{title}**, a roadmap created by a task force of 30 civil-society experts.",
    orientationBodyGoal:
      "You're reading one of the **12 goals** of **{title}**, a roadmap created by a task force of 30 civil-society experts.",
    orientationBodySphere:
      "You're reading one of the **3 spheres** of **{title}**, a roadmap created by a task force of 30 civil-society experts.",
    orientationCtaPrefix: "Start with the",
    orientationCtaIntro: "introduction",
    orientationCtaMiddle: "or the",
    orientationCtaSummary: "executive summary",
    orientationCtaSuffix: "for the full picture.",
    orientationDismiss: "Don't show this again",
    close: "Close",
    toggleSidebar: "Toggle Sidebar",
    navigation: "Navigation",
    breadcrumbNav: "Breadcrumb",
    errorHeading: "Something went wrong",
    errorBody: "An unexpected error occurred. Please try again.",
    errorRetry: "Try again",
    mcpSubtitle: "Chat with the Document via AI",
    mcpTitle: "Catalunya 2022 MCP Server",
    mcpPageTitle: "MCP Server",
    mcpDescription:
      "Connect any AI assistant that supports MCP to the Catalunya 2022 document. No authentication required, open to everyone, humans and AI agents alike.",
    mcpCardTitle: "MCP Server",
    mcpCardDescription: "Connect any AI assistant to the document",
    mcpCopyCommand: "Copy command",
    mcpCopyQuestion: "Copy question",
    mcpTryAsking:
      "Once connected, you can ask your AI assistant anything about the document. Start with simple questions to explore the structure, or go deeper with analysis and cross-references across spheres, goals, and proposals.",
    printPage: "Print page",
    printPageDescription: "Print in a clean layout without navigation",
    share: "Share",
    copyLink: "Copy link",
    copyLinkDescription: "Copy link to share via social media, messaging, or email",
    tagline: "Call to reactivate Catalonia",

    actionPlanMetaDescription:
      "3 spheres, 12 goals, and 91 concrete actions to reactivate Catalonia. Explore the full structure of the Catalunya 2022 action plan.",
    taskForceMetaDescription:
      "30 civil society experts, coordinated by Victòria Alsina and Genís Roca, crafted 12 goals and 91 actions to reactivate Catalonia.",
    organizationsMetaDescription:
      "Over 230 organizations from all sectors of Catalonia contributed proposals to the 12 goals and 91 actions of the document.",
    pressMetaDescription:
      "Coverage from major Catalan and Spanish media outlets on the Catalunya 2022 project, from 2020 to 2021.",
  },
  es: {
    previous: "Anterior",
    next: "Siguiente",
    home: "Inicio",
    homeDescription:
      "Plan estratégico para reactivar Cataluña: 3 ámbitos de transformación, 12 objetivos y 91 acciones concretas elaboradas por 30 expertos de la sociedad civil.",
    introductionTitle: "Introducción",
    executiveSummaryTitle: "Resumen Ejecutivo",
    trainOfProsperityTitle: "El Tren de la Prosperidad",
    actionPlan: "Plan de Acción",
    actionPlanShort: "Plan",
    search: "Buscar Catalunya 2022...",
    searchPlaceholder: "Buscar ámbitos, objetivos, acciones...",
    searchGoalsActions: "Buscar objetivos y acciones...",
    searchOrganizations: "Buscar organizaciones...",
    copyPage: "Copiar página",
    pageCopied: "¡Página copiada!",
    linkCopied: "¡Enlace copiado!",
    citationCopied: "¡Cita copiada!",
    copyAsMarkdown: "Copiar página en Markdown para LLMs",
    openInChatGPT: "Abrir en ChatGPT",
    openInClaude: "Abrir en Claude",
    askQuestions: "Hacer preguntas sobre esta página",
    skipToContent: "Ir al contenido principal",
    pageNavigation: "Navegación de página",
    memberNavigation: "Navegación de miembros",
    callToReactivate: "Llamamiento para reactivar el país",
    exploreAllActions: "Explorar todas las acciones",
    learnMoreAbout: "Saber más sobre",
    downloadDocument: "Descargar el documento",
    chatWithDocument: "Conversar con el documento",
    pdfDescription: "Documento completo",
    epubDescription: "Formato e-reader",
    heroContextP1:
      "La historia nos dice que siempre que el mundo ha emprendido procesos de transformación, Cataluña se ha incorporado con decisión, gracias al empuje de la sociedad civil. En junio de 2020, en medio de la conmoción de la pandemia, el Gobierno de la Generalitat de Catalunya",
    heroContextP2:
      "El resultado: tres ámbitos de transformación, doce objetivos y",
    heroOfficiallyConvened: "convocó oficialmente",
    heroContextConvened:
      "un grupo de trabajo de treinta expertos que abarca la academia, la empresa, la ciencia, la cultura y la administración pública con el objetivo de lanzar un llamamiento a un debate nacional centrado en la acción.",
    heroNinetyOneActions: "noventa y una acciones concretas",
    heroContextActions:
      "que abarcan la sociedad, la economía y el sector público, configuradas por casi 400 expertos colaboradores y más de 1.400 propuestas ciudadanas. Desarrollado a lo largo de dos legislaturas, por encima de las líneas de partido, el documento ya ha inspirado acciones gubernamentales posteriores. Una hoja de ruta para una Cataluña más justa, más competitiva y mejor gobernada.",
    pdfHref: "/documents/catalunya-2022-es.pdf",
    epubHref: "/documents/catalunya-2022-es.epub",
    actionPlanSubtitle: "Plan de Acción",
    actionPlanTitle: "Reset: Llamamiento para reactivar el país",
    actionPlanDescription:
      "El plan de acción Catalunya 2022 se organiza en tres ámbitos (sociedad, economía y sector público), con 12 objetivos y 91 acciones concretas. Explore la estructura completa a continuación o busque un tema específico.",
    sphere: "Ámbito",
    goal: "Objetivo",
    action: "Acción",
    taskForceSubtitle: "30 expertos de la sociedad civil",
    taskForceTitle: "Grupo de Trabajo",
    taskForceDescription:
      "El 2 de junio de 2020, el Gobierno de la Generalitat de Catalunya creó el Grup de Treball Catalunya 2022, un organismo independiente de 30 expertos de la sociedad civil, coordinado por Victòria Alsina y Genís Roca. Trabajando de manera voluntaria, sus miembros definieron políticas para asegurar la competitividad y el desarrollo de Cataluña tras la Covid-19. Dialogaron con centenares de personas y organizaciones, recibieron más de 1.400 propuestas del público y entregaron 12 objetivos y 91 acciones concretas al nuevo Gobierno de la Generalitat.",
    organizationsSubtitle: "Más de 230 organizaciones de la sociedad civil",
    organizationsTitle: "Organizaciones Consultadas",
    organizationsDescription:
      "El grupo de trabajo envió cartas a más de 400 entidades (administraciones, partidos políticos, empresas, agentes sociales y económicos, organizaciones culturales, universidades y fundaciones) de todos los sectores y territorios de Cataluña, invitándolas a compartir propuestas de recuperación y reflexiones estratégicas. Más de 230 organizaciones respondieron, contribuyendo a los 12 objetivos y 91 acciones que forman este documento. El listado siguiente es no exhaustivo y por orden alfabético.",
    showingOf: "Mostrando {count} de {total} organizaciones",
    copying: "Copiando...",
    moreCopyOptions: "Más opciones de copia",
    peopleConsultedSubtitle: "Más de 1.400 propuestas recibidas",
    peopleConsultedTitle: "Personas Consultadas",
    peopleConsultedDescription:
      "El Grupo de Trabajo Catalunya 2022 dialogó con centenares de personas del mundo académico, empresarial, cultural, la administración pública y la sociedad civil. Una",
    peopleConsultedOpenCall: "convocatoria abierta",
    peopleConsultedOpenCallContext:
      "invitó a todos en Cataluña a contribuir con ideas, con el resultado de más de 1.400 propuestas de acciones concretas. Lo que empezó como un grupo de 30 expertos se convirtió en un esfuerzo colaborativo que involucró a más de 500 colaboradores. El listado siguiente es no exhaustivo y por orden alfabético.",
    searchPeople: "Buscar personas...",
    showingOfPeople: "Mostrando {count} de {total} personas",
    noResultsPeople: "Sin resultados para \u201c{query}\u201d.",
    pressSubtitle: "2020–2021",
    pressTitle: "Cobertura de Prensa",
    pressDescription:
      "El proyecto Catalunya 2022 atrajo cobertura de los principales medios de comunicación catalanes y españoles, desde la formación del grupo de trabajo y la convocatoria abierta de propuestas en 2020, hasta la presentación del documento final al Gobierno de Cataluña en junio de 2021.",
    featuredVideo: "Vídeo destacado",
    resourcesSubtitle: "Descargas y enlaces",
    resourcesTitle: "Recursos",
    resourcesDescription:
      "Acceda al documento completo Catalunya 2022 en diversos formatos e idiomas, registros oficiales del gobierno, presentaciones y enlaces de proyectos de código abierto.",
    peopleConsultedCopySampleLabel:
      "{total} personas consultadas. Muestra (primeras {sample}):",
    organizationsCopySampleLabel:
      "{total} organizaciones participaron. Muestra (primeras {sample}):",
    copyFullListLabel: "Para la lista completa, visite: {url}",
    noResults: "Sin resultados",
    searchErrorTitle: "La búsqueda no está disponible en este momento",
    searchErrorBody:
      "No hemos podido cargar el índice de búsqueda. Vuelve a intentarlo.",
    resultCount: "{n} resultados",
    spheres: "Ámbitos",
    goals: "Objetivos",
    actions: "Acciones",
    documents: "Documentos",
    taskForceCategory: "Grupo de Trabajo",
    colorTheme: "Tema de color",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    systemMode: "Modo del sistema",
    openGPTApp: "Custom GPT",
    chatCardDescription: "Chatea sobre el documento en ChatGPT",

    homeOgSubtitle: "3 ámbitos · 12 objetivos · 91 acciones",
    ogTagline: "Llamamiento para reactivar el país",
    notFoundHeading: "404 — Esta acción aún no se ha propuesto",
    notFoundBody: "No hemos encontrado este ámbito, objetivo o acción en el documento Catalunya 2022. ¿Quizás podría proponerlo para la próxima iteración?",
    goHome: "Ir al inicio",
    exploreActionPlan: "Explorar el plan de acción",
    copySource: "Fuente: Catalunya 2022",
    copyLlmPrompt: "Por favor, analiza y resume este contenido de Catalunya 2022",
    siteDescription: "Un plan estratégico para reactivar Cataluña, creado por el Grup de Treball Catalunya 2022",
    opensInNewTab: "(se abre en una pestaña nueva)",
    orientationBodyAction:
      "Estás leyendo una de las **91 acciones** de **{title}**, una hoja de ruta elaborada por un grupo de trabajo de 30 expertos de la sociedad civil.",
    orientationBodyGoal:
      "Estás leyendo uno de los **12 objetivos** de **{title}**, una hoja de ruta elaborada por un grupo de trabajo de 30 expertos de la sociedad civil.",
    orientationBodySphere:
      "Estás leyendo uno de los **3 ámbitos** de **{title}**, una hoja de ruta elaborada por un grupo de trabajo de 30 expertos de la sociedad civil.",
    orientationCtaPrefix: "Empieza por la",
    orientationCtaIntro: "introducción",
    orientationCtaMiddle: "o el",
    orientationCtaSummary: "resumen ejecutivo",
    orientationCtaSuffix: "para tener la visión completa.",
    orientationDismiss: "No mostrar de nuevo",
    close: "Cerrar",
    toggleSidebar: "Alternar barra lateral",
    navigation: "Navegación",
    breadcrumbNav: "Migas de pan",
    errorHeading: "Algo ha salido mal",
    errorBody: "Se ha producido un error inesperado. Por favor, inténtalo de nuevo.",
    errorRetry: "Reintentar",
    mcpSubtitle: "Conversa con el documento vía IA",
    mcpTitle: "Servidor MCP Catalunya 2022",
    mcpPageTitle: "Servidor MCP",
    mcpDescription:
      "Conecta cualquier asistente de IA compatible con MCP al documento Catalunya 2022. Sin autenticación, abierto a todos, personas y agentes de IA.",
    mcpCardTitle: "Servidor MCP",
    mcpCardDescription: "Conecta cualquier asistente de IA al documento",
    mcpCopyCommand: "Copiar comando",
    mcpCopyQuestion: "Copiar pregunta",
    mcpTryAsking:
      "Una vez conectado, puedes preguntar cualquier cosa sobre el documento a tu asistente de IA. Empieza con preguntas sencillas para explorar la estructura, o profundiza con análisis y referencias cruzadas entre ámbitos, objetivos y propuestas.",
    printPage: "Imprimir página",
    printPageDescription: "Imprimir en formato limpio sin navegación",
    share: "Compartir",
    copyLink: "Copiar enlace",
    copyLinkDescription: "Copiar enlace para compartir por redes sociales, mensajería o correo",
    tagline: "Llamamiento para reactivar el país",

    actionPlanMetaDescription:
      "3 ámbitos, 12 objetivos y 91 acciones concretas para reactivar Cataluña. Explore la estructura del plan de acción Catalunya 2022.",
    taskForceMetaDescription:
      "30 expertos de la sociedad civil, coordinados por Victòria Alsina y Genís Roca, elaboraron 12 objetivos y 91 acciones para reactivar Cataluña.",
    organizationsMetaDescription:
      "Más de 230 organizaciones de todos los sectores de Cataluña contribuyeron con propuestas a los 12 objetivos y 91 acciones del documento.",
    pressMetaDescription:
      "Cobertura de los principales medios de comunicación catalanes y españoles sobre el proyecto Catalunya 2022, de 2020 a 2021.",
  },
};

const PLACEHOLDER_RE = /\{(\w+)\}/g;

export function formatUiString(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(PLACEHOLDER_RE, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`
  );
}
