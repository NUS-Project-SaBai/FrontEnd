'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { LoadingUI } from '@/components/LoadingUI';
import { DiagnosesTable } from '@/components/records/consultation/DiagnosesTable';
import { getPdfConsult } from '@/data/consult/getPdfConsult';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { Consult } from '@/types/Consult';
import { Diagnosis } from '@/types/Diagnosis';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { PrescriptionTable } from '../prescription/PrescriptionTable';
import { RecordConsultationTableRow } from './RecordConsultationTableRow';

export function RecordConsultationTable({
  consults,
}: {
  consults: Consult[] | null;
}) {
  const [consult, setConsult] = useState<Consult | null>(null);
  const closeModal = () => setConsult(null);

  // TODO: refactor api call such that diagnosis is part of the consult
  const [diagnosisArray, setDiagnosisArray] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (consult == null) return;
    getDiagnosisByConsult(consult.id).then(setDiagnosisArray);
  }, [consult]);

  if (consults == null) {
    return <LoadingUI message="Loading Consultations..." />;
  } else if (consults.length === 0) {
    return <p>No Consultations Found</p>;
  }

  return (
    <>
      <ReactModal
        isOpen={consult != null}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        {consult == null ? (
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
              <DisplayField
                label="Remarks"
                content={consult.remarks || 'NIL'}
              />
              <div className="py-2">
                <p className="font-bold">Diagnoses</p>
                <DiagnosesTable diagnoses={diagnosisArray} />
              </div>
              <div className="py-2">
                <p className="font-bold">Prescriptions</p>
                <PrescriptionTable
                  prescriptions={consult?.prescriptions || []}
                />
              </div>
            </div>
            <Button onClick={closeModal} text="Close" colour="red" />
          </>
        )}
      </ReactModal>

      <table className="rounded-table text-left">
        <thead className="bg-gray-50">
          <tr>
            <th>Doctor</th>
            <th>Referral Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {consults.map(consult => (
            <RecordConsultationTableRow
              key={consult.id}
              consult={consult}
              openConsultModal={consult => setConsult(consult)}
              onGeneratePDF={() => {
                getPdfConsult(consult.id).then(payload => {
                  if (payload == null) return;
                  const url = URL.createObjectURL(payload);
                  window.open(url, '_blank');
                });
              }}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
