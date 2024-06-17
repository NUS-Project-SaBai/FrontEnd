import React, { useState } from "react";
import ApiComponent from "./apiComponent";

const apiInputArray = [
  // We will be using id = 1000 for testing purposes
  {
    title: "Visits",
    requests: [
      { method: "GET", path: "/visits", key: "getAllVisits" },
      {
        method: "GET",
        path: "/visits?patient=",
        key: "getVisitsByPatient",
        foreignKey: { patientID: 1000 },
      },
      {
        method: "POST",
        path: "/visits",
        key: "postVisit",
        defaultInput: {
          patient: 1000,
          date: new Date().toISOString(),
          status: "",
        },
      },
      {
        method: "PATCH",
        path: "/visits/",
        key: "patchVisit",
        primaryKey: { visitID: 1000 },
        defaultInput: {
          patient: 1000,
          date: new Date().toISOString(),
          status: "Patch successful!",
        },
      },
      {
        method: "DELETE",
        path: "/visits/",
        key: "deleteVisit",
        primaryKey: { visitID: 1000 },
      },
    ],
  },
  {
    title: "Consults",
    requests: [
      {
        method: "GET",
        path: "/consults",
        key: "getAllConsults",
      },
      {
        method: "GET",
        path: "/consults?visit=",
        key: "getConsults",
        foreignKey: { visitID: 1000 },
      },
      {
        method: "POST",
        path: "/consults",
        key: "postConsult",
        defaultInput: {
          visit: 1000,
          date: new Date().toISOString(),
          doctor: 1000,
          past_medical_history: "",
          consultation: "",
          plan: "",
          referred_for: "",
          referral_notes: "",
          remarks: "Post successful!",
        },
      },
      {
        method: "PATCH",
        path: "/consults/",
        key: "patchConsult",
        primaryKey: { consultID: 1000 },
        defaultInput: {
          visit: 1000,
          date: new Date().toISOString(),
          doctor: 1000,
          past_medical_history: "",
          consultation: "",
          plan: "",
          referred_for: "",
          referral_notes: "",
          remarks: "Patch successful!",
        },
      },
      {
        method: "DELETE",
        path: "/consults/",
        key: "deleteConsult",
        primaryKey: { consultID: 1000 },
      },
    ],
  },
  {
    title: "Diagnosis",
    requests: [
      {
        method: "GET",
        path: "/diagnosis",
        key: "getAllDiagnosis",
      },
      {
        method: "GET",
        path: "/diagnosis?consult=",
        key: "getDiagnosis",
        foreignKey: { consultID: 1000 },
      },
      {
        method: "POST",
        path: "/diagnosis",
        key: "postDiagnosis",
        defaultInput: {
          consult: 1000,
          details: "Post successful!",
          category: "",
        },
      },
      {
        method: "PATCH",
        path: "/diagnosis/",
        key: "patchDiagnosis",
        primaryKey: { diagnosisID: 1000 },
        defaultInput: {
          consult: 1000,
          details: "Patch successful!",
          category: "",
        },
      },
      {
        method: "DELETE",
        path: "/diagnosis/",
        key: "deleteDiagnosis",
        primaryKey: { diagnosisID: 1000 },
      },
    ],
  },
  {
    title: "Medications",
    requests: [
      { method: "GET", path: "/medications", key: "getAllMedications" },
      {
        method: "GET",
        path: "/medications/",
        key: "getMedications",
        foreignKey: { visitID: 1000 },
      },
      {
        method: "POST",
        path: "/medications",
        key: "postMedications",
        defaultInput: {
          medicine_name: "",
          quantity: 0,
          notes: "",
          remarks: "Post successful!",
        },
      },
      {
        method: "PATCH",
        path: "/medications/",
        key: "patchMedications",
        primaryKey: { medicationID: 1000 },
        defaultInput: {
          medicine_name: "",
          quantity: 0,
          notes: "",
          remarks: "Patch successful!",
          quantityChange: 50,
        },
      },
      {
        method: "DELETE",
        path: "/medications/",
        key: "deleteMedications",
        primaryKey: { medicationID: 1000 },
      },
    ],
  },
  {
    title: "Orders",
    requests: [
      {
        method: "GET",
        path: "/orders",
        key: "getAllOrders",
      },
      {
        method: "GET",
        path: "/orders?order_status=PENDING",
        key: "getOrderStatus",
      },
      // I dont think this work, need to check what order queries are available
      // {
      //   method: "GET",
      //   path: "/orders?visit=",
      //   key: "getOrdersByVisit",
      //   inputKey: "visitID",
      // },
      {
        method: "POST",
        path: "/orders",
        key: "postOrder",
        defaultInput: {
          medicine: 1000,
          quantity: 0,
          consult: 1000,
          notes: "",
          remarks: "Post successful!",
          order_status: "Pending",
        },
      },
      {
        method: "PATCH",
        path: "/orders/",
        key: "patchOrder",
        primaryKey: { orderID: 1000 },
        defaultInput: {
          medicine: 1000,
          quantity: 0,
          consult: 1000,
          notes: "",
          remarks: "Patch successful!",
          order_status: "Success",
        },
      },
      {
        method: "DELETE",
        path: "/orders/",
        key: "deleteOrder",
        inputKey: "orderID",
        primaryKey: { orderID: 1000 },
      },
    ],
  },
  {
    title: "Patients",
    requests: [
      { method: "GET", path: "/patients", key: "getAllPatients" },
      {
        method: "GET",
        path: "/patients/",
        key: "getPatient",
        foreignKey: { patientID: 1000 },
      },
      {
        method: "POST",
        path: "/patients",
        key: "postPatient",
        defaultInput: {
          village_prefix: "",
          name: "Post successful!",
          identification_number: "",
          contact_no: "",
          gender: "",
          date_of_birth: new Date().toISOString(),
          drug_allergy: "None",
          face_encodings: "",
          picture: "",
        },
      },
      {
        method: "PATCH",
        path: "/patients/",
        key: "patchPatient",
        primaryKey: { patientID: 1000 },
        defaultInput: {
          village_prefix: "",
          name: "Patch successful!",
          identification_number: "",
          contact_no: "",
          gender: "",
          date_of_birth: new Date().toISOString(),
          drug_allergy: "None",
          face_encodings: "",
          picture: "",
        },
      },
      {
        method: "DELETE",
        path: "/patients/",
        key: "deletePatient",
        primaryKey: { patientID: 1000 },
      },
    ],
  },

  {
    title: "Vital Signs",
    requests: [
      {
        method: "GET",
        path: "/vitals",
        key: "getAllVitalSigns",
      },
      {
        method: "GET",
        path: "/vitals?visit=",
        key: "getVitalSigns",
        foreignKey: { visitID: 1000 },
      },
      {
        method: "POST",
        path: "/vitals",
        key: "postVitalSigns",
        defaultInput: {
          visit: 1,
          height: 0,
          weight: 0,
          systolic: 0,
          diastolic: 0,
          temperature: 0,
          diabetes_mellitus: "Haven't Asked / Not Applicable",
          heart_rate: 0,
          urine_test: "",
          hemocue_count: 0,
          blood_glucose: 0,
          left_eye_degree: "",
          right_eye_degree: "",
          left_eye_pinhole: "",
          right_eye_pinhole: "",
          others: "Post Successful!",
        },
      },
      {
        method: "PATCH",
        path: "/vitals/",
        key: "patchVitalSigns",
        primaryKey: { vitalID: 1000 },
        defaultInput: {
          visit: 1,
          height: 0,
          weight: 0,
          systolic: 0,
          diastolic: 0,
          temperature: 0,
          diabetes_mellitus: "Haven't Asked / Not Applicable",
          heart_rate: 0,
          urine_test: "",
          hemocue_count: 0,
          blood_glucose: 0,
          left_eye_degree: "",
          right_eye_degree: "",
          left_eye_pinhole: "",
          right_eye_pinhole: "",
          others: "Post Successful!",
        },
      },
      {
        method: "DELETE",
        path: "/vitals/",
        key: "deleteVitalSigns",
        primaryKey: { vitalID: 1000 },
      },
    ],
  },
];

