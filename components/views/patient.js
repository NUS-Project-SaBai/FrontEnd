import React from "react";
import { DisplayField } from "../textContainers/DispayField";

function PatientView({ content }) {
  const calculate_age = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference);

    return Math.abs(age.getUTCFullYear() - 1970);
  };
  const fieldsArray = [
    { label: "IC Number", key: "local_name" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "date_of_birth", calculate: calculate_age },
    { label: "Date of Birth", key: "date_of_birth" },
    { label: "Allergies", key: "drug_allergy" },
  ];
  return fieldsArray.map((field, index) => (
    <div className="grid-cols-1">
      <DisplayField
        key={index}
        label={field.label}
        content={
          field.calculate
            ? field.calculate(content.fields[field.key])
            : content.fields[field.key]
        }
      />
    </div>
  ));
}

export { PatientView };
