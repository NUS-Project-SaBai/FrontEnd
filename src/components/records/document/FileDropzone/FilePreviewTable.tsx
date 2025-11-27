import { FileItem } from './FileDropzone';
import { FilePreviewRow } from './FilePreviewRow';

export function FilePreviewTable({
  fileItems,
  onRename,
  onDescriptionChange,
  onRemove,
}: {
  fileItems: FileItem[];
  onRename: (index: number, newName: string) => void;
  onDescriptionChange: (index: number, newDescription: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="max-h-[calc(100vh-28rem)] overflow-y-auto rounded-lg border-2 border-gray-300">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-gray-100 text-left text-sm font-medium text-gray-700">
          <tr>
            <th className="w-8/12">File Name</th>
            <th className="w-2/12">Size</th>
            <th className="w-2/12">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fileItems.map((item, index) => (
            <FilePreviewRow
              key={`${item.file.name}-${index}`}
              fileItem={item}
              onRename={newName => onRename(index, newName)}
              onDescriptionChange={newDescription =>
                onDescriptionChange(index, newDescription)
              }
              onRemove={() => onRemove(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
