import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import { Button } from "@/components/TextComponents/Button";
import { InputField } from "@/components/TextComponents/InputField";

const Prescription = () => {
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
    console.dir(visitsFiltered);
    return visitsFiltered
      .filter((visit) => filteredVisitIdsUsingOrders.has(visit.id))
      .map((visit) => {
        const Id =
          `${visit.patient.village_prefix}${visit.patient.pk}`.padStart(3, "0");
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
              <div className="truncate">Notes: {prescription.notes}</div>
            )}
          </li>
        ));

        return (
          <tr key={visit.id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
              {Id}
            </td>
            <td>
              <img
                src={imageUrl}
                alt="Patient"
                className="object-cover h-28 w-28 my-2"
              />
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {fullName}
            </td>
            <td>
              <ul className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {prescriptions}
              </ul>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-2">
              <Button
                colour="green"
                text="Prescribe"
                onClick={() =>
                  handlePrescriptionAction(correctPrescription, "approve")
                }
              />

              <Button
                colour="red"
                text="Reject"
                onClick={() =>
                  handlePrescriptionAction(correctPrescription, "cancel")
                }
              />
            </td>
          </tr>
        );
      });
  };

  return (
    <div className="mx-4 my-2">
      <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
        Prescriptions
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
                      Actions
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
      </div>
    </div>
  );
};

export default withAuth(Prescription);
