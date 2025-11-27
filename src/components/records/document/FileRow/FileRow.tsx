import { IconButton } from '@/components/IconButton';
import { useLoadingState } from '@/hooks/useLoadingState';
import {
  ArrowUturnLeftIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { FileRowItem } from './FileRowItem';

export function FileRow({
  item,
  onSave,
  onDelete,
  showSize = false,
  showCreatedAt = false,
}: {
  item: FileRowItem;
  onSave: (fileName: string, description: string) => Promise<void>;
  onDelete: () => Promise<void>;
  showSize?: boolean;
  showCreatedAt?: boolean;
}) {
  const ICON_CLASS_STYLE = 'h-5 w-5';
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.fileName);
  const [editDescription, setEditDescription] = useState(
    item.description || ''
  );
  const { isLoading: isSubmitting, withLoading } = useLoadingState();

  const handleSave = withLoading(async () => {
    await onSave(editName, editDescription);
    setIsEditing(false);
  });

  const handleDelete = withLoading(onDelete);

  const handleCancel = () => {
    setEditName(item.fileName);
    setEditDescription(item.description || '');
    setIsEditing(false);
  };

  return (
    <tr
      className={` ${
        item.isDuplicated
          ? 'bg-red-100 text-sm hover:bg-red-200'
          : 'text-sm hover:bg-gray-50'
      } ${isSubmitting ? 'pointer-events-none opacity-50' : ''} `}
    >
      <td className={showSize ? 'py-3' : 'px-2 py-3'}>
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full rounded border px-2 py-1 font-mono"
                placeholder="File name"
              />
              <p className="font-mono">{item.fileExt}</p>
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
          <div className={showSize ? 'space-y-1' : 'space-y-3.5'}>
            <Link
              title="Preview document in new tab"
              href={item.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={
                showSize
                  ? 'font-mono text-blue-500 underline'
                  : 'py-1 text-blue-600 underline'
              }
            >
              {item.fileName}
              {item.fileExt}
            </Link>
            {item.description ? (
              <p
                className={
                  showSize
                    ? 'text-sm text-gray-700'
                    : 'py-1 text-sm text-gray-600'
                }
              >
                {item.description}
              </p>
            ) : (
              <p
                className={
                  showSize
                    ? 'text-sm italic text-gray-400'
                    : 'py-1 text-sm italic text-gray-400'
                }
              >
                No description
              </p>
            )}
          </div>
        )}
      </td>

      {showSize && item.size && (
        <td className="whitespace-nowrap">{item.size}</td>
      )}

      {showCreatedAt && item.createdAt && (
        <td className="px-2 py-1">{item.createdAt}</td>
      )}

      <td className={showSize ? '' : 'px-2 py-1'}>
        <div
          className={
            showSize
              ? 'flex items-center justify-center gap-2'
              : 'flex flex-col gap-2 md:flex-row'
          }
        >
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
                icon={
                  showSize ? (
                    <XMarkIcon className={ICON_CLASS_STYLE} />
                  ) : (
                    <TrashIcon className={ICON_CLASS_STYLE} />
                  )
                }
                colour="red"
                label={showSize ? 'Remove file' : 'Delete file'}
                onClick={handleDelete}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
