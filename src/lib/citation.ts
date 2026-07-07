import type { Locale, Trilingual } from "@/i18n/routing";

const DOCUMENT_DOI = "10.5281/zenodo.19500831";
export const DOCUMENT_DOI_URL = `https://doi.org/${DOCUMENT_DOI}`;
export const DOCUMENT_AUTHOR = "Grup de Treball Catalunya 2022";

/** Must match the Zenodo record (ca) and the llms.txt titles. */
export const DOCUMENT_TITLE: Trilingual = {
  ca: "Catalunya 2022 - RESET: Crida per reactivar el país",
  en: "Catalunya 2022 - RESET: Call to reactivate Catalonia",
  es: "Catalunya 2022 - RESET: Llamamiento para reactivar el país",
};

export const citeLabel: Trilingual = {
  ca: "Com citar",
  en: "How to cite",
  es: "Cómo citar",
};

export const copyCitationLabel: Trilingual = {
  ca: "Copiar la citació",
  en: "Copy citation",
  es: "Copiar la cita",
};

export const citeDescription: Trilingual = {
  ca: "Referència amb URL i DOI permanent",
  en: "Reference with URL and permanent DOI",
  es: "Referencia con URL y DOI permanente",
};

export const citeSectionLabel: Trilingual = {
  ca: "Referència",
  en: "Reference",
  es: "Referencia",
};

export const citeSectionTitle: Trilingual = {
  ca: "Com citar",
  en: "How to cite",
  es: "Cómo citar",
};

export const citeSectionDescription: Trilingual = {
  ca: "Referència recomanada per citar el document en treballs acadèmics, articles i mitjans. El DOI enllaça amb l'arxiu permanent a Zenodo.",
  en: "Recommended reference for citing the document in academic work, articles, and media. The DOI links to the permanent archive on Zenodo.",
  es: "Referencia recomendada para citar el documento en trabajos académicos, artículos y medios. El DOI enlaza con el archivo permanente en Zenodo.",
};

/** License sentence split around the linked license name: prefix [Creative Commons BY 4.0] suffix */
export const licenseNoticePrefix: Trilingual = {
  ca: "Contingut publicat sota llicència",
  en: "Content published under the",
  es: "Contenido publicado bajo licencia",
};

export const licenseNoticeSuffix: Trilingual = {
  ca: "- reutilització lliure amb atribució.",
  en: "license - free reuse with attribution.",
  es: "- reutilización libre con atribución.",
};

/** Three lines: author / title / URL · DOI. */
export function buildCitationText(url: string, locale: Locale): string {
  return `${DOCUMENT_AUTHOR}.\n${DOCUMENT_TITLE[locale]}.\n${url} · DOI: ${DOCUMENT_DOI_URL}`;
}
