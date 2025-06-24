'use server';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { DiagnosesTable } from '@/components/records/consultation/DiagnosesTable';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { Consult } from '@/types/Consult';
import { Diagnosis } from '@/types/Diagnosis';
import { PrescriptionTable } from '../prescription/PrescriptionTable';

export default async function ConsultationDetails({
  consult,
  onClose,
}: {
  consult: Consult;
  onClose?: () => void;
}) {
  // TODO: refactor api call such that diagnosis is part of the consult
  const diagnosisArray: Diagnosis[] = await getDiagnosisByConsult(consult.id);

  return consult == null ? (
    <p>No Consult Found</p>
  ) : (
    <>
      <div>
        <DisplayField
          label="Consultation done by"
          content={consult.doctor.nickname || ''}
        />
        <DisplayField
          label="Past Medical History"
          content={consult.past_medical_history || 'NIL'}
        />
        <DisplayField
          label="Consultation"
          content={consult.consultation || 'NIL'}
        />
        <DisplayField label="Plan" content={consult.plan} />
        <DisplayField
          label="Referred for"
          content={consult.referred_for || 'NIL'}
        />
        <DisplayField
          label="Referred Notes"
          content={consult.referral_notes || 'NIL'}
        />
        <DisplayField label="Remarks" content={consult.remarks || 'NIL'} />
        <div className="py-2">
          <p className="font-bold">Diagnoses</p>
          <DiagnosesTable diagnoses={diagnosisArray} />
        </div>
        <div className="py-2">
          <p className="font-bold">Prescriptions</p>
          <PrescriptionTable prescriptions={consult?.prescriptions || []} />
        </div>
      </div>
      {onClose && <Button onClick={onClose} text="Close" colour="red" />}
    </>
  );
}
