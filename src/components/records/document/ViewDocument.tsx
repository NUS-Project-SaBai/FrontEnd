'use client';

import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import { deleteUpload } from '@/data/fileUpload/deleteUpload';
import { patchUpload } from '@/data/fileUpload/patchUpload';
import { Upload } from '@/types/Upload';
import { formatDate } from '@/utils/formatDate';
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function ViewDocument({
  documents,
  setDocuments,
  isLoading,
}: {
  documents: Upload[];
  setDocuments: React.Dispatch<React.SetStateAction<Upload[]>>;
  isLoading: boolean;
}) {
  const ICON_CLASS_STYLE = 'h-5 w-5';
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleEdits = async (documentId: number) => {
    try {
      const updated = await patchUpload(documentId, {
        file_name: newFileName,
        description: newDescription,
      });
      setDocuments(ds =>
        ds.map(d => (d.id === documentId && updated ? updated : d))
      );
      setEditingId(null);
      setNewFileName('');
      setNewDescription('');
      toast.success('Document updated');
    } catch (err: unknown) {
      console.error('patchUploadName failed:', err);
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

  const handleDelete = async (docId: number) => {
    deleteUpload(docId).then(() => {
      setDocuments(ds => ds.filter(d => d.id !== docId));
    });
  };

  return (
    <>
      <Button
        text="View Documents"
        onClick={() => setIsOpen(true)}
        colour="blue"
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
                <th className="px-2 py-1">File Name</th>
                <th className="px-2 py-1">Created At</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td className="px-2 py-3">
                    {editingId === doc.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newFileName}
                          onChange={e => setNewFileName(e.target.value)}
                          className="w-full rounded border px-2 py-1"
                          placeholder="File name"
                        />
                        <input
                          type="text"
                          value={newDescription}
                          onChange={e => setNewDescription(e.target.value)}
                          className="w-full rounded border px-2 py-1 text-sm"
                          placeholder="Add description..."
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Link
                          href={doc.file_path || doc.offline_file || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {doc.file_name}
                        </Link>
                        {doc.description ? (
                          <p className="text-sm text-gray-600">
                            {doc.description}
                          </p>
                        ) : (
                          <p className="text-sm italic text-gray-400">
                            No description
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-1">
                    {formatDate(doc.created_at, 'datetime')}
                  </td>
                  <td className="px-2 py-1">
                    {editingId === doc.id ? (
                      <div className="flex space-x-2">
                        <IconButton
                          icon={<CheckIcon className={ICON_CLASS_STYLE} />}
                          label="Save"
                          onClick={() => handleEdits(doc.id)}
                          colour="green"
                        />
                        <IconButton
                          icon={<XMarkIcon className={ICON_CLASS_STYLE} />}
                          label="Cancel"
                          onClick={() => {
                            setEditingId(null);
                            setNewFileName('');
                            setNewDescription('');
                          }}
                          colour="red"
                        />
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <IconButton
                          icon={<PencilIcon className={ICON_CLASS_STYLE} />}
                          label="Edit"
                          onClick={() => {
                            setEditingId(doc.id);
                            setNewFileName(doc.file_name);
                            setNewDescription(doc.description || '');
                          }}
                          colour="blue"
                        />
                        <IconButton
                          icon={<TrashIcon className={ICON_CLASS_STYLE} />}
                          label="Delete"
                          onClick={() => {
                            confirm(
                              `Are you sure you want to delete ${doc.file_name}?`
                            ) && handleDelete(doc.id);
                          }}
                          colour="red"
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </>
  );
}
