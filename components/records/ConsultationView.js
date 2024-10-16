import React, { useEffect, useState } from 'react';
import { DisplayField } from '@/components/TextComponents/';
import { PrescriptionsTable } from './PrescriptionsTable';
import axiosInstance from '@/pages/api/_axiosInstance';

export function ConsultationView({ consult }) {
  const [diagnosisArray, setDiagnosisArray] = useState([]);

  useEffect(() => {
    fetchDiagnosis();
  }, []);

  async function fetchDiagnosis() {
    try {
      const response = await axiosInstance.get(
        `/diagnosis?consult=${consult.id}`
      );

      const { data: diagnosis } = response;
      setDiagnosisArray(diagnosis);
    } catch (error) {
      console.error('Error fetching diagnosis:', error);
    }
  }

  const renderPrescriptions = prescriptions => {
    return <PrescriptionsTable prescriptions={prescriptions} />;
  };

  const diagnosisRows = diagnosisArray.map(diagnosis => {
    return (
      <tr key={diagnosis.id}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {diagnosis.category}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {diagnosis.details}
        </td>
      </tr>
    );
  });

  if (!consult) {
    return <h2>No Consultation</h2>;
  }

  const prescriptions = consult.prescriptions;
  return (
    <div className="grid gap-y-2">
      <label className="text-3xl font-bold text-center text-sky-800 mb-2">
        Consultation Details
      </label>
      <DisplayField
        key={'doctor'}
        label={'Consultation done by'}
        content={consult.doctor.nickname}
      />

      <DisplayField
        key={'past_medical_history'}
        label={'Past Medical History'}
        content={consult.past_medical_history}
      />

      <DisplayField
        key={'consultation'}
        label={'Consultation'}
        content={consult.consultation}
      />

      <DisplayField key={'plan'} label={'Plan'} content={consult.plan} />

      <DisplayField
        key={'referred_for'}
        label={'Referred For'}
        content={consult.referred_for}
      />

      <DisplayField
        key={'referred_notes'}
        label={'Referred Notes'}
        content={consult.referral_notes}
      />

      <DisplayField
        key={'remarks'}
        label={'Remarks'}
        content={consult.remarks}
      />

      <div>
        <label className="text-base font-semibold leading-6 text-gray-900">
          Diagnoses
        </label>
        <div className="mt-4 flow-root">
          <div className="-mx-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {diagnosisRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {prescriptions.length > 0 ? (
        renderPrescriptions(prescriptions)
      ) : (
        <h2>No Prescriptions</h2>
      )}

      <hr />
    </div>
  );
}
