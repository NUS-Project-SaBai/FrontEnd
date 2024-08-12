import axios from 'axios';
import CustomModal from '@/components/CustomModal';
import toast from 'react-hot-toast';
import { useState } from 'react';
import {
  API_URL,
  CLOUDINARY_URL,
  MATCH_FOUND_MESSAGE,
  NO_MATCHES_FOUND_MESSAGE,
  NO_PHOTO_MESSAGE,
} from '@/utils/constants';
import { urltoFile } from '@/utils/helpers';
import Link from 'next/link';
import { Button } from '@/components/TextComponents';

export function ScanModal({
  modalIsOpen,
  cameraIsOpen,
  imageDetails,
  closeScanModal,
  renderWebcam,
  toggleCameraOpen,
}) {
  const [matchedPatientData, setMatchedPatientData] = useState(null);

  const scanPatient = async () => {
    if (imageDetails == null) {
      toast.error(NO_PHOTO_MESSAGE);
      return;
    }

    const scanPatientFormData = new FormData();
    scanPatientFormData.append(
      'picture',
      await urltoFile(imageDetails, 'patient_screenshot.jpg', 'image/jpg')
    );

    try {
      const response = await axios.post(
        `${API_URL}/patients/search`,
        scanPatientFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMatchedPatientData(response.data);
      toast.success(MATCH_FOUND_MESSAGE);
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(NO_MATCHES_FOUND_MESSAGE);
      } else if (error.response.status === 400) {
        toast.error(NO_PHOTO_MESSAGE);
      }
    }
  };

  return (
    <CustomModal
      isOpen={modalIsOpen}
      onRequestClose={closeScanModal}
      content={
        <div>
          <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
            Scan Face
          </h1>
          <div className="flex flex-col items-center">
            {!cameraIsOpen && (
              <div className="h-64 w-64 bg-gray-400 flex items-center justify-center">
                {imageDetails != null && (
                  <img src={imageDetails} alt="Scanned Image" />
                )}
              </div>
            )}

            {cameraIsOpen && <div>{renderWebcam()}</div>}

            <div className="flex items-center justify-center mt-4 space-x-4">
              {cameraIsOpen ? (
                <Button text="Cancel" colour="red" onClick={toggleCameraOpen} />
              ) : (
                <Button
                  text="Take Photo"
                  colour="green"
                  onClick={toggleCameraOpen}
                />
              )}

              <Button
                text="Search Image"
                onClick={scanPatient}
                colour="green"
              />
            </div>
          </div>

          <hr className="my-4" />

          <label className="block text-lg font-medium text-gray-900 mb-2">
            Results
          </label>
          {matchedPatientData ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link
                        href={`/record?id=${matchedPatientData.patient.id}`}
                      >
                        {matchedPatientData.patient.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {matchedPatientData.patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <img
                        src={`${CLOUDINARY_URL}/${matchedPatientData.patient.picture}`}
                        alt="Patient Photo"
                        className="h-16 w-16 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {matchedPatientData.confidence.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <h2 className="text-center text-lg text-red-600">
              No matches found!
            </h2>
          )}
        </div>
      }
    />
  );
}
