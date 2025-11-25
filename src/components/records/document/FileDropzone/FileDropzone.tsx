import { FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { FilePreviewTable } from './FilePreviewTable';

export type FileItem = {
  file: FileWithPath;
  fileName: string;
  fileExt: string | undefined;
};
export function FileDropzone({
  files,
  setFiles,
}: {
  files: FileItem[];
  setFiles: (file: FileItem[]) => void;
}) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop(acceptedFiles) {
      const duplicatedFiles = files.filter(file =>
        acceptedFiles.some(newFile => newFile.name === file.fileName)
      );
      if (duplicatedFiles.length > 0) {
        toast.error(
          `Duplicate file names detected. Please rename them before uploading: \n\n ${duplicatedFiles.map(f => f.fileName).join(', ')}`,
          { duration: 8000 }
        );
      }

      const newFileItems = acceptedFiles.map(file => ({
        file,
        fileName: file.name.endsWith('.'.concat(file.type.split('/')[1]))
          ? file.name.slice(0, file.name.lastIndexOf('.'))
          : file.name,
        fileExt: file.type.split('/')[1] || undefined,
      }));

      setFiles([...files, ...newFileItems]);
    },
  });
  const handleRename = (index: number, newName: string) => {
    setFiles(
      files.map((item, i) =>
        i === index ? { ...item, fileName: newName } : item
      )
    );
  };

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-4">
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            Selected Files ({files.length})
          </h3>
          <FilePreviewTable
            fileItems={files}
            onRename={handleRename}
            onRemove={handleRemove}
          />
        </div>
      )}

      <div
        {...getRootProps()}
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center shadow-md transition-colors hover:border-gray-400 hover:bg-gray-100"
      >
        <input {...getInputProps({})} />
        <p className="text-gray-600">
          Drag and drop files here, or click to select files
        </p>
        <p className="mt-1 text-sm text-gray-500">Multiple files supported</p>
      </div>
    </section>
  );
}
