'use client';

import { Button } from '@/components/Button';
import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { patchUploadName } from '@/data/fileUpload/patchUploadName';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function ViewDocument({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
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
      setDocuments(ds => ds.map(d => (d.id === doc.id ? updated : d)));
      setEditingId(null);
      toast.success('Document renamed');
    } catch (err) {
      console.error('patchUploadName failed:', err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
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
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <table className="w-full divide-y divide-gray-400 text-left">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td className="pr-4">
                  {editingId === doc.id ? (
                    <input
                      type="text"
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      className="w-full rounded border px-2 py-1"
                    />
                  ) : (
                    <Link
                      href={doc.file_path || doc.offline_file || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {doc.file_name}
                    </Link>
                  )}
                </td>
                <td className="pr-4">
                  {formatDate(doc.created_at, 'datetime')}
                </td>
                <td>
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
        <Button text="Close" onClick={closeModal} colour="red" />
      </ReactModal>
    </>
  );
}
