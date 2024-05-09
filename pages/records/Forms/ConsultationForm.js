import React from "react";
import { InputBox, Button } from "@/components/TextComponents";

function ConsultationForm({
  handleInputChange,
  formDetails,
  updateFormDetails,
}) {
  function handleClick(e) {
    //Update form details resulting in rendering of page
    updateFormDetails([...formDetails.diagnoses, { details: "", type: "" }]);
  }

  function handleDelete(index) {
    //Delete diagnosis
    updateFormDetails([...formDetails.diagnoses].filter((_, i) => i != index));
  }

  function handleDiagnosisChange(e, index) {
    //used to update diagnosis inputs
    const newDiagnoses = formDetails.diagnoses.map((diagnosis, i) => {
      return index !== i
        ? diagnosis
        : { ...diagnosis, [e.target.name]: e.target.value };
    });
    updateFormDetails(newDiagnoses);
  }

  function diagnosisToAdd() {
    const diagnosisOptions = [
      "Cardiovascular",
      "Dermatology",
      "Ear Nose Throat",
      "Endocrine",
      "Eye",
      "Gastrointestinal",
      "Haematology",
      "Infectious Diseases",
      "Renal & Genitourinary",
      "Respiratory",
      "Musculoskeletal",
      "Neurology",
      "Obstetrics & Gynaecology",
      "Oral Health",
      "Others",
    ];
    //Generate textfields for diagnosis
    const renderDiagnosis = (diagnosis, index) => (
      <div key={index} className="space-y-2 mb-2">
        <InputBox
          key="details"
          name="details"
          label={`Diagnosis ${index + 1}`}
          type="text"
          value={formDetails.details}
          onChange={(e) => handleDiagnosisChange(e, index)}
          placeholder="Type your notes here..."
        />

        <select
          className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-4 ${
            diagnosis.category === "Please select..." ? "bg-red-100" : ""
          }`}
          name="type"
          onChange={(e) => handleDiagnosisChange(e, index)}
          value={diagnosis.category}
        >
          <option>Please select...</option>
          {diagnosisOptions.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>

        <Button
          colour="red"
          text="Delete Assessment"
          onClick={() => handleDelete(index)}
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
        onClick={(e) => handleClick(e)}
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

      <label className="label">* Referred for (within clinic)</label>
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

export default ConsultationForm;
