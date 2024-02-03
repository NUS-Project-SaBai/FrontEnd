import React from "react";

export function ConsultationsView({ content }) {
  const renderPrescriptions = (prescriptions) => {
    const prescriptionRows = prescriptions.map((prescription) => {
      const name = prescription?.medicine?.medicine_name;
      const quantity = prescription.quantity;
      const notes = prescription.notes;

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

  const type = content.type;
  const prescriptions = content.prescriptions;

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
