import { DisplayField } from "@/components/textContainers/DispayField";
import React from "react";
import { VisitPrescriptionsTable } from "../Prescriptions/VisitPrescriptionsTable";

export function ConsultationsView({ content }) {
  const renderPrescriptions = (prescriptions) => {
    return <VisitPrescriptionsTable content={prescriptions} />;
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
