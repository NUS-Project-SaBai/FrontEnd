export function ConsultationsTable({ consultRows }) {
  return (
    <div class="shadow-lg rounded-lg overflow-hidden ">
      <table className="w-full table-auto">
        <thead>
          <tr class="bg-gray-100">
            <th class="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Doctor
            </th>
            <th class="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Referred For
            </th>
            <th class="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{consultRows}</tbody>
      </table>
    </div>
  );
}
