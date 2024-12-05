import { InputField } from './InputField';

export function SearchField({ name, label, handleSearchChange }) {
  return (
    <div className="field flex-[3]">
      <div className="control">
        <InputField
          type="text"
          name={name}
          label={label}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
