import { Patient } from '@/types/Patient';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useReducer } from 'react';

type ReducerState = {
  queryStr: string;
  patient: null | Patient;
  patientList: Patient[];
  suggestions: Patient[];
};

type ReducerAction =
  | { type: 'updateQueryStr'; value: string }
  | { type: 'setPatient'; value: Patient }
  | { type: 'updatePatientList'; value: Patient[] };

export function RegistrationAutosuggest({
  patientList,
  setPatient,
}: {
  patientList: Patient[];
  setPatient: Dispatch<SetStateAction<Patient | null>>;
}) {
  const [{ queryStr, suggestions, patient }, dispatch] = useReducer(reducer, {
    queryStr: '',
    patient: null,
    patientList: patientList,
    suggestions: [],
  });

  useEffect(() => {
    if (patient != null) {
      setPatient(patient);
    }
  }, [patient, setPatient]);

  useEffect(() => {
    dispatch({ type: 'updatePatientList', value: patientList });
  }, [patientList]);

  return (
    <div>
      <input
        type="search"
        placeholder="Search Patient"
        className="w-full rounded-md border-2 border-gray-200 p-1 placeholder:text-gray-400"
        onChange={e =>
          dispatch({ type: 'updateQueryStr', value: e.target.value })
        }
        value={queryStr}
      />
      <div className="rounded-md border-2 border-gray-300">
        {suggestions.map(patient => (
          <SuggestionItem
            key={patient.patient_id}
            patient={patient}
            onClick={() => dispatch({ type: 'setPatient', value: patient })}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestionItem({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="grid grid-cols-2 items-center border-b-2 border-gray-200 p-1 hover:cursor-pointer hover:bg-blue-200"
    >
      <Image
        src={patient.picture_url}
        alt="Patient Picture"
        width={100}
        height={100}
      />
      <div className="flex flex-col">
        <p className="font-semibold">{patient.patient_id}</p>
        <p>{patient.name}</p>
      </div>
    </div>
  );
}

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'updateQueryStr':
      const inputValue = action.value.trim().toLowerCase();
      const filteredResult =
        inputValue.length == 0
          ? []
          : state.patientList.filter(patient =>
              patient.filter_string.toLowerCase().includes(inputValue)
            );
      return {
        ...state,
        queryStr: action.value,
        suggestions: filteredResult,
      };
    case 'setPatient':
      return {
        ...state,
        patient: action.value,
        queryStr: action.value.name,
        suggestions: [],
      };
    case 'updatePatientList':
      return { ...state, patientList: action.value };
  }
}
