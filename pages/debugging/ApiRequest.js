import React, { useState } from "react";
import axios from "axios";

const APIRequestComponent = () => {
  // State to store responses from API requests
  const [responses, setResponses] = useState({});

  // State to store input values for IDs and payloads
  const [inputs, setInputs] = useState({
    visitID: "",
    consultPayload: "",
    consultID: "",
    diagnosisPayload: "",
    medicationPayload: "",
    medicationID: "",
    orderPayload: "",
    prescriptionID: "",
    patientID: "",
    patientPayload: "",
    visitPayload: "",
    vitalSignsPayload: "",
    orderPatchPayload: "",
  });

  // Array of API request configurations
  const apiRequests = [
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

  // Function to handle API requests
  const handleApiRequest = async (
    method,
    path,
    key,
    inputKey,
    idKey,
    isPayload,
  ) => {
    try {
      // Construct the full URL
      let fullUrl = `http://127.0.0.1:8000${path}`;

      // Append input values to the URL if necessary
      if (inputKey) {
        fullUrl += inputs[inputKey];
      }
      if (idKey) {
        fullUrl += inputs[idKey];
      }

      let response;
      // Make the API request using axios
      if (method === "GET" || method === "DELETE") {
        response = await axios[method.toLowerCase()](fullUrl);
      } else {
        response = await axios[method.toLowerCase()](
          fullUrl,
          isPayload ? JSON.parse(inputs[inputKey]) : null,
        );
      }

      // Update the responses state with the new data
      setResponses((prevResponses) => ({
        ...prevResponses,
        [key]: response.data,
      }));
    } catch (err) {
      // Handle errors
      console.error(`Failed to ${method} data:`, err.message);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e, key) => {
    setInputs({
      ...inputs,
      [key]: e.target.value,
    });
  };

  return (
    <div>
      <h2>API Request Component</h2>
      {apiRequests.map((section) => (
        <div key={section.title}>
          <h3>{section.title}</h3>
          {section.requests.map((request) => (
            <div key={request.key}>
              {request.inputKey && (
                <div>
                  <label>
                    {request.inputKey
                      .replace(/([A-Z])/g, "$1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </label>
                  <input
                    type="text"
                    value={inputs[request.inputKey]}
                    onChange={(e) => handleInputChange(e, request.inputKey)}
                    placeholder="Enter payload"
                  />
                </div>
              )}
              {request.idKey && (
                <div>
                  <label>
                    {request.idKey
                      .replace(/([A-Z])/g, "$1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </label>
                  <input
                    type="text"
                    value={inputs[request.idKey]}
                    onChange={(e) => handleInputChange(e, request.idKey)}
                    placeholder="Enter ID"
                  />
                </div>
              )}
              <button
                onClick={() =>
                  handleApiRequest(
                    request.method,
                    request.path,
                    request.key,
                    request.inputKey,
                    request.idKey,
                    request.isPayload,
                  )
                }
              >
                {request.method} {section.title}
              </button>
              {responses[request.key] && (
                <div>
                  <h4>
                    {request.method} {section.title} Response:
                  </h4>
                  <pre>{JSON.stringify(responses[request.key], null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default APIRequestComponent;
