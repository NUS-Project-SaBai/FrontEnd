'use client';
import { Button } from '@/components/Button';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingUI } from '@/components/LoadingUI';
import { postUpload } from '@/data/fileUpload/postUpload';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import moment from 'moment';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function UploadDocument({
  patient,
  onUploadSuccess,
}: {
  patient: Patient;
  onUploadSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const useFormReturn = useForm({});

  const { isLoading, withLoading } = useLoadingState(false);
  return (
    <>
      <Button
        text="Upload Document"
        colour="green"
        onClick={() => setIsOpen(true)}
      />
      <ReactModal isOpen={isOpen} ariaHideApp={false}>
        <FormProvider {...useFormReturn}>
          <form
            onSubmit={withLoading(async e => {
              e.preventDefault();
              await useFormReturn.handleSubmit(
                async vals => {
                  const file = vals.file[0];

                  const currentDate = moment().format('YYYY-MM-DD');
                  const patientIdentifier = patient.patient_id;
                  const documentName: string =
                    vals.file_name == ''
                      ? file.name
                      : vals.file_name +
                        file.name.slice(file.name.lastIndexOf('.'));

                  const labeledDocumentName = [
                    patientIdentifier,
                    currentDate,
                    documentName,
                  ].join('_');

                  const formData = new FormData();
                  formData.append('file', file, labeledDocumentName);
                  formData.append('file_name', labeledDocumentName);
                  formData.append('patient_pk', patient.pk.toString());

                  try {
                    await postUpload(formData);
                    useFormReturn.reset();
                    setIsOpen(false);
                    toast.success(
                      'File uploaded successfully as \n' + labeledDocumentName
                    );
                    onUploadSuccess();
                  } catch (err) {
                    console.log(err);
                    toast.error('Error uploading file:\n' + err);
                  }
                },
                () => toast.error('Invalid/Missing File/input')
              )();
            })}
          >
            <RHFInputField
              name="file"
              label="File to Upload"
              type="file"
              isRequired={true}
            />
            <RHFInputField name="file_name" label="File Name" type="text" />
            <Button
              text="Close"
              colour="red"
              onClick={() => setIsOpen(false)}
            />
            {isLoading ? (
              <LoadingUI message="Uploading Document..." />
            ) : (
              <Button text="Upload" colour="green" type="submit" />
            )}
          </form>
        </FormProvider>
      </ReactModal>
    </>
  );
}
