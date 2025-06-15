export type Vision = {
  id?: number;
  left_glasses_degree?: string;
  right_glasses_degree?: string;
  visit_id?: number;
};

export function visionFromJson(jsonObj: object): Vision | null {
  return jsonObj as Vision;
}

export const EMPTY_VISION: Vision = {
  id: undefined,
  left_glasses_degree: '',
  right_glasses_degree: '',
  visit_id: undefined,
};
