'use client';
import { Button } from '@/components/Button';
import { WebcamInput } from '@/components/inputs/WebcamInput';
import { LoadingUI } from '@/components/LoadingUI';
import { searchFace } from '@/data/patient/searchFace';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../Modal';

export function PatientScanForm({
  setFilteredPatients,
}: {
  setFilteredPatients: Dispatch<SetStateAction<Patient[] | null>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const [imgDetails, setImgDetails] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoadingState(false);
  const onSearch = withLoading(async () => {
    if (imgDetails == null) {
      toast.error('Please take a photo first!');
      return;
    }
    try {
      const { data, isMockData } = await searchFace(imgDetails);
      if (isMockData) {
        toast('Mock facial recognition response', { icon: 'ℹ️' });
      } else if (data.length == 0) {
        toast.error('Patient does not exist!');
        return;
      }
      setFilteredPatients(data);
      closeModal();
    } catch (error) {
      toast.error(`Error scanning face: ${error}`);
      console.error('Error scanning face:', error);
    }
  });
  return (
    <>
      <Button text="Scan Face" onClick={() => setIsOpen(true)} colour="green" />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="Scan Face"
        text="Close"
        className="mx-auto my-8"
      >
        <div className="flex flex-col space-y-2">
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
          </div>
        </div>
      </Modal>
    </>
  );
}
