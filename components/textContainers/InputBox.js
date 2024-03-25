export function InputBox({ name, label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900 mt-4"
      >
        {label} 123
      </label>
      <div className="">
        <textarea
          rows={4}
          id={name}
          placeholder={placeholder}
          name={name}
          type={type}
          onChange={onChange}
          value={value}
          required
          className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          defaultValue={""}
        />
      </div>
    </div>
  );
}
