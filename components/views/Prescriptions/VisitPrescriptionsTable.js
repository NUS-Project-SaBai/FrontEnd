export function VisitPrescriptionsTable({ content: prescriptions }) {
  const prescriptionRows = prescriptions.map((prescription) => {
    console.log(prescription);
    const name = prescription?.medicine?.medicine_name;
    const quantity = prescription.quantity;
    // let doctor = prescription.doctor

    return (
      <tr key={prescription.id}>
        <td>{name}</td>
        <td>{quantity}</td>
        {/* <td>{doctor}</td> */}
      </tr>
    );
  });

  return (
    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Medicine Name</th>
          <th>Quantity</th>
          {/* <th>Doctor</th> */}
        </tr>
      </thead>
      <tbody>{prescriptionRows}</tbody>
    </table>
  );
}
