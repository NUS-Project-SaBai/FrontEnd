import React from "react";
import { DisplayField } from "../textContainers/DispayField";

function PatientView({ content }) {
  const fieldsArray = [
    { label: "IC Number", key: "local_name" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "date_of_birth" },
    { label: "Date of Birth", key: "date_of_birth" },
    { label: "Allergies", key: "drug_allergy" },
  ];
  return fieldsArray.map((field, index) => (
    <div className="grid-cols-1">
      <DisplayField
        key={index}
        label={field.label}
        content={content.fields[field.key]}
      />
    </div>
  ));
}

export { PatientView };
