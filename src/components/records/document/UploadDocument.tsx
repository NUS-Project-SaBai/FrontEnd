'use client';
import { Button } from '@/components/Button';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import {
  FileDropzone,
  FileItem,
} from '@/components/records/document/FileDropzone/FileDropzone';
import { postUpload } from '@/data/fileUpload/postUpload';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function UploadDocument({
  patient,
  onUploadSuccess,
}: {
  patient: Patient;
  onUploadSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const useFormReturn = useForm<{ files: FileItem[] }>({});

  const { isLoading, withLoading } = useLoadingState(false);

  return (
    <>
      <Button
        text="Upload Document"
        colour="green"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="Upload Document"
        text="Close"
      >
        <FormProvider {...useFormReturn}>
          <form
            onSubmit={async e => {
              e.preventDefault();
              withLoading(
                useFormReturn.handleSubmit(
                  async vals => {
                    const currentDate = DateTime.now().toFormat('yyyy-MM-dd');
                    const patientIdentifier = patient.patient_id;
                    const commonPrefix = patientIdentifier + '_' + currentDate;

                    const formData = new FormData();
                    vals.files.forEach(fileItem => {
                      formData.append(
                        'files',
                        fileItem.file,
                        commonPrefix +
                          '_' +
                          fileItem.file_name +
                          (fileItem.fileExt ? '.' + fileItem.fileExt : '')
                      );
                    });
                    formData.append('patient_pk', patient.pk.toString());
                    vals.files.forEach(fileItem => {
                      formData.append('descriptions', fileItem.description);
                    });

                    try {
                      const message = await postUpload(formData);
                      useFormReturn.reset();
                      closeModal();
                      toast.success(message);
                      onUploadSuccess();
                    } catch (err) {
                      console.error(err);
                      toast.error('Error uploading file:\n' + err);
                    }
                  },
                  errors => {
                    toast.error(
                      errors.files?.message || 'Invalid/Missing Files'
                    );
                  }
                )
              )();
            }}
          >
            <Controller
              control={useFormReturn.control}
              name="files"
              defaultValue={[]}
              rules={{
                validate: {
                  duplicateCheck: val => {
                    if (
                      val.some((fileItem: FileItem) => fileItem.isDuplicated)
                    ) {
                      return 'Please ensure there are no duplicate file names.';
                    }
                    return true;
                  },
                  required: val => {
                    if (val.length === 0) {
                      return 'Please upload at least one file.';
                    }
                    return true;
                  },
                },
              }}
              render={({ field: { value, onChange } }) => (
                <FileDropzone files={value || []} setFiles={onChange} />
              )}
            />

            <div className="flex gap-2 py-2">
              <Button text="Close" colour="red" onClick={closeModal} />
              {isLoading ? (
                <LoadingUI message="Uploading Document..." />
              ) : (
                <Button text="Upload" colour="green" type="submit" />
              )}
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
}
