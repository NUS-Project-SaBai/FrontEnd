export type Vision = {
  id?: number;
  visit?: number;
  // diagnosed degree
  left_eye_degree?: string;
  right_eye_degree?: string;
  // pinhole degree
  left_eye_pinhole?: string;
  right_eye_pinhole?: string;
  // for prescribed degree
  left_eye_glasses_degree: string;
  right_eye_glasses_degree: string;
  // for prescribed astigmatism degree (if used)
  left_eye_glasses_astigmatism_degree?: string;
  right_eye_glasses_astigmatism_degree?: string;
};

export function visionFromJson(jsonObj: object): Vision | null {
  return jsonObj as Vision;
}

export const EMPTY_VISION: Vision = {
  id: undefined,
  visit: undefined,
  left_eye_degree: '',
  right_eye_degree: '',
  left_eye_pinhole: '',
  right_eye_pinhole: '',
  left_eye_glasses_degree: '',
  right_eye_glasses_degree: '',
  left_eye_glasses_astigmatism_degree: '',
  right_eye_glasses_astigmatism_degree: '',
};
