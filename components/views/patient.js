import React from "react";

function ConsultationsTable({ consultRows }) {
  return (
    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          {/* <th>Type</th> */}
          <th>Doctor</th>
          <th>Referred For</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{consultRows}</tbody>
    </table>
  );
}

function ConsultationsView({ content }) {
  const renderPrescriptions = (prescriptions) => {
    let prescriptionRows = prescriptions.map((prescription) => {
      let name = prescription?.medicine?.medicine_name;
      let quantity = prescription.quantity;
      let notes = prescription.notes;

      return (
        <tr key={prescription.id}>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>{notes}</td>
        </tr>
      );
    });

    return (
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>{prescriptionRows}</tbody>
      </table>
    );
  };

  function renderMedicalConsultation(consult) {
    let prescriptions = consult.prescriptions;

    return (
      <div>
        <div className="field">
          <label className="label">Problems</label>
          <article className="message">
            <div className="message-body">{consult.problems}</div>
          </article>
        </div>

        <div className="field">
          <label className="label">Diagnosis</label>
          <article className="message">
            <div className="message-body">{consult.diagnosis}</div>
          </article>
        </div>

        <div className="field">
          <label className="label">Notes</label>
          <article className="message">
            <div className="message-body">{consult.notes}</div>
          </article>
        </div>
      </div>
    );
  }

  if (Object.keys(content).length === 0) return null;

  let type = content.type;
  let prescriptions = content.prescriptions;

  return (
    <div className="column is-12">
      <h1 style={{ color: "black", fontSize: "1.5em" }}>Consultation</h1>
      <div className="field">
        <label className="label">Done by</label>
        <article className="message">
          <div className="message-body">{content.doctor.username}</div>
        </article>
      </div>

      <hr />

      {type === "medical" ? renderMedicalConsultation(content) : null}

      <hr />

      <div className="field">
        <label className="label">Referrals</label>
        <article className="message">
          <div className="message-body" style={{ whiteSpace: "pre-line" }}>
            {content.referrals}
          </div>
        </article>
      </div>

      <hr />

      <div className="field">
        <label className="label">Past Medical History</label>
        <article className="message">
          <div className="message-body">{content.problems}</div>
        </article>
      </div>

      <hr />

      <div className="field">
        <label className="label">Consultation</label>
        <article className="message">
          <div className="message-body">{content.diagnosis}</div>
        </article>
      </div>

      <hr />

      <div className="field">
        <label className="label">Diagnosis</label>
        <article className="message">
          <div className="message-body" style={{ whiteSpace: "pre-line" }}>
            {content.notes}
          </div>
        </article>
      </div>

      <div className="field">
        <label className="label">Plan</label>
        <article className="message">
          <div className="message-body" style={{ whiteSpace: "pre-line" }}>
            {content.addendum}
          </div>
        </article>
      </div>

      <hr />

      <div className="field">
        <label className="label">Prescriptions</label>
        {prescriptions.length > 0 ? (
          renderPrescriptions(prescriptions)
        ) : (
          <h2>None</h2>
        )}
      </div>

      <hr />
    </div>
  );
}

function VitalsView({ content }) {
  console.log("Content:", content);
  return (
    <div className="column is-12">
      <h1 style={{ color: "black", fontSize: "1.5em" }}>Vital Signs</h1>

      <br></br>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Height</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.height}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Weight</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.weight}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Systolic</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.systolic}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Diastolic</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.diastolic}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Temperature</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.temperature}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Heart Rate</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.heart_rate}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Left Eye</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.left_eye_degree}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Right Eye</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.right_eye_degree}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Left Eye Pinhole</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.left_eye_pinhole}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Right Eye Pinhole</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.right_eye_pinhole}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Diabetes Mellitus?</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.diabetes_mellitus}</div>
            </article>
          </div>
        </div>
      </div>

      <hr />

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Urine Dip Test</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.urine_test}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Hemocue Hb Count</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.hemocue_count}</div>
            </article>
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Blood Glucose</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.blood_glucose}</div>
            </article>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Others</label>
          <div className="control">
            <article className="message">
              <div className="message-body">{content.others}</div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitPrescriptionsTable({ content: prescriptions }) {
  let prescriptionRows = prescriptions.map((prescription) => {
    console.log(prescription);
    let name = prescription?.medicine?.medicine_name;
    let quantity = prescription.quantity;
    // let doctor = prescription.doctor

    return (
      <tr key={prescription.id}>
        <td>{name}</td>
        <td>{quantity}</td>
        {/* <td>{doctor}</td> */}
      </tr>
    );
  });

  return (
    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Medicine Name</th>
          <th>Quantity</th>
          {/* <th>Doctor</th> */}
        </tr>
      </thead>
      <tbody>{prescriptionRows}</tbody>
    </table>
  );
}

function PatientView({ content }) {
  return (
    <div className="column is-3">
      <div className="field">
        <label className="label">IC Number</label>
        <article className="message">
          <div className="message-body">{content.fields.local_name}</div>
        </article>
      </div>

      <div className="field">
        <label className="label">Gender</label>
        <article className="message">
          <div className="message-body">{content.fields.gender}</div>
        </article>
      </div>

      <div className="field">
        <label className="label">Age</label>
        <article className="message">
          <div className="message-body">
            {content.fields.date_of_birth
              ? Math.abs(
                  new Date(
                    Date.now() - new Date(content.fields.date_of_birth),
                  ).getUTCFullYear() - 1970,
                )
              : "No DOB"}
          </div>
        </article>
      </div>

      <div className="field">
        <label className="label">Date of Birth</label>
        <article className="message">
          <div className="message-body">{content.fields.date_of_birth}</div>
        </article>
      </div>

      <div className="field">
        <label className="label">Allergies</label>
        <article className="message">
          <div className="message-body">{content.fields.drug_allergy}</div>
        </article>
      </div>
    </div>
  );
}

export {
  ConsultationsTable,
  ConsultationsView,
  VitalsView,
  VisitPrescriptionsTable,
  PatientView,
};
