import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import Modal from 'react-modal';
import {
  ConsultationsTable,
  PrescriptionsTable,
  VitalsTable,
  ConsultationView,
  ConsultationForm,
  OrderForm,
  Header,
} from '@/components/records';
import withAuth from '@/utils/auth';
import toast from 'react-hot-toast';
import { Button, PageTitle } from '@/components/TextComponents/';
import axiosInstance from '@/pages/api/_axiosInstance';
import CustomModal from '@/components/CustomModal';
import useWithLoading from '@/utils/loading';

const PatientConsultation = () => {
  const [mounted, setMounted] = useState(false);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  const [consult, setConsult] = useState({});
  const [vitals, setVitals] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);

  const [medications, setMedications] = useState([]);

  const [selectedVisitID, setSelectedVisitID] = useState(null);
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

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useWithLoading(async () => {
    const patientID = Router.query.id;
    try {
      const { data: patient } = await axiosInstance.get(
        `/patients/${patientID}`
      );
      const { data: visits } = await axiosInstance.get(
        `/visits?patient=${patientID}`
      );

      setPatient(patient);
      setVisits(visits);

      if (visits.length > 0) {
        const visitID = visits[0].id;
        loadVisitDetails(visitID);
        loadMedicationStock();
      }
    } catch (error) {
      toast.error(`Error loading patient data: ${error.message}`);
      console.error('Error loading patient data:', error);
    }
  });

  const loadVisitDetails = useWithLoading(async visitID => {
    try {
      const { data: consults } = await axiosInstance.get(
        `/consults?visit=${visitID}`
      );
      const prescriptions = consults
        .flatMap(consult => consult.prescriptions)
        .filter(prescription => prescription != null);
      const { data: vitals } = await axiosInstance.get(
        `/vitals?visit=${visitID}`
      );

      setMounted(true);
      setSelectedVisitID(visitID);
      setConsult(consults);
      setPrescriptions(prescriptions);
      setVitals(vitals[0] || {});
    } catch (error) {
      toast.error(`Error loading visit details: ${error.message}`);
      console.error('Error loading visit details:', error);
    }
  });

  const loadMedicationStock = useWithLoading(async () => {
    try {
      const { data: medications } = await axiosInstance.get('/medications');
      setMedications(medications);
    } catch (error) {
      toast.error(`Error loading medication stock: ${error.message}`);
      console.error('Error loading medication stock:', error);
    }
  });

  const submitConsultationForm = useWithLoading(async () => {
    try {
      const formPayload = {
        visit: selectedVisitID,
        ...consultationFormDetails,
      };

      const diagnosesPayload = consultationFormDetails.diagnoses.map(
        diagnosis => ({
          details: diagnosis.details,
          category: diagnosis.type,
        })
      );

      const ordersPayload = orders.map(order => ({
        ...order,
        visit: selectedVisitID,
      }));

      const combinedPayload = {
        consult: formPayload,
        diagnoses: diagnosesPayload,
        orders: ordersPayload,
      };

      await axiosInstance.post('/consults', combinedPayload);

      toast.success('Medical Consult Completed!');
      Router.push('/records');
    } catch (error) {
      toast.error(`Error submitting consultation form: ${error.message}`);
      console.error('Error submitting consultation form:', error);
    }
  });

  // Consultations View Modal
  function toggleCustomModal() {
    setConsultationModalOpen(!consultationModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleCustomModal();
  }

  // Order Form Modal
  function selectOrder(order) {
    setOrderFormDetails(order);
    toggleOrderFormModal();
  }

  function toggleOrderFormModal() {
    loadMedicationStock();
    setOrderFormModalOpen(!orderFormModalOpen);
  }

  const handleVisitChange = useCallback(event => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  function handleOrderFormChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === 'medication') {
      const pKey = parseInt(value.split(' ')[0]);
      const medicineName = value.split(' ').slice(1).join(' ');

      setOrderFormDetails(prevState => ({
        ...prevState,
        medicine: pKey,
        medicine_name: medicineName,
      }));
    } else {
      setOrderFormDetails(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  function submitNewOrder() {
    // Non-existent medication check
    if (orderFormDetails.medicine == null || orderFormDetails.medicine === 0) {
      toast.error(
        'Please select the name of the medication you would like to prescribe.'
      );
      return;
    }

    // Decimal check
    if (!Number.isInteger(orderFormDetails.quantity - 0)) {
      toast.error('Please enter a valid quantity.');
      return;
    }

    const index = orders.findIndex(
      order => order.medicine === orderFormDetails.medicine
    );
    if (index !== -1) {
      orders[index] = orderFormDetails;
    } else {
      orders.push({ ...orderFormDetails, order_status: 'PENDING' });
    }

    setOrders([...orders]);
    setOrderFormDetails({});
    toggleOrderFormModal();
  }

  // Consultation Form
  function handleConsultationFormInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setConsultationFormDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleConsultationFormDiagnosis(diagnoses) {
    setConsultationFormDetails(prevState => ({ ...prevState, diagnoses }));
  }

  function PatientHeader() {
    return (
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
    );
  }

  function LeftColumn() {
    return (
      <div className="space-y-8">
        {typeof vitals === 'undefined' ? (
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

  function RightColumn() {
    return (
      <div className="bg-blue-50 p-4 rounded-lg relative space-y-2">
        <ConsultationForm
          handleInputChange={handleConsultationFormInputChange}
          formDetails={consultationFormDetails}
          handleDiagnosis={handleConsultationFormDiagnosis}
        />
        <div className="my-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Orders</h2>
          <hr className="mb-4" />
          {orders.length > 0 ? (
            <OrdersTable />
          ) : (
            <p className="text-gray-500 text-sm mb-4">No Orders</p>
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              colour="green"
              text={'Add Orders'}
              onClick={() => toggleOrderFormModal()}
              className="mr-2"
            />
          </div>
        </div>
        <hr className="my-4" />

        <Button
          colour="green"
          text={'Submit'}
          onClick={() => submitConsultationForm()}
        />
      </div>
    );
  }

  function OrdersTable() {
    const orderRows = orders.map((order, index) => {
      const name = order.medicine_name;
      const quantity = order.quantity;

      return (
        <tr key={`${order.id}-${index}`}>
          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
            {name}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {quantity}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-2">
            <Button
              colour="green"
              text="Edit"
              onClick={() => selectOrder(order)}
            />
            <Button
              colour="red"
              text="Delete"
              onClick={() => {
                setOrders(prevOrders => {
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
      <div className="mt-4 mx-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-2 flow-root">
            <div className="-mx-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full border border-gray-700 divide-y divide-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200">
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-base font-semibold text-gray-900 border-b border-gray-700"
                      >
                        Medicine
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-base font-semibold text-gray-900 border-b border-gray-700"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-base font-semibold text-gray-900 border-b border-gray-700"
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

  function Render() {
    if (!mounted) return null;

    return (
      <div className="mt-7 mx-6 overflow-hidden">
        <Modal
          isOpen={orderFormModalOpen}
          onRequestClose={toggleOrderFormModal}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <OrderForm
              allergies={patient.drug_allergy}
              medications={medications}
              handleInputChange={handleOrderFormChange}
              orderDetails={orderFormDetails}
              medicationOptions={medications.map(medication => (
                <option
                  key={medication.id}
                  value={`${medication.id} ${medication.medicine_name}`}
                >
                  {medication.medicine_name}
                </option>
              ))}
              onSubmit={submitNewOrder}
            />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={toggleOrderFormModal}
            >
              Close
            </button>
          </div>
        </Modal>
        <CustomModal
          isOpen={consultationModalOpen}
          onRequestClose={toggleCustomModal}
        >
          <ConsultationView content={selectedConsult} />
        </CustomModal>
        <PageTitle title="Patient Consultation" />
        <PatientHeader />
        <b>
          Please remember to press the submit button at the end of the form!
        </b>
        <hr />
        <div className="grid grid-cols-2 gap-x-4 mb-4">
          <div>
            <LeftColumn />
          </div>
          <div>
            <RightColumn />
          </div>
        </div>
      </div>
    );
  }

  return <Render />;
};

export default withAuth(PatientConsultation);
