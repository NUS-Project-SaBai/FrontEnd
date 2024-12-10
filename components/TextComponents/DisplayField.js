export function DisplayField({ label, content, highlight, size, textColour }) {
  const highlightColours = {
    red: 'bg-red-200 text-red-900 ring-red-300',
    yellow: 'bg-yellow-200 text-yellow-900 ring-yellow-300',
    grey: 'bg-gray-200 text-gray-900 ring-gray-300',
  };
  return (
    <div>
      <label
        htmlFor={label}
        className={`block text-${size ?? 'sm'} font-medium text-gray-900`}
      >
        {label}
      </label>
      <div
        className={`block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset sm:text-${size ?? 'sm'} sm:leading-6 mt-1 whitespace-pre-wrap ${
          highlightColours[highlight] ??
          'bg-gray-200 text-gray-900 ring-gray-300' //TODO: should not default to highlight grey
        } ${textColour ?? ''}`}
      >
        {content}
      </div>
    </div>
  );
}
