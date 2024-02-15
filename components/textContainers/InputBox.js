export function InputBox({ name, label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        rows="5"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        name={name}
        type={type}
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}
