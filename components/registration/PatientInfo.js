import { DisplayField, Button } from '@/components/TextComponents/';
import { CLOUDINARY_URL } from '@/utils/constants';

export function PatientInfo({ patient, submitNewVisit }) {
  if (!patient.pk) {
    return <div></div>;
  }
  return (
    <div>
      <div>
        <img
          src={`${CLOUDINARY_URL}/${patient.picture}`}
          alt="Placeholder image"
          className="has-ratio h-48 w-48 object-cover"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-2">
        <DisplayField
          label="ID"
          content={`${patient.village_prefix}${patient.pk
            .toString()
            .padStart(3, '0')}`}
        />
        <DisplayField label="Name" content={patient.name} />
        <DisplayField
          label="ID Number"
          content={patient.identification_number}
        />
        <DisplayField label="Gender" content={patient.gender} />
        <DisplayField label="Date of Birth" content={patient.date_of_birth} />
        <DisplayField label="Drug Allergies" content={patient.drug_allergy} />

        <Button
          text="Create New Visit"
          onClick={submitNewVisit}
          colour="green"
        />
      </div>
    </div>
  );
}
