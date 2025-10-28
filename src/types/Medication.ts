export type Medication = {
  id: number;
  medicine_name: string;
  code: string;
  quantity: number;
  warning_quantity: number | null;
  notes: string;
};
