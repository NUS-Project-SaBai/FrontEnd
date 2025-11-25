import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function FilePreviewRow({ file }: { file: File }) {
  const ICON_CLASS_STYLE = 'h-5 w-5';

  return (
    <tr key={`${file.name}`} className="text-sm hover:bg-gray-50">
      <td>
        <p className="font-mono">{file.name}</p>
      </td>
      <td className="whitespace-nowrap">{(file.size / 1024).toFixed(2)} KB</td>
      <td>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="rounded p-2 text-blue-500 transition-colors hover:bg-blue-50"
            aria-label="Edit file name"
          >
            <PencilIcon className={ICON_CLASS_STYLE} />
          </button>
          <button
            type="button"
            className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
            aria-label="Remove file"
          >
            <XMarkIcon className={ICON_CLASS_STYLE} />
          </button>
        </div>
      </td>
    </tr>
  );
}
