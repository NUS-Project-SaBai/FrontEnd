import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import moment from "moment";
import {
  ConsultationsTable,
  VisitPrescriptionsTable,
  VitalsTable,
  ConsultationsView,
  ConsultationForm,
  PrescriptionForm,
} from "@/pages/records/_components";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/TextComponents/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const PatientConsultation = () => {
  const [state, setState] = useState({
    mounted: false,
    patient: {},
    medications: [],
    visits: [],
    visitID: null,
    consults: [],
    orders: [],
    referredFor: [],
    vitals: {},
    formDetails: { diagnoses: [] },
    medicationDetails: {},
    formModalOpen: false,
    isEditing: false,
    viewModalOpen: false,
    modalContent: {},
  });

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    // let { id: patientId } = this.props.query;
    const router = Router;
    const { query } = router;
    const { id: patientId } = query;

    // gets patient data
    let { data: patient } = await axios.get(`${API_URL}/patients/${patientId}`);

    // gets all visit data
    let { data: visits } = await axios.get(
      `${API_URL}/visits?patient=${patientId}`,
    );

    // sorts
    let visitsSorted = visits.sort((a, b) => {
      return b.id - a.id;
    });

    setState((prevState) => ({
      ...prevState,
      patient: patient,
      visits: visitsSorted,
    }));

    let visitID = visitsSorted[0].id;
    loadVisitDetails(visitID);
    loadMedicationStock();
  }

  function toggleViewModal(viewType = null, consult = {}) {
    setState((prevState) => ({
      ...prevState,
      viewModalOpen: !state.viewModalOpen,
      viewType,
      consult,
    }));
  }

  function renderViewModal() {
    let { viewModalOpen, consult } = state;

    let modalContent = <ConsultationsView content={consult} />;
    return (
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={() => toggleViewModal()}
        style={viewModalStyles}
        contentLabel="Example Modal"
      >
        {modalContent}
      </Modal>
    );
  }

  function toggleFormModal(order = {}) {
    loadMedicationStock();

    setState((prevState) => ({
      ...prevState,
      formModalIsOpen: !state.formModalIsOpen,
      medicationDetails: order,
      isEditing: Object.keys(order).length > 0,
    }));
  }

  async function loadMedicationStock() {
    let { data: medications } = await axios.get(`${API_URL}/medications`);

    let { data: orders } = await axios.get(
      `${API_URL}/orders?order_status=PENDING`,
    );

    // key -> medicine pk
    // value -> total reserved
    let reservedMedications = {};
    orders.forEach((order) => {
      let medicationID = order.medicine;
      let quantityReserved = order.quantity;

      if (typeof reservedMedications[medicationID] === "undefined") {
        reservedMedications[medicationID] = quantityReserved;
      } else {
        reservedMedications[medicationID] =
          reservedMedications[medicationID] + quantityReserved;
      }
    });

    setState((prevState) => ({
      ...prevState,
      medications,
      reservedMedications,
    }));
  }

  function renderFormModal() {
    let {
      patient,
      isEditing,
      medications,
      medicationDetails,
      formModalIsOpen,
      reservedMedications,
      orders,
    } = state;
    let options = medications
      .filter((medication) => {
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].medicine == medication.pk) return false;
        }
        return true;
      })
      .map((medication) => {
        let name = medication.fields.medicine_name;
        let pKey = medication.pk;

        var value = "";
        if (Object.keys(medicationDetails).length > 0)
          value = `${medicationDetails.medicine} ${medicationDetails.medicine_name}`;

        if (value == `${pKey} ${name}`)
          return (
            <option key={pKey} value={`${pKey} ${name}`}>
              {name}
            </option>
          );
        return (
          <option key={pKey} value={`${pKey} ${name}`}>
            {name}
          </option>
        );
      });

    return (
      <Modal
        isOpen={formModalIsOpen}
        onRequestClose={() => toggleFormModal()}
        style={formModalStyles}
        contentLabel="Example Modal"
      >
        <PrescriptionForm
          allergies={patient.drug_allergy}
          handleInputChange={handlePrescriptionChange}
          formDetails={medicationDetails}
          isEditing={isEditing}
          medicationOptions={options}
          medications={medications}
          reservedMedications={reservedMedications}
          onSubmit={() => submitNewPrescription()}
        />
      </Modal>
    );
  }

  function handlePrescriptionChange(e) {
    let { medicationDetails } = state;

    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === "medication") {
      let pKey = value.split(" ")[0];
      let medicineName = value.split(" ").slice(1).join(" ");

      medicationDetails["medicine"] = pKey;
      medicationDetails["medicine_name"] = medicineName;
    } else {
      medicationDetails[name] = value;
    }

    setState((prevState) => ({
      ...prevState,
      medicationDetails,
    }));
  }

  function submitNewPrescription() {
    let { orders, medicationDetails, isEditing, medications } = state;
    if (!Number.isInteger(medicationDetails.quantity - 0)) {
      // Decimal check
      toast.error("Please enter a valid quantity.");
      return;
    } else if (medicationDetails.medicine == null) {
      // Non existent medication check
      toast.error(
        `Please enter the name of the medication you would like to prescribe.`,
      );
      return;
    } else if (
      medicationDetails.quantity >
      medications.filter((med) => med.pk == medicationDetails.medicine)[0]
        .fields.quantity
    ) {
      toast.error(
        `Not enough stock for ${medicationDetails.medicine_name}, please check the quantity and try again.`,
      );
      return;
    }
    if (isEditing) {
      // go find that order
      let index = orders.findIndex((order) => {
        order.medication == medicationDetails.medication;
      });
      orders[index] = medicationDetails;
      // edit that order
    } else {
      orders.push({ ...medicationDetails, order_status: "PENDING" });
    }

    setState((prevState) => ({
      ...prevState,
      orders: orders,
      medicationDetails: {},
      formModalIsOpen: false,
    }));
  }

  async function loadVisitDetails(visitID) {
    let { data: consults } = await axios.get(
      `${API_URL}/consults?visit=${visitID}`,
    );

    let { data: prescriptions } = await axios.get(
      `${API_URL}/orders?visit=${visitID}`,
    );

    let consultsEnriched = consults.map((consult) => {
      let consultPrescriptions = prescriptions.filter((prescription) => {
        return prescription.consult.id === consult.id;
      });

      return {
        ...consult,
        prescriptions: consultPrescriptions,
      };
    });

    let { data: vitals } = await axios.get(
      `${API_URL}/vitals?visit=${visitID}`,
    );

    setState((prevState) => ({
      ...prevState,
      consults: consultsEnriched,
      vitals: vitals[0] || {},
      visitPrescriptions: consultsEnriched.flatMap((x) => x.prescriptions),
      mounted: true,
      visitID,
    }));
  }

  async function submitForm() {
    //Post 405 error
    const router = Router;
    const { query } = router;
    let { formDetails, visitID, orders } = state;

    orders.forEach((order) => {
      axios.patch(`${API_URL}/medications/${order.medicine}`, {
        quantityChange: -parseInt(order.quantity),
      });
    });

    var formPayload = {
      visit: visitID,
      ...formDetails,
    };

    delete formPayload.diagnoses;

    var consultId;
    var orderPromises;

    let { data: medicalConsult } = await axios
      .post(`${API_URL}/consults`, {
        ...formPayload,
        doctor: window.localStorage.getItem("userID"),
      })
      .catch((error) => {
        console.error("Error creating consult:", error.response.data);
        toast.error("Error creating consult.");
      });

    consultId = medicalConsult.id;
    orderPromises = [];

    let diagnosisFormat = "";

    for (let i = 0; i < formDetails.diagnoses.length; i++) {
      diagnosisFormat += `DIAGNOSIS ${i + 1}
          ${formDetails.diagnoses[i].details}
          ${
            !formDetails.diagnoses[i].type
              ? "Cardiovascular"
              : formDetails.diagnoses[i].type
          }
          
          `;
    }

    for (let i = 0; i < formDetails.diagnoses.length; i++) {
      let { data: medicalDiagnosis } = await axios.post(
        `${API_URL}/diagnosis`,
        {
          consult: consultId,
          details: formDetails.diagnoses[i].details,
          category: formDetails.diagnoses[i].type,
        },
      );
    }

    orders.forEach((order) => {
      let orderPayload = {
        ...order,
        visit: visitID,
        doctor: window.localStorage.getItem("userID"),
        consult: consultId,
      };
      orderPromises.push(axios.post(`${API_URL}/orders`, orderPayload));
    });

    await Promise.all(orderPromises);
    toast.success("Medical Consult Completed!");

    Router.push("/records");
  }

  function updateFormDetails(diagnoses) {
    // update the form details
    let { formDetails } = state;
    formDetails = { ...formDetails, diagnoses: diagnoses };

    setState((prevState) => ({ ...prevState, formDetails }));
  }

  function handleInputChange(e) {
    let { formDetails } = state;

    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    formDetails[name] = value;

    setState((prevState) => ({
      ...prevState,
      formDetails,
    }));
  }

  function handleVisitChange(e) {
    const value = e.target.value;

    // pull the latest visit

    // this.setState({ visitID: value });
    loadVisitDetails(value);
  }

  function renderHeader() {
    const { patient, visits } = state;

    const visitOptions = visits.map((visit) => {
      const date = moment(visit.date).format("DD MMMM YYYY");
      return (
        <option key={visit.id} value={visit.id}>
          {date}
        </option>
      );
    });

    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2">
          <img
            src={`${CLOUDINARY_URL}/${patient.picture}`}
            alt="Placeholder image"
            className="h-48 w-48 object-cover rounded-md"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <div>
            <label className="block text-gray-700">Village ID</label>
            <p className="text-lg font-medium">{`${
              patient.village_prefix
            }${patient.pk.toString().padStart(3, "0")}`}</p>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Visit on</label>
            <div className="relative">
              <select
                name="medication"
                onChange={handleVisitChange}
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-4 appearance-none focus:outline-none focus:border-blue-500"
              >
                {visitOptions}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div>
            <label className="block text-gray-700">Name</label>
            <p className="text-lg font-medium">{patient.name}</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4"></div>
      </div>
    );
  }

  function renderFirstColumn() {
    let { vitals, consults, visitPrescriptions } = state;

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

        <ConsultationsTable
          content={consults}
          buttonFunction={toggleViewModal}
        />

        <VisitPrescriptionsTable content={visitPrescriptions} />
      </div>
    );
  }

  function renderSecondColumn() {
    //let { form } = this.props.query;

    let { formDetails, orders } = state;

    let formContent = () => {
      return (
        <div className="space-y-2">
          <ConsultationForm
            updateFormDetails={updateFormDetails}
            formDetails={formDetails}
            handleInputChange={handleInputChange}
          />
          <hr />
          <label className="block text-sm font-medium text-gray-900 mt-4">
            Prescriptions
          </label>
          {orders.length > 0 ? renderPrescriptionTable() : "No Prescriptions"}
          <hr />
          <Button
            colour="green"
            text={"Add Prescriptions"}
            onClick={() => toggleFormModal()}
          />
        </div>
      );
    };

    return (
      <div className="space-y-2">
        {formContent()}

        <Button colour="green" text={"Submit"} onClick={() => submitForm()} />
      </div>
    );
  }

  function renderPrescriptionTable() {
    let { orders } = state;

    let orderRows = orders.map((order, index) => {
      let name = order.medicine_name;
      let quantity = order.quantity;

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
              onClick={() => toggleFormModal(order)}
            />
            <Button
              colour="red"
              text="Delete"
              onClick={() => {
                orders.splice(index, 1);
                setState((prevState) => ({ ...prevState, orders }));
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
          // position: "relative"
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
    if (!state.mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
          overflowX: "hidden", //remove horizontal scrollbar
        }}
      >
        {renderFormModal()}
        {renderViewModal()}
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
