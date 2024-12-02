import { InputField } from './InputField';

export default function SearchField({ handleSearchChange }) {
  return (
    <div className="field flex-[3]">
      <div className="control">
        <InputField
          type="text"
          name="Input Patient Name/ID to Search"
          label="Input Patient Name/ID to Search"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
