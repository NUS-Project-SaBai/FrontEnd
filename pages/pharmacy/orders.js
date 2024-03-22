import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";

const Orders = () => {
  const [visits, setVisits] = useState([]);
  const [visitsFiltered, setVisitsFiltered] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredVisitIdsUsingOrders, setFilteredVisitIdsUsingOrders] =
    useState(new Set());

  useEffect(() => {
    fetchOrdersAndVisits();
  }, []);

  const fetchOrdersAndVisits = async () => {
    try {
      const { data: orders } = await axios.get(
        `${API_URL}/orders?order_status=PENDING`,
      );
      const { data: visits } = await axios.get(`${API_URL}/visits`);

      const newFilteredVisitIds = new Set(
        orders.map((order) => order.consult.visit.id),
      );
      setFilteredVisitIdsUsingOrders(newFilteredVisitIds);
      setVisits(visits);
      setVisitsFiltered(visits);
      setOrders(orders);
    } catch (error) {
      console.error(error);
    }
  };

  const onFilterChange = (event) => {
    const filteredVisits = visits.filter((visit) => {
      const patientId =
        `${visit.patient.village_prefix}${visit.patient.id}`
          .padStart(3, "0")
          .toLowerCase() +
        ` ${visit.patient.name} ${visit.patient.local_name}`.toLowerCase();
      return patientId.includes(event.target.value.toLowerCase());
    });
    setVisitsFiltered(filteredVisits);
  };

  const handlePrescriptionAction = async (prescriptions, actionType) => {
    if (window.confirm(`Are you sure you want to ${actionType} this order?`)) {
      try {
        const promises = prescriptions.map((prescription) => {
          return axios.patch(`${API_URL}/orders/${prescription.id}`, {
            order_status: actionType === "approve" ? "approved" : "cancelled",
          });
        });
        await Promise.all(promises);
        fetchOrdersAndVisits();
      } catch (error) {
        console.error("Error updating orders:", error);
      }
    }
  };

  const renderTableContent = () => {
    return visitsFiltered
      .filter((visit) => filteredVisitIdsUsingOrders.has(visit.id))
      .map((visit) => {
        const Id =
          `${visit.patient.village_prefix}${visit.patient.id}`.padStart(3, "0");
        const imageUrl = `${CLOUDINARY_URL}/${visit.patient.picture}`;
        const fullName = visit.patient.name;

        const correctPrescription = orders.filter(
          (order) => order.consult.visit.id === visit.id,
        );
        // i changed this to only show notes if it exist, else will just omit
        const prescriptions = correctPrescription.map((prescription) => (
          <li key={prescription.id}>
            {prescription.medicine?.medicine_name || ""}:{" "}
            {prescription.quantity}
            <br />
            {prescription.notes && (
              <>
                Notes: {prescription.notes}
                <br />
                <br />
              </>
            )}
          </li>
        ));

        return (
          <tr key={visit.id}>
            <td>{Id}</td>
            <td>
              <figure className="image is-96x96">
                <img
                  src={imageUrl}
                  alt="Patient"
                  style={{ height: 96, width: 96, objectFit: "cover" }}
                />
              </figure>
            </td>
            <td>{fullName}</td>
            <td>
              <ul>{prescriptions}</ul>
            </td>
            <td>
              <button
                className="button is-dark"
                onClick={() =>
                  handlePrescriptionAction(correctPrescription, "approve")
                }
              >
                Prescribe
              </button>
              <button
                className="button is-danger"
                style={{ marginLeft: "10px" }}
                onClick={() =>
                  handlePrescriptionAction(correctPrescription, "cancel")
                }
              >
                Cancel
              </button>
            </td>
          </tr>
        );
      });
  };

  return (
    <div style={{ marginTop: 15, marginLeft: 25, marginRight: 25 }}>
      <div className="column is-12">
        <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
          Orders
        </h1>
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
              <th>Prescriptions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Orders);
