import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";

const RecordsComponent = () => {
  const [patients, setPatients] = useState([]);
  const [patientsFiltered, setPatientsFiltered] = useState([]);
  const [filterString, setFilterString] = useState("");

  const onFilterChange = (event) => {
    const newFilterString = event.target.value.toLowerCase();
    const filteredPatients = patients.filter((patient) => {
      const { name, contact_no, village_prefix, pk } = patient.fields;
      const patientFilter =
        `${village_prefix}${pk} ${name} ${contact_no}`.toLowerCase();
      return patientFilter.includes(newFilterString);
    });

    setFilterString(newFilterString);
    setPatientsFiltered(filteredPatients);
  };

  const onRefresh = async () => {
    try {
      const { data: fetchedPatients } = await axios.get(`${API_URL}/patients`);
      setPatients(fetchedPatients);
      setPatientsFiltered(fetchedPatients);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const renderTableContent = () => {
    return patientsFiltered.map((patient) => {
      const Id = `${patient.fields.village_prefix}${patient.pk
        .toString()
        .padStart(3, "0")}`;
      const imageUrl = `${CLOUDINARY_URL}/${patient.fields.picture}`;
      const fullName = patient.fields.name;
      const progress = (
        <div>
          <button
            className="button is-dark level-item"
            onClick={() => {
              Router.push(`/record?id=${patient.pk}`);
            }}
            style={{ display: "inline-block" }}
          >
            View
          </button>
          <button
            className="button is-danger level-item"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this patient?")) {
                try {
                  await axios.delete(`${API_URL}/patients/${patient.pk}`);
                  onRefresh();
                } catch (error) {
                  console.error(error);
                }
              }
            }}
            style={{ display: "inline-block", marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      );

      return (
        <tr key={patient.pk}>
          <td>{Id}</td>
          <td>
            <figure className="image is-96x96">
              <img
                src={imageUrl}
                alt="Placeholder image"
                style={{ height: 96, width: 96, objectFit: "cover" }}
              />
            </figure>
          </td>
          <td>{fullName}</td>
          <td>{progress}</td>
        </tr>
      );
    });
  };

  return (
    <div style={{ marginTop: 15, marginLeft: 25, marginRight: 25 }}>
      <div className="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Records</h1>
        <div className="field">
          <div className="control">
            <input
              className="input is-medium"
              type="text"
              placeholder="Search Patient"
              value={filterString}
              onChange={onFilterChange}
            />
          </div>
        </div>
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(RecordsComponent);
