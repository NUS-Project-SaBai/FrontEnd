export function InputField({ name, label, type, value, onChange }) {
  return (
    <div>
      <label className="block text-xm font-medium mb-2">{label}</label>
      <input
        className="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg  w-full p-3 "
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
