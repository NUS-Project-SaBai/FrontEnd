'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import { DiagnosesTable } from '@/components/records/consultation/DiagnosesTable';
import { RecordConsultationTableRow } from '@/components/records/consultation/RecordConsultationTableRow';
import { PrescriptionTable } from '@/components/records/prescription/PrescriptionTable';
import { getConsultByID } from '@/data/consult/getConsult';
import { getPdfConsult } from '@/data/consult/getPdfConsult';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Consult } from '@/types/Consult';
import { Diagnosis } from '@/types/Diagnosis';
import { useEffect, useState } from 'react';

export function RecordConsultationTable({
  consults,
}: {
  consults: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[] | null;
}) {
  const [consultId, setConsultId] = useState<number | null>(null);
  const [consult, setConsult] = useState<Consult | null>(null);
  const [diagnosisArray, setDiagnosisArray] = useState<Diagnosis[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);
  const closeModal = () => {
    setConsultId(null);
    setConsult(null);
    setDiagnosisArray([]);
  };

  useEffect(() => {
    if (consultId == null) return;
    withLoading(async () => {
      await Promise.all([
        getConsultByID(consultId.toString()).then(setConsult),
        getDiagnosisByConsult(consultId).then(setDiagnosisArray),
      ]);
    })();
  }, [consultId]);

  if (consults == null) {
    return <LoadingUI message="Loading Consultations..." />;
  } else if (consults.length === 0) {
    return <p>No Consultations Found</p>;
  }

  return (
    <>
      <Modal
        isOpen={consultId != null}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="Consultation"
        text="Close"
      >
        {isLoading ? (
          <LoadingUI message="Loading Consultation..." />
        ) : consult == null ? (
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
                  prescriptions={
                    consult?.prescriptions.map(p => ({
                      consult_id: p.consult,
                      visit_date: p.visit.date,
                      medication: p.medication_review.medicine.medicine_name,
                      quantity: p.medication_review.quantity_changed,
                      notes: p.notes,
                      status: p.medication_review.order_status,
                    })) || []
                  }
                />
              </div>
            </div>
            <Button onClick={closeModal} text="Close" colour="red" />
          </>
        )}
      </Modal>

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
              openConsultModal={setConsultId}
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
