import type { Trilingual } from "@/i18n/routing";

export type HeroItem = {
  /** Descriptive text starting with "To..." / "Per..." / "Para..." */
  text: Trilingual;
  /** Display label: "Action 7.3" / "Acció 7.3" / "Acción 7.3" */
  label: Trilingual;
  /** Canonical route path for "Learn more" link */
  slug: string;
};

const heroItems: HeroItem[] = [
  {
    text: { ca: "Per fer un país de ciència i dades.", en: "To build a Catalonia founded on science and data.", es: "Para hacer un país de ciencia y datos." },
    label: { ca: "l'Objectiu 8", en: "Goal 8", es: "el Objetivo 8" },
    slug: "/sphere-2/goal-8",
  },
  {
    text: { ca: "Per fomentar les escoles de segona oportunitat i les escoles d'adults.", en: "To promote adult and second chance schools.", es: "Para fomentar las escuelas de segunda oportunidad y las escuelas de adultos." },
    label: { ca: "l'Acció 2.6", en: "Action 2.6", es: "la Acción 2.6" },
    slug: "/sphere-1/goal-2/action-2-6",
  },
  {
    text: { ca: "Per accelerar la transformació del sistema educatiu.", en: "To speed up the transformation of the education system.", es: "Para acelerar la transformación del sistema educativo." },
    label: { ca: "l'Objectiu 2", en: "Goal 2", es: "el Objetivo 2" },
    slug: "/sphere-1/goal-2",
  },
  {
    text: { ca: "Per incorporar l'educació artística als centres d'aprenentatge.", en: "To incorporate artistic education into learning centres.", es: "Para incorporar la educación artística a los centros de aprendizaje." },
    label: { ca: "l'Acció 1.7", en: "Action 1.7", es: "la Acción 1.7" },
    slug: "/sphere-1/goal-1/action-1-7",
  },
  {
    text: { ca: "Per repensar el Consell Nacional de la Cultura i de les Arts.", en: "To rethink the National Council for Culture and the Arts.", es: "Para repensar el Consejo Nacional de la Cultura y de las Artes." },
    label: { ca: "l'Acció 1.9", en: "Action 1.9", es: "la Acción 1.9" },
    slug: "/sphere-1/goal-1/action-1-9",
  },
  {
    text: { ca: "Per fomentar la formació, captació i retenció de talent.", en: "To foster the training, attraction and retention of talent.", es: "Para fomentar la formación, captación y retención de talento." },
    label: { ca: "l'Acció 7.3", en: "Action 7.3", es: "la Acción 7.3" },
    slug: "/sphere-2/goal-7/action-7-3",
  },
  {
    text: { ca: "Per assolir la sobirania en energia i alimentació.", en: "To achieve food and energy sovereignty.", es: "Para alcanzar la autonomía en energía y alimentación." },
    label: { ca: "l'Objectiu 6", en: "Goal 6", es: "el Objetivo 6" },
    slug: "/sphere-2/goal-6",
  },
  {
    text: { ca: "Per impulsar la col·laboració publicoprivada en l'àmbit de les dades.", en: "To promote public/private cooperation in the sphere of data.", es: "Para impulsar la colaboración público-privada en el ámbito de los datos." },
    label: { ca: "l'Acció 8.3", en: "Action 8.3", es: "la Acción 8.3" },
    slug: "/sphere-2/goal-8/action-8-3",
  },
  {
    text: { ca: "Per pujar el país al núvol.", en: "To move Catalonia to the Cloud.", es: "Para subir el país a la nube." },
    label: { ca: "l'Objectiu 12", en: "Goal 12", es: "el Objetivo 12" },
    slug: "/sphere-3/goal-12",
  },
  {
    text: { ca: "Per aprovar la llei del sector públic digital de Catalunya.", en: "To approve the Act on the Digital Public Sector of Catalonia.", es: "Para aprobar la ley del sector público digital de Cataluña." },
    label: { ca: "l'Acció 12.4", en: "Action 12.4", es: "la Acción 12.4" },
    slug: "/sphere-3/goal-12/action-12-4",
  },
  {
    text: { ca: "Per crear un sistema integral d'atenció i cura de les persones al llarg de la vida.", en: "To create a comprehensive lifelong care and support system for people.", es: "Para crear un sistema integral de atención y cuidado de las personas a lo largo de su vida." },
    label: { ca: "l'Objectiu 3", en: "Goal 3", es: "el Objetivo 3" },
    slug: "/sphere-1/goal-3",
  },
  {
    text: { ca: "Per exigir l'elaboració de polítiques basades en evidència empírica.", en: "To call for the development of empirical evidence-based policies.", es: "Para exigir la elaboración de políticas basadas en la evidencia empírica." },
    label: { ca: "l'Acció 8.1", en: "Action 8.1", es: "la Acción 8.1" },
    slug: "/sphere-2/goal-8/action-8-1",
  },
];

export { heroItems };
