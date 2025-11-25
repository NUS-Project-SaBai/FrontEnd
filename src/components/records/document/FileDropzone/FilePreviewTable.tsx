import { FileItem } from './FileDropzone';
import { FilePreviewRow } from './FilePreviewRow';

export function FilePreviewTable({
  fileItems,
  onRename,
  onRemove,
}: {
  fileItems: FileItem[];
  onRename: (index: number, newName: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="max-h-[calc(100vh-28rem)] overflow-y-auto rounded-lg border-2 border-gray-300">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-gray-100 text-left text-sm font-medium text-gray-700">
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fileItems.map((item, index) => (
            <FilePreviewRow
              key={`${item.file.name}-${index}`}
              file={item.file}
              displayName={item.fileName}
              onRename={newName => onRename(index, newName)}
              onRemove={() => onRemove(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
