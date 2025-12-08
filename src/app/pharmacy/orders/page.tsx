'use client';
import { IconButton } from '@/components/IconButton';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientPhoto } from '@/components/PatientPhoto';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { VILLAGES_AND_ALL } from '@/constants';
import { VillageContext } from '@/context/VillageContext';
import { patchOrder } from '@/data/order/patchOrder';
import { useLoadingState } from '@/hooks/useLoadingState';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { formatDate } from '@/utils/formatDate';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { fetchAllPatientMedicationOrders } from './api';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

type OrderRowData = {
  patient: {
    patient_id: string;
    name: string;
    picture_url: string;
    village_prefix: VillagePrefix;
  };
  data: {
    orders: {
      order_id: number;
      medication_name: string;
      medication_code: string;
      quantity_changed: number;
      is_low_stock: boolean;
      notes: string;
    }[];
    diagnoses: { category: string; details: string }[];
    visit_id: number;
    visit_date: string;
  }[];
};

export default function OrdersPage() {
  const [orderRowData, setOrderRowData] = useState<OrderRowData[]>([]);
  const [filteredOrderRowData, setFilteredOrderRowData] = useState<
    OrderRowData[]
  >([]);
  const { isLoading, withLoading } = useLoadingState(true);

  const isLoadingRef = useRef(isLoading);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState<boolean>(false);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  const { village } = useContext(VillageContext);

  const fetchPendingOrders = withLoading(async () => {
    const result = await fetchAllPatientMedicationOrders();
    setOrderRowData(result);
    setFilteredOrderRowData(result);
  });

  const silentRefresh = async () => {
    try {
      // Call API directly without loading
      const result = await fetchAllPatientMedicationOrders();
      
      // Update the main data state
      setOrderRowData(result);
      setFilteredOrderRowData(result);

    } catch (error) {
      console.error("Background refresh failed", error);
      // Suppress UI errors for background refreshes to avoid annoying the user
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPendingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refresh interval
  useEffect(() => {
    // If auto refresh is off, don't start an interval
    if (!isAutoRefreshEnabled) return;

    const intervalId = setInterval(() => {
      if (!isLoadingRef.current) {
        silentRefresh();
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [isAutoRefreshEnabled]);

  return (
    <LoadingPage isLoading={isLoading} message="Loading Pending Orders...">
      <div className="p-2">
        <h1>Orders</h1>
        <Suspense>
          <div className="flex items-center justify-between">
            {/* Left: Search */}
            <div className="flex-1 max-w-full flex items-center">
              <PatientSearchbar
                data={useMemo(
                  () =>
                    orderRowData.filter(
                      x =>
                        village === VillagePrefix.ALL ||
                        x.patient.village_prefix === village
                    ),
                  [orderRowData, village]
                )}
                setFilteredItems={setFilteredOrderRowData}
                filterFunction={useCallback(
                  (query: string) => (item: OrderRowData) =>
                    item.patient.patient_id.toLowerCase().includes(query.toLowerCase()) ||
                    item.patient.name.toLowerCase().includes(query.toLowerCase()),
                  []
                )}
              />
            </div>

            {/* Auto-Refresh Toggle */}
            <label className="flex flex-col gap-1 cursor-pointer pl-6 items-center">
              <span className="text-sm text-muted-foreground">
                Auto Refresh:{" "}
                <span
                  className={
                    isAutoRefreshEnabled
                      ? "text-green-500 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {isAutoRefreshEnabled ? "On" : "Off"}
                </span>
              </span>

              <Switch
                checked={isAutoRefreshEnabled}
                onCheckedChange={setIsAutoRefreshEnabled}
                id="auto-refresh"
              />
            </label>
          </div>
        </Suspense>
        <div className="pt-4">
          <table className="w-full text-left">
            <thead className="border-b-2">
              <tr>
                <th>
                  <p>ID / Full Name</p>
                  <p>Photo</p>
                </th>
                <th>
                  <p>Visit On</p>
                </th>
                <th>Diagnoses</th>
                <th>Prescriptions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrderRowData.length == 0 ? (
                <tr>
                  <td className="col-span-4">No Pending Orders</td>
                </tr>
              ) : (
                filteredOrderRowData.map((x, index) => (
                  <OrderRow
                    key={x.patient?.patient_id || index}
                    orderRowData={x}
                    removeNonPendingOrder={fetchPendingOrders}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LoadingPage>
  );
}

function OrderRow({
  orderRowData: { patient, data },
  removeNonPendingOrder,
}: {
  orderRowData: OrderRowData;
  removeNonPendingOrder: (id: number) => void;
}) {
  const onPatchError = (err: Error, medicine_name: string) => {
    toast.error(() => (
      <p>
        {err.message}
        <br />
        <br />
        <b>Patient: </b>
        {patient.name}
        <br />
        <b>Medicine: </b>
        {medicine_name}
      </p>
    ));
  };

  return (
    <>
      <tr>
        {/* rowSpan is data.length + 1 because the current row has no data. */}
        <td className="px-0" rowSpan={data.length + 1}>
          {/* Hacky regex workaround cuz backend send patient_id with village prefix and padded zeroes*/}
          <Link href={`/records/patient-record?id=${patient.patient_id.replace(/^..0+/, "")}`}>
            <p
              className={
                'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
              }
            >
              {patient.patient_id}
            </p>
            <p className="font-semibold">{patient.name}</p>
            <PatientPhoto
              pictureUrl={patient.picture_url}
              className="h-24 w-20 object-cover"
              height={80}
              width={80}
            />
          </Link>
        </td>
      </tr>
      {data.map(({ visit_id, visit_date, orders, diagnoses }) => (
        <tr key={visit_id}>
          <td>
            <p className="text-nowrap">
              {visit_date ? formatDate(visit_date, 'datetime') : 'No Date'}
            </p>
          </td>
          <td className="min-w-60 text-gray-700">
            {diagnoses.map((d, i) => (
              <li key={i} className="list-none text-sm">
                <b>Diagnosis {i + 1}</b>
                <p>Category: {d.category}</p>
                <p>{d.details}</p>
              </li>
            ))}
          </td>
          <td className="p-0">
            <div className="flex flex-col divide-y-2">
              {orders.map((o, i) => (
                <div
                  key={i}
                  className={clsx(
                    'flex justify-between p-1.5 text-sm text-gray-700 hover:bg-slate-100', // base styling
                    o.is_low_stock && 'bg-red-100' // highlight if low stock
                  )}
                >
                  <div>
                    {o.is_low_stock && (
                      <p className="mb-1.5 font-bold text-red-600">
                        Warning: Low Stock!
                      </p>
                    )}
                    <p>
                      <b>{o.medication_name}: </b>
                      {Math.abs(o.quantity_changed)}
                    </p>
                    <p>
                      <b>Dosage Instruction: </b>
                      {o.notes}
                    </p>
                    <p>
                      <b> Code: </b>
                      {o.medication_code || 'N/A'}
                    </p>
                  </div>
                  <ApproveRejectOrderButton
                    handleApproveOrder={async () => {
                      await patchOrder(o.order_id.toString(), 'APPROVED')
                        .then((r) => {
                          if ('error' in r) {
                            onPatchError(new Error(r.error), o.medication_name);
                            return;
                          }
                          removeNonPendingOrder(o.order_id)
                        })
                    }}
                    handleCancelOrder={async () => {
                      await patchOrder(o.order_id.toString(), 'CANCELLED')

                        .then((r) => {
                          if ('error' in r) {
                            onPatchError(new Error(r.error), o.medication_name);
                            return;
                          }
                          removeNonPendingOrder(o.order_id)
                        })
                    }}
                  />
                </div>
              ))}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

function ApproveRejectOrderButton({
  handleApproveOrder,
  handleCancelOrder,
}: {
  handleApproveOrder: () => void;
  handleCancelOrder: () => void;
}) {
  const ICON_CLASS_STYLE = 'h-6 w-8';
  const { isLoading: isUpdating, withLoading } = useLoadingState(false);
  const [actionStr, setActionStr] = useState('');
  return isUpdating ? (
    <LoadingUI message={actionStr} />
  ) : (
    <div className="flex items-center gap-2">
      <IconButton
        icon={<CheckIcon className={ICON_CLASS_STYLE} />}
        colour="green"
        variant="solid"
        label="Approve Order"
        onClick={withLoading(async () => {
          setActionStr('Approving Order...');
          handleApproveOrder();
        })}
      />
      <IconButton
        icon={<XMarkIcon className={ICON_CLASS_STYLE} />}
        colour="red"
        variant="solid"
        label="Cancel Order"
        onClick={withLoading(async () => {
          setActionStr('Cancelling Order...');
          await handleCancelOrder();
        })}
      />
    </div>
  );
}
