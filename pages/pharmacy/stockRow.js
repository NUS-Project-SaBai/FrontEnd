import React from "react";

const StockRow = ({ medication, handleDelete, handleEdit }) => {
  const { medicine_name, quantity, pk } = medication;
  return (
    <tr>
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

export default StockRow;
