'use client';
import { Button } from '@/components/Button';
import { WebcamInput } from '@/components/inputs/WebcamInput';
import { LoadingUI } from '@/components/LoadingUI';
import { searchFace } from '@/data/patient/searchFace';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function PatientScanForm({
  setSelectedPatient,
}: {
  setSelectedPatient: (patient: Patient) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const [imgDetails, setImgDetails] = useState<string | null>(null);
  const [scanSuggestionsList, setScanSuggestionsList] = useState<Patient[]>([]);
  const { isLoading, withLoading } = useLoadingState(false);
  const onSearch = withLoading(async () => {
    if (imgDetails == null) {
      toast.error('Please take a photo first!');
      return;
    }
    try {
      const data = await searchFace(imgDetails);
      if (data.length == 0) {
        toast.error('Patient does not exist!');
        return;
      }
      setScanSuggestionsList(data);
    } catch (error) {
      toast.error(`Error scanning face: ${error}`);
      console.error('Error scanning face:', error);
    }
  });
  return (
    <>
      <Button text="Scan Face" onClick={() => setIsOpen(true)} colour="green" />

      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <WebcamInput
          imageDetails={imgDetails}
          setImageDetails={setImgDetails}
        />
        <div className="flex justify-center space-x-2">
          {isLoading ? (
            <LoadingUI message="Searching Face..." />
          ) : (
            <Button
              text="Search"
              colour="green"
              Icon={<MagnifyingGlassIcon className="inline h-5 w-5" />}
              onClick={onSearch}
            />
          )}
          <Button text="Close" onClick={closeModal} colour="red" />
        </div>
        <div className="flex w-full flex-col divide-y-2">
          {scanSuggestionsList.map((patient, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedPatient(patient);
                closeModal();
              }}
              className="flex py-2 hover:cursor-pointer hover:bg-gray-300"
            >
              <Image
                src={patient.picture_url}
                alt={'Patient Image'}
                width={120}
                height={120}
              />
              <div className="w-full items-center p-2">
                <p>{patient.patient_id}</p>
                <p>{patient.name}</p>
                <p>{patient.confidence}</p>
              </div>
            </div>
          ))}
        </div>
      </ReactModal>
    </>
  );
}
