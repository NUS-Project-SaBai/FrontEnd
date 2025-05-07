'use client';

import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Button } from '../Button';

export function ViewDocument({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Upload[]>([]);
  useEffect(() => {
    getUploadByPatientId(patient.pk).then(data => {
      setDocuments(data);
    });
  }, [patient.pk]);
  return (
    <>
      <Button
        text="View Documents"
        onClick={() => setIsOpen(true)}
        colour="blue"
      />
      <ReactModal isOpen={isOpen} ariaHideApp={false}>
        <table className="w-full divide-y divide-gray-400 text-left">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <Link
                  href={doc.file_path || doc.offline_file || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  <td>{doc.file_name}</td>
                </Link>
                <td>{new Date(doc.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button text="Close" onClick={() => setIsOpen(false)} colour="red" />
      </ReactModal>
    </>
  );
}
