import React, { useEffect, useState } from 'react';
import { Button, InputBox } from '@/components/TextComponents/';
import { PrescriptionsTable } from './PrescriptionsTable';
import toast from 'react-hot-toast';
import axiosInstance from '@/pages/api/_axiosInstance';

export function ConsultationEdit({ content: consult, onRequestClose }) {
  const [diagnosisArray, setDiagnosisArray] = useState([]);
  const [consultDetails, setConsultDetails] = useState({ ...consult });

  const diagnosisOptions = [
    'Cardiovascular',
    'Dermatology',
    'Ear Nose Throat',
    'Endocrine',
    'Eye',
    'Gastrointestinal',
    'Haematology',
    'Infectious Diseases',
    'Renal & Genitourinary',
    'Respiratory',
    'Musculoskeletal',
    'Neurology',
    'Obstetrics & Gynaecology',
    'Oral Health',
    'Others',
  ];

  useEffect(() => {
    fetchDiagnosis();
  }, []);

  const handleConsult = event => {
    const { name, value } = event.target;
    setConsultDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDiagnosis = (id, field, value) => {
    setDiagnosisArray(prevDiagnosisArray =>
      prevDiagnosisArray.map(diagnosis =>
        diagnosis.id === id ? { ...diagnosis, [field]: value } : diagnosis
      )
    );
  };

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
    return <PrescriptionsTable content={prescriptions} />;
  };

  const diagnosisRows = diagnosisArray.map(diagnosis => {
    return (
      <tr key={diagnosis.id}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          <select
            name="type"
            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={diagnosis.category}
            onChange={e =>
              handleDiagnosis(diagnosis.id, 'category', e.target.value)
            }
          >
            {diagnosisOptions.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <input
            name="text"
            type="text"
            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={diagnosis.details}
            onChange={e =>
              handleDiagnosis(diagnosis.id, 'details', e.target.value)
            }
          />
        </td>
      </tr>
    );
  });

  if (!consult) {
    return <h2>No Consultation</h2>;
  }

  const submitConsultChanges = async () => {
    consultDetails['visit'] = consultDetails.visit.id;
    consultDetails['doctor'] = consultDetails.doctor.id;

    console.dir(diagnosisArray);

    try {
      const combinedPayload = {
        consult: consultDetails,
        diagnoses: diagnosisArray,
      };

      await axiosInstance.patch(
        `/consults/${consultDetails.id}`,
        combinedPayload
      );

      toast.success('Consultation details updated successfully');
    } catch (error) {
      toast.error('Failed to update consultation details');
      console.error('Error updating consultation details:', error);
    }
    onRequestClose();
  };

  const prescriptions = consult.prescriptions;

  return (
    <div className="grid gap-y-2">
      <label className="text-3xl font-bold text-center text-sky-800 mb-2">
        Consultation Details
      </label>
      {/* Abit hesistant to allow change of doctor, since that might mess up backend users */}
      {/* <InputBox
        name={'doctor'}
        label={'Consultation done by'}
        onChange={handleConsult}
        value={consultDetails.doctor?.nickname}
      /> */}

      <InputBox
        name={'past_medical_history'}
        label={'Past Medical History'}
        onChange={handleConsult}
        value={consultDetails.past_medical_history}
      />

      <InputBox
        name={'consultation'}
        label={'Consultation'}
        onChange={handleConsult}
        value={consultDetails.consultation}
      />
      <InputBox
        name={'plan'}
        label={'Plan'}
        onChange={handleConsult}
        value={consultDetails.plan}
      />

      <label className="block text-sm font-medium text-gray-900 mt-4">
        Referred for (within clinic)
      </label>
      <select
        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        name="referred_for"
        onChange={handleConsult}
        value={consultDetails.referred_for}
      >
        <option>Please select....</option>
        <option value="Diagnostic">Diagnostic</option>
        <option value="Acute">Acute</option>
        <option value="Chronic">Chronic</option>
      </select>

      <InputBox
        name={'referral_notes'}
        label={'Referred Notes'}
        onChange={handleConsult}
        value={consultDetails.referral_notes}
      />

      <InputBox
        name={'remarks'}
        label={'Remarks'}
        onChange={handleConsult}
        value={consultDetails.remarks}
      />

      <div>
        <label className="text-base font-semibold leading-6 text-gray-900">
          Diagnoses
        </label>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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

      <div className="flex justify-center my-4">
        <Button
          text={'Save Changes'}
          onClick={() => submitConsultChanges()}
          colour="green"
        />
      </div>
      <hr />
    </div>
  );
}
