export function DisplayField({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div>
      <label htmlFor={label} className="text-sm font-medium">
        {label}
      </label>
      <p className="w-full rounded-md bg-gray-200 p-1.5 shadow-sm">{content}</p>
    </div>
  );
}
