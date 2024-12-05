import React, { useEffect, useState } from 'react';
import moment from 'moment';
import withAuth from '@/utils/auth';
import { Button, SearchField, PageTitle } from '@/components/TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import toast from 'react-hot-toast';
import useWithLoading from '@/utils/loading';
import { VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import { VillageDropdown } from '@/pages/records';
import useCachedVillageCode, {
  VILLAGE_CODE_ALL,
} from '@/hooks/useCachedVillageCode';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [searchBy, setSearchBy] = useState('');
  const [villageCode, setVillageCode] = useCachedVillageCode();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    loadPendingOrders();
    loadDiagnoses();
    setCurrentPage(1);
  }, []);

  function filterByVillage() {
    console.log(villageCode);
    if (villageCode === VILLAGE_CODE_ALL) return orders;
    const filteredOrders = orders.filter(order => {
      return order.visit.patient.village_prefix === villageCode;
    });
    console.dir(filteredOrders);
    return filteredOrders;
  }

  function filterById() {
    if (!searchBy) return ordersFilteredByVillage;
    const filteredOrders = ordersFilteredByVillage.filter(order => {
      return order.visit.patient.filter_string
        .toLowerCase()
        .trim()
        .includes(searchBy);
    });
    return filteredOrders;
  }

  const ordersFilteredByVillage = filterByVillage();
  const ordersFilteredById = filterById();

  const loadDiagnoses = useWithLoading(async () => {
    try {
      const { data: diagnoses } = await axiosInstance.get('/diagnosis');
      setDiagnoses(diagnoses);
    } catch (error) {
      toast.error(`Failed to fetch diagnoses: ${error.message}`);
      console.error('Error loading diagnoses:', error);
    }
  });

  const loadPendingOrders = useWithLoading(async () => {
    try {
      const { data: orders } = await axiosInstance.get(
        '/orders?order_status=PENDING'
      );
      setOrders(orders);
    } catch (error) {
      toast.error(`Failed to fetch orders: ${error.message}`);
      console.error('Error loading orders:', error);
    }
  });

  const handleOrderApprove = useWithLoading(async order => {
    if (window.confirm('Are you sure you want to approve this order?')) {
      try {
        await axiosInstance.patch(`/orders/${order.id}`, {
          order_status: 'APPROVED',
        });
        toast.success('Order approved successfully!');
        loadPendingOrders();
      } catch (error) {
        toast.error(`Failed to approve order: ${error.message}`);
        console.error('Error updating orders:', error);
      }
    }
  });

  const handleOrderCancel = useWithLoading(async order => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axiosInstance.patch(`/orders/${order.id}`, {
          order_status: 'CANCELLED',
        });
        toast.success('Order cancelled successfully!');
        loadPendingOrders();
      } catch (error) {
        toast.error(`Failed to cancel order: ${error.message}`);
        console.error('Error updating orders:', error);
      }
    }
  });

  const TableContent = () => {
    return ordersFilteredById.slice(startIndex, endIndex).map(order => {
      const visit = order.visit;
      const patientVillagePrefix = visit.patient.village_prefix;
      const prescriptions = (
        <li key={order.medication_review.id}>
          <b>{order.medication_review.medicine.medicine_name || ''}:</b>{' '}
          {Math.abs(order.medication_review.quantity_changed)}
          <br />
          {order.notes && (
            <div className="w-50 text-wrap">
              <b>Dosage Instructions:</b> {order.notes}
            </div>
          )}
        </li>
      );

      return (
        <tr key={order.id}>
          <td
            className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 ${VILLAGE_COLOR_CLASSES[patientVillagePrefix] || 'text-gray-500'}`}
          >
            {visit.patient.patient_id}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {moment(visit.date).format('DD MMMM YYYY HH:mm')}
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <img
              src={visit.patient.picture}
              alt="Patient"
              className="object-cover h-28 w-28 rounded-lg"
            />
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {visit.patient.name}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <ul>{prescriptions}</ul>
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <ul>
              {diagnoses
                .filter(
                  // Filter by consult
                  diagnosis => {
                    return diagnosis.consult.id === order.consult;
                  }
                )
                .map((diagnosis, index) => (
                  <li key={diagnosis.id}>
                    <b>Diagnosis {index + 1}</b>
                    <p>Category: {diagnosis.category}</p>
                    <p className="w-50 text-wrap">Notes: {diagnosis.details}</p>
                  </li>
                ))}
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
              text="Reject"
              onClick={() => handleOrderCancel(order)}
            />
          </td>
        </tr>
      );
    });
  };

  const Table = () => {
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
                      Dosage
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Diagnoses
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
              currentPage ===
              Math.ceil(ordersFilteredById.length / itemsPerPage)
            }
          >
            Next
          </button>
        </span>
      </div>
    );
  };

  return (
    <div className="mx-4 my-2">
      <PageTitle title="Orders" />
      <div className="field mb-4">
        <div className="control flex items-center space-x-4">
          <VillageDropdown
            value={villageCode}
            handleDropdownChangeWithStyle={e => setVillageCode(e.target.value)}
          />
          <SearchField
            name={'Input Patient Name/ID to Search'}
            label={'Input Patient Name/ID to Search'}
            handleSearchChange={e =>
              setSearchBy(e.target.value.toLowerCase().trim())
            }
          />
        </div>
      </div>
      <Table />
    </div>
  );
};

export default withAuth(Orders);
