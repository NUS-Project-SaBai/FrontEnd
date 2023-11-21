import React from "react";

class VitalsForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { handleInputChange, formDetails } = this.props;
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

        {/* <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">Cataract (Text eg. Anyth)</label>
            <div className="control">
              <input
                name="cataracts"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.cataracts}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">Eye Pressure (Text eg. Anyth)</label>
            <div className="control">
              <input
                name="eye_pressure"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.eye_pressure}
              />
            </div>
          </div>
        </div>

        <br></br>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">HIV Positive (Text eg. Positive)</label>
            <div className="control">
              <input
                name="hiv_positive"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.hiv_positive}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">PTB Positive (Text eg. Positive)</label>
            <div className="control">
              <input
                name="ptb_positive"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.ptb_positive}
              />
            </div>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">HEPC Positive (Text eg. Positive)</label>
          <div className="control">
            <input
              name="hepc_positive"
              className="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.hepc_positive}
            />
          </div>
        </div>

        <br></br>

        <label className="label">Psychology Tests</label>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">PHQ-9 (Number(0-27) eg. 7)</label>
            <div className="control">
              <input
                name="phq_9"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.phq_9}
              />
            </div>
          </div>

          <div className="control is-expanded">
            <label className="label">GAD-7 (Number(0-21) eg. 4)</label>
            <div className="control">
              <input
                name="gad_7"
                className="input"
                type="text"
                onChange={handleInputChange}
                value={formDetails.gad_7}
              />
            </div>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">SDQ (Number eg. 34)</label>
          <div className="control">
            <input
              name="sdq"
              className="input"
              type="text"
              onChange={handleInputChange}
              value={formDetails.sdq}
            />
          </div>
        </div> */}

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
            <label className="label">Capillary Blood Glucose (Decimal eg. 13.2)</label>
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

  render() {
    let { handleInputChange, formDetails } = this.props;
    const { showWomenClinicDetails } = this.state;
    //console.log(formDetails);
    return (
      <div>
        {/* <label className="label">Patient Photo Details</label>

        <div className="field">
          <label className="label">Photo URL</label>
          <div className="control">
            <textarea
              name="photo_url"
              className="textarea"
              placeholder="Insert Photo URL here..."
              onChange={handleInputChange}
              value={formDetails.photo_url}
            />
          </div>
        </div> */}

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

        <hr/>
        <label className="label">Assessment</label>

        <div className="field">
          <label className="label">Diagnosis 1</label>
          <div className="control">
            <textarea
              name="diagnosis1"
              placeholder="Type your notes here..."
              className='textarea'
              onChange={handleInputChange}
              value={formDetails.diagnosis1}
            />
          </div>
          <div className='select'>
                <select 
                    name="diagnosisType1"
                    onChange={handleInputChange}
                    value={formDetails.diagnosisType1}
                >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ear Nose Throat">Ear Nose Throat</option>
                    <option value="Endocrine">Endocrine</option>
                    <option value="Eye">Eye</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Haematology">Haematology</option>
                    <option value="Infectious Diseases">Infectious Diseases</option>
                    <option value="Renal & Genitourinary">Renal & Genitourinary</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Musculoskeletal ">Musculoskeletal </option>
                    <option value="Neurology">Neurology</option>
                    <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                    <option value="Oral Health">Oral Health</option>
                    <option value="Others">Others</option>
                </select>
            </div>
        </div>

        <div className="field">
          <label className="label">Diagnosis 2</label>
          <div className="control">
            <textarea
              name="diagnosis2"
              placeholder="Type your notes here..."
              className='textarea'
              onChange={handleInputChange}
              value={formDetails.diagnosis2}
            />
          </div>
          <div className='select'>
                <select 
                    name="diagnosisType2"
                    onChange={handleInputChange}
                    value={formDetails.diagnosisType2}
                >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ear Nose Throat">Ear Nose Throat</option>
                    <option value="Endocrine">Endocrine</option>
                    <option value="Eye">Eye</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Haematology">Haematology</option>
                    <option value="Infectious Diseases">Infectious Diseases</option>
                    <option value="Renal & Genitourinary">Renal & Genitourinary</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Musculoskeletal ">Musculoskeletal </option>
                    <option value="Neurology">Neurology</option>
                    <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                    <option value="Oral Health">Oral Health</option>
                    <option value="Others">Others</option>
                </select>
            </div>
        </div>

        <div className="field">
          <label className="label">Diagnosis 3</label>
          <div className="control">
            <textarea
              name="diagnosis3"
              placeholder="Type your notes here..."
              className='textarea'
              onChange={handleInputChange}
              value={formDetails.diagnosis3}
            />
          </div>
          <div className='select'>
                <select 
                    name="diagnosisType3"
                    onChange={handleInputChange}
                    value={formDetails.diagnosisType3}
                >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ear Nose Throat">Ear Nose Throat</option>
                    <option value="Endocrine">Endocrine</option>
                    <option value="Eye">Eye</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Haematology">Haematology</option>
                    <option value="Infectious Diseases">Infectious Diseases</option>
                    <option value="Renal & Genitourinary">Renal & Genitourinary</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Musculoskeletal ">Musculoskeletal </option>
                    <option value="Neurology">Neurology</option>
                    <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                    <option value="Oral Health">Oral Health</option>
                    <option value="Others">Others</option>
                </select>
            </div>
        </div>

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

        {/* <div className="field">
          <label className="label">
            <input
              name="women_clinic_checkbox"
              type="checkbox"
              checked={showWomenClinicDetails}
              onChange={this.handleCheckboxAndInputChange}
              style={{ marginRight: "10px" }}
              value={formDetails.women_clinic_checkbox}
            />
            Women's Clinic Triage
          </label>
        </div>

        {showWomenClinicDetails && (
          <div className="field">
            <label className="label">Additional Information</label>
            <div className="control">
              <div className="columns">
                <div className="column">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="breast_problem"
                      style={{ marginRight: "10px" }}
                      onChange={handleInputChange}
                      value={formDetails.breast_problem}
                    />
                    Breast Problem
                  </label>
                </div>
                <div className="column">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="genital_area_problem"
                      style={{ marginRight: "10px" }}
                      onChange={handleInputChange}
                      value={formDetails.genital_area_problem}
                    />
                    Genital Area Problem
                  </label>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="menstruation_problem"
                      style={{ marginRight: "10px" }}
                      onChange={handleInputChange}
                      value={formDetails.menstruation_problem}
                    />
                    Menstruation Problem
                  </label>
                </div>
                <div className="column">
                  {/* <label className="checkbox">
                    <input
                      type="checkbox"
                      name="Others"
                      style={{ marginRight: "10px" }}
                    />
                    Others
                  </label> */}
                  {/*<textarea
                    name="others_details"
                    className="textarea"
                    placeholder="Others..."
                    onChange={handleInputChange}
                    value={formDetails.others_details}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <hr /> */}

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
            {/* <input
              name="referred_for"
              className="input"
              type="text"
              placeholder="Type specialty here..."
              onChange={handleInputChange}
              value={formDetails.referred_for}
            /> */}
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
            <label className="label">Currently Reserved</label>
            <h2>{this.calculateMedicineReservedStock(formDetails.medicine)}</h2>
          </div>

          <div className="control is-expanded">
            <label className="label">Quantity to be ordered</label>
            <div className="control">
              <input
                name="quantity"
                className="input"
                type="number"
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
