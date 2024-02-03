import React, { useState } from "react";
import { InputField } from "../views/InputField";

function VitalsForm({ handleInputChange, formDetails, patient }) {
  const vitalFields = [
    {
      name: "height",
      label: "Height (Decimal eg. 160.5)",
      value: formDetails.height,
    },
    {
      name: "weight",
      label: "Weight (Decimal eg. 60.2)",
      value: formDetails.weight,
    },
    {
      name: "systolic",
      label: "Systolic (Number eg. 10)",
      value: formDetails.systolic,
    },
    {
      name: "diastolic",
      label: "Diastolic (Number eg. 10)",
      value: formDetails.diastolic,
    },
    {
      name: "temperature",
      label: "Temperature (Decimal eg. 36.5)",
      value: formDetails.temperature,
    },
    {
      name: "heart_rate",
      label: "Heart Rate (Number eg. 120)",
      value: formDetails.heart_rate,
    },
    {
      name: "left_eye_degree",
      label: "Left Eye (Fraction eg. 6/6)",
      value: formDetails.left_eye_degree,
    },
    {
      name: "right_eye_degree",
      label: "Right Eye (Fraction eg. 6/12)",
      value: formDetails.right_eye_degree,
    },
    {
      name: "left_eye_pinhole",
      label: "Left Eye Pinhole (Fraction eg. 6/6)",
      value: formDetails.left_eye_pinhole,
    },
    {
      name: "right_eye_pinhole",
      label: "Right Eye Pinhole (Fraction eg. 6/12)",
      value: formDetails.right_eye_pinhole,
    },
    // Add more fields as needed
  ];

  const statFields = [
    {
      name: "urine_test",
      label: "Urine Dip Test (Text eg. Anyth)",
      value: formDetails.urine_test,
    },
    {
      name: "hemocue_count",
      label: "Weight (Decimal eg. 60.2)",
      value: formDetails.hemocue_count,
    },
    {
      name: "blood_glucose",
      label: "Capillary Blood Glucose (Decimal eg. 13.2)",
      value: formDetails.blood_glucose,
    },
    {
      name: "others",
      label: "Others (Text eg. Anyth)",
      value: formDetails.others,
    },
  ];

  return (
    <form>
      <div>
        <label className="label">Vitals</label>
      </div>
      <div>
        <div class="grid gap-6 md:grid-cols-2">
          {vitalFields.map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type="number"
              value={field.value}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <div>
          <label className="label">STAT Investigations</label>
        </div>
        <div>
          <div class="grid gap-6 md:grid-cols-2">
            {statFields.map((field) => (
              <InputField
                key={field.name}
                name={field.name}
                label={field.label}
                type="number"
                value={field.value}
                onChange={handleInputChange}
              />
            ))}
          </div>
        </div>

        {patient.fields.date_of_birth &&
          Math.abs(
            new Date(
              Date.now() - new Date(patient.fields.date_of_birth),
            ).getUTCFullYear() - 1970,
          ) >= 40 && (
            <div className="field is-grouped">
              <div className="control is-expanded">
                <label className="label"> Has Diabetes?</label>
                <div className="select">
                  <select name="diabetes_mellitus" onChange={handleInputChange}>
                    <option>Please Select...</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}
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
      if (index !== i) return diagnosis;
      return { ...diagnosis, [e.target.name]: e.target.value };
    });
    updateFormDetails(newDiagnoses);
  }

  function diagnosisToAdd() {
    //Generate textfields for diagnosis
    return formDetails.diagnoses.map((diagnosis, index) => {
      return (
        <div className="field" key={index}>
          <label className="label">Diagnosis {index + 1}</label>
          <div className="control">
            <textarea
              name="details"
              placeholder="Type your notes here..."
              className="textarea"
              onChange={(e) => handleDiagnosisChange(e, index)}
              value={diagnosis.details}
            />
          </div>
          <div className="select">
            <select
              name="type"
              onChange={(e) => handleDiagnosisChange(e, index)}
              value={diagnosis.type}
            >
              <option disabled>Please select....</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Ear Nose Throat">Ear Nose Throat</option>
              <option value="Endocrine">Endocrine</option>
              <option value="Eye">Eye</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
              <option value="Haematology">Haematology</option>
              <option value="Infectious Diseases">Infectious Diseases</option>
              <option value="Renal & Genitourinary">
                Renal & Genitourinary
              </option>
              <option value="Respiratory">Respiratory</option>
              <option value="Musculoskeletal ">Musculoskeletal </option>
              <option value="Neurology">Neurology</option>
              <option value="Obstetrics & Gynaecology">
                Obstetrics & Gynaecology
              </option>
              <option value="Oral Health">Oral Health</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <button
            className="button is-dark"
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={() => handleDelete(index)}
          >
            Delete Assessment
          </button>
        </div>
      );
    });
  }

  return (
    <div>
      <label className="label">Medical Consultation Form</label>

      <div className="field">
        <label className="label">Past Medical History</label>
        <div className="control">
          <textarea
            name="problems"
            className="textarea"
            placeholder="Type your problems here..."
            onChange={handleInputChange}
            value={formDetails.problems}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Consultation</label>
        <div className="control">
          <textarea
            name="diagnosis"
            className="textarea"
            placeholder="Type your diagnosis here..."
            onChange={handleInputChange}
            value={formDetails.diagnosis}
          />
        </div>
      </div>

      <hr />
      <label className="label">Assessment</label>

      {diagnosisToAdd()}

      <button className="button is-dark" onClick={(e) => handleClick(e)}>
        Add New Diagnosis
      </button>

      <hr />

      <div className="field">
        <label className="label">Plan</label>
        <div className="control">
          <textarea
            name="addendum"
            className="textarea"
            placeholder="Type your plan here..."
            onChange={handleInputChange}
            value={formDetails.addendum}
          />
        </div>
      </div>

      <hr />

      <div className="field">
        <label className="label">* Referred for (within clinic)</label>
        <div className="control" style={{ marginBottom: 20 }}>
          <div className="select">
            <select name="referred_for" onChange={handleInputChange}>
              <option>Please select....</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Acute">Acute</option>
              <option value="Chronic">Chronic</option>
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Referral Notes</label>
        <div className="control">
          <textarea
            name="referred_notes"
            className="textarea"
            placeholder="Type your referral notes here..."
            onChange={handleInputChange}
            value={formDetails.referred_notes}
          />
        </div>
      </div>
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
      <h1 style={{ color: "black", fontSize: "1.5em" }}>Prescription</h1>

      <div className="field">
        <label className="label">Allergies</label>
        <h2 style={{ color: "red" }}>{allergies}</h2>
      </div>

      <div className="field">
        <label className="label">Medicine</label>
        <div className="select is-fullwidth">
          <select name={"medication"} onChange={handleInputChange}>
            <option value={"0 Dummy"}>-</option>
            {medicationOptions}
          </select>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">In Stock</label>
          <h2>{calculateMedicineCurrentStock(formDetails.medicine)}</h2>
        </div>

        <div className="control is-expanded">
          <label className="label">Quantity to be ordered</label>
          <div className="control">
            <input
              name="quantity"
              className="input"
              type="number"
              onWheel={(e) => e.target.blur()}
              onChange={handleInputChange}
              value={formDetails.quantity}
            />
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Dosage Instructions</label>
        <div className="control">
          <textarea
            name="notes"
            className="textarea"
            placeholder="Textarea"
            onChange={handleInputChange}
            value={formDetails.notes}
          />
        </div>
      </div>

      <button
        className="button is-dark is-medium level-item"
        style={{ marginTop: 15 }}
        onClick={onSubmit}
      >
        {isEditing ? "Edit" : "Add"}
      </button>
    </div>
  );
}

export { VitalsForm, MedicalForm, PrescriptionForm };
