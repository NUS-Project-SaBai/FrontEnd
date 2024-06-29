import React, { useState, useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import { Button, InputField } from "@/components/TextComponents";
import makeRequest from "@/utils/make-request";

const Orders = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersFiltered, setOrdersFiltered] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data: orders } = await makeRequest(
        "get",
        `${API_URL}/orders?order_status=PENDING`,
      );
      setOrders(orders);
      setOrdersFiltered(orders);
    } catch (error) {
      console.error(error);
    }
  };

  const onFilterChange = (event) => {
    const filteredOrders = orders.filter((order) => {
      return order.visit.patient.filter_string.includes(
        event.target.value.toUpperCase(),
      );
    });
    setOrdersFiltered(filteredOrders);
  };

  const handleOrderApprove = async (order) => {
    if (window.confirm("Are you sure you want to approve this order?")) {
      try {
        await makeRequest("patch", `${API_URL}/orders/${order.id}`, {
          order_status: "APPROVED",
        });
        await makeRequest(
          "patch",
          `${API_URL}/medications/${order.medicine.id}`,
          {
            quantityChange: -order.quantity,
          },
        );

        router.reload();
      } catch (error) {
        console.error("Error updating orders:", error.response.data);
      }
    }
  };

  const handleOrderCancel = async (order) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await makeRequest(`patch`, `${API_URL}/orders/${order.id}`, {
          order_status: "CANCELLED",
        });
        router.reload();
      } catch (error) {
        console.error("Error updating orders:", error);
      }
    }
  };

  const renderTableContent = () => {
    return ordersFiltered.map((order) => {
      const visit = order.visit;
      const prescriptions = (
        <li key={order.medicine.id}>
          {order.medicine?.medicine_name || ""}: {order.quantity}
          <br />
          {order.medicine.notes && (
            <div className="truncate">Notes: {order.medicine.notes}</div>
          )}
        </li>
      );

      return (
        <tr key={order.id}>
          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
            {visit.patient.patient_id}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {moment(visit.date).format("DD MMMM YYYY HH:mm")}
          </td>
          <td>
            <img
              src={`${CLOUDINARY_URL}/${visit.patient.picture}`}
              alt="Patient"
              className="object-cover h-28 w-28 my-2"
            />
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {visit.patient.name}
          </td>
          <td>
            <ul className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {prescriptions}
            </ul>
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-2">
            <Button
              colour="green"
              text="Approve"
              onClick={() => handleOrderApprove(order)}
            />

            <Button
              colour="red"
              text="Cancel"
              onClick={() => handleOrderCancel(order)}
            />
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="mx-4 my-2">
      <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
        Orders
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
                      className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                    >
                      Visit On
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

export default withAuth(Orders);
