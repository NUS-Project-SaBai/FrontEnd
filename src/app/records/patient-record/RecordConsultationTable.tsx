'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { DiagnosesTable } from '@/components/records/DiagnosesTable';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { Consult } from '@/types/Consult';
import { Diagnosis } from '@/types/Diagnosis';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { RecordConsultationTableRow } from './RecordConsultationTableRow';

export function RecordConsultationTable({ consults }: { consults: Consult[] }) {
  const [consult, setConsult] = useState<Consult | null>(null);

  // TODO: refactor api call such that diagnosis is part of the consult
  const [diagnosisArray, setDiagnosisArray] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (consult == null) return;
    getDiagnosisByConsult(consult.id).then(setDiagnosisArray);
  }, [consult]);

  return (
    <>
      <ReactModal isOpen={consult != null} ariaHideApp={false}>
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
                label="Remarks"
                content={consult.remarks || 'NIL'}
              />
              {/* TODO: Implement the diagnoses and prescription table */}
              <div className="py-2">
                <p className="font-bold">Diagnoses</p>
                <DiagnosesTable diagnoses={diagnosisArray} />
              </div>
              <div className="py-2">
                <p className="font-bold">Prescriptions</p>
              </div>
            </div>
            <Button
              onClick={() => setConsult(null)}
              text="Close"
              colour="red"
            />
          </>
        )}
      </ReactModal>

      <table className="w-full rounded border border-gray-300 shadow">
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
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
