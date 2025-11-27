import { FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { FilePreviewTable } from './FilePreviewTable';
import imageCompression from 'browser-image-compression';

export type FileItem = {
  file: FileWithPath;
  file_name: string;
  fileExt: string | undefined;
  isDuplicated: boolean;
  description: string;
};
export function FileDropzone({
  files,
  setFiles,
}: {
  files: FileItem[];
  setFiles: (file: FileItem[]) => void;
}) {
  const checkAndMarkDuplicates = (files: FileItem[]): FileItem[] => {
    const nameCount: Record<string, number> = {};
    files.forEach(file => {
      const fullName =
        file.file_name + (file.fileExt ? '.' + file.fileExt : '');
      nameCount[fullName] = (nameCount[fullName] || 0) + 1;
    });
    files.forEach(file => {
      const fullName =
        file.file_name + (file.fileExt ? '.' + file.fileExt : '');
      file.isDuplicated = nameCount[fullName] > 1;
    });
    return files;
  };
  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 1048576 * 10, // 10 MB, don't allow too large files. Storage is limited.
    onDropRejected(fileRejections) {
      fileRejections.forEach(rejection => {
        rejection.errors.forEach(err => {
          if (err.code === 'file-too-large') {
            toast.error(
              `File "${rejection.file.name}" is too large!\nMaximum size is 10 MB.`
            );
          }
        });
      });
    },
    async onDrop(acceptedFiles) {
      const duplicatedFiles = acceptedFiles.filter(file =>
        files.some(f => f.file_name + '.' + f.fileExt === file.name)
      );
      if (duplicatedFiles.length > 0) {
        toast.error(
          `Duplicate file names detected. Please rename them before uploading: \n\n ${duplicatedFiles.map(f => f.name).join(', ')}`,
          { duration: 8000 }
        );
      }

      const newFileItems = await Promise.all(
        acceptedFiles.map(async file =>
          file.type.split('/')[0] === 'image'
            ? await imageCompression(file, {
                maxSizeMB: 1.2,
              })
            : file
        )
      ).then(files =>
        files.map(file => ({
          file: file,
          file_name:
            file.name.lastIndexOf('.') !== -1
              ? file.name.slice(0, file.name.lastIndexOf('.'))
              : file.name,
          fileExt:
            file.type && file.type.split('/')[1]
              ? file.type.split('/')[1]
              : undefined,
          isDuplicated: false,
          description: '',
        }))
      );

      setFiles(checkAndMarkDuplicates([...files, ...newFileItems]));
    },
  });
  const handleDocumentChange = (
    index: number,
    updates: Partial<Pick<FileItem, 'file_name' | 'description'>>
  ) => {
    const updatedFiles = [...files];
    updatedFiles[index] = { ...updatedFiles[index], ...updates };
    setFiles(checkAndMarkDuplicates(updatedFiles));
  };

  const handleRemove = (index: number) => {
    setFiles(checkAndMarkDuplicates(files.filter((_, i) => i !== index)));
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
            onDocumentChange={handleDocumentChange}
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
