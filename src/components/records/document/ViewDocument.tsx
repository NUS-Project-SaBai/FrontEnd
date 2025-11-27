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
  InformationCircleIcon,
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
  documents: UploadFile[];
  setDocuments: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  isLoading: boolean;
}) {
  const ICON_CLASS_STYLE = 'h-5 w-5';
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileExt, setNewFileExt] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleEdits = async (documentId: number) => {
    const original = documents.find(d => d.id === documentId);
    if (!original) {
      toast.error('Original document not found');
      return;
    }
    const trimmedName = (newFileName.trim() + newFileExt).trim();
    const trimmedDesc = newDescription.trim();
    const originalName = original.file_name.trim();
    const originalDesc = (original.description || '').trim();

    // Skip API call if nothing changed
    if (trimmedName === originalName && trimmedDesc === originalDesc) {
      setEditingId(null);
      setNewFileName('');
      setNewFileExt('');
      setNewDescription('');
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
      setEditingId(null);
      setNewFileName('');
      setNewFileExt('');
      setNewDescription('');
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

  const handleDelete = async (docId: number) => {
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
                <tr key={doc.id}>
                  <td className="px-2 py-3">
                    {editingId === doc.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newFileName}
                            onChange={e => setNewFileName(e.target.value)}
                            className="w-full rounded border px-2 py-1 font-mono"
                            placeholder="File name"
                          />
                          <p className="font-mono">{newFileExt}</p>
                        </div>
                        <input
                          type="text"
                          value={newDescription}
                          onChange={e => setNewDescription(e.target.value)}
                          className="w-full rounded border px-2 py-1 text-sm"
                          placeholder="Add description..."
                        />
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <Link
                          href={doc.file_path || doc.offline_file || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 text-blue-600 underline"
                        >
                          {doc.file_name}
                        </Link>
                        {doc.description ? (
                          <p className="py-1 text-sm text-gray-600">
                            {doc.description}
                          </p>
                        ) : (
                          <p className="py-1 text-sm italic text-gray-400">
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
                      <div className="flex flex-col gap-2 md:flex-row">
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
                            setNewFileExt('');
                            setNewDescription('');
                          }}
                          colour="red"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 md:flex-row">
                        <IconButton
                          icon={<PencilIcon className={ICON_CLASS_STYLE} />}
                          label="Edit"
                          onClick={() => {
                            setEditingId(doc.id);
                            const lastDot = doc.file_name.lastIndexOf('.');
                            if (lastDot > 0) {
                              setNewFileName(doc.file_name.slice(0, lastDot));
                              setNewFileExt(doc.file_name.slice(lastDot));
                            } else {
                              setNewFileName(doc.file_name);
                              setNewFileExt('');
                            }
                            setNewDescription(doc.description || '');
                          }}
                          colour="blue"
                        />
                        <IconButton
                          icon={<TrashIcon className={ICON_CLASS_STYLE} />}
                          label="Delete"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${doc.file_name}?`
                              )
                            ) {
                              handleDelete(doc.id);
                            }
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
