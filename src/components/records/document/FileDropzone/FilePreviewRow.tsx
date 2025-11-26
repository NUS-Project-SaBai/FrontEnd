import { IconButton } from '@/components/IconButton';
import {
  ArrowUturnLeftIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { FileItem } from './FileDropzone';

export function FilePreviewRow({
  fileItem,
  onRename,
  onDescriptionChange,
  onRemove,
}: {
  fileItem: FileItem;
  onRename: (newName: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  onRemove: () => void;
}) {
  const ICON_CLASS_STYLE = 'h-5 w-5';
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(fileItem.fileName);
  const [editDescription, setEditDescription] = useState(fileItem.description);

  const handleSave = () => {
    onRename(editName);
    onDescriptionChange(editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(fileItem.fileName);
    setEditDescription(fileItem.description);
    setIsEditing(false);
  };

  return (
    <tr
      key={`${fileItem.file.name}`}
      className={
        fileItem.isDuplicated
          ? 'bg-red-100 text-sm hover:bg-red-200'
          : 'text-sm hover:bg-gray-50'
      }
    >
      <td className="py-3">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full rounded border px-2 py-1 font-mono"
              />
              <p className="font-mono">.{fileItem.fileExt}</p>
            </div>
            <input
              type="text"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
              placeholder="Add description..."
            />
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              title="Preview document in new tab"
              href={URL.createObjectURL(fileItem.file)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="font-mono text-blue-500 underline">
                {fileItem.fileName}.{fileItem.fileExt}
              </p>
            </Link>
            {fileItem.description ? (
              <p className="text-sm text-gray-700">{fileItem.description}</p>
            ) : (
              <p className="text-sm italic text-gray-400">No description</p>
            )}
          </div>
        )}
      </td>
      <td className="whitespace-nowrap">
        {(() => {
          const bytes = fileItem.file.size;
          const kb = bytes / 1024;
          if (kb >= 1000) {
            return `${(kb / 1024).toFixed(2)} MB`;
          } else {
            return `${kb.toFixed(2)} KB`;
          }
        })()}
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {isEditing ? (
            <>
              <IconButton
                icon={<CheckIcon className={ICON_CLASS_STYLE} />}
                colour="green"
                label="Save changes"
                onClick={handleSave}
              />
              <IconButton
                icon={<ArrowUturnLeftIcon className={ICON_CLASS_STYLE} />}
                colour="red"
                label="Cancel edit"
                onClick={handleCancel}
              />
            </>
          ) : (
            <>
              <IconButton
                icon={<PencilIcon className={ICON_CLASS_STYLE} />}
                colour="blue"
                label="Edit file"
                onClick={() => setIsEditing(true)}
              />
              <IconButton
                icon={<XMarkIcon className={ICON_CLASS_STYLE} />}
                colour="red"
                label="Remove file"
                onClick={onRemove}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
