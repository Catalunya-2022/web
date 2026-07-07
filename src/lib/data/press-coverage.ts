import type { Trilingual } from "@/i18n/routing";

export type PressArticle = {
  url: string;
  outlet: string;
  domain: string;
  title: string;
  date: string;
  ogImage?: string;
  highlighted: boolean;
};

export type PressSection = {
  id: string;
  label: Trilingual;
  title: Trilingual;
  articles: PressArticle[];
};

/** Hashed filenames: content blockers match outlet-domain tokens in image URLs. */
export function pressFaviconPath(domain: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < domain.length; i++) {
    hash ^= domain.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `/press-favicons/${(hash >>> 0).toString(16).padStart(8, "0")}.png`;
}

export const youtubeVideo: {
  id: string;
  start: number;
  url: string;
  title: Trilingual;
  date: Trilingual;
  location: string;
  description: Trilingual;
} = {
  id: "US_dRLYn320",
  start: 585,
  url: "https://www.youtube.com/watch?v=US_dRLYn320&t=585",
  title: {
    ca: "Presentació de les conclusions del Grup de Treball Catalunya 2022",
    en: "Presentation of the Catalunya 2022 Task Force conclusions",
    es: "Presentación de las conclusiones del Grupo de Trabajo Catalunya 2022",
  },
  date: {
    ca: "10 de juny de 2021",
    en: "June 10, 2021",
    es: "10 de junio de 2021",
  },
  location: "Palau de la Generalitat, Barcelona",
  description: {
    ca: "El grup de treball va presentar les seves conclusions finals (3 àmbits, 12 objectius i 91 accions) al president Pere Aragonès al Palau de la Generalitat.",
    en: "The task force presented its final conclusions (3 spheres, 12 goals, and 91 actions) to President Pere Aragonès at the Palau de la Generalitat.",
    es: "El grupo de trabajo presentó sus conclusiones finales (3 ámbitos, 12 objetivos y 91 acciones) al presidente Pere Aragonès en el Palau de la Generalitat.",
  },
};

