'use client';
import { postUpload } from '@/data/fileUpload/postUpload';
import { Patient } from '@/types/Patient';
import moment from 'moment';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { Button } from '../Button';
import { RHFInputField } from '../inputs/RHFInputField';

export function UploadDocument({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const useFormReturn = useForm({});

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
            onSubmit={e => {
              e.preventDefault();
              useFormReturn.handleSubmit(
                vals => {
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

                  postUpload(formData)
                    .then(() => {
                      useFormReturn.reset();
                      setIsOpen(false);
                      toast.success(
                        'File uploaded successfully as \n' + labeledDocumentName
                      );
                    })
                    .catch(err => {
                      console.log(err);
                      toast.error('Error uploading file:\n' + err);
                    });
                },
                () => toast.error('Invalid/Missing File/input')
              )();
            }}
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
            <Button text="Upload" colour="green" type="submit" />
          </form>
        </FormProvider>
      </ReactModal>
    </>
  );
}
