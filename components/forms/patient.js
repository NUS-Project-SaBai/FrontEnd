import React from "react";

class VitalsForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { handleInputChange, formDetails, patient } = this.props;
    return (
      <div>
        <label className="label">Vitals</label>
        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Height (Decimal eg. 160.5)</label>
            <div className="control">
              <input
                name="height"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.height}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Weight (Decimal eg. 60.2)</label>
            <div className="control">
              <input
                name="weight"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.weight}
              />
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Systolic (Number eg. 10)</label>
            <div className="control">
              <input
                name="systolic"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.systolic}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Diastolic (Number eg. 10)</label>
            <div className="control">
              <input
                name="diastolic"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.diastolic}
              />
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Temperature (Decimal eg. 36.5)</label>
            <div className="control">
              <input
                name="temperature"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.temperature}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Heart Rate (Number eg. 120)</label>
            <div className="control">
              <input
                name="heart_rate"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.heart_rate}
              />
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Left Eye (Fraction eg. 6/6)</label>
            <div className="control">
              <input
                name="left_eye_degree"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.left_eye_degree}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Right Eye (Fraction eg. 6/12)</label>
            <div className="control">
              <input
                name="right_eye_degree"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.right_eye_degree}
              />
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Left Eye Pinhole (Fraction eg. 6/6)</label>
            <div className="control">
              <input
                name="left_eye_pinhole"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.left_eye_pinhole}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">
              Right Eye Pinhole (Fraction eg. 6/12)
            </label>
            <div className="control">
              <input
                name="right_eye_pinhole"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.right_eye_pinhole}
              />
            </div>
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

        <label className="label">STAT Investigations</label>
        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Urine Dip Test (Text eg. Anyth)</label>
            <div className="control">
              <input
                name="urine_test"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.urine_test}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Hemocue Hb Count (Decimal eg. 13.2)</label>
            <div className="control">
              <input
                name="hemocue_count"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.hemocue_count}
              />
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">
              Capillary Blood Glucose (Decimal eg. 13.2)
            </label>
            <div className="control">
              <input
                name="blood_glucose"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.blood_glucose}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Others (Text eg. Anyth)</label>
            <div className="control">
              <input
                name="others"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.others}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class MedicalForm extends React.Component {
  constructor() {
    super();
    this.state = {
      showWomenClinicDetails: false,
    };
  }

  handleCheckboxChange = (event) => {
    const { checked } = event.target;
    this.setState({ showWomenClinicDetails: checked });
  };

  handleCheckboxAndInputChange = (event) => {
    this.handleCheckboxChange(event);
    handleInputChange(event);
  };

  handleClick = (e) => {
    let { formDetails, updateFormDetails } = this.props;

    updateFormDetails([...formDetails.diagnoses, { details: "", type: "" }]);
  };

  handleDelete = (index) => {
    let { formDetails, updateFormDetails } = this.props;

    updateFormDetails([...formDetails.diagnoses].filter((_, i) => i != index));
  };

  handleDiagnosisChange = (e, index) => {
    let { updateFormDetails, formDetails } = this.props;

    const newDiagnoses = formDetails.diagnoses.map((diagnosis, i) => {
      if (index !== i) return diagnosis;
      return { ...diagnosis, [e.target.name]: e.target.value };
    });
    updateFormDetails(newDiagnoses);
  };

  diagnosisToAdd() {
    let { formDetails } = this.props;

    return formDetails.diagnoses.map((diagnosis, index) => {
      return (
        <div className="field" key={index}>
          <label className="label">Diagnosis {index + 1}</label>
          <div className="control">
            <textarea
              name="details"
              placeholder="Type your notes here..."
              className="textarea"
              onChange={(e) => this.handleDiagnosisChange(e, index)}
              value={diagnosis.details}
            />
          </div>
          <div className="select">
            <select
              name="type"
              onChange={(e) => this.handleDiagnosisChange(e, index)}
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
            onClick={() => this.handleDelete(index)}
          >
            Delete Assessment
          </button>
        </div>
      );
    });
  }

  render() {
    let { handleInputChange, formDetails } = this.props;
    const { showWomenClinicDetails } = this.state;
    //console.log(formDetails);
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

        {this.diagnosisToAdd()}

        <button className="button is-dark" onClick={(e) => this.handleClick(e)}>
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
}

class PrescriptionForm extends React.Component {
  constructor() {
    super();
  }

  calculateMedicineCurrentStock(medicine) {
    let { medications } = this.props;

    let medication = medications.filter((med) => {
      return medicine == med.pk;
    });

    if (medication.length > 0) return medication[0].fields.quantity;
    return 0;
  }

  calculateMedicineReservedStock(medicine) {
    let { reservedMedications } = this.props;

    if (typeof reservedMedications[medicine] === "undefined") return 0;
    else return reservedMedications[medicine];
  }

  render() {
    let {
      allergies,
      handleInputChange,
      formDetails,
      medicationOptions,
      onSubmit,
      isEditing,
    } = this.props;
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
            <h2>{this.calculateMedicineCurrentStock(formDetails.medicine)}</h2>
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
}

export { VitalsForm, MedicalForm, PrescriptionForm };
