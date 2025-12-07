'use client';

import { Button } from '@/components/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Diagnosis } from '@/types/Diagnosis';
const diagnosisOptions = [
  'Cardiovascular',
  'Dermatology',
  'Ear Nose Throat',
  'Endocrine',
  'Eye',
  'Gastrointestinal',
  'Haematology',
  'Infectious Diseases',
  'Renal & Genitourinary',
  'Respiratory',
  'Musculoskeletal',
  'Neurology',
  'Obstetrics & Gynaecology',
  'Oral Health',
  'Others',
];
export function DiagnosisField({
  diagnosis,
  setDiagnosis,
  error,
}: {
  diagnosis: Omit<Diagnosis, 'consult'>[];
  setDiagnosis: (diagnoses: Omit<Diagnosis, 'consult'>[]) => void;
  error: string | undefined;
}) {
  const EMPTY_DIAGNOSIS = { details: '', category: '' };
  return (
    <div
      className={
        'flex flex-col gap-1 ' +
        (error ? 'rounded border-2 border-red-500' : '')
      }
    >
      <p>
        Diagnosis<span className="text-red-500">*</span>
      </p>
      {error && <p className="font-semibold text-red-500">{error}</p>}
      {diagnosis.map((val, index) => (
        <DiagnosisInputRow
          key={index}
          diagnosisNumber={index + 1}
          diagnosis={val}
          onDiagnosisDelete={() => {
            setDiagnosis(diagnosis.filter((_, i) => i !== index));
          }}
          onDiagnosisEdit={curDiagnosis => {
            const newDiagnosis = [...diagnosis];
            newDiagnosis[index] = curDiagnosis;
            setDiagnosis(newDiagnosis);
          }}
        />
      ))}
      <Button
        colour="green"
        text="Add Diagnosis"
        onClick={() => setDiagnosis([...diagnosis, EMPTY_DIAGNOSIS])}
      />
    </div>
  );
}

function DiagnosisInputRow({
  diagnosisNumber,
  diagnosis,
  onDiagnosisDelete,
  onDiagnosisEdit,
}: {
  diagnosisNumber: number;
  diagnosis: Omit<Diagnosis, 'consult'>;
  onDiagnosisDelete: () => void;
  onDiagnosisEdit: (curDiagnosis: Omit<Diagnosis, 'consult'>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label>
        Diagnosis {diagnosisNumber}
        <span className="text-red-500">*</span>
      </label>
      <textarea
        placeholder="Type your diagnosis here..."
        rows={6}
        value={diagnosis.details}
        onChange={e => {
          onDiagnosisEdit({ ...diagnosis, details: e.target.value });
        }}
      />
      <Select
        value={diagnosis.category}
        onValueChange={val => onDiagnosisEdit({ ...diagnosis, category: val })}
      >
        <SelectTrigger className="w-full rounded-md border-2 bg-white p-2 text-gray-900">
          <SelectValue placeholder="Select category..." />
        </SelectTrigger>
        <SelectContent>
          {diagnosisOptions.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        colour="red"
        text={`Delete Diagnosis ${diagnosisNumber}`}
        onClick={onDiagnosisDelete}
      />
    </div>
  );
}
