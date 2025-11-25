import { FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { FilePreviewTable } from './FilePreviewTable';
export function FileDropzone({
  files,
  setFiles,
}: {
  files: FileWithPath[];
  setFiles: (file: FileWithPath[]) => void;
}) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop(acceptedFiles, fileRejections, event) {
      const duplicatedFiles = files.filter(file =>
        acceptedFiles.some(newFile => newFile.name === file.name)
      );
      if (duplicatedFiles.length > 0) {
        toast.error(
          `Duplicate file names detected. Please rename them before uploading: \n\n ${duplicatedFiles.map(f => f.name).join(', ')}`,
          { duration: 8000 }
        );
      }

      setFiles([...files, ...acceptedFiles]);
    },
  });
  return (
    <section className="space-y-4">
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            Selected Files ({files.length})
          </h3>
          <FilePreviewTable files={files} />
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
