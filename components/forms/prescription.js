import React from "react";

class PrescriptionForm extends React.Component {
  constructor() {
    super();
  }

  calculateMedicineCurrentStock(medicine) {
    let { medications } = this.props;

    let medication = medications.filter((med) => {
      return medicine == med.id;
    });

    if (medication.length > 0) return medication[0].quantity;
    return 0;
  }

  calculateMedicineReservedStock(medicine) {
    let { reservedMedications } = this.props;

    if (typeof reservedMedications[medicine] === "undefined") return 0;
    else return reservedMedications[medicine];
  }

  render() {
    let {
      allergies,
      handleInputChange,
      formDetails,
      medicationOptions,
      onSubmit,
    } = this.props;
    return (
      <div className="column is-12">
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Prescription</h1>

        <div className="field">
          <label className="label">Allergies</label>
          <h2 style={{ color: "red" }}>{allergies}</h2>
        </div>

        <div className="field">
          <label className="label">Medicine</label>
          <div className="select is-fullwidth">
            <select name={"medication"} onChange={handleInputChange}>
              <option value={"0 Dummy"}>-</option>
              {medicationOptions}
            </select>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label">In Stock</label>
            <h2>{this.calculateMedicineCurrentStock(formDetails.medicine)}</h2>
          </div>

          <div className="control is-expanded">
            <label className="label">Currently Reserved</label>
            <h2>{this.calculateMedicineReservedStock(formDetails.medicine)}</h2>
          </div>

          <div className="control is-expanded">
            <label className="label">Quantity to be ordered</label>
            <div className="control">
              <input
                name="quantity"
                className="input"
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={handleInputChange}
                value={formDetails.quantity}
              />
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Notes</label>
          <div className="control">
            <textarea
              name="notes"
              className="textarea"
              placeholder="Textarea"
              onChange={handleInputChange}
              value={formDetails.notes}
            />
          </div>
        </div>

        <button
          className="button is-dark is-medium level-item"
          style={{ marginTop: 15 }}
          onClick={onSubmit}
        >
          Edit
        </button>
      </div>
    );
  }
}

export { PrescriptionForm };
