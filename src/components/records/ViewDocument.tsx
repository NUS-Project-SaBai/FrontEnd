'use client';

import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { patchUploadName } from '@/data/fileUpload/patchUploadName';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import { formatDate } from '@/utils/formatDate';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function ViewDocument({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Upload[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    getUploadByPatientId(patient.pk).then(data => {
      setDocuments(data);
    });
  }, [patient.pk]);

  // handle the rename action
  const handleRename = async (doc: Upload) => {
    try {
      const updated = await patchUploadName(doc.id, newFileName);
      setDocuments(ds =>
        ds.map(d => (d.id === doc.id && updated ? updated : d))
      );
      setEditingId(null);
      setNewFileName('');
      toast.success('Document renamed');
    } catch (err: unknown) {
      console.error('patchUploadName failed:', err);
      let message = 'Unknown error';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { error?: string } | undefined;
        message = data?.error ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(`Failed to rename document: ${message}`);
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
        ariaHideApp={false}
        title="View Documents"
        text="Close"
      >
        <table className="w-full table-fixed divide-y divide-gray-400 text-left">
          <colgroup>
            <col className="w-1/2" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
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
                <td className="px-2 py-1">
                  {editingId === doc.id ? (
                    <input
                      type="text"
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      className="w-full rounded border px-2 py-1"
                    />
                  ) : (
                    <Link
                      href={doc.file_path || doc.offline_file || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.file_name}
                    </Link>
                  )}
                </td>
                <td className="px-2 py-1">
                  {formatDate(doc.created_at, 'datetime')}
                </td>
                <td className="px-2 py-1">
                  {editingId === doc.id ? (
                    <div className="flex space-x-2">
                      <Button
                        text="Save"
                        colour="green"
                        onClick={() => handleRename(doc)}
                      />
                      <Button
                        text="Cancel"
                        colour="red"
                        onClick={() => {
                          setEditingId(null);
                          setNewFileName('');
                        }}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Edit"
                      colour="green"
                      onClick={() => {
                        setEditingId(doc.id);
                        setNewFileName(doc.file_name);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button text="Close" onClick={() => setIsOpen(false)} colour="red" />
      </Modal>
    </>
  );
}
