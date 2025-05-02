export function DisplayField({
  label,
  content,
  highlight = '',
}: {
  label: string;
  content: string;
  highlight?: 'bg-red-200' | 'bg-amber-200' | 'bg-green-200' | '';
}) {
  return (
    <div className="self-end">
      <label htmlFor={label} className="text-sm font-medium">
        {label}
      </label>
      <p
        className={
          'w-full rounded-md p-1.5 text-gray-600 shadow-sm ' +
          (highlight || 'bg-gray-200')
        }
      >
        {content}
      </p>
    </div>
  );
}
