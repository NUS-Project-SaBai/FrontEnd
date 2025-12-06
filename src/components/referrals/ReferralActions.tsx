import { Button } from '@/components/Button';
import { Referral } from '@/types/Referral';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

export function ReferralActions({
    referral,
    onGeneratePDF,
}: {
    referral: Referral;
    onGeneratePDF: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 p-3">
            <Link href={`./referrals/${referral.id}`}>
                <Button
                    text="Referral Details"
                    colour="green"
                    Icon={<PencilSquareIcon className="h-5 w-5" />}
                />
            </Link>
            <Button
                text="Consult PDF"
                Icon={<ClipboardList className="h-5 w-5" />}
                onClick={onGeneratePDF}
                colour="indigo"
            />
        </div>
    );
}
