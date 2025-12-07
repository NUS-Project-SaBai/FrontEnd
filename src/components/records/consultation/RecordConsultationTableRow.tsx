import { IconButton } from '@/components/IconButton';
import { Consult } from '@/types/Consult';
import { formatDate } from '@/utils/formatDate';
import {
  DocumentArrowDownIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

export function RecordConsultationTableRow({
  consult,
  openConsultModal,
  onEditConsult,
  onGeneratePDF,
}: {
  consult: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>;
  openConsultModal: (consultId: number) => void;
  onEditConsult: (consultId: number) => void;
  onGeneratePDF: () => void;
}) {
  const ICON_CLASS_STYLE = 'h-6 w-6';

  return (
    <tr>
      <td>{consult.doctor.nickname}</td>
      <td>{consult.referred_for || 'Not Referred'}</td>
      <td>{formatDate(consult.date)}</td>
      <td>
        <div className="flex flex-wrap gap-2">
          <IconButton
            icon={<EyeIcon className={ICON_CLASS_STYLE} />}
            colour="indigo"
            variant="solid"
            label="View consultation"
            onClick={() => openConsultModal(consult.id)}
          />
          <IconButton
            icon={<PencilSquareIcon className={ICON_CLASS_STYLE} />}
            colour="green"
            variant="solid"
            label="Edit consultation"
            onClick={() => onEditConsult(consult.id)}
          />
          <IconButton
            icon={<DocumentArrowDownIcon className={ICON_CLASS_STYLE} />}
            colour="blue"
            variant="solid"
            label="Generate PDF"
            onClick={onGeneratePDF}
          />
        </div>
      </td>
    </tr>
  );
}
