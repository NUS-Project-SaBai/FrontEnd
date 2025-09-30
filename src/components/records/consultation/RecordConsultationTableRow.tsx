import { Button } from '@/components/Button';
import { Consult } from '@/types/Consult';

export function RecordConsultationTableRow({
  consult,
  openConsultModal,
  onGeneratePDF,
}: {
  consult: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>;
  openConsultModal: (consultId: number) => void;
  onGeneratePDF: () => void;
}) {
  return (
    <tr>
      <td>{consult.doctor.nickname}</td>
      <td>{consult.referred_for || 'Not Referred'}</td>
      <td>
        <Button text="View" onClick={() => openConsultModal(consult.id)} />
      </td>
      <td>
        <Button text="Generate PDF" onClick={() => onGeneratePDF()} />
      </td>
    </tr>
  );
}
