export function ConsultationsTable({ consultRows }) {
  return (
    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Referred For</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{consultRows}</tbody>
    </table>
  );
}
