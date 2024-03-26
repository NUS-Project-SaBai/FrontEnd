import React from "react";

export const StockRow = ({ medication, handleDelete, handleEdit }) => {
  const { medicine_name, quantity, pk } = medication;
  return (
    <tr key={pk}>
      <td>{medicine_name}</td>
      <td>{quantity}</td>
      <td className="level-left">
        <button
          className="button is-dark level-item"
          onClick={() => handleEdit()}
        >
          Edit
        </button>
        <button
          className="button is-danger level-item"
          onClick={() => handleDelete()}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
