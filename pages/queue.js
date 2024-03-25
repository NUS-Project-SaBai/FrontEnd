import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";

import { render } from "react-dom";
import { Button } from "@/components/textContainers/Button";
import { InputField } from "@/components/textContainers/InputField";

function Queue() {
  //Queue Page
  const [visits, setVisits] = useState([]); //Shouldnt this pull based on Patients not Visits
  const [visitsFiltered, setVisitsFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; //Change to 10 after development
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const reversedVisitsFiltered = [...visitsFiltered].reverse(); //response.data, reverse to order them from most recent

  useEffect(() => {
    axios
      .get(`${API_URL}/visits?status=started`)
      .then((response) => {
        setVisits(response.data);
        setVisitsFiltered(response.data);
      })
      .catch((error) => console.error("Error loading page", error));
  }, []);

  async function handleDelete(visit_id, patient_id) {
    //Not yet implementd
    const confirmed = window.confirm(
      "Are you sure you want to delete this visit?",
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/visits/${visit_id}`);
      const updatedVisits = visits.filter((visit) => visit.id !== visit_id);
      const updatedVisitsFiltered = visitsFiltered.filter(
        (visit) => visit.id !== visit_id,
      );
      setVisits(updatedVisits);
      setVisitsFiltered(updatedVisitsFiltered);
    } catch (error) {
      console.error(error);
    }
  }

  function renderTableContent() {
    const visitsRows = reversedVisitsFiltered
      .slice(startIndex, endIndex)
      .map((visit, idx) => {
        const Id = `${visit.patient.village_prefix}${visit.patient.id
          .toString()
          .padStart(3, "0")}`;
        const imageUrl = `${CLOUDINARY_URL}/${visit.patient.picture}`;
        const fullName = visit.patient.name;
        const progress = (
          <Button
            text={"View"}
            onClick={() => Router.push(`/record?id=${visit.patient.id}`)}
            colour="indigo"
          />
        );

        const vitals = (
          <Button
            text={"Create"}
            onClick={() =>
              Router.push(`/patientVital?id=${visit.patient.id}&form=vitals`)
            }
            colour="green"
          />
        );

        const consultation = (
          <Button
            text={"Create"}
            onClick={() =>
              Router.push(`/patientMedical?id=${visit.patient.id}&form=medical`)
            }
            colour="green"
          />
        );

        return (
          <tr key={Id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
              {Id}
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
              {progress}
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

    return <>{visitsRows}</>;
  }

  function onFilterChange(e) {
    const filteredVisits = visits.filter((visit) => {
      const patientId1 =
        `${visit.patient.village_prefix}${visit.patient.id}`.toLowerCase();
      const patientId2 =
        `${visit.patient.village_prefix}`.toLowerCase() +
        `${visit.patient.id}`.padStart(3, `0`);
      const name = `${visit.patient.name}`.toLowerCase();
      const searchValue = e.target.value.toLowerCase();
      return (
        patientId1.includes(searchValue) ||
        patientId2.includes(searchValue) ||
        name.includes(searchValue)
      );
    });
    setVisitsFiltered(filteredVisits);
  }

  return (
    <div className="mx-4 mt-2">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
        List of Patients
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
              currentPage ===
              Math.ceil(reversedVisitsFiltered.length / itemsPerPage)
            }
          >
            Next
          </button>
        </span>
      </div>
    </div>
  );
}

export default withAuth(Queue);
