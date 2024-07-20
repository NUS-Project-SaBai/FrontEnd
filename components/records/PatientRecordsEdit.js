import { DisplayField } from '@/components/TextComponents';
import { CLOUDINARY_URL } from '@/utils/constants';

export function PatientRecordsEdit({ content }) {
  const patientFields = [
    { label: 'Name', value: content.name },
    { label: 'ID Number', value: content.identification_number },
    { label: 'Contact Number', value: content.contact_no },
    { label: 'Gender', value: content.gender },
    { label: 'Date of Birth', value: content.date_of_birth },
    { label: 'Village', value: content.village_prefix },
    { label: 'POOR Card', value: content.poor },
    { label: 'BS2 Card', value: content.bs2 },
    { label: 'Drug Allergies', value: content.drug_allergy },
  ];

  function renderTableField(field) {
    if (field.label === '') {
      return <div></div>;
    }

    return (
      <DisplayField
        key={field.label}
        label={field.label}
        content={field.value}
        highlight={field.highlight}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {patientFields.map(field => renderTableField(field))}
      <img
        src={`${CLOUDINARY_URL}/${content.picture}`}
        alt="Placeholder image"
        className="h-48 w-48 object-cover rounded-md place-self-center"
      />
    </div>
  );
}
