import { Button } from '@/components/Button';
import { Consult } from '@/types/Consult';

export function RecordConsultationTableRow({
  consult,
  openConsultModal,
}: {
  consult: Consult;
  openConsultModal: (consult: Consult) => void;
}) {
  return (
    <tr>
      <td>{consult.doctor.nickname}</td>
      <td>{consult.referred_for || 'Not Referred'}</td>
      <td>
        <Button text="View" onClick={() => openConsultModal(consult)} />
      </td>
    </tr>
  );
}
