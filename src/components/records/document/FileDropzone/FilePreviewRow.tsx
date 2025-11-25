import {
  ArrowUturnLeftIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FileItem } from './FileDropzone';

export function FilePreviewRow({
  fileItem,
  onRename,
  onRemove,
}: {
  fileItem: FileItem;
  onRename: (newName: string) => void;
  onRemove: () => void;
}) {
  const ICON_CLASS_STYLE = 'h-5 w-5';
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(fileItem.fileName);

  const handleSave = () => {
    onRename(editName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(fileItem.fileName);
    setIsEditing(false);
  };

  return (
    <tr key={`${fileItem.file.name}`} className="text-sm hover:bg-gray-50">
      <td>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full rounded border px-2 py-1 font-mono"
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <p className="font-mono">.{fileItem.fileExt}</p>
          </div>
        ) : (
          <p className="font-mono">
            {fileItem.fileName}.{fileItem.fileExt}
          </p>
        )}
      </td>
      <td className="whitespace-nowrap">
        {(fileItem.file.size / 1024).toFixed(2)} KB
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                className="rounded p-2 text-green-500 transition-colors hover:bg-green-50"
                aria-label="Save file name"
                title="Save file name"
                onClick={handleSave}
              >
                <CheckIcon className={ICON_CLASS_STYLE} />
              </button>
              <button
                type="button"
                className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                aria-label="Cancel edit"
                title="Cancel edit"
                onClick={handleCancel}
              >
                <ArrowUturnLeftIcon className={ICON_CLASS_STYLE} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded p-2 text-blue-500 transition-colors hover:bg-blue-50"
                aria-label="Edit file name"
                title="Edit file name"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className={ICON_CLASS_STYLE} />
              </button>
              <button
                type="button"
                className="rounded p-2 text-red-500 transition-colors hover:bg-red-50"
                aria-label="Remove file"
                title="Remove file"
                onClick={onRemove}
              >
                <XMarkIcon className={ICON_CLASS_STYLE} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
