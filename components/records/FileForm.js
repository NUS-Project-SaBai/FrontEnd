import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axiosInstance from '@/pages/api/_axiosInstance';

export function FileForm({ patient }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (patient !== null) {
      axiosInstance
        .get(`/upload?patient_pk=${patient.pk}`)
        .then(response => {
          setFiles(response.data);
        })
        .catch(error => console.error('Error loading page', error));
    }
  }, []);

  useEffect(() => {
    renderRows();
  }, [files]);

  function renderRows() {
    // Displays the list of medications in stock
    const tableRows = files
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(file => {
        const time = moment(file.created_at).format('DD MMMM YYYY HH:mm');
        const file_name = file.file_name;
        const file_url = file.file_path;

        return (
          <tr key={file.id}>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <a
                href={file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {file_name}
              </a>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {time}
            </td>
          </tr>
        );
      });
    return tableRows;
  }

  return (
    <div className="space-y-2">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      File name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
