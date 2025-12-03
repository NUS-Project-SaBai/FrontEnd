import { useEffect, useMemo } from 'react';
import { FileRow } from '../FileRow/FileRow';
import { FileItem } from './FileDropzone';

export function FilePreviewTable({
  fileItems,
  onDocumentChange,
  onRemove,
}: {
  fileItems: FileItem[];
  onDocumentChange: (
    index: number,
    updates: Partial<Pick<FileItem, 'file_name' | 'description'>>
  ) => void;
  onRemove: (index: number) => void;
}) {
  const fileRowItems = useMemo(() => {
    return fileItems.map((item, index) => {
      const bytes = item.file.size;
      const kb = bytes / 1024;
      const sizeDisplay =
        kb >= 1000 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;

      return {
        id: `${item.file.name}-${index}`,
        fileName: item.file_name,
        fileExt: item.fileExt ? `.${item.fileExt}` : '',
        description: item.description,
        previewUrl: URL.createObjectURL(item.file),
        size: sizeDisplay,
        isDuplicated: item.isDuplicated,
      };
    });
  }, [fileItems]);

  // Cleanup blob URLs when component unmounts or fileItems change
  useEffect(() => {
    return () => {
      fileRowItems.forEach(item => {
        URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [fileRowItems]);

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
          {fileRowItems.map((item, index) => (
            <FileRow
              key={item.id}
              item={item}
              onSave={async (newName, newDescription) => {
                onDocumentChange(index, {
                  file_name: newName,
                  description: newDescription,
                });
              }}
              onDelete={async () => onRemove(index)}
              showSize={true}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
