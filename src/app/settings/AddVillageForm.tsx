/**
 * AddVillageForm Component
 *
 * A form component for adding new villages to the system using React Hook Form.
 * Provides validated input fields for village name and color selection.
 */

'use client';

import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddVillageFormData {
  village_name: string;
  colour_code: string;
}

interface AddVillageFormProps {
  onSuccess: () => void; // Callback when village is successfully created
  onCancel: () => void; // Callback when user cancels form
  colorOptions: Array<{ label: string; value: string }>;
}

export function AddVillageForm({
  onSuccess,
  onCancel,
  colorOptions,
}: AddVillageFormProps) {
  // Initialize React Hook Form with empty default values
  const methods = useForm<AddVillageFormData>({
    defaultValues: {
      village_name: '',
      colour_code: '',
    },
  });

  const { handleSubmit, reset } = methods;

  // Handle form submission - trims whitespace, sends POST request, shows toast notifications
  const onSubmit = async (data: AddVillageFormData) => {
    try {
      await axiosClientInstance.post('/villages/', {
        village_name: data.village_name.trim(),
        colour_code: data.colour_code,
      });

      toast.success(`Village "${data.village_name}" created successfully`);
      reset();
      onSuccess();
    } catch (err) {
      // Handle different error types and show appropriate error messages
      if (err instanceof AxiosError) {
        const errorData = err.response?.data;
        if (errorData?.village_name?.[0]) {
          toast.error(errorData.village_name[0]);
        } else if (errorData?.message) {
          toast.error(errorData.message);
        } else {
          toast.error(err.message || 'Failed to create village');
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to create village');
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-gray-300 bg-gray-50 p-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Village
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            title="Close form"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form fields - responsive grid layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RHFInputField
            name="village_name"
            label="Village Name"
            type="text"
            isRequired={true}
            placeholder="Enter village name"
          />

          <RHFDropdown
            name="colour_code"
            label="Color"
            options={colorOptions}
            isRequired={true}
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Village
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
