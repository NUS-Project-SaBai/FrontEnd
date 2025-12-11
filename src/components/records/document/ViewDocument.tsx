'use client';

import { Button } from '@/components/Button';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import { deleteUpload } from '@/data/fileUpload/deleteUpload';
import { patchUpload } from '@/data/fileUpload/patchUpload';
import { formatDate } from '@/utils/formatDate';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileRow } from './FileRow/FileRow';
import { FileRowItem } from './FileRow/FileRowItem';
import { UploadFile } from '@/types/UploadFile';

export function ViewDocument({
  documents,
  setDocuments,
  isLoading,
}: {
  documents: UploadFile[];
  setDocuments: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const convertToFileRowItem = (doc: UploadFile): FileRowItem => {
    const lastDot = doc.file_name.lastIndexOf('.');
    const fileName =
      lastDot > 0 ? doc.file_name.slice(0, lastDot) : doc.file_name;
    const fileExt = lastDot > 0 ? doc.file_name.slice(lastDot) : '';

    return {
      id: doc.id,
      fileName,
      fileExt,
      description: doc.description,
      previewUrl: doc.file_path || doc.offline_file || '#',
      createdAt: formatDate(doc.created_at, 'datetime'),
    };
  };

  const handleSave = async (
    documentId: number,
    updates: Partial<Pick<UploadFile, 'file_name' | 'description'>>
  ) => {
    const original = documents.find(d => d.id === documentId);
    if (!original) {
      toast.error('Original document not found');
      return;
    }

    const lastDot = original.file_name.lastIndexOf('.');
    const fileExt = lastDot > 0 ? original.file_name.slice(lastDot) : '';
    const trimmedName = updates.file_name
      ? (updates.file_name.trim() + fileExt).trim()
      : original.file_name;
    const trimmedDesc =
      updates.description !== undefined
        ? updates.description.trim()
        : original.description || '';
    const originalName = original.file_name.trim();
    const originalDesc = (original.description || '').trim();

    // Skip API call if nothing changed
    if (trimmedName === originalName && trimmedDesc === originalDesc) {
      toast('No changes to save', {
        icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
      });
      return;
    }

    try {
      const updated = await patchUpload(documentId, {
        file_name: trimmedName,
        description: trimmedDesc,
      });
      setDocuments(ds =>
        ds.map(d => (d.id === documentId && updated ? updated : d))
      );
      toast.success('Document updated');
    } catch (err: unknown) {
      console.error('patchUpload failed:', err);
      let message = 'Unknown error';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { error?: string } | undefined;
        message = data?.error ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(`Failed to update document: ${message}`);
    }
  };

  const handleDelete = async (docId: number, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    try {
      await deleteUpload(docId);
      setDocuments(ds => ds.filter(d => d.id !== docId));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
      console.error('Delete error:', error);
    }
  };

  return (
    <>
      <Button
        text="View Documents"
        onClick={() => setIsOpen(true)}
        colour="blue"
        className='w-24 h-16'
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        size="full"
        ariaHideApp={false}
        title="View Documents"
        text="Close"
      >
        {isLoading ? (
          <LoadingUI message="Loading documents..." />
        ) : documents.length === 0 ? (
          <div className="px-2 py-4 text-center text-gray-500">
            No documents found.
          </div>
        ) : (
          <table className="w-full table-fixed divide-y divide-gray-800 text-left">
            <thead>
              <tr>
                <th className="w-[60%] px-2 py-1">File Name</th>
                <th className="w-[20%] px-2 py-1">Created At</th>
                <th className="w-[15%] px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map(doc => (
                <FileRow
                  key={doc.id}
                  item={convertToFileRowItem(doc)}
                  onSave={async (fileName, description) =>
                    handleSave(doc.id, { file_name: fileName, description })
                  }
                  onDelete={async () => handleDelete(doc.id, doc.file_name)}
                  showCreatedAt={true}
                />
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </>
  );
}
