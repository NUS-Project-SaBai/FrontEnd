import { FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
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
    <section>
      {files.map(file => (
        <div key={file.name}>
          <strong>File:</strong> {file.name} - {file.size} bytes
        </div>
      ))}
      <div
        {...getRootProps()}
        className="rounded-sm border-2 border-dashed border-gray-300 bg-gray-100 p-8 hover:cursor-pointer"
      >
        <input {...getInputProps({})} />
        <p className="text-center text-gray-500">
          Drag and drop files here, or click here to select file
        </p>
      </div>
    </section>
  );
}
