import { FileWithPath } from 'react-dropzone';
import { FilePreviewRow } from './FilePreviewRow';

export function FilePreviewTable({ files }: { files: FileWithPath[] }) {
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
          {files.map((file, index) => (
            <FilePreviewRow key={`${file.name}`} file={file} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
