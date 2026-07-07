import type { Trilingual } from "@/i18n/routing";
import type { GoalId, SphereId } from "@/lib/data/constants";

export const SPHERE_SUMMARIES: Record<SphereId, Trilingual> = {
  1: {
    ca: "Societat Justa",
    en: "Fair Society",
    es: "Sociedad Justa",
  },
  2: {
    ca: "Economia",
    en: "Economy",
    es: "Economía",
  },
  3: {
    ca: "Sector Públic",
    en: "Public Sector",
    es: "Sector Público",
  },
};

export const GOAL_SUMMARIES: Record<GoalId, Trilingual> = {
  1: {
    ca: "Cultura i Participació",
    en: "Culture & Participation",
    es: "Cultura y Participación",
  },
  2: {
    ca: "Transformació Educativa",
    en: "Education Transformation",
    es: "Transformación Educativa",
  },
  3: {
    ca: "Atenció i Cura",
    en: "Lifelong Care & Support",
    es: "Atención y Cuidado",
  },
  4: {
    ca: "Habitatge Assequible",
    en: "Affordable Housing",
    es: "Vivienda Asequible",
  },
  5: {
    ca: "Innovació en Sectors",
    en: "Innovation in Sectors",
    es: "Innovación en Sectores",
  },
  6: {
    ca: "Alimentació i Energia",
    en: "Food & Energy Sovereignty",
    es: "Alimentación y Energía",
  },
  7: {
    ca: "Coneixement i Explotació",
    en: "Knowledge & Exploitation",
    es: "Conocimiento y Explotación",
  },
  8: {
    ca: "Ciència i Dades",
    en: "Science & Data",
    es: "Ciencia y Datos",
  },
  9: {
    ca: "Talent Sector Públic",
    en: "Public Sector Talent",
    es: "Talento Sector Público",
  },
  10: {
    ca: "Valor Públic",
    en: "Public Value & Participation",
    es: "Valor Público",
  },
  11: {
    ca: "Coordinació Territorial",
    en: "Regional Coordination",
    es: "Coordinación Territorial",
  },
  12: {
    ca: "Catalunya Digital",
    en: "Digital Catalonia",
    es: "Cataluña Digital",
  },
};
