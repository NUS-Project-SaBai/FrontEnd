import { DisplayField } from "@/components/textContainers/DispayField";
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
          <tr className="bg-sky-200">
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>{prescriptionRows}</tbody>
      </table>
    );
  };

  const renderMedicalConsultation = (consult) => {
    return (
      <div>
        <DisplayField
          key={"problems"}
          label={"Problems"}
          content={consult.problems}
        />
        <DisplayField
          key={"diagnosis"}
          label={"Diagnosis"}
          content={consult.diagnosis}
        />
        <DisplayField key={"notes"} label={"Notes"} content={consult.notes} />
      </div>
    );
  };

  const type = content.type;
  const prescriptions = content.prescriptions;

  return (
    <div className="grid gap-y-2">
      <label className="text-3xl font-bold text-center text-sky-800 mb-2">
        Consultation Details
      </label>
      <DisplayField
        key={"doctor"}
        label={"Done by"}
        content={content.doctor?.username}
      />

      {type === "medical" ? renderMedicalConsultation(content) : null}

      <DisplayField
        key={"referrals"}
        label={"Referrals"}
        content={content.referrals}
      />

      <DisplayField
        key={"problems"}
        label={"Past Medical History"}
        content={content.problems}
      />

      <DisplayField
        key={"diagnosis"}
        label={"Consultation"}
        content={content.diagnosis}
      />

      <DisplayField key={"notes"} label={"Diagnosis"} content={content.notes} />

      <DisplayField
        key={"addendum"}
        label={"Plan"}
        content={content.addendum}
      />

      <label className="label">Prescriptions</label>
      {prescriptions?.length > 0 ? (
        renderPrescriptions(prescriptions)
      ) : (
        <h2>None Prescibed</h2>
      )}

      <hr />
    </div>
  );
}
