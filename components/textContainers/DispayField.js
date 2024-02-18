export function DisplayField({ label, content }) {
  return (
    <div>
      <label className="block text-xm font-medium text-gray-700 mb-0 ">
        {label}
      </label>
      <div className="bg-gray-200 border text-gray-900 text-sm rounded-lg  block w-full p-3">
        {content}
      </div>
    </div>
  );
}