export const pressSections: PressSection[] = [
  {
    id: "publication",
    label: { ca: "Juny 2021", en: "June 2021", es: "Junio 2021" },
    title: { ca: "Publicació i Presentació", en: "Publication & Presentation", es: "Publicación y Presentación" },
    articles: [
      {
        url: "https://www.lavanguardia.com/politica/20210610/7516680/expertos.html",
        outlet: "La Vanguardia",
        domain: "lavanguardia.com",
        title: "Los expertos diseñan un 'reset' para la Catalunya postcovid",
        date: "2021-06-10",
        ogImage: "/press-images/lavanguardia-og.jpg",
        highlighted: true,
      },
      {
        url: "https://www.elpuntavui.cat/politica/article/17-politica/1983900-objectiu-fer-un-reset-al-pais.html",
        outlet: "El Punt Avui",
        domain: "elpuntavui.cat",
        title: "Objectiu: fer un 'reset' al país",
        date: "2021-06-10",
        ogImage: "/press-images/elpuntavui-og.jpg",
        highlighted: true,
      },
      {
        url: "https://govern.cat/salapremsa/notes-premsa/410819/president-aragones-liderarem-reactivacio-social-economica-del-pais-i-alhora-dedicarem-tots-esforcos-resolucio-del-conflicte-politic-lestat",
        outlet: "Govern de Catalunya",
        domain: "govern.cat",
        title:
          "El cap de l'Executiu ha rebut l'informe final del Grup de Treball Catalunya 2022",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.elnacional.cat/ca/politica/guia-govern-resetejar-pais-91-propostes-post-covid_618590_102.html",
        outlet: "El Nacional",
        domain: "elnacional.cat",
        title:
          "La guia del Govern per 'resetejar' el país: 91 mesures per l'era post Covid",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.ara.cat/politica/sobirania-energetica-ampliar-parc-d-habitatge-public-fins-10-propostes-dels-experts-reactivar-catalunya_1_4014033.html",
        outlet: "Ara",
        domain: "ara.cat",
        title:
          "De la sobirania energètica a ampliar el parc d'habitatge públic fins al 10%: les propostes dels experts per reactivar Catalunya",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.naciodigital.cat/noticia/221136/politica/comite-experts-catalunya-2022-habitatge-public-administracio",
        outlet: "Nació Digital",
        domain: "naciodigital.cat",
        title:
          "El comitè de savis per la Catalunya postCovid demana un 10% d'habitatge públic i repensar l'administració",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.publico.es/public/arribar-al-10-d-habitatge-public-i-apostar-per-l-energia-sostenible-km-0-receptes-catalunya-2022-per-transformar-pais.html",
        outlet: "Públic",
        domain: "publico.es",
        title:
          "Arribar al 10% d'habitatge públic i apostar per l'energia sostenible km.0, receptes de Catalunya 2022 per transformar el país",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.ccma.cat/tv3/alacarta/mes-324/victoria-alsina-i-genis-roca-ens-presenten-linforme-reset-crida-per-reactivar-el-pais/video/6105385/",
        outlet: "TV3",
        domain: "ccma.cat",
        title:
          "Victòria Alsina i Genís Roca ens presenten l'informe 'Reset. Crida per reactivar el país'",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.viaempresa.cat/economia/reset-reactivar-catalunya-experts_2153372_102.html",
        outlet: "Via Empresa",
        domain: "viaempresa.cat",
        title: "Reset i Crida, el pla dels experts per reactivar Catalunya",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.vilaweb.cat/noticies/experts-accions-per-catalunya-pandemia/",
        outlet: "VilaWeb",
        domain: "vilaweb.cat",
        title:
          "Un grup d'experts proposen noranta-una accions per 'fer un reset' a la Catalunya de després de la pandèmia",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.europapress.es/catalunya/noticia-grupo-expertos-propone-91-acciones-reactivar-catalunya-pandemia-20210610134136.html",
        outlet: "EuropaPress",
        domain: "europapress.es",
        title:
          "Un grupo de expertos propone 91 acciones para 'reactivar' Catalunya tras la pandemia",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.segre.com/noticies/economia/2021/06/10/un_grup_experts_proposen_accions_la_generalitat_per_fer_reset_la_catalunya_despres_la_pandemia_137510_1107.html",
        outlet: "Segre",
        domain: "segre.com",
        title:
          "Un grup d'experts proposa 91 accions a la Generalitat per 'fer un reset' a la Catalunya de després de la pandèmia",
        date: "2021-06-10",
        highlighted: false,
      },
      {
        url: "https://www.aoc.cat/2021/1000286834/el-grup-de-treball-catalunya-2022-lliura-les-seves-conclusions-al-govern-de-la-generalitat-de-catalunya/",
        outlet: "AOC",
        domain: "aoc.cat",
        title:
          "El Grup de Treball Catalunya 2022 lliura les seves conclusions al Govern de la Generalitat de Catalunya",
        date: "2021-06-11",
        highlighted: false,
      },
      {
        url: "https://www.regio7.cat/arreu-catalunya-espanya-mon/2021/06/11/grup-d-experts-proposa-91-52864676.html",
        outlet: "Regió 7",
        domain: "regio7.cat",
        title:
          "Un grup d'experts proposa 91 accions per 'fer un reset' a la Catalunya postpandèmia",
        date: "2021-06-11",
        highlighted: false,
      },
      {
        url: "https://www.lavanguardia.com/politica/20210614/7527060/futuro-poscovid-pandemia-catluna-reactivacion.html",
        outlet: "La Vanguardia",
        domain: "lavanguardia.com",
        title:
          "El 'reset' poscovid para reactivar Catalunya tras la pandemia",
        date: "2021-06-14",
        highlighted: false,
      },
      {
        url: "https://www.ara.cat/politica/antoni-bassas-entrevista-genis-roca-coordinador-grup-treball-catalunya-2022-11-h_1_4019813.html",
        outlet: "Ara",
        domain: "ara.cat",
        title:
          "Genís Roca, coordinador del grup Catalunya 2022: 'És una agenda que interpel·la el Govern en aquest primer any de legislatura'",
        date: "2021-06-15",
        highlighted: false,
      },
      {
        url: "https://www.viaempresa.cat/opinio/genis-roca-reset-experts_2153652_102.html",
        outlet: "Via Empresa",
        domain: "viaempresa.cat",
        title: "Reset",
        date: "2021-06-16",
        highlighted: false,
      },
      {
        url: "https://elmondedema.cat/category/2021/reset-a-la-catalunya-2022/",
        outlet: "El Món de Demà",
        domain: "elmondedema.cat",
        title: "#62 Reset a la Catalunya 2022",
        date: "2021-06-20",
        highlighted: false,
      },
      {
        url: "https://www.diaridegirona.cat/economia/2021/06/27/10-anys-s-haurien-fer-54363321.html",
        outlet: "Diari de Girona",
        domain: "diaridegirona.cat",
        title:
          "«En 10 anys s'haurien de fer 35.000 habitatges públics a Girona»",
        date: "2021-06-27",
        highlighted: false,
      },
    ],
  },
  {
    id: "formation",
    label: { ca: "Juny–Juliol 2020", en: "June–July 2020", es: "Junio–Julio 2020" },
    title: { ca: "Creació i Convocatòria Oberta", en: "Formation & Open Call", es: "Creación y Convocatoria Abierta" },
    articles: [
      {
        url: "https://www.europapress.es/catalunya/noticia-grupo-trabajo-catalunya-2022-llama-toda-comunidad-participar-plan-postcrisis-20200713123318.html",
        outlet: "EuropaPress",
        domain: "europapress.es",
        title:
          "El grupo de trabajo Catalunya 2022 llama a toda la comunidad a participar de un plan postcrisis",
        date: "2020-07-13",
        ogImage: "/press-images/europapress-og.jpg",
        highlighted: true,
      },
      {
        url: "https://www.expansion.com/catalunya/2020/06/02/5ed62fc8e5fdea914c8b4574.html",
        outlet: "Expansión",
        domain: "expansion.com",
        title:
          "Torra se rodea de 30 expertos para definir un 'futuro disruptivo' para Cataluña en 2022",
        date: "2020-06-02",
        ogImage: "/press-images/expansion-og.jpg",
        highlighted: true,
      },
      {
        url: "https://www.lavanguardia.com/politica/20200602/481573481358/govern-400-expertos-estrategia-covid19-grupo-de-trabajo-catalunya-2022.html",
        outlet: "La Vanguardia",
        domain: "lavanguardia.com",
        title:
          "El Govern movilizará a 400 expertos para dibujar una estrategia catalana postCovid",
        date: "2020-06-02",
        highlighted: false,
      },
      {
        url: "https://www.elpuntavui.cat/politica/article/17-politica/1799582-el-govern-impulsa-el-grup-d-experts-catalunya-2022-per-dissenyar-la-sortida-a-la-crisi-del-coronavirus.html",
        outlet: "El Punt Avui",
        domain: "elpuntavui.cat",
        title:
          "El Govern impulsa el grup d'experts 'Catalunya 2022' per dissenyar la sortida a la crisi del coronavirus",
        date: "2020-06-02",
        highlighted: false,
      },
      {
        url: "https://www.publico.es/public/catalunya-2022-repte-tracar-futur-incert.html",
        outlet: "Públic",
        domain: "publico.es",
        title: "Catalunya 2022: el repte de traçar un futur incert",
        date: "2020-06-02",
        highlighted: false,
      },
      {
        url: "https://www.elperiodico.com/es/politica/20200602/el-govern-anuncia-el-plan-catalunya-2022-para-definir-el-futuro-tras-la-pandemia-7984391",
        outlet: "El Periódico",
        domain: "elperiodico.com",
        title:
          "El Govern anuncia el plan Catalunya 2022 para definir el futuro tras la pandemia",
        date: "2020-06-02",
        highlighted: false,
      },
      {
        url: "https://www.naciodigital.cat/noticia/203410/govern/posa/marxa/comite/experts/definir/catalunya/post-pandemia",
        outlet: "Nació Digital",
        domain: "naciodigital.cat",
        title:
          "El Govern posa en marxa un comitè d'experts per definir la Catalunya post-pandèmia",
        date: "2020-06-02",
        highlighted: false,
      },
      {
        url: "https://www.ara.cat/politica/DIRECTE-Torra-Aragones-compareixen-Catalunya_0_2464553628.html",
        outlet: "Ara",
        domain: "ara.cat",
        title:
          "El Govern crea un grup de treball per dibuixar la 'Catalunya del 2022'",
        date: "2020-06-02",
        highlighted: false,
      },
      {
        url: "https://www.lrp.cat/opinio/article/1800327-catalunya-2022.html",
        outlet: "La República",
        domain: "lrp.cat",
        title: "Catalunya 2022",
        date: "2020-06-05",
        highlighted: false,
      },
      {
        url: "https://www.ccma.cat/catradio/alacarta/revolucio/genis-roca-i-victoria-alsina-serem-disruptius-i-agosarats-per-dissenyar-la-catalunya-post-covid/audio/1073001/",
        outlet: "Catalunya Ràdio",
        domain: "ccma.cat",
        title: "Genís Roca i Victòria Alsina, al 'Revolució 4.0'",
        date: "2020-06-14",
        highlighted: false,
      },
      {
        url: "https://www.ccma.cat/tv3/alacarta/mes-324/entrevista-a-genis-roca-coordinador-del-grup-de-treball-catalunya-2022/video/6049413/",
        outlet: "TV3",
        domain: "ccma.cat",
        title: "Entrevista Genís Roca, al 'MÉS_324'",
        date: "2020-06-26",
        highlighted: false,
      },
      {
        url: "https://www.lavanguardia.com/politica/20200711/482217026805/la-pandemia-es-un-acelerador-de-reformas-estructurales.html",
        outlet: "La Vanguardia",
        domain: "lavanguardia.com",
        title:
          "'La pandemia es un acelerador de reformas estructurales', entrevista a Genís Roca i Victòria Alsina",
        date: "2020-07-11",
        highlighted: false,
      },
      {
        url: "https://www.ara.cat/politica/treball-Catalunya-recollir-propostes-covid-19_0_2489151149.html",
        outlet: "Ara",
        domain: "ara.cat",
        title:
          "El grup de treball Catalunya 2022 fa una crida a la societat per recollir propostes de sortida a la crisi del covid",
        date: "2020-07-13",
        highlighted: false,
      },
      {
        url: "https://www.elpuntavui.cat/politica/article/17-politica/1819826-el-grup-catalunya-2022-demana-propostes-a-la-societat-per-dissenyar-la-sortida-a-la-crisi-del-coronavirus.html",
        outlet: "El Punt Avui",
        domain: "elpuntavui.cat",
        title:
          "El grup Catalunya 2022 demana propostes a la societat per dissenyar la sortida a la crisi del coronavirus",
        date: "2020-07-13",
        highlighted: false,
      },
      {
        url: "https://www.naciodigital.cat/noticia/205793/crida/dels/experts/govern/institucions/entitats/bastir/horitzo/catalunya/2022",
        outlet: "Nació Digital",
        domain: "naciodigital.cat",
        title:
          "Crida dels experts del Govern a institucions i entitats per bastir l'horitzó Catalunya 2022",
        date: "2020-07-13",
        highlighted: false,
      },
    ],
  },
];
