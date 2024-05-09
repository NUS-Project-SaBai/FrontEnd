import { DisplayField } from "@/components/textContainers/DisplayField";
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
        label={"Consultation done by"}
        content={content.doctor?.username}
      />

      {type === "medical" ? renderMedicalConsultation(content) : null}

      <DisplayField
        key={"past_medical_history"}
        label={"Past Medical History"}
        content={content.past_medical_history}
      />

      <DisplayField
        key={"consultation"}
        label={"Consultation"}
        content={content.consultation}
      />

      <DisplayField key={"plan"} label={"Plan"} content={content.plan} />

      <DisplayField
        key={"referred_for"}
        label={"Referred For"}
        content={content.referred_for}
      />

      <DisplayField
        key={"referred_notes"}
        label={"Referred Notes"}
        content={content.referral_notes}
      />

      <DisplayField
        key={"remarks"}
        label={"Remarks"}
        content={content.remarks}
      />

      {prescriptions?.length > 0 ? (
        renderPrescriptions(prescriptions)
      ) : (
        <h2>None Prescibed</h2>
      )}

      <hr />
    </div>
  );
}
