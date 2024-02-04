export function InputField({ name, label, type, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={name}
        name={name}
        type={type}
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}
