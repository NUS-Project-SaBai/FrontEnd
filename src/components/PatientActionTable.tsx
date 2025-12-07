import { PatientPhoto } from '@/components/PatientPhoto';
import { VILLAGES } from '@/constants';
import { Patient } from '@/types/Patient';
import { ReactNode } from 'react';

/**
 * Generic patient table with customizable columns and action slots
 */
export interface PatientActionTableProps<T> {
  /** Array of data items that include patient information */
  items: T[];
  /** Function to extract patient from the data item */
  getPatient: (item: T) => Patient;
  /** Optional custom columns to render after patient photo */
  customColumns?: (item: T) => ReactNode;
  /** Custom actions/buttons to render in the actions column */
  renderActions: (item: T) => ReactNode;
  /** Optional custom table headers */
  headers?: {
    photo?: string;
    customColumns?: string;
    actions?: string;
  };
  /** Optional key extractor for list rendering */
  getKey?: (item: T) => string | number;
  /** Optional class name for the table */
  className?: string;
}

export function PatientActionTable<T>({
  items,
  getPatient,
  customColumns,
  renderActions,
  headers = {},
  getKey,
  className = '',
}: PatientActionTableProps<T>) {
  const defaultHeaders = {
    photo: headers.photo || 'Photo',
    customColumns: headers.customColumns || 'Details',
    actions: headers.actions || 'Actions',
  };

  return (
    <table className={`w-full divide-y-2 divide-gray-500 ${className}`}>
      <thead>
        <tr>
          <th>{defaultHeaders.photo}</th>
          {customColumns && <th>{defaultHeaders.customColumns}</th>}
          <th>{defaultHeaders.actions}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const patient = getPatient(item);
          const key = getKey ? getKey(item) : index;

          return (
            <tr key={key}>
              <td>
                <PatientPhoto
                  pictureUrl={patient.picture_url}
                  width={180}
                  height={180}
                  className="justify-self-center"
                />
              </td>
              {customColumns && <td>{customColumns(item)}</td>}
              <td>{renderActions(item)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/**
 * Compact patient table variant with patient ID, photo, name, and actions in a horizontal layout
 */
export interface CompactPatientTableProps {
  patients: Patient[];
  renderActions: (patient: Patient) => ReactNode;
  headers?: {
    id?: string;
    photo?: string;
    name?: string;
    actions?: string;
    extra?: string;
  };
  className?: string;
  /** Optional extra information column renderer (e.g., last visit, referral state) */
  extraColumn?: (patient: Patient) => ReactNode;
}

// (Implementation moved below as a thin wrapper around Generic variant)

// Generic compact table variant for heterogeneous items that include a patient
export interface CompactPatientTableGenericProps<T> {
  items: T[];
  getPatient: (item: T) => Patient;
  renderActions: (item: T) => ReactNode;
  headers?: {
    id?: string;
    photo?: string;
    name?: string;
    actions?: string;
    extra?: string;
  };
  className?: string;
  extraColumn?: (item: T) => ReactNode;
  getKey?: (item: T) => string | number;
  columnClassNames?: {
    id?: string;
    photo?: string;
    name?: string;
    extra?: string;
    actions?: string;
  };
}

export function CompactPatientTableGeneric<T>({
  items,
  getPatient,
  renderActions,
  headers = {},
  className = '',
  extraColumn,
  getKey,
  columnClassNames = {},
}: CompactPatientTableGenericProps<T>) {
  const defaultHeaders = {
    id: headers.id || 'ID',
    photo: headers.photo || 'Photo',
    name: headers.name || 'Full Name',
    actions: headers.actions || 'Actions',
    extra: headers.extra || 'Additional Info',
  };
  const thClasses = {
    id: columnClassNames.id ?? 'w-[10%]',
    photo: columnClassNames.photo ?? 'w-[20%]',
    name: columnClassNames.name ?? 'w-[25%]',
    extra: columnClassNames.extra ?? 'w-[25%]',
    actions: columnClassNames.actions ?? 'w-[20%]',
  };

  return (
    <table
      className={`w-full divide-y-2 divide-gray-500 text-left ${className}`}
    >
      <thead>
        <tr className="py-8">
          <th className={thClasses.id}>{defaultHeaders.id}</th>
          <th className={thClasses.photo}>{defaultHeaders.photo}</th>
          <th className={thClasses.name}>{defaultHeaders.name}</th>
          {extraColumn && (
            <th className={thClasses.extra}>{defaultHeaders.extra}</th>
          )}
          <th className={thClasses.actions}>{defaultHeaders.actions}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300">
        {items.map(item => {
          const patient = getPatient(item);
          const key = getKey ? getKey(item) : patient.pk;
          return (
            <tr key={key}>
              <td
                className={
                  'font-semibold ' + VILLAGES[patient.village_prefix].color
                }
              >
                {patient.patient_id}
              </td>
              <td>
                <PatientPhoto pictureUrl={patient.picture_url} />
              </td>
              <td>{patient.name}</td>
              {extraColumn && <td>{extraColumn(item)}</td>}
              <td>{renderActions(item)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Backwards-compatible thin wrapper: delegates to CompactPatientTableGeneric
export function CompactPatientTable({
  patients,
  renderActions,
  headers = {},
  className = '',
  extraColumn,
}: CompactPatientTableProps) {
  return (
    <CompactPatientTableGeneric
      items={patients}
      getPatient={p => p}
      renderActions={p => renderActions(p)}
      headers={headers}
      className={className}
      extraColumn={extraColumn ? p => extraColumn(p) : undefined}
      getKey={p => p.pk}
      columnClassNames={{
        id: 'w-[10%]',
        photo: 'w-[25%] md:w-[10%]',
        name: 'w-[25%]',
        extra: extraColumn ? 'w-[20%]' : undefined,
        actions: 'w-[20%]',
      }}
    />
  );
}
