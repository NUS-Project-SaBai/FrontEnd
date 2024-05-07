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
    { label: "ID Number", key: "identification_number" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "date_of_birth", calculate: calculate_age },
    { label: "Date of Birth", key: "date_of_birth" },
    { label: "Allergies", key: "drug_allergy" },
  ];
  console.log(fieldsArray);
  return fieldsArray.map((field, index) => (
    <div className="grid-cols-1" key={index}>
      <DisplayField
        key={index}
        label={field.label}
        content={
          field.calculate
            ? field.calculate(content[field.key])
            : content[field.key]
        }
      />
    </div>
  ));
}

export { PatientView };
