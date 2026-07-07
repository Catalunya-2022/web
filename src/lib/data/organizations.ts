import type { Trilingual } from "@/i18n/routing";

export type Organization = {
  name: Trilingual;
  website: string | null;
};

export const organizations: Organization[] = [
  {
    name: { ca: "Acadèmia Catalana de la Música", es: "Acadèmia Catalana de la Música", en: "Catalan Music Academy" },
    website: "https://academiamusica.cat/"
  },
  {
    name: { ca: "Agrupa Global Talent", es: "Agrupa Global Talent", en: "Agrupa Global Talent" },
    website: "https://agrupaglobal.com/"
  },
  {
    name: { ca: "Agrupament de Botiguers de Catalunya", es: "Agrupament de Botiguers de Catalunya", en: "Catalonia Shopkeepers' Group" },
    website: "https://www.abccat.com/"
  },
  {
    name: { ca: "Ajuntament de Barcelona", es: "Ajuntament de Barcelona", en: "Barcelona City Council" },
    website: "https://ajuntament.barcelona.cat/"
  },
  {
    name: { ca: "Alternativas Económicas", es: "Alternativas Económicas", en: "Alternativas Económicas" },
    website: "https://alternativaseconomicas.coop/"
  },
  {
    name: { ca: "Aresta Cooperativa", es: "Aresta Cooperativa", en: "Aresta Cooperativa" },
    website: "https://aresta.coop/"
  },
  {
    name: { ca: "Art Barcelona", es: "Art Barcelona", en: "Art Barcelona" },
    website: "https://www.artbarcelona.es/"
  },
  {
    name: { ca: "Asociación Nacional de Centrales de Compra y Servicios", es: "Asociación Nacional de Centrales de Compra y Servicios", en: "National Association of Service and Purchase Hubs" },
    website: "https://anceco.com/"
  },
  {
    name: { ca: "Asociación Nacional de Centros Comerciales", es: "Asociación Nacional de Centros Comerciales", en: "National Association of Shopping Centres" },
    website: "https://www.aedecc.com/"
  },
  {
    name: { ca: "Associació Catalana d'Entitats de Recerca", es: "Associació Catalana d'Entitats de Recerca", en: "Catalan Association of Research Organisations" },
    website: "https://www.acer-catalunya.org/"
  },
  {
    name: { ca: "Associació Catalana d'Executius, Directius i Empresaris", es: "Asociación Catalana de Ejecutivos, Directivos y Empresarios", en: "Catalan Association of Executives, Directors and Entrepreneurs" },
    website: "https://acedecatalunya.org"
  },
  {
    name: { ca: "Associació Catalana d'Universitats Públiques", es: "Associació Catalana d'Universitats Públiques", en: "Catalan Association of State Universities" },
    website: "https://www.acup.cat/"
  },
  {
    name: { ca: "Associació Catalana de Comptabilitat i Direcció", es: "Associació Catalana de Comptabilitat i Direcció", en: "Catalan Association of Accounting and Management" },
    website: "https://accid.org/"
  },
  {
    name: { ca: "Associació Catalana de Crítics d'Art", es: "Associació Catalana de Crítics d'Art", en: "Catalan Association of Art Critics" },
    website: "https://acca.cat/"
  },
  {
    name: { ca: "Associació d'Editors en Llengua Catalana", es: "Associació d'Editors en Llengua Catalana", en: "Association of Catalan Language Publishers" },
    website: "https://editors.cat/"
  },
  {
    name: { ca: "Associació d'Empreses de Teatre de Catalunya", es: "Associació d'Empreses de Teatre de Catalunya", en: "Association of Theatre Companies of Catalonia" },
    website: "https://www.adetca.cat/"
  },
  {
    name: { ca: "Associació d'Iniciatives Rurals de Catalunya", es: "Associació d'Iniciatives Rurals de Catalunya", en: "Association of Rural Initiatives of Catalonia" },
    website: "https://www.desenvolupamentrural.cat/"
  },
  {
    name: { ca: "Associació de Dones del Món Rural", es: "Associació de Dones del Món Rural", en: "Association of Countryside Women" },
    website: "https://www.donesmonrural.cat/"
  },
  {
    name: { ca: "Associació de Joves Agricultors i Ramaders de Catalunya", es: "Associació de Joves Agricultors i Ramaders de Catalunya", en: "Association of Young Agricultural and Livestock Farmers of Catalonia" },
    website: "https://jarc.cat/"
  },
  {
    name: { ca: "Associació de Mestres Rosa Sensat", es: "Associació de Mestres Rosa Sensat", en: "Rosa Sensat Teachers' Association" },
    website: "https://www.rosasensat.org/"
  },
  {
    name: { ca: "Associació de Micropobles de Catalunya", es: "Associació de Micropobles de Catalunya", en: "Association of Microtowns of Catalonia" },
    website: "https://www.micropobles.cat/"
  },
  {
    name: { ca: "Associació de Professionals de la Gestió Cultural de Catalunya", es: "Associació de Professionals de la Gestió Cultural de Catalunya", en: "Association of Cultural Management Professionals of Catalonia" },
    website: "https://gestiocultural.org/"
  },
  {
    name: { ca: "Associació de Promotors de Catalunya", es: "Associació de Promotors de Catalunya", en: "Association of Developers of Catalonia" },
    website: "https://apcebcn.cat/"
  },
  {
    name: { ca: "Associació del Taxi Intermunicipal de Catalunya", es: "Associació del Taxi Intermunicipal de Catalunya", en: "Intermunicipal Taxi Association of Catalonia" },
    website: null
  },
  {
    name: { ca: "Associació Eòlica de Catalunya", es: "Associació Eòlica de Catalunya", en: "Windfarm Association of Catalonia" },
    website: "https://eoliccat.net/"
  },
  {
    name: { ca: "Associació L'Era, Espai de Recursos Agroecològics, Revista Agrocultura", es: "Associació L'Era, Espai de Recursos Agroecològics, Revista Agrocultura", en: "L'Era Association, Forum for Agro-ecological Resources, Agrocultura Journal" },
    website: "https://associaciolera.org/"
  },
  {
    name: { ca: "Associació Professional de Representants, Promotors i Mànagers", es: "Associació Professional de Representants, Promotors i Mànagers", en: "Professional Association of Representatives, Executives and Managers" },
    website: "https://www.arcatalunya.cat/"
  },
  {
    name: { ca: "Ateneu Barcelonès", es: "Ateneu Barcelonès", en: "Ateneu Barcelonès" },
    website: "https://ateneubcn.cat/"
  },
  {
    name: { ca: "Atlas Sport Consulting", es: "Atlas Sport Consulting", en: "Atlas Sport Consulting" },
    website: null
  },
  {
    name: { ca: "Barcelona Global", es: "Barcelona Global", en: "Barcelona Global" },
    website: "https://www.barcelonaglobal.org/"
  },
  {
    name: { ca: "Barcelona Oberta", es: "Barcelona Oberta", en: "Barcelona Oberta" },
    website: "https://barcelonaoberta.cat/"
  },
  {
    name: { ca: "Barcelona Tech City", es: "Barcelona Tech City", en: "Barcelona Tech City" },
    website: "https://www.techbarcelona.com/"
  },
  {
    name: { ca: "Biocat", es: "Biocat", en: "Biocat" },
    website: "https://www.biocat.cat/"
  },
  {
    name: { ca: "Blanco y Negro Music", es: "Blanco y Negro Music", en: "Blanco y Negro Music" },
    website: "https://www.blancoynegro.com/"
  },
  {
    name: { ca: "Cambra de Comerç de Barcelona", es: "Cambra de Comerç de Barcelona", en: "Barcelona Chamber of Commerce" },
    website: "https://cambrabcn.org/"
  },
  {
    name: { ca: "Cambra del Llibre de Catalunya", es: "Cambra del Llibre de Catalunya", en: "Book Chamber of Catalonia" },
    website: "https://www.cambrallibre.cat/"
  },
  {
    name: { ca: "Caritas", es: "Caritas", en: "Caritas" },
    website: "https://www.caritascatalunya.cat/"
  },
  {
    name: { ca: "Casal Català de Nantes", es: "Casal Català de Nantes", en: "Nantes Catalan Culture Centre" },
    website: "https://www.casalcatalanantes.org/"
  },
  {
    name: { ca: "Catalunya Film Festivals", es: "Catalunya Film Festivals", en: "Catalunya Film Festivals" },
    website: "https://catalunyafilmfestivals.com/"
  },
  {
    name: { ca: "CatBio & Health Tech", es: "CatBio & Health Tech", en: "CatBio & Health Tech" },
    website: "https://catalonia.health/"
  },
  {
    name: { ca: "Catesco", es: "Catesco", en: "Catesco" },
    website: "https://catesco.org/"
  },
  {
    name: { ca: "CECOT", es: "CECOT", en: "CECOT" },
    website: "https://cecot.org/"
  },
  {
    name: { ca: "Cellnex", es: "Cellnex", en: "Cellnex" },
    website: "https://www.cellnex.com/"
  },
  {
    name: { ca: "Centre d'Alt Rendiment Sant Cugat", es: "Centre d'Alt Rendiment Sant Cugat", en: "(Sant Cugat) High Performance Sports Centre of Catalonia" },
    website: "https://www.car.edu/"
  },
  {
    name: { ca: "Centre d'Estudis Jurídics i Formació Especialitzada", es: "Centre d'Estudis Jurídics i Formació Especialitzada", en: "Centre for Legal Studies and Specialist Training" },
    website: "https://cejfe.gencat.cat/"
  },
  {
    name: { ca: "Centre de Cultura Contemporània de Barcelona", es: "Centre de Cultura Contemporània de Barcelona", en: "Contemporary Culture Centre of Barcelona" },
    website: "https://www.cccb.org/"
  },
  {
    name: { ca: "Centre per a la Integració de la Medicina i les Tecnologies Innovadores", es: "Centre per a la Integració de la Medicina i les Tecnologies Innovadores", en: "Centre for the Integration of Medicine and Innovative Technologies" },
    website: "https://cimti.cat/"
  },
  {
    name: { ca: "Cercle d'Economia", es: "Cercle d'Economia", en: "Economy Circle" },
    website: "https://cercledeconomia.com/"
  },
  {
    name: { ca: "Cercle de Cultura", es: "Cercle de Cultura", en: "Culture Circle" },
    website: "https://www.cercledecultura.org/"
  },
  {
    name: { ca: "CIDOB", es: "CIDOB", en: "CIDOB" },
    website: "https://www.cidob.org/"
  },
  {
    name: { ca: "Clade", es: "Clade", en: "Clade" },
    website: "https://www.grupclade.com/"
  },
  {
    name: { ca: "Clúster Audiovisual de Catalunya", es: "Clúster Audiovisual de Catalunya", en: "Audiovisual Cluster of Catalonia" },
    website: "https://www.clusteraudiovisual.cat/"
  },
  {
    name: { ca: "Cohabitac", es: "Cohabitac", en: "Cohabitac" },
    website: "https://www.cohabitac.cat/"
  },
  {
    name: { ca: "Col·legi d'Ambientòlegs de Catalunya", es: "Col·legi d'Ambientòlegs de Catalunya", en: "Association of Environmentalists of Catalonia" },
    website: "https://www.coamb.cat/"
  },
  {
    name: { ca: "Col·legi d'Arquitectes de Catalunya", es: "Col·legi d'Arquitectes de Catalunya", en: "Association of Architects of Catalonia" },
    website: "https://www.arquitectes.cat/"
  },
  {
    name: { ca: "Col·legi d'Economistes de Catalunya", es: "Col·legi d'Economistes de Catalunya", en: "Association of Economists of Catalonia" },
    website: "https://www.coleconomistes.cat/"
  },
  {
    name: { ca: "Col·legi d'Enginyers de Camins", es: "Col·legi d'Enginyers de Camins", en: "Association of Civil Engineers" },
    website: "https://ww2.camins.cat/"
  },
  {
    name: { ca: "Col·legi de Censors Jurats de Comptes", es: "Col·legi de Censors Jurats de Comptes", en: "Association of Chartered Accountants" },
    website: "https://www.auditorscensors.com/"
  },
  {
    name: { ca: "Col·legi de Gestors Administratius", es: "Col·legi de Gestors Administratius", en: "Association of Administrative Agents" },
    website: "https://gestors.cat/"
  },
  {
    name: { ca: "Col·legi de Graduats Socials", es: "Col·legi de Graduats Socials", en: "Association of Labour Relations Experts" },
    website: "https://www.graduados-sociales.com/"
  },
  {
    name: { ca: "Col·legi de Metges de Barcelona", es: "Col·legi de Metges de Barcelona", en: "Association of Physicians of Barcelona" },
    website: "https://www.comb.cat/"
  },
  {
    name: { ca: "Col·legi Oficial d'Enginyeria en Informàtica de Catalunya", es: "Col·legi Oficial d'Enginyeria en Informàtica de Catalunya", en: "Official Association of Computer Engineering of Catalonia" },
    website: "https://enginyeriainformatica.cat/"
  },
  {
    name: { ca: "Col·legi Oficial de Psicologia de Catalunya", es: "Col·legi Oficial de Psicologia de Catalunya", en: "Official Association of Psychology of Catalonia" },
    website: "https://www.copc.cat/"
  },
  {
    name: { ca: "Col·legi Oficial de Treball Social de Catalunya", es: "Col·legi Oficial de Treball Social de Catalunya", en: "Official Association of Social Work of Catalonia" },
    website: "https://www.tscat.cat/"
  },
  {
    name: { ca: "Comertia", es: "Comertia", en: "Comertia" },
    website: "https://www.comertia.net/"
  },
  {
    name: { ca: "Comissions Obreres de Catalunya", es: "Comissions Obreres de Catalunya", en: "Commissions Obreres de Catalunya (trade union)" },
    website: "https://www.ccoo.cat/"
  },
  {
    name: { ca: "Comsa", es: "Comsa", en: "Comsa" },
    website: "https://www.comsa.com/"
  },
  {
    name: { ca: "Confederació de Cooperatives de Catalunya", es: "Confederació de Cooperatives de Catalunya", en: "Confederation of Cooperatives of Catalonia" },
    website: "https://cooperativescatalunya.coop/"
  },
  {
    name: { ca: "Consell Assessor per al Desenvolupament Sostenible", es: "Consell Assessor per al Desenvolupament Sostenible", en: "Advisory Council for Sustainable Development" },
    website: "https://cads.gencat.cat/"
  },
  {
    name: { ca: "Consell Català de la Producció Agrària Ecològica", es: "Consell Català de la Producció Agrària Ecològica", en: "Catalan Council for Organic Agricultural Production" },
    website: "https://www.ccpae.org/"
  },
  {
    name: { ca: "Consell d'Empreses Distribuïdores d'Alimentació de Catalunya", es: "Consell d'Empreses Distribuïdores d'Alimentació de Catalunya", en: "Council of Food Distributor Companies of Catalonia" },
    website: "https://cedac.es/"
  },
  {
    name: { ca: "Consell de Col·legis d'Administradors de Finques de Catalunya", es: "Consell de Col·legis d'Administradors de Finques de Catalunya", en: "Council of Associations of Property Managers of Catalonia" },
    website: "https://www.consellcaf.cat/"
  },
  {
    name: { ca: "Consell de Gremis", es: "Consell de Gremis", en: "Council of Guilds" },
    website: "https://www.conselldegremis.cat/"
  },
  {
    name: { ca: "Consell Nacional de la Cultura i de les Arts", es: "Consell Nacional de la Cultura i de les Arts", en: "National Council for Culture and the Arts" },
    website: "https://conca.gencat.cat/"
  },
  {
    name: { ca: "Consorci Administració Oberta de Catalunya", es: "Consorci Administració Oberta de Catalunya", en: "Open Administration Consortium of Catalonia" },
    website: "https://www.aoc.cat/"
  },
  {
    name: { ca: "Consorci de Salut i Social de Catalunya", es: "Consorci de Salut i Social de Catalunya", en: "Social and Health Consortium of Catalonia" },
    website: "https://www.consorci.org/"
  },
  {
    name: { ca: "Consorci de Serveis Socials de Barcelona", es: "Consorci de Serveis Socials de Barcelona", en: "Social Services Consortium of Barcelona" },
    website: "https://www.cssbcn.cat/"
  },
  {
    name: { ca: "Consorci de Serveis Universitaris de Catalunya", es: "Consorci de Serveis Universitaris de Catalunya", en: "Consortium of University Services of Catalonia" },
    website: "https://www.csuc.cat/"
  },
  {
    name: { ca: "Coordinadora Catalana de Fundacions", es: "Coordinadora Catalana de Fundacions", en: "Catalan Foundations Coordination Council" },
    website: "https://ccfundacions.cat/"
  },
  {
    name: { ca: "Corporació Catalana de Mitjans Audiovisuals", es: "Corporació Catalana de Mitjans Audiovisuals", en: "Catalan Broadcasting Corporation" },
    website: "https://www.3cat.cat/corporatiu/"
  },
  {
    name: { ca: "Cottet Optics", es: "Cottet Optics", en: "Cottet Optics" },
    website: "https://www.cottet.com/"
  },
  {
    name: { ca: "Diputació de Barcelona", es: "Diputació de Barcelona", en: "Barcelona Provincial Council" },
    website: "https://www.diba.cat/"
  },
  {
    name: { ca: "Diputació de Tarragona", es: "Diputació de Tarragona", en: "Tarragona Provincial Council" },
    website: "https://www.dipta.cat/"
  },
  {
    name: { ca: "DobleVia SCCL", es: "DobleVia SCCL", en: "DobleVia SCCL" },
    website: "https://doblevia.coop/"
  },
  {
    name: { ca: "EADA", es: "EADA", en: "EADA" },
    website: "https://www.eada.edu/"
  },
  {
    name: { ca: "EAE", es: "EAE", en: "EAE" },
    website: "https://www.eae.es/"
  },
  {
    name: { ca: "Edu21", es: "Edu21", en: "Edu21" },
    website: "https://edu21.cat/"
  },
  {
    name: { ca: "ESADE Business & Law School, Centre de Governança Pública", es: "ESADE Business & Law School, Centre de Governança Pública", en: "ESADE Business & Law School, Centre for Public Governance" },
    website: "https://www.esade.edu/faculty-research/en/esadegov/organizational-centers/partners-program"
  },
  {
    name: { ca: "Escola d'Arquitectura La Salle", es: "Escola d'Arquitectura La Salle", en: "La Salle School of Architecture" },
    website: "https://www.salleurl.edu/en/la-salle-higher-technical-school-architecture-and-building-etsals"
  },
  {
    name: { ca: "Escola Superior de Comerç i Distribució", es: "Escola Superior de Comerç i Distribució", en: "Advanced School of Commerce and Distribution" },
    website: "https://escodi.com/"
  },
  {
    name: { ca: "Eurecat", es: "Eurecat", en: "Eurecat" },
    website: "https://eurecat.org/"
  },
  {
    name: { ca: "Federació Catalana d'Associacions de Propietaris Forestals", es: "Federació Catalana d'Associacions de Propietaris Forestals", en: "Catalan Federation of Forest Owner Associations" },
    website: "https://www.boscat.cat/"
  },
  {
    name: { ca: "Federació d'Associacions de Pares i Mares d'Escoles Lliures de Catalunya", es: "Federació d'Associacions de Pares i Mares d'Escoles Lliures de Catalunya", en: "Federation of Parents' Associations of Free Schools of Catalonia" },
    website: "https://fapel.net/"
  },
  {
    name: { ca: "Federació d'Entitats d'Atenció a la Infància i Adolescència", es: "Federació d'Entitats d'Atenció a la Infància i Adolescència", en: "Federation of Children's and Young People's Care Organisations" },
    website: "https://fedaia.org/"
  },
  {
    name: { ca: "Federació de Cooperatives Agràries de Catalunya", es: "Federació de Cooperatives Agràries de Catalunya", en: "Federation of Agricultural Cooperatives of Catalonia" },
    website: "https://www.cooperativesagraries.cat/"
  },
  {
    name: { ca: "Federació de Cooperatives de Treball", es: "Federació de Cooperatives de Treball", en: "Federation of Labour Cooperatives" },
    website: "https://www.cooperativestreball.coop/"
  },
  {
    name: { ca: "Federació de Municipis", es: "Federació de Municipis", en: "Federation of Municipalities" },
    website: "https://www.fmc.cat/"
  },
  {
    name: { ca: "Federació de Mútues d'Iniciativa Social", es: "Federació de Mútues d'Iniciativa Social", en: "Federation of Social Enterprise Mutual Health Associations" },
    website: "https://www.mutualitats.cat/"
  },
  {
    name: { ca: "FemCAT", es: "FemCAT", en: "FemCAT" },
    website: "https://www.femcat.cat/"
  },
  {
    name: { ca: "Fepime Catalunya", es: "Fepime Catalunya", en: "Fepime Catalunya" },
    website: "https://www.fepime.cat/"
  },
  {
    name: { ca: "Ferrocarrils de la Generalitat de Catalunya", es: "Ferrocarrils de la Generalitat de Catalunya", en: "Ferrocarrils de la Generalitat de Catalunya (Catalan railway network)" },
    website: "https://www.fgc.cat/"
  },
  {
    name: { ca: "Festival Cruïlla", es: "Festival Cruïlla", en: "Cruïlla Festival" },
    website: "https://www.cruillabarcelona.com/"
  },
  {
    name: { ca: "Festival Sónar", es: "Festival Sónar", en: "Sónar Festival" },
    website: "https://sonar.es/"
  },
  {
    name: { ca: "Foment del Treball Nacional", es: "Foment del Treball Nacional", en: "Employment Development Department (Foment del Treball Nacional)" },
    website: "https://www.foment.com/"
  },
  {
    name: { ca: "Fòrum Social Mundial de les Economies Transformadores", es: "Fòrum Social Mundial de les Economies Transformadores", en: "World Social Forum of Transformative Economies" },
    website: "https://transformadora.org/"
  },
  {
    name: { ca: "Fundació Alicia", es: "Fundació Alicia", en: "Alicia Foundation" },
    website: "https://alicia.cat/"
  },
  {
    name: { ca: "Fundació Amics del MNAC", es: "Fundació Amics del MNAC", en: "Friends of the MNAC Foundation" },
    website: "https://www.amicsmuseunacional.org/"
  },
  {
    name: { ca: "Fundació Antigues Caixes Catalanes", es: "Fundació Antigues Caixes Catalanes", en: "Traditional Catalan Savings Banks Foundation" },
    website: "https://www.fcaixescatalanes.cat/"
  },
  {
    name: { ca: "Fundació Barcelona Comerç", es: "Fundació Barcelona Comerç", en: "Barcelona Commerce Foundation" },
    website: "https://www.eixosbcn.barcelona/"
  },
  {
    name: { ca: "Fundació BCN Formació Professional", es: "Fundació BCN Formació Professional", en: "BCN Vocational Training Foundation" },
    website: "https://www.fundaciobcnfp.cat/"
  },
  {
    name: { ca: "Fundació Betània-Patmos", es: "Fundació Betània-Patmos", en: "Betània-Patmos Foundation" },
    website: "https://www.betania-patmos.org/"
  },
  {
    name: { ca: "Fundació Carulla", es: "Fundació Carulla", en: "Carulla Foundation" },
    website: "https://fundaciocarulla.cat/"
  },
  {
    name: { ca: "Fundació Catalana per a la Recerca i la Innovació", es: "Fundació Catalana per a la Recerca i la Innovació", en: "Catalan Foundation for Research and Innovation" },
    website: "https://fcri.cat/"
  },
  {
    name: { ca: "Fundació Catalunya Cultura", es: "Fundació Catalunya Cultura", en: "Catalonia Culture Foundation" },
    website: "https://www.fundaciocatalunyacultura.cat/"
  },
  {
    name: { ca: "Fundació Catalunya Europa", es: "Fundació Catalunya Europa", en: "Catalonia Europe Foundation" },
    website: "https://www.catalunyaeuropa.net/"
  },
  {
    name: { ca: "Fundació Catalunya La Pedrera", es: "Fundació Catalunya La Pedrera", en: "La Pedrera Catalonia Foundation" },
    website: "https://www.fundaciocatalunya-lapedrera.com/"
  },
  {
    name: { ca: "Fundació Collserola", es: "Fundació Collserola", en: "Collserola Foundation" },
    website: "https://www.fundaciocollserola.cat/"
  },
  {
    name: { ca: "Fundació Congrés de Cultura Catalana", es: "Fundació Congrés de Cultura Catalana", en: "Catalan Congress of Culture Foundation" },
    website: "https://fundaciocongres.cat/"
  },
  {
    name: { ca: "Fundació Conservatori del Liceu", es: "Fundació Conservatori del Liceu", en: "Liceu Conservatory Foundation" },
    website: "https://www.conservatoriliceu.es/"
  },
  {
    name: { ca: "Fundació El Llindar", es: "Fundació El Llindar", en: "El Llindar Foundation" },
    website: "https://www.elllindar.org/"
  },
  {
    name: { ca: "Fundació Factor Humà", es: "Fundació Factor Humà", en: "Human Factor Foundation" },
    website: "https://factorhuma.org/"
  },
  {
    name: { ca: "Fundació Iluro", es: "Fundació Iluro", en: "Iluro Foundation" },
    website: "https://fundacioiluro.cat/"
  },
  {
    name: { ca: "Fundació Inform", es: "Fundació Inform", en: "Inform Foundation" },
    website: "https://inform.es/"
  },
  {
    name: { ca: "Fundació Institució Cultural del CIC", es: "Fundació Institució Cultural del CIC", en: "CIC Cultural Institution Foundation" },
    website: "https://fundaciocic.org/"
  },
  {
    name: { ca: "Fundació Institut Ramon Muntaner", es: "Fundació Institut Ramon Muntaner", en: "Ramon Muntaner Institute Foundation" },
    website: "https://www.irmu.org/"
  },
  {
    name: { ca: "Fundació IPSI", es: "Fundació IPSI", en: "IPSI Foundation" },
    website: "https://ipsi.cat/"
  },
  {
    name: { ca: "Fundació Jaume Bofill", es: "Fundació Jaume Bofill", en: "Jaume Bofill Foundation" },
    website: "https://fundaciobofill.cat/"
  },
  {
    name: { ca: "Fundació Joan Profitós", es: "Fundació Joan Profitós", en: "Joan Profitós Foundation" },
    website: "https://escolapia.cat/xarxa-escola-pia/fundacio-joan-profitos/"
  },
  {
    name: { ca: "Fundació La Caixa", es: "Fundació La Caixa", en: "La Caixa Foundation" },
    website: "https://fundacionlacaixa.org/ca/"
  },
  {
    name: { ca: "Fundació Pau Costa", es: "Fundació Pau Costa", en: "Pau Costa Foundation" },
    website: "https://www.paucostafoundation.org/"
  },
  {
    name: { ca: "Fundació Pere Tarrés", es: "Fundació Pere Tarrés", en: "Pere Tarrés Foundation" },
    website: "https://www.peretarres.org/"
  },
  {
    name: { ca: "Fundació Sanitària Sant Pere Claver", es: "Fundació Sanitària Sant Pere Claver", en: "Sant Pere Claver Healthcare Foundation" },
    website: "https://www.pereclaver.org/"
  },
  {
    name: { ca: "Fundació Surt", es: "Fundació Surt", en: "Surt Foundation" },
    website: "https://surt.org/"
  },
  {
    name: { ca: "Fundació Teatre Lliure", es: "Fundació Teatre Lliure", en: "Teatre Lliure Foundation" },
    website: "https://www.teatrelliure.com/"
  },
  {
    name: { ca: "Fundesplai", es: "Fundesplai", en: "Fundesplai" },
    website: "https://fundesplai.org"
  },
  {
    name: { ca: "Fundraisers.cat", es: "Fundraisers.cat", en: "Fundraisers.cat" },
    website: "https://www.fundraising.cat"
  },
  {
    name: { ca: "Generalitat de Catalunya, Centre de Telecomunicacions i Tecnologies de la Informació", es: "Generalitat de Catalunya, Centre de Telecomunicacions i Tecnologies de la Informació", en: "Government of Catalonia, Centre for Telecommunications and Information Technologies" },
    website: "https://ctti.gencat.cat"
  },
  {
    name: { ca: "Generalitat de Catalunya, Direcció General d'Atenció Ciutadana", es: "Generalitat de Catalunya, Direcció General d'Atenció Ciutadana", en: "Government of Catalonia, Directorate-General for Citizen Information" },
    website: "https://atenciociutadana.gencat.cat"
  },
  {
    name: { ca: "Generalitat de Catalunya, Direcció General de Comerç", es: "Generalitat de Catalunya, Direcció General de Comerç", en: "Government of Catalonia, Directorate-General for Commerce" },
    website: "https://empresa.gencat.cat"
  },
  {
    name: { ca: "Generalitat de Catalunya, Direcció General de Contractació Pública", es: "Generalitat de Catalunya, Direcció General de Contractació Pública", en: "Government of Catalonia, Directorate-General for Public Procurement" },
    website: "https://contractacio.gencat.cat"
  },
  {
    name: { ca: "Glovo", es: "Glovo", en: "Glovo" },
    website: "https://glovoapp.com"
  },
  {
    name: { ca: "GoodTechLab", es: "GoodTechLab", en: "GoodTechLab" },
    website: "https://goodtechlab.io"
  },
  {
    name: { ca: "Gremi d'Editors de Catalunya", es: "Gremi d'Editors de Catalunya", en: "Publishers Guild of Catalonia" },
    website: "https://www.gremieditors.cat"
  },
  {
    name: { ca: "Gremi d'Hotels", es: "Gremi d'Hotels", en: "Hotels Guild" },
    website: "https://barcelonahotels.org"
  },
  {
    name: { ca: "Gremi de Cinemes de Catalunya", es: "Gremi de Cinemes de Catalunya", en: "Guild of Cinemas of Catalonia" },
    website: "https://gremicines.com/"
  },
  {
    name: { ca: "Gremi de Restauració", es: "Gremi de Restauració", en: "Restaurant Business Guild" },
    website: "https://www.gremirestauracio.com/"
  },
  {
    name: { ca: "Grup Enderrock", es: "Grup Enderrock", en: "Enderrock Group" },
    website: "https://www.enderrock.cat/"
  },
  {
    name: { ca: "Grup Focus", es: "Grup Focus", en: "Focus Group" },
    website: "https://www.focus.cat/"
  },
  {
    name: { ca: "Grup Parlamentari Ciutadans", es: "Grup Parlamentari Ciutadans", en: "Cs Parliamentary Group" },
    website: "https://www.ciudadanos-cs.org/"
  },
  {
    name: { ca: "Grup Parlamentari Comuns", es: "Grup Parlamentari Comuns", en: "Catalunya en Comú-Podem Parliamentary Group" },
    website: "https://comuns.cat/"
  },
  {
    name: { ca: "Grup Parlamentari CUP", es: "Grup Parlamentari CUP", en: "CUP Parliamentary Group" },
    website: "https://cup.cat/"
  },
  {
    name: { ca: "Grup Parlamentari ERC", es: "Grup Parlamentari ERC", en: "ERC Parliamentary Group" },
    website: "https://www.esquerra.cat/"
  },
  {
    name: { ca: "Grup Parlamentari JxCat", es: "Grup Parlamentari JxCat", en: "JxCat Parliamentary Group" },
    website: "https://junts.cat/"
  },
  {
    name: { ca: "Grup Parlamentari PP", es: "Grup Parlamentari PP", en: "PP Parliamentary Group" },
    website: "https://www.ppcatalunya.com/"
  },
  {
    name: { ca: "Grup Parlamentari PSC", es: "Grup Parlamentari PSC", en: "PSC Parliamentary Group" },
    website: "https://www.socialistes.cat/"
  },
  {
    name: { ca: "GSMA", es: "GSMA", en: "GSMA" },
    website: "https://www.gsma.com/"
  },
  {
    name: { ca: "Guionistes Associats de Catalunya", es: "Guionistes Associats de Catalunya", en: "Associated Scriptwriters of Catalonia" },
    website: "https://www.guionistes.cat/"
  },
  {
    name: { ca: "Hospital Clínic", es: "Hospital Clínic", en: "Hospital Clínic" },
    website: "https://www.clinicbarcelona.org/"
  },
  {
    name: { ca: "Ideograma", es: "Ideograma", en: "Ideograma" },
    website: "https://www.ideograma.org/"
  },
  {
    name: { ca: "IESE", es: "IESE", en: "IESE" },
    website: "https://www.iese.edu/"
  },
  {
    name: { ca: "Incasol", es: "Incasol", en: "Incasol" },
    website: "https://incasol.gencat.cat/"
  },
  {
    name: { ca: "Institut Català d'Estudis Agraris", es: "Institut Català d'Estudis Agraris", en: "Catalan Institute of Agricultural Studies" },
    website: "https://icea.iec.cat/"
  },
  {
    name: { ca: "Institut Català de la Salut", es: "Institut Català de la Salut", en: "Catalan Health Institute" },
    website: "https://ics.gencat.cat/"
  },
  {
    name: { ca: "Institut d'Estudis Catalans", es: "Institut d'Estudis Catalans", en: "Institute of Catalan Studies" },
    website: "https://www.iec.cat/"
  },
  {
    name: { ca: "Institut of Art, Basilea", es: "Institut of Art, Basilea", en: "Institute of Art, Basel" },
    website: "https://www.artbasel.com"
  },
  {
    name: { ca: "Institut per al Desenvolupament i la Promoció de l'Alt Pirineu i Aran", es: "Institut per al Desenvolupament i la Promoció de l'Alt Pirineu i Aran", en: "Institute for the Development and Promotion of Alt Pirineu i Aran" },
    website: "https://territori.gencat.cat/ca/06_territori_i_urbanisme/idapa"
  },
  {
    name: { ca: "Institut Ramon Llull", es: "Institut Ramon Llull", en: "Ramon Llull Institute" },
    website: "https://www.llull.cat/"
  },
  {
    name: { ca: "Intueri Consulting", es: "Intueri Consulting", en: "Intueri Consulting" },
    website: "https://www.intueri-consulting.com/"
  },
  {
    name: { ca: "La Cúpula Music", es: "La Cúpula Music", en: "La Cúpula Music" },
    website: "https://www.lacupulamusic.com/"
  },
  {
    name: { ca: "La Marieta Web", es: "La Marieta Web", en: "La Marieta Web" },
    website: null
  },
  {
    name: { ca: "La Virreina Centre de la Imatge", es: "La Virreina Centre de la Imatge", en: "La Virreina Image Centre" },
    website: "https://ajuntament.barcelona.cat/lavirreina/ca"
  },
  {
    name: { ca: "LEITAT", es: "LEITAT", en: "LEITAT" },
    website: "https://leitat.org/"
  },
  {
    name: { ca: "LleidaNet", es: "LleidaNet", en: "LleidaNet" },
    website: "https://www.lleida.net/"
  },
  {
    name: { ca: "Mancomunitat d'Iniciatives pel Desenvolupament Integral del Territori", es: "Mancomunitat d'Iniciatives pel Desenvolupament Integral del Territori", en: "Commonwealth of Initiatives for the Comprehensive Development of Catalonia" },
    website: "https://www.midit2020.com/"
  },
  {
    name: { ca: "Mobile World Capital", es: "Mobile World Capital", en: "Mobile World Capital" },
    website: "https://mobileworldcapital.com/"
  },
  {
    name: { ca: "Moviments de Renovació Pedagògica", es: "Moviments de Renovació Pedagògica", en: "Teaching Renewal Movements" },
    website: "https://www.mrp.cat/"
  },
  {
    name: { ca: "Mucho", es: "Mucho", en: "Mucho" },
    website: "https://wearemucho.com/"
  },
  {
    name: { ca: "Novicom Marketing Group España", es: "Novicom Marketing Group España", en: "Novicom Marketing Group España" },
    website: "https://www.novicommarketinggroup.com/"
  },
  {
    name: { ca: "Observatori DESC", es: "Observatori DESC", en: "DESC Observatory" },
    website: "https://observatoridesca.org/"
  },
  {
    name: { ca: "Observatori Dona Empresa i Economia", es: "Observatorio Mujer, Empresa y Economía", en: "Women, Enterprise and Economy Observatory" },
    website: "https://www.odee.cat/"
  },
  {
    name: { ca: "Oficina per a la Reforma Horària", es: "Oficina per a la Reforma Horària", en: "Office for Working Hour Reform" },
    website: "https://reformahoraria.cat/"
  },
  {
    name: { ca: "Òmnium Cultural", es: "Òmnium Cultural", en: "Òmnium Cultural" },
    website: "https://www.omnium.cat/"
  },
  {
    name: { ca: "País Conscient", es: "País Conscient", en: "País Conscient" },
    website: "https://infopaisconscient.wixsite.com/paisconscient"
  },
  {
    name: { ca: "PIMEC", es: "PIMEC", en: "PIMEC" },
    website: "https://pimec.org/"
  },
  {
    name: { ca: "Pla Estratègic Metropolità de Barcelona", es: "Pla Estratègic Metropolità de Barcelona", en: "Metropolitan Strategic Plan of Barcelona" },
    website: "https://pemb.cat/"
  },
  {
    name: { ca: "Pla Nacional de Valors", es: "Pla Nacional de Valors", en: "National Values Plan" },
    website: "https://pladevalors.cat/"
  },
  {
    name: { ca: "Plataforma Actua Cultura", es: "Plataforma Actua Cultura", en: "Actua Cultura Platform" },
    website: "https://www.actuacultura.cat/"
  },
  {
    name: { ca: "Plataforma Assambleària d'Artistes de Catalunya", es: "Plataforma Assambleària d'Artistes de Catalunya", en: "Assembly Platform for Artists of Catalonia" },
    website: "https://www.paac.cat/"
  },
  {
    name: { ca: "Plataforma Transport Públic", es: "Plataforma Transport Públic", en: "Public Transport Platform" },
    website: "https://transportpublic.org/"
  },
  {
    name: { ca: "Proa", es: "Proa", en: "Proa" },
    website: "https://proafed.com/"
  },
  {
    name: { ca: "Productors Audiovisuals de Catalunya", es: "Productors Audiovisuals de Catalunya", en: "Audiovisual Producers of Catalonia" },
    website: "https://pac.cat/"
  },
  {
    name: { ca: "Qesb", es: "Qesb", en: "Qesb" },
    website: null
  },
  {
    name: { ca: "Qida", es: "Qida", en: "Qida" },
    website: "https://www.qida.es/"
  },
  {
    name: { ca: "Qualitat Serveis Empresarials", es: "Qualitat Serveis Empresarials", en: "Qualitat Serveis Empresarials" },
    website: "https://qualitats.com/"
  },
  {
    name: { ca: "QueSoni SCCL", es: "QueSoni SCCL", en: "QueSoni SCCL" },
    website: "https://quesoni.cat/"
  },
  {
    name: { ca: "RDB Consulting", es: "RDB Consulting", en: "RDB Consulting" },
    website: "https://www.rdbconsulting.biz/"
  },
  {
    name: { ca: "Resilence Earth", es: "Resilence Earth", en: "Resilence Earth" },
    website: "https://resilience.earth/"
  },
  {
    name: { ca: "Salus Coop", es: "Salus Coop", en: "Salus Coop" },
    website: "https://www.salus.coop/"
  },
  {
    name: { ca: "Secretariat de l'Escola Rural", es: "Secretariat de l'Escola Rural", en: "Secretariat for Rural Schools" },
    website: "https://sites.google.com/view/secretariatescolaruralcat/"
  },
  {
    name: { ca: "Secretariat Escola Cristiana", es: "Secretariat Escola Cristiana", en: "Christian School Foundation Secretariat" },
    website: "https://www.fecc.cat/"
  },
  {
    name: { ca: "Ship2B", es: "Ship2B", en: "Ship2B" },
    website: "https://www.ship2b.org/"
  },
  {
    name: { ca: "Síndic d'Aran", es: "Síndic d'Aran", en: "Ombudsman of Aran" },
    website: "https://www.conselharan.org/es/eth-sindic/"
  },
  {
    name: { ca: "Síndic de Greuges de Catalunya", es: "Síndic de Greuges de Catalunya", en: "Ombudsman of Catalonia" },
    website: "https://www.sindic.cat/"
  },
  {
    name: { ca: "Sindicat de Llogaters", es: "Sindicat de Llogaters", en: "Tenants' Union" },
    website: "https://sindicatdellogateres.org/"
  },
  {
    name: { ca: "Social Car", es: "Social Car", en: "Social Car" },
    website: "https://www.socialcar.com/"
  },
  {
    name: { ca: "Societat d'Ordenació del Territori", es: "Societat d'Ordenació del Territori", en: "Society for the Organisation of the Territory" },
    website: "https://scot.iec.cat/"
  },
  {
    name: { ca: "Som Mobilitat", es: "Som Mobilitat", en: "Som Mobilitat" },
    website: "https://sommobilitat.coop/"
  },
  {
    name: { ca: "Taula del Tercer Sector", es: "Taula del Tercer Sector", en: "Board for the Third Sector" },
    website: "https://www.tercersector.cat/"
  },
  {
    name: { ca: "Telefónica", es: "Telefónica", en: "Telefónica" },
    website: "https://www.telefonica.com/es/"
  },
  {
    name: { ca: "Terra Franca", es: "Terra Franca", en: "Terra Franca" },
    website: "https://www.terrafranca.cat/"
  },
  {
    name: { ca: "Tr3C", es: "Tr3C", en: "Tr3C" },
    website: "https://www.tresc.cat/"
  },
  {
    name: { ca: "Turisme de Barcelona", es: "Turisme de Barcelona", en: "Tourism of Barcelona" },
    website: "https://www.barcelonaturisme.com/"
  },
  {
    name: { ca: "Unió Catalana d'Hospitals", es: "Unió Catalana d'Hospitals", en: "Catalan Union of Hospitals" },
    website: "https://www.uch.cat/"
  },
  {
    name: { ca: "Unió de Federacions Esportives de Catalunya", es: "Unió de Federacions Esportives de Catalunya", en: "Union of Sporting Federations of Catalonia" },
    website: "https://www.ufec.cat/"
  },
  {
    name: { ca: "Unió Empresarial de l'Anoia", es: "Unió Empresarial de l'Anoia", en: "Anoia Business Union" },
    website: "https://www.uea.cat/"
  },
  {
    name: { ca: "Universitat de Barcelona", es: "Universitat de Barcelona", en: "University of Barcelona" },
    website: "https://web.ub.edu/"
  },
  {
    name: { ca: "Universitat de Barcelona — Grup CETT", es: "Universidad de Barcelona — Grupo CETT", en: "University of Barcelona — CETT Group" },
    website: "https://www.cett.es/"
  },
  {
    name: { ca: "Universitat de Lleida", es: "Universitat de Lleida", en: "University of Lleida" },
    website: "https://www.udl.cat/"
  },
  {
    name: { ca: "Universitat Internacional de Catalunya", es: "Universitat Internacional de Catalunya", en: "International University of Catalonia" },
    website: "https://www.uic.es/"
  },
  {
    name: { ca: "Universitat Oberta de Catalunya", es: "Universitat Oberta de Catalunya", en: "Open University of Catalonia" },
    website: "https://www.uoc.edu/"
  },
  {
    name: { ca: "Universitat Politècnica de Catalunya", es: "Universitat Politècnica de Catalunya", en: "Technical University of Catalonia" },
    website: "https://www.upc.edu/"
  },
  {
    name: { ca: "Universitat Pompeu Fabra", es: "Universitat Pompeu Fabra", en: "Pompeu Fabra University" },
    website: "https://www.upf.edu/"
  },
  {
    name: { ca: "Vall d'Hebron Institute of Oncology", es: "Vall d'Hebron Institute of Oncology", en: "Vall d'Hebron Institute of Oncology" },
    website: "https://vhio.net/"
  },
  {
    name: { ca: "Xarxa d'Economia Solidària", es: "Xarxa d'Economia Solidària", en: "Economy of Solidarity Network" },
    website: "https://xes.cat/"
  },
  {
    name: { ca: "Xarxa d'Espais de Producció i Creació de Catalunya", es: "Xarxa d'Espais de Producció i Creació de Catalunya", en: "Network of Production and Creation Factories of Catalonia" },
    website: "https://xarxaprod.cat/"
  },
  {
    name: { ca: "Xarxa de Municipis per l'Economia Social i Solidària", es: "Xarxa de Municipis per l'Economia Social i Solidària", en: "Network of Towns for the Economy of Society and Solidarity" },
    website: "https://xmess.cat/"
  }
];
