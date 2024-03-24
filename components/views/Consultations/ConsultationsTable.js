export function ConsultationsTable({ consultRows }) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden mb-4">
      <table className="w-full">
        <thead>
          <tr className="bg-sky-200">
            <th className="w-1/3 py-2 px-2 text-center font-bold uppercase">
              Doctor
            </th>
            <th className="w-1/3 py-2 px-2 text-center font-bold uppercase">
              Referred For
            </th>
            <th className="w-1/3 py-2 px-2 text-center font-bold uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{consultRows}</tbody>
      </table>
    </div>
  );
}
