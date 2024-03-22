export function ConsultationsTable({ consultRows }) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden ">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Doctor
            </th>
            <th className="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Referred For
            </th>
            <th className="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{consultRows}</tbody>
      </table>
    </div>
  );
}
