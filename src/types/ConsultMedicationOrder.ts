export type ConsultMedicationOrder = {
  index: number | undefined; // for internal use in the form only
  medication: string; // <id> <name>
  quantity?: number;
  notes: string;
};
