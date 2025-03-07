import React from 'react';
import { InputBox, Button } from '@/components/TextComponents';

export function ConsultationForm({
  handleInputChange,
  formDetails,
  handleDiagnosis,
}) {
  function handleDiagnosisClick() {
    handleDiagnosis([...formDetails.diagnoses, { details: '', type: '' }]);
  }

  function handleDiagnosisDelete(index) {
    handleDiagnosis([...formDetails.diagnoses].filter((_, i) => i !== index));
  }

  function handleDiagnosisChange(e, index) {
    const newDiagnoses = [...formDetails.diagnoses];
    newDiagnoses[index][e.target.name] = e.target.value;
    handleDiagnosis(newDiagnoses);
  }

  function diagnosisToAdd() {
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

    // Generate textfields for diagnosis
    const renderDiagnosis = (diagnosis, index) => (
      <div key={index} className="space-y-2 mb-2">
        <InputBox
          key="details"
          name="details"
          label={`Diagnosis ${index + 1}`}
          type="text"
          value={diagnosis.details}
          onChange={e => handleDiagnosisChange(e, index)}
          placeholder="Type your notes here..."
        />

        <select
          className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-4 ${
            diagnosis.category === 'Please select...' ? 'bg-red-100' : ''
          }`}
          name="category"
          onChange={e => handleDiagnosisChange(e, index)}
          value={diagnosis.category || 'nil'} // the 'nil' switch is there for a bug where if there are 2 diagnoses, and the first has a selected category and the second doesn't, but you delete the first, the category of the first overrides the empty category of the second: https://github.com/NUS-Project-SaBai/FrontEnd/pull/242
        >
          <option disabled value="nil">
            Please select...
          </option>
          {diagnosisOptions.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>

        <Button
          colour="red"
          text="Delete Diagnosis"
          onClick={() => handleDiagnosisDelete(index)}
        />
      </div>
    );
    return formDetails.diagnoses.map(renderDiagnosis);
  }

  return (
    <div>
      <label className="label">Medical Consultation Form</label>
      <InputBox
        key="past_medical_history"
        name="past_medical_history"
        label="Past Medical History"
        type="text"
        value={formDetails.past_medical_history}
        onChange={handleInputChange}
        placeholder="Type your problems here..."
      />
      <InputBox
        key="consultation"
        name="consultation"
        label="Consultation"
        type="text"
        value={formDetails.consultation}
        onChange={handleInputChange}
        placeholder="Type your consultation here..."
      />

      <label className="block text-sm font-medium text-gray-900 mt-4">
        Assessment
      </label>

      {diagnosisToAdd()}

      <Button
        colour="green"
        text="Add New Diagnosis"
        onClick={e => handleDiagnosisClick(e)}
      />

      <InputBox
        key="plan"
        name="plan"
        label="Plan"
        type="text"
        value={formDetails.plan}
        onChange={handleInputChange}
        placeholder="Type your plan here..."
      />

      <hr className="mt-2" />

      <label className="label">
        Referral for
        <span className="block text-sm text-gray-500">(This is optional)</span>
      </label>
      <select
        className="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-4  "
        name="referred_for"
        onChange={handleInputChange}
        value={formDetails.referred_for}
      >
        <option>Please select....</option>
        <option value="Diagnostic">Diagnostic</option>
        <option value="Acute">Acute</option>
        <option value="Chronic">Chronic</option>
        <option value="AdvancedVision">Advanced Vision [Within clinic]</option>
        <option value="GlassesFitting">Glasses Fitting [Within clinic]</option>
      </select>

      <InputBox
        key="referral_notes"
        name="referral_notes"
        label="Referral Notes"
        type="text"
        value={formDetails.referral_notes}
        onChange={handleInputChange}
        placeholder="Type your referral notes here..."
      />

      <InputBox
        key="remarks"
        name="remarks"
        label="Remarks"
        type="text"
        value={formDetails.remarks}
        onChange={handleInputChange}
        placeholder="Insert remarks here..."
      />
    </div>
  );
}
