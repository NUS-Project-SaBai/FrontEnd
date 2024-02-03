export function InputField({ name, label, type, value, onChange }) {
  return (
    <div>
      <label for="first_name" class="block mb-2 text-sm font-medium">
        {label}
      </label>
      <input
        id="first_name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name={name}
        className="input"
        type={type}
        // onWheel={(e) => e.target.blur()}
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}
