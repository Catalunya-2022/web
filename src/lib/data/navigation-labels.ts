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
    ca: "Accés a la Cultura",
    en: "Access to Culture",
    es: "Acceso a la Cultura",
  },
  2: {
    ca: "Educació",
    en: "Education",
    es: "Educación",
  },
  3: {
    ca: "Atenció i Cura",
    en: "Lifelong Care",
    es: "Atención y Cuidado",
  },
  4: {
    ca: "Habitatge Digne",
    en: "Affordable Housing",
    es: "Vivienda Digna",
  },
  5: {
    ca: "Innovació Sectorial",
    en: "Innovation in Sectors",
    es: "Innovación",
  },
  6: {
    ca: "Aliments i Energia",
    en: "Food & Energy",
    es: "Alimentos y Energía",
  },
  7: {
    ca: "Coneixement",
    en: "Knowledge",
    es: "Conocimiento",
  },
  8: {
    ca: "Ciència i Dades",
    en: "Science & Data",
    es: "Ciencia y Datos",
  },
  9: {
    ca: "Talent Públic",
    en: "Public Sector Talent",
    es: "Talento Público",
  },
  10: {
    ca: "Valor Públic",
    en: "Public Value",
    es: "Valor Público",
  },
  11: {
    ca: "Equilibri Territorial",
    en: "Regional Coordination",
    es: "Equilibrio Regional",
  },
  12: {
    ca: "Catalunya Digital",
    en: "Digital Catalonia",
    es: "Cataluña Digital",
  },
};
