export function InputField({ name, label, type, value, onChange }) {
  return (
    <div>
      <label for="first_name" class="block text-base font-xl">
        {label}
      </label>
      <input
        id="first_name"
        class="text-sm rounded-lg block w-full  bg-green-200 "
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
