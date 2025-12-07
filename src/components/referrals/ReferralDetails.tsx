import { VILLAGES } from '@/constants';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import { formatDate } from '@/utils/formatDate';
import { ReferralStateDropdown } from './ReferralStateDropdown';

export function ReferralDetails({
    patient,
    date,
    referral,
}: {
    patient: Patient;
    date: string;
    referral: Referral;
}) {
    return (
        <div className="grid items-center justify-center p-2">
            <div className="grid justify-center">
                <p className="text-center">
                    Patient ID:&nbsp;
                    <span className={'font-bold ' + VILLAGES[patient.village_prefix].color}>
                        {patient.patient_id}
                    </span>
                </p>
                <p className="text-center">Name: {patient.name}</p>
                <p className="text-center">
                    Visited on: {formatDate(date, 'date')}
                </p>
            </div>
            <div className="mt-2">
                <ReferralStateDropdown referral={referral} />
            </div>
        </div>
    );
}
