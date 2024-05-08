import { venueOptions } from "../../utils/constants";

const VenueOptions = ({ handleInputChange }) => (
  <div>
    <label
      htmlFor="Village"
      className="block text-xs font-medium text-gray-900"
    >
      Village
    </label>

    <select
      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      name="village_prefix"
      onChange={handleInputChange}
      default={Object.keys(venueOptions)[0]}
    >
      {Object.entries(venueOptions).map(([key, value]) => (
        <option value={key}>{value}</option>
      ))}{" "}
    </select>

    {/* <input
            name="village_prefix"
            className="input"
            type="text"
            onChange={this.handleInputChange}
            value={formDetails.village_prefix}
          /> */}
  </div>
);

export default VenueOptions;
