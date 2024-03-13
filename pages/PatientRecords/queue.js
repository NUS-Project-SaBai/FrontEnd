import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";
import { ViewButton } from "@/components/textContainers/ViewButton";
import { CreateButton } from "@/components/textContainers/CreateButton";

function Queue() {
  //Queue Page
  const [visits, setVisits] = useState([]); //Shouldnt this pull based on Patients not Visits
  const [visitsFiltered, setVisitsFiltered] = useState([]);

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2); //Change to 10 after development
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    //Above consts for pagination
    const reversedVisitsFiltered = [...visitsFiltered].reverse(); //response.data, reverse to order them from most recent
    const visitsRows = reversedVisitsFiltered
      .slice(startIndex, endIndex)
      .map((visit, idx) => {
        const Id = `${visit.patient.village_prefix}${visit.patient.id
          .toString()
          .padStart(3, "0")}`;
        const imageUrl = `${CLOUDINARY_URL}/${visit.patient.picture}`;
        const fullName = visit.patient.name;
        const progress = (
          <ViewButton
            text={"View"}
            onClick={() => Router.push(`/record?id=${visit.patient.id}`)}
          />
        );

        const vitals = (
          <div className="field is-grouped">
            <div className="control is-expanded">
              {" "}
              <CreateButton
                text={"Create"}
                onClick={() =>
                  Router.push(
                    `/patientVital?id=${visit.patient.id}&form=vitals`,
                  )
                }
              />
            </div>
          </div>
        );

        const consultation = (
          <div className="field is-grouped">
            <div className="control is-expanded">
              {" "}
              <CreateButton
                text={"Create"}
                onClick={() =>
                  Router.push(
                    `/patientMedical?id=${visit.patient.id}&form=medical`,
                  )
                }
              />
            </div>
          </div>
        );

        return (
          <tr key={idx}>
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
            <td>{vitals}</td>
            <td>{consultation}</td>
          </tr>
        );
      });

    return (
      <>
        {visitsRows}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <button
            className="button is-dark level-item"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="button is-dark level-item"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(reversedVisitsFiltered.length / itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </>
    );
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
    <div
      style={{
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
      }}
    >
      <div className="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient Records</h1>
        <div className="field">
          <div className="control">
            <input
              className="input is-medium"
              type="text"
              placeholder="Search Patient"
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
              <th>Record</th>
              <th>New Vitals</th>
              <th>New Consultation</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(Queue);
