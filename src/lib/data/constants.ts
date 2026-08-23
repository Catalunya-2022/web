export type SphereId = 1 | 2 | 3;
export type GoalId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const SPHERE_GOALS: Record<SphereId, GoalId[]> = {
  1: [1, 2, 3, 4],
  2: [5, 6, 7, 8],
  3: [9, 10, 11, 12],
};

/** Catalunya 2022 was published on June 1, 2021. */
export const DOCUMENT_PUBLICATION_DATE = "2021-06-01";

export const ACTION_COUNTS: Record<GoalId, number> = {
  1: 9,
  2: 6,
  3: 10,
  4: 6,
  5: 12,
  6: 10,
  7: 9,
  8: 4,
  9: 5,
  10: 7,
  11: 8,
  12: 5,
};
