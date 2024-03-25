import React, { useState } from "react";
import { InputField } from "../textContainers/InputField";
import { InputBox } from "../textContainers/InputBox";
import { DisplayField } from "../textContainers/DispayField";
import { Button } from "../textContainers/Button";
function VitalsForm({ handleInputChange, formDetails, patient }) {
  const vitalFields = [
    {
      name: "height",
      label: "Height (Decimal eg. 160.5)",
      value: formDetails.height,
      type: "number",
    },
    {
      name: "weight",
      label: "Weight (Decimal eg. 60.2)",
      value: formDetails.weight,
      type: "number",
    },
    {
      name: "systolic",
      label: "Systolic (Number eg. 10)",
      value: formDetails.systolic,
      type: "number",
    },
    {
      name: "diastolic",
      label: "Diastolic (Number eg. 10)",
      value: formDetails.diastolic,
      type: "number",
    },
    {
      name: "temperature",
      label: "Temperature (Decimal eg. 36.5)",
      value: formDetails.temperature,
      type: "number",
    },
    {
      name: "heart_rate",
      label: "Heart Rate (Number eg. 120)",
      value: formDetails.heart_rate,
      type: "number",
    },
    {
      name: "left_eye_degree",
      label: "Left Eye (Fraction eg. 6/6)",
      value: formDetails.left_eye_degree,
      type: "text",
    },
    {
      name: "right_eye_degree",
      label: "Right Eye (Fraction eg. 6/12)",
      value: formDetails.right_eye_degree,
      type: "text",
    },
    {
      name: "left_eye_pinhole",
      label: "Left Eye Pinhole (Fraction eg. 6/6)",
      value: formDetails.left_eye_pinhole,
      type: "text",
    },
    {
      name: "right_eye_pinhole",
      label: "Right Eye Pinhole (Fraction eg. 6/12)",
      value: formDetails.right_eye_pinhole,
      type: "text",
    },
    // Add more fields as needed
  ];

  const statFields = [
    {
      name: "urine_test",
      label: "Urine Dip Test (Text eg. Anyth)",
      value: formDetails.urine_test,
      type: "text",
    },
    {
      name: "hemocue_count",
      label: "Hemocue Hb Count (Number)",
      value: formDetails.hemocue_count,
      type: "number",
    },
    {
      name: "blood_glucose",
      label: "Capillary Blood Glucose (Decimal eg. 13.2)",
      value: formDetails.blood_glucose,
      type: "number",
    },
    {
      name: "others",
      label: "Others (Text eg. Anyth)",
      value: formDetails.others,
      type: "text",
    },
  ];

  return (
    <form>
      <div>
        <label className="label">Vitals</label>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <div>
          <label className="label">STAT Investigations</label>
        </div>
        <div>
          <div className="grid gap-6 md:grid-cols-2">
            {statFields.map((field) => (
              <InputField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={field.value}
                onChange={handleInputChange}
              />
            ))}
            {patient.fields.date_of_birth &&
              Math.abs(
                new Date(
                  Date.now() - new Date(patient.fields.date_of_birth),
                ).getUTCFullYear() - 1970,
              ) >= 40 && (
                <div className="field is-grouped">
                  <div className="control is-expanded">
                    <label className="label"> Diabetes?</label>

                    <select
                      className="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 mt-4"
                      name="diabetes_mellitus"
                      onChange={handleInputChange}
                    >
                      <option>Please Select...</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </form>
  );
}

function MedicalForm({ handleInputChange, formDetails, updateFormDetails }) {
  const [showWomenClinicDetails, setShowWomenClinicDetails] = useState(false); //Not sure what this does yet

  function handleCheckboxChange(e) {
    const { checked } = e.target;
    setShowWomenClinicDetails(checked);
  }

  function handleCheckboxAndInputChange(e) {
    handleCheckboxChange(e);
    handleInputChange(e);
  }

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
            diagnosis.type === "Please select..." ? "bg-red-100" : ""
          }`}
          name="type"
          onChange={(e) => handleDiagnosisChange(e, index)}
          value={diagnosis.type}
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
        key="problems"
        name="problems"
        label="Past Medical History"
        type="text"
        value={formDetails.problems}
        onChange={handleInputChange}
        placeholder="Type your problems here..."
      />
      <InputBox
        key="diagnosis"
        name="diagnosis"
        label="Consultation"
        type="text"
        value={formDetails.diagnosis}
        onChange={handleInputChange}
        placeholder="Type your diagnosis here..."
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
        key="addendum"
        name="addendum"
        label="Plan"
        type="text"
        value={formDetails.addendum}
        onChange={handleInputChange}
        placeholder="Type your plan here..."
      />

      <hr className="mt-2" />

      <label className="label">* Referred for (within clinic)</label>
      <select
        className="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-4  "
        name="type"
        onChange={handleInputChange}
        value={formDetails.type}
      >
        <option>Please select....</option>
        <option value="Diagnostic">Diagnostic</option>
        <option value="Acute">Acute</option>
        <option value="Chronic">Chronic</option>
      </select>

      <InputBox
        key="referred_notes"
        name="referred_notes"
        label="Referral Notes"
        type="text"
        value={formDetails.referred_notes}
        onChange={handleInputChange}
        placeholder="Type your referral notes here..."
      />
    </div>
  );
}

function PrescriptionForm({
  allergies,
  handleInputChange,
  formDetails,
  medicationOptions,
  onSubmit,
  isEditing,
  medications,
  reservedMedications,
}) {
  function calculateMedicineCurrentStock(medicine) {
    const medication = medications.filter((med) => {
      return medicine == med.pk;
    });

    if (medication.length > 0) return medication[0].fields.quantity;
    return 0;
  }

  function calculateMedicineReservedStock(medicine) {
    if (typeof reservedMedications[medicine] === "undefined") return 0;
    else return reservedMedications[medicine];
  }

  return (
    <div className="column is-12">
      <h1 className="text-black text-2xl font-bold mb-4">Prescription</h1>

      <DisplayField
        label="Allergies"
        content={<h2 className="text-red-600">{allergies}</h2>}
      />

      <div className="field mb-6">
        <label className="label">Medicine</label>
        <div className="relative">
          <select
            name={"medication"}
            onChange={handleInputChange}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
          >
            <option value={"0 Dummy"}>-</option>
            {medicationOptions}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 13.707a1 1 0 01-1.414-1.414L9.586 12 7.293 9.707a1 1 0 111.414-1.414L11 10.586l2.293-2.293a1 1 0 111.414 1.414L12.414 12l2.293 2.293a1 1 0 010 1.414 1 1 0 01-1.414 0L11 13.414l-2.293 2.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex mb-6">
        <div className="w-1/2 pr-2">
          <DisplayField
            label="In Stock"
            content={calculateMedicineCurrentStock(formDetails.medicine)}
          />
        </div>
        <div className="w-1/2 pl-2">
          <InputField
            label="Quantity to be ordered"
            onChange={handleInputChange}
            value={formDetails.quantity}
            type="number"
            name="quantity"
          />
        </div>
      </div>

      <InputBox
        label="Dosage Instructions"
        name="notes"
        placeholder="Dosage Instruction"
        onChange={handleInputChange}
        value={formDetails.notes}
      />

      <Button
        colour="green"
        text={isEditing ? "Edit" : "Add"}
        onClick={onSubmit}
      />
    </div>
  );
}

export { VitalsForm, MedicalForm, PrescriptionForm };
