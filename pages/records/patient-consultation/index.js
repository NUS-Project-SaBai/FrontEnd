import React, { useState, useEffect, useCallback } from "react";
import Router from "next/router";
import Modal from "react-modal";
import {
  ConsultationsTable,
  PrescriptionsTable,
  VitalsTable,
  ConsultationView,
  ConsultationForm,
  OrderForm,
  Header,
} from "@/pages/records/_components";
import { API_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/TextComponents/";
import makeRequest from "@/pages/api/_make-request";

const PatientConsultation = () => {
  const [mounted, setMounted] = useState(false);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  const [consult, setConsult] = useState({});
  const [vitals, setVitals] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);

  const [medications, setMedications] = useState([]);

  const [selectedVisitID, setSelectedVisitID] = useState({});
  const [selectedConsult, setSelectedConsult] = useState({});

  // Consultation View Modal hooks
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  // Order Form Modal hooks
  const [orders, setOrders] = useState([]);
  const [orderFormDetails, setOrderFormDetails] = useState({});
  const [orderFormModalOpen, setOrderFormModalOpen] = useState(false);

  // Consultation Form hooks
  const [consultationFormDetails, setConsultationFormDetails] = useState({
    diagnoses: [],
  });

  const handleVisitChange = useCallback((event) => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    const patientID = Router.query.id;

    const { data: patient } = await makeRequest(
      "get",
      `${API_URL}/patients/${patientID}`,
    );
    const { data: visits } = await makeRequest(
      "get",
      `${API_URL}/visits?patient=${patientID}`,
    );

    setPatient(patient);
    setVisits(visits);

    if (visits.length > 0) {
      const visitID = visits[0].id;
      loadVisitDetails(visitID);
      loadMedicationStock();
    }
  }

  async function loadVisitDetails(visitID) {
    const { data: consults } = await makeRequest(
      "get",
      `${API_URL}/consults?visit=${visitID}`,
    );

    const prescriptions = consults
      .flatMap((consult) => consult.prescriptions)
      .filter((prescription) => prescription != null);

    const { data: vitals } = await makeRequest(
      "get",
      `${API_URL}/vitals?visit=${visitID}`,
    );

    setMounted(true);
    setSelectedVisitID(visitID);
    setConsult(consults);
    setPrescriptions(prescriptions);
    setVitals(vitals[0] || {});
  }

  async function loadMedicationStock() {
    const { data: medications } = await makeRequest(
      "get",
      `${API_URL}/medications`,
    );
    setMedications(medications);
  }

  // Consultations View Modal

  function toggleConsultationViewModal() {
    setConsultationModalOpen(!consultationModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleConsultationViewModal();
  }

  function renderConsultationViewModal() {
    return (
      <Modal
        isOpen={consultationModalOpen}
        onRequestClose={() => toggleConsultationViewModal()}
        style={viewModalStyles}
        contentLabel="Example Modal"
      >
        <ConsultationView content={selectedConsult} />
      </Modal>
    );
  }

  // Order Form Modal

  function selectOrder(order) {
    setOrderFormDetails(order);
    toggleOrderFormModal(!orderFormModalOpen);
  }

  function toggleOrderFormModal() {
    loadMedicationStock();
    setOrderFormModalOpen(!orderFormModalOpen);
  }

  function handleOrderFormChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === "medication") {
      const pKey = parseInt(value.split(" ")[0]);
      const medicineName = value.split(" ").slice(1).join(" ");

      setOrderFormDetails((prevState) => ({
        ...prevState,
        medicine: pKey,
        medicine_name: medicineName,
      }));
    } else {
      setOrderFormDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  function submitNewOrder() {
    // Non existent medication check
    if (orderFormDetails.medicine == null || orderFormDetails.medicine === 0) {
      toast.error(
        `Please select the name of the medication you would like to prescribe.`,
      );
    }

    // Decimal check
    if (!Number.isInteger(orderFormDetails.quantity - 0)) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    const index = orders.findIndex((order) => {
      order.medicine === orderFormDetails.medicine;
    });
    if (index !== -1) {
      orders[index] = orderFormDetails;
    } else {
      orders.push({ ...orderFormDetails, order_status: "PENDING" });
    }

    setOrders(orders);
    setOrderFormDetails({});
    toggleOrderFormModal();
  }

  function renderOrderFormModal() {
    const options = medications
      .filter((medication) => {
        return !orders.some((order) => order.medicine === medication.id);
      })
      .map((medication) => {
        const name = medication.medicine_name;
        const pKey = medication.id;
        return (
          <option key={pKey} value={`${pKey} ${name}`}>
            {name}
          </option>
        );
      });

    return (
      <Modal
        isOpen={orderFormModalOpen}
        onRequestClose={() => toggleOrderFormModal()}
        style={formModalStyles}
      >
        <OrderForm
          allergies={patient.drug_allergy}
          medications={medications}
          handleInputChange={handleOrderFormChange}
          orderDetails={orderFormDetails}
          medicationOptions={options}
          onSubmit={() => submitNewOrder()}
        />
      </Modal>
    );
  }

  // Consultation Form
  function handleConsultationFormInputChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setConsultationFormDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleConsultationFormDiagnosis(diagnoses) {
    setConsultationFormDetails((prevState) => ({ ...prevState, diagnoses }));
  }

  async function submitConsultationForm() {
    // orders.forEach((order) => {
    //   axios
    //     .patch(`${API_URL}/medications/${order.medicine}`, {
    //       quantityChange: -parseInt(order.quantity),
    //     })
    //     .catch((error) => {
    //       console.error("Error creating order:", error.response.data);
    //     });
    // });

    const formPayload = {
      visit: selectedVisitID,
      ...consultationFormDetails,
    };

    const { data: consult } = await makeRequest("post", `${API_URL}/consults`, {
      ...formPayload,
    }).catch((error) => {
      toast.error("Error creating consult.");
    });

    const diagnosesPromises = [];
    consultationFormDetails.diagnoses.forEach((diagnosis) => {
      const diagnosisRequest = makeRequest("post", `${API_URL}/diagnosis`, {
        consult: consult.id,
        details: diagnosis.details,
        category: diagnosis.type,
      });
      diagnosesPromises.push(diagnosisRequest);
    });
    await Promise.all(diagnosesPromises);

    const orderPromises = [];
    orders.forEach((order) => {
      const orderRequest = makeRequest("post", `${API_URL}/orders`, {
        ...order,
        visit: selectedVisitID,
        consult: consult.id,
      }).catch((error) => {
        console.error("Error creating order:", error.response.data);
        console.error("Payload:", {
          ...order,
          visit: selectedVisitID,
          consult: consult.id,
        });
      });

      orderPromises.push(orderRequest);
    });
    await Promise.all(orderPromises);

    toast.success("Medical Consult Completed!");

    Router.push("/records");
  }

  function renderHeader() {
    return (
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
    );
  }

  function renderFirstColumn() {
    return (
      <div className="space-y-8">
        {typeof vitals === "undefined" ? (
          <>
            <label className="label">Vital Signs</label>
            <h2>Not Done</h2>
          </>
        ) : (
          <VitalsTable content={vitals} />
        )}

        <ConsultationsTable content={consult} buttonOnClick={selectConsult} />

        <PrescriptionsTable content={prescriptions} />
      </div>
    );
  }

  function renderSecondColumn() {
    return (
      <div className="space-y-2">
        <div className="space-y-2">
          <ConsultationForm
            handleInputChange={handleConsultationFormInputChange}
            formDetails={consultationFormDetails}
            handleDiagnosis={handleConsultationFormDiagnosis}
          />
          <hr />
          <label className="block text-sm font-medium text-gray-900 mt-4">
            Orders
          </label>
          {orders.length > 0 ? renderOrdersTable() : "No Orders"}
          <hr />
          <Button
            colour="green"
            text={"Add Orders"}
            onClick={() => toggleOrderFormModal()}
          />
        </div>

        <Button
          colour="green"
          text={"Submit"}
          onClick={() => submitConsultationForm()}
        />
      </div>
    );
  }

  function renderOrdersTable() {
    const orderRows = orders.map((order, index) => {
      const name = order.medicine_name;
      const quantity = order.quantity;

      return (
        <tr key={order.id}>
          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
            {name}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {quantity}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <Button
              colour="green"
              text="Edit"
              onClick={() => selectOrder(order)}
            />
            <Button
              colour="red"
              text="Delete"
              onClick={() => {
                setOrders((prevOrders) => {
                  const updatedOrders = [...prevOrders];
                  updatedOrders.splice(index, 1);
                  return updatedOrders;
                });
              }}
            />
          </td>
        </tr>
      );
    });

    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-2 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                      >
                        Medicine
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                      >
                        Quantity
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
                    {orderRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function render() {
    if (!mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
          overflowX: "hidden", //remove horizontal scrollbar
        }}
      >
        {renderOrderFormModal()}
        {renderConsultationViewModal()}
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patient Consultation
        </h1>
        {renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div className="grid grid-cols-2 gap-x-4 mb-4">
          <div>{renderFirstColumn()}</div>
          <div>{renderSecondColumn()}</div>
        </div>
      </div>
    );
  }
  return <>{render()}</>;
};

const formModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "12.5%",
    bottom: "12.5%",
  },
  overlay: {
    zIndex: 4,
  },
};

const viewModalStyles = {
  content: {
    left: "30%",
    right: "12.5%",
    top: "12.5%",
    bottom: "12.5%",
  },
  overlay: {
    zIndex: 4,
  },
};

export default withAuth(PatientConsultation);
