import React from "react";

export const stockRow = (medication) => {
  return (
    <tr key={medication.pk}>
      <td>{medication.fields.medicine_name}</td>
      <td>{medication.fields.quantity}</td>
      <td className="level-left">
        <button
          className="button is-dark level-item"
          onClick={() =>
            toggleModal(true, { ...medication.fields, pk: medication.pk })
          }
        >
          Edit
        </button>
        <button
          className="button is-danger level-item"
          onClick={() => handleDelete(medication.pk)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
