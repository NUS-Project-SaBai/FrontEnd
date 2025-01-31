import { submitNewVisit } from '@/pages/registration';
import useWithLoading from '@/utils/loading';
import { Button } from '../TextComponents';

export default function NoVisitPlaceholder({ patient, onRefresh }) {
  const handleNewVisit = useWithLoading(async () =>
    submitNewVisit(patient).then(r => onRefresh())
  );

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h2 className="text-black text-xl">
        This patient has no visits currently
      </h2>
      <p>
        <Button
          text="Create New Visit"
          onClick={handleNewVisit}
          colour="green"
        />
      </p>
    </div>
  );
}
