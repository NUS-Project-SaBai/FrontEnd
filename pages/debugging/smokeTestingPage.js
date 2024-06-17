import React, { useState } from "react";
import ApiComponent from "./apiComponent";

const apiInputArray = [
  {
    title: "Consults",
    requests: [
      {
        method: "GET",
        path: "/consults?visit=",
        key: "getConsults",
        inputKey: "visitID",
      },
      {
        method: "POST",
        path: "/consults",
        key: "postConsult",
        inputKey: "consultPayload",
        isPayload: true,
      },
    ],
  },
  {
    title: "Diagnosis",
    requests: [
      {
        method: "GET",
        path: "/diagnosis?consult=",
        key: "getDiagnosis",
        inputKey: "consultID",
      },
      {
        method: "POST",
        path: "/diagnosis",
        key: "postDiagnosis",
        inputKey: "diagnosisPayload",
        isPayload: true,
      },
    ],
  },
  {
    title: "Medications",
    requests: [
      { method: "GET", path: "/medications", key: "getMedications" },
      {
        method: "POST",
        path: "/medications",
        key: "postMedications",
        inputKey: "medicationPayload",
        isPayload: true,
      },
      {
        method: "PATCH",
        path: "/medications/",
        key: "patchMedications",
        inputKey: "medicationPayload",
        idKey: "medicationID",
        isPayload: true,
      },
      {
        method: "DELETE",
        path: "/medications/",
        key: "deleteMedications",
        inputKey: "medicationID",
      },
    ],
  },
  {
    title: "Orders",
    requests: [
      {
        method: "GET",
        path: "/orders?order_status=PENDING",
        key: "getOrderStatus",
      },
      {
        method: "GET",
        path: "/orders?visit=",
        key: "getOrdersByVisit",
        inputKey: "visitID",
      },
      {
        method: "POST",
        path: "/orders",
        key: "postOrder",
        inputKey: "orderPayload",
        isPayload: true,
      },
      {
        method: "PATCH",
        path: "/orders/",
        key: "patchOrder",
        inputKey: "orderPatchPayload",
        idKey: "prescriptionID",
        isPayload: true,
      },
    ],
  },
  {
    title: "Patients",
    requests: [
      { method: "GET", path: "/patients", key: "getPatients" },
      {
        method: "GET",
        path: "/patients/",
        key: "getSinglePatient",
        inputKey: "patientID",
      },
      {
        method: "POST",
        path: "/patients",
        key: "postPatient",
        inputKey: "patientPayload",
        isPayload: true,
      },
    ],
  },
  {
    title: "Visits",
    requests: [
      { method: "GET", path: "/visits", key: "getVisits" },
      {
        method: "GET",
        path: "/visits?patient=",
        key: "getVisitsByPatient",
        inputKey: "patientID",
      },
      {
        method: "POST",
        path: "/visits",
        key: "postVisit",
        inputKey: "visitPayload",
        isPayload: true,
      },
    ],
  },
  {
    title: "Vital Signs",
    requests: [
      {
        method: "GET",
        path: "/vitals?visit=",
        key: "getVitalSigns",
        inputKey: "visitID",
      },
      {
        method: "POST",
        path: "/vitals",
        key: "postVitalSigns",
        inputKey: "vitalSignsPayload",
        isPayload: true,
      },
    ],
  },
];

const defaultPayloads = {
  consultPayload: {
    visit: 1,
    date: new Date().toISOString(),
    doctor: 1,
    past_medical_history: "",
    consultation: "",
    plan: "",
    referred_for: "",
    referral_notes: "",
    remarks: "",
  },
  diagnosisPayload: {
    consult: 1,
    details: "",
    category: "",
  },
  medicationPayload: {
    medicine_name: "",
    quantity: 0,
    notes: "",
    remarks: "",
    quantityChange: 0,
  },
  orderPayload: {
    medicine: 1,
    quantity: 0,
    consult: 1,
    notes: "",
    remarks: "",
    order_status: "",
  },
  patientPayload: {
    village_prefix: "",
    name: "",
    identification_number: "",
    contact_no: "",
    gender: "",
    date_of_birth: new Date().toISOString(),
    drug_allergy: "None",
    face_encodings: "",
    picture: "",
  },
  visitPayload: {
    patient: 1,
    date: new Date().toISOString(),
    status: "",
  },
  vitalSignsPayload: {
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
    others: "",
  },
};

const SmokeTestPage = () => {
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (key, value) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Smoke Test Page</h1>
      {apiInputArray.map((group) => (
        <div key={group.title} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{group.title}</h2>
          {group.requests.map((req) => {
            const apiUrl = `http://127.0.0.1:8000${req.path}${
              req.inputKey ? inputValues[req.inputKey] || "" : ""
            }${req.idKey ? inputValues[req.idKey] || "" : ""}`;
            const defaultValue = req.isPayload
              ? defaultPayloads[req.inputKey] || {}
              : null;
            return (
              <div key={req.key} className="mb-4">
                <label className="block text-gray-700 mb-1">
                  {req.inputKey && (
                    <>
                      {req.inputKey}:
                      <input
                        type="text"
                        value={inputValues[req.inputKey] || ""}
                        onChange={(e) =>
                          handleInputChange(req.inputKey, e.target.value)
                        }
                        className="ml-2 p-2 border border-gray-300 rounded"
                      />
                    </>
                  )}
                  {req.idKey && (
                    <>
                      {req.idKey}:
                      <input
                        type="text"
                        value={inputValues[req.idKey] || ""}
                        onChange={(e) =>
                          handleInputChange(req.idKey, e.target.value)
                        }
                        className="ml-2 p-2 border border-gray-300 rounded"
                      />
                    </>
                  )}
                </label>
                <ApiComponent
                  method={req.method}
                  apiUrl={apiUrl}
                  defaultValue={defaultValue}
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
