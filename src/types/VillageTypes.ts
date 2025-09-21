export interface Village {
  id: number;
  village_name: string;
  colour_code: string;
  is_hidden: boolean;
}

// Type alias for village codes used in forms and filters
export type VillageCode = string;
// Constant for "ALL" option in village dropdowns
export const ALL_VILLAGES = 'ALL';
