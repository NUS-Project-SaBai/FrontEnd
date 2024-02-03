import React from "react";

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

export { PatientView };
