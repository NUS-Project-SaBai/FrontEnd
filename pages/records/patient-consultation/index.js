import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import {
  ConsultationsTable,
  PrescriptionsTable,
  VitalsTable,
  ConsultationView,
  ConsultationForm,
  OrderForm,
  Header,
  HeightWeightGraph,
} from '@/components/records';
import withAuth from '@/utils/auth';
import toast from 'react-hot-toast';
import { Button } from '@/components/TextComponents/';
import axiosInstance from '@/pages/api/_axiosInstance';
import CustomModal from '@/components/CustomModal';
import useWithLoading from '@/utils/loading';

const PatientConsultation = () => {
  const [mounted, setMounted] = useState(false);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  const [consults, setConsult] = useState({});
  const [vitals, setVitals] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);

  const [medications, setMedications] = useState([]);

  const [selectedVisitID, setSelectedVisitID] = useState(null);
  const [selectedConsult, setSelectedConsult] = useState({});

  // Consultation View Modal hooks
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  // Order Form Modal hooks
  const [orders, setOrders] = useState([]);
  const blankOrderFormDetails = {
    quantity: '',
    medicine: 0, // refers to the medcine id
    medicine_name: '',
  };
  const [orderFormDetails, setOrderFormDetails] = useState(
    blankOrderFormDetails
  );
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
    if (consultationFormDetails.diagnoses.length == 0) {
      toast.error('Please include at least one diagnosis');
      return;
    }
    const validDiagnosesCategory = consultationFormDetails.diagnoses.every(
      diagnosis =>
        diagnosis.category !== undefined && diagnosis.category !== null
    );

    const validDiagnosesDetails = consultationFormDetails.diagnoses.every(
      diagnosis => diagnosis.details !== '' && diagnosis.details !== null
    );

    if (!validDiagnosesCategory) {
      toast.error('All diagnoses must have a defined category');
    }

    if (!validDiagnosesDetails) {
      toast.error('All diagnoses must have accompanying details');
    }

    if (!validDiagnosesCategory || !validDiagnosesDetails) {
      return;
    }

    try {
      const formPayload = {
        ...consultationFormDetails,
        visit: selectedVisitID,
      };

      const diagnosesPayload = consultationFormDetails.diagnoses.map(
        diagnosis => ({
          details: diagnosis.details,
          category: diagnosis.category,
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
    const value = Number(event.target.value);
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

  async function submitNewOrder() {
    // Non-existent medication check: check if orderFormDetails.medicine (which is the id) is === 0 (which is the default value in the state obj)
    if (orderFormDetails.medicine === 0) {
      toast.error(
        'Please select the name of the medication you would like to prescribe.'
      );
      return;
    }

    // Decimal check, make sure quantity to be added is not an empty string or 0
    if (!orderFormDetails.quantity || orderFormDetails.quantity === '0') {
      // quantity comes from number field but is string due to the workaround of the number field scrolling effect with a text field
      toast.error('Please enter a valid quantity.');
      return;
    }

    // Check if quantity to be ordered < stock
    const stockMedication = medications.find(
      med => orderFormDetails.medicine === med.id
    );
    const quantityStockMedication = stockMedication
      ? stockMedication.quantity
      : 0;
    if (orderFormDetails.quantity > quantityStockMedication) {
      toast.error('Not enough medication in stock.');
      return;
    }

    // get pending quantity of medicine requested
    const pendingQuantity = await axiosInstance
      .get(`/medications/${orderFormDetails.medicine}?order_status=PENDING`)
      .then(res => res.data.pending_quantity);

    // Alert when (pending order + current_order) > stock
    if (
      -pendingQuantity + Number(orderFormDetails.quantity) >
      quantityStockMedication
    ) {
      let alertResult = confirm(`Insufficient Stock!
        Pending: ${-pendingQuantity}
        Requesting: ${orderFormDetails.quantity}
        Current Stock: ${quantityStockMedication} - ${-pendingQuantity} = ${quantityStockMedication + pendingQuantity}
        `);
      if (!alertResult) {
        return;
      }
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
    setOrderFormDetails(blankOrderFormDetails);
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

  if (!mounted) return null;

  return (
    <div className="mt-7 mx-6 overflow-hidden">
      <CustomModal
        isOpen={orderFormModalOpen}
        onRequestClose={toggleOrderFormModal}
        onSubmit={submitNewOrder}
      >
        <OrderForm
          allergies={patient.drug_allergy}
          medications={medications}
          handleInputChange={handleOrderFormChange}
          orderDetails={orderFormDetails}
          medicationOptions={medications
            .sort((a, b) =>
              a.medicine_name
                .toLowerCase()
                .localeCompare(b.medicine_name.toLowerCase())
            )
            .filter(
              med =>
                orders.find(orderMed => orderMed.medicine == med.id) == null
            )
            .map(medication => (
              <option
                key={medication.id}
                value={`${medication.id} ${medication.medicine_name}`}
              >
                {medication.medicine_name}
              </option>
            ))}
        />
      </CustomModal>

      <CustomModal
        isOpen={consultationModalOpen}
        onRequestClose={toggleCustomModal}
      >
        <ConsultationView consult={selectedConsult} />
      </CustomModal>
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
        Patient Consultation
      </h1>
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
      <b>Please remember to press the submit button at the end of the form!</b>
      <hr />
      <div className="grid grid-cols-2 gap-x-4 mb-4">
        {/*Left Column*/}
        <div className="space-y-8">
          {typeof vitals === 'undefined' ? (
            <>
              <label className="label">Vital Signs</label>
              <h2>Not Done</h2>
            </>
          ) : (
            <VitalsTable
              vitals={vitals}
              patient={patient}
              visit={visits.find(visit => visit.id === selectedVisitID)}
            />
          )}

          <ConsultationsTable
            consults={consults}
            buttonOnClick={selectConsult}
          />

          <PrescriptionsTable prescriptions={prescriptions} />

          <HeightWeightGraph
            age={
              new Date(
                visits.find(visit => visit.id === selectedVisitID).date
              ).getFullYear() - new Date(patient.date_of_birth).getFullYear()
            }
            weight={vitals.weight}
            height={vitals.height}
            gender={patient.gender}
          />
        </div>

        {/*Right Column*/}
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
      </div>
    </div>
  );
};

export default withAuth(PatientConsultation);
