import { Diagnosis } from '@/types/Diagnosis';

export function DiagnosesTable({ diagnoses }: { diagnoses: Diagnosis[] }) {
  return (
    <div className="rounded-lg border">
      <table className="w-full divide-y-2 text-left">
        <thead>
          <tr className="bg-gray-50">
            <th className="w-[40%] rounded-tl-lg">Category</th>
            <th className="rounded-tr-lg">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {diagnoses &&
            diagnoses.map((diagnosis, i) => (
              <tr key={i}>
                <td>{diagnosis.category}</td>
                <td>{diagnosis.details}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
