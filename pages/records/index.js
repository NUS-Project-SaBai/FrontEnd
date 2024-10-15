import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { CLOUDINARY_URL, OFFLINE, defaultAPI_URL } from '@/utils/constants';
import withAuth from '@/utils/auth';
import { Button, InputField } from '@/components/TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import { VENUE_OPTIONS } from '@/utils/constants';
import useWithLoading from '@/utils/loading';
import { VILLAGE_COLOR_CLASSES } from '@/utils/constants';

function VillageDropdown({ handleDropdownChangeWithStyle, PATIENT_CODE_ALL }) {
  return (
    <div className="field">
      <div className="control">
        <label
          htmlFor="patientDropdown"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Search by village code
        </label>
        <select
          className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          name="patientDropdown"
          id="patientDropdown"
          onChange={handleDropdownChangeWithStyle}
        >
          <option value={PATIENT_CODE_ALL}>{`${PATIENT_CODE_ALL}`}</option>
          {Object.entries(VENUE_OPTIONS).map(([key, value]) => (
            <option
              className={`${VILLAGE_COLOR_CLASSES[key] || 'text-gray-500'}`}
              value={key}
              key={key}
            >
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SearchField({ handleSearchChange }) {
  return (
    <div className="field flex-[3]">
      <div className="control">
        <InputField
          type="text"
          name="Input Patient/ID to Search"
          label="Input Patient/ID to Search"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [patientsFiltered, setPatientsFiltered] = useState([]);

  const PATIENT_CODE_ALL = 'ALL';
  const [patientCode, setPatientCode] = useState(PATIENT_CODE_ALL);
  const [patientSearch, setPatientSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const fetchPatients = useWithLoading(async () => {
    try {
      const response = await axiosInstance.get('/patients');
      setPatients(response.data);
      setPatientsFiltered(response.data);
    } catch (error) {
      toast.error(`Error loading patients: ${error.message}`);
      console.error('Error loading patients:', error);
    }
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patientSearch, patientCode]);

  function handleSearchChange(e) {
    const searchValue = e.target.value.toLowerCase().trim();
    setPatientSearch(searchValue);
  }

  function handleCodeChange(e) {
    const searchValue = e.target.value;
    setPatientCode(searchValue);
  }

  function handleDropdownChangeWithStyle(e) {
    const selectedValue = e.target.value;
    e.target.className = `flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6 ${
      VILLAGE_COLOR_CLASSES[selectedValue] || 'text-gray-500'
    }`;
    handleCodeChange(e);
  }

  function filterPatients() {
    const filteredPatients = patients.filter(patient => {
      return (
        patient.filter_string.toLowerCase().trim().includes(patientSearch) &&
        (patientCode === PATIENT_CODE_ALL ||
          patient.village_prefix === patientCode)
      );
    });
    setPatientsFiltered(filteredPatients);
  }

  function TableContent() {
    const patientRows = patientsFiltered
      .slice(startIndex, endIndex)
      .map(patient => {
        const patientID = patient.patient_id;
        const imageUrl = `${CLOUDINARY_URL}/${patient.picture}`;

        const patientVillagePrefix = patient.village_prefix;
        const fullName = patient.name;

        const record = (
          <Button
            text={'View'}
            onClick={() =>
              Router.push(`/records/patient-record?id=${patient.pk}`)
            }
            colour="indigo"
          />
        );

        const vitals = (
          <Button
            text={'Create'}
            onClick={() =>
              Router.push(`/records/patient-vitals?id=${patient.pk}`)
            }
            colour="green"
          />
        );

        const consultation = (
          <Button
            text={'Create'}
            onClick={() =>
              Router.push(`/records/patient-consultation?id=${patient.pk}`)
            }
            colour="green"
          />
        );

        return (
          <tr key={patientID}>
            <td
              className={`whitespace-nowrap px-3 py-4 text-sm ${VILLAGE_COLOR_CLASSES[patientVillagePrefix] || 'text-gray-500'}`}
            >
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

  function Table() {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-2 flow-root">
          <div className="-mx-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
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
                  <TableContent />
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
    );
  }

  return (
    <div className="mx-4 mt-2">
      <div className="mx-4 mt-2">
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patients List
        </h1>
        <div className="flex items-center space-x-4">
          <VillageDropdown
            handleDropdownChangeWithStyle={handleDropdownChangeWithStyle}
            PATIENT_CODE_ALL={PATIENT_CODE_ALL}
          />
          <SearchField handleSearchChange={handleSearchChange} />
        </div>
      </div>

      <Table />
    </div>
  );
}

export default withAuth(PatientList);