const SmokeTestPage = () => {
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (key, value) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };

  const constructApiUrl = (path, primaryKey, foreignKey) => {
    let url = `http://127.0.0.1:8000${path}`;

    // Append foreign key to URL if present and not empty
    if (foreignKey) {
      Object.keys(foreignKey).forEach((key) => {
        const value =
          inputValues[key] !== undefined ? inputValues[key] : foreignKey[key];
        if (value !== "") url += value; // Only append if value is not an empty string
      });
    }

    // Append primary key to URL if present and not empty
    if (primaryKey) {
      Object.keys(primaryKey).forEach((key) => {
        const value =
          inputValues[key] !== undefined ? inputValues[key] : primaryKey[key];
        if (value !== "") url += value; // Only append if value is not an empty string
      });
    }

    return url;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Smoke Test Page</h1>
      {apiInputArray.map((group) => (
        <div key={group.title} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{group.title}</h2>
          {group.requests.map((req) => {
            // Dynamically construct the API URL based on current input values
            const apiUrl = constructApiUrl(
              req.path,
              req.primaryKey,
              req.foreignKey,
            );
            const defaultValue = req.defaultInput || {};

            return (
              <div key={req.key} className="mb-4">
                {/* Render input fields for foreign keys */}
                {req.foreignKey &&
                  Object.keys(req.foreignKey).map((key) => (
                    <div key={key} className="mb-2">
                      <label className="block text-gray-700 mb-1">
                        {key}:
                        <input
                          type="text"
                          value={
                            inputValues[key] !== undefined
                              ? inputValues[key]
                              : req.foreignKey[key]
                          }
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="ml-2 p-2 border border-gray-300 rounded"
                          placeholder={`Enter ${key} or leave blank`}
                        />
                      </label>
                    </div>
                  ))}
                {/* Render input fields for primary keys */}
                {req.primaryKey &&
                  Object.keys(req.primaryKey).map((key) => (
                    <div key={key} className="mb-2">
                      <label className="block text-gray-700 mb-1">
                        {key}:
                        <input
                          type="text"
                          value={
                            inputValues[key] !== undefined
                              ? inputValues[key]
                              : req.primaryKey[key]
                          }
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="ml-2 p-2 border border-gray-300 rounded"
                          placeholder={`Enter ${key} or leave blank`}
                        />
                      </label>
                    </div>
                  ))}
                {/* Pass props to ApiComponent with dynamic apiUrl */}
                <ApiComponent
                  method={req.method}
                  apiUrl={apiUrl}
                  defaultInput={defaultValue}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SmokeTestPage;
