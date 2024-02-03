export function InputField({ name, label, type, value, onChange }) {
  return (
    <div>
      <label for="first_name" class="block text-base font-xl">
        {label}
      </label>
      <input
        id="first_name"
        class="text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 "
        name={name}
        className="input"
        type={type}
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}
