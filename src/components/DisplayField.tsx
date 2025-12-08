export function DisplayField({
  label,
  content,
  highlight = '',
  spanFull = false,
}: {
  label?: string;
  content: string | React.JSX.Element;
  highlight?: 'bg-red-200' | 'bg-amber-200' | 'bg-green-200' | '';
  spanFull?: boolean;
}) {
  return (
    <div className={`w-full self-end ${spanFull ? 'col-span-full' : ''}`}>
      <label htmlFor={label} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={
          'w-full rounded-md p-1.5 text-gray-600 shadow-sm ' +
          (highlight || 'bg-gray-200')
        }
      >
        {content}
      </div>
    </div>
  );
}
