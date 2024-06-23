import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import { Button, InputField } from "@/components/TextComponents";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [patientsFiltered, setPatientsFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    axios
      .get(`${API_URL}/patients`)
      .then((response) => {
        setPatients(response.data);
        setPatientsFiltered(response.data);
      })
      .catch((error) => console.error("Error loading page", error));
  }, []);

  function renderTableContent() {
    const patientRows = patientsFiltered
      .slice(startIndex, endIndex)
      .map((patient, idx) => {
        const patientID = patient.patient_id;
        const imageUrl = `${CLOUDINARY_URL}/${patient.picture}`;
        const fullName = patient.name;
        const record = (
          <Button
            text={"View"}
            onClick={() =>
              Router.push(`/records/patient-record?id=${patient.pk}`)
            }
            colour="indigo"
          />
        );

        const vitals = (
          <Button
            text={"Create"}
            onClick={() =>
              Router.push(`/records/patient-vital?id=${patient.pk}`)
            }
            colour="green"
          />
        );

        const consultation = (
          <Button
            text={"Create"}
            onClick={() =>
              Router.push(`/records/patient-consultation?id=${patient.pk}`)
            }
            colour="green"
          />
        );

        return (
          <tr key={patientID}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
              {patientID}
            </td>
            <td>
              <img
                src={imageUrl}
                alt="Placeholder image"
                className="object-cover h-28 w-28 my-2"
              />
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {fullName}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {record}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {vitals}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {consultation}
            </td>
          </tr>
        );
      });

    return <>{patientRows}</>;
  }

  function onFilterChange(e) {
    const filteredPatients = patients.filter((patient) => {
      const searchValue = e.target.value.toLowerCase();
      return patient.filter_string.includes(searchValue);
    });
    setPatientsFiltered(filteredPatients);
  }

  return (
    <div className="mx-4 mt-2">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
        Patients List
      </h1>
      <div className="field">
        <div className="control">
          <InputField
            type="text"
            name="Input Patient/ID to Search"
            label="Search for Patient/ID"
            onChange={onFilterChange}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Photo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Full Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Record
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Vitals
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Consultation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderTableContent()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <span className="isolate inline-flex rounded-md shadow-sm mt-2">
          <button
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(patientsFiltered.length / itemsPerPage)
            }
          >
            Next
          </button>
        </span>
      </div>
    </div>
  );
}

export default withAuth(PatientList);
