import { venueOptions } from "../../utils/constants";

const VenueOptions = ({ handleInputChange }) => (
  <div className="field is-grouped">
    <div className="control is-expanded">
      <label className="label">Village Prefix</label>
      <div className="control">
        <div className="select">
          <select
            name="village_prefix"
            onChange={handleInputChange}
            default={Object.keys(venueOptions)[0]}
          >
            {Object.entries(venueOptions).map(([key, value]) => (
              <option value={key}>{value}</option>
            ))}{" "}
          </select>
        </div>
        {/* <input
            name="village_prefix"
            className="input"
            type="text"
            onChange={this.handleInputChange}
            value={formDetails.village_prefix}
          /> */}
      </div>
    </div>
  </div>
);

export default VenueOptions;
