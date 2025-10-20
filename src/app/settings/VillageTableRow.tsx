/**
 * VillageTableRow Component
 *
 * Represents a single village row in the village management table.
 * Supports inline editing with React Hook Form, visibility toggling,
 * and color selection.
 */

'use client';

import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Village {
  id: number;
  village_name: string;
  colour_code: string;
  is_hidden: boolean;
}

interface VillageTableRowProps {
  village: Village; // The village data to display
  onUpdate: () => void; // Callback to refresh data after updates
  colorOptions: Array<{ label: string; value: string }>;
}

export function VillageTableRow({
  village,
  onUpdate,
  colorOptions,
}: VillageTableRowProps) {
  const [isEditing, setIsEditing] = useState(false); // Track whether this row is in edit mode

  // Initialize React Hook Form with current village data
  const methods = useForm({
    defaultValues: {
      village_name: village.village_name,
      colour_code: village.colour_code,
    },
  });

  const { handleSubmit, reset } = methods;

  // Enter edit mode and reset form with current village data// Start editing mode
  const startEditing = () => {
    setIsEditing(true);
    reset({
      village_name: village.village_name,
      colour_code: village.colour_code,
    });
  };

  // Exit edit mode without saving changes// Cancel editing mode
  const cancelEditing = () => {
    setIsEditing(false);
    reset();
  };

  // Save village changes via PATCH request and exit edit mode on success
  const saveVillage = async (data: {
    village_name: string;
    colour_code: string;
  }) => {
    try {
      await axiosClientInstance.patch(`/villages/${village.id}/`, {
        village_name: data.village_name.trim(),
        colour_code: data.colour_code,
      });

      toast.success('Village updated successfully');
      setIsEditing(false);
      onUpdate(); // Refresh parent data
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            'Failed to update village'
        );
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update village');
      }
    }
  };

  // Toggle village visibility (show/hide) via PATCH request
  const toggleVisibility = async () => {
    try {
      await axiosClientInstance.patch(`/villages/${village.id}/`, {
        is_hidden: !village.is_hidden,
      });

      toast.success(
        `Village ${village.is_hidden ? 'shown' : 'hidden'} successfully`
      );
      onUpdate(); // Refresh parent data
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            'Failed to update village visibility'
        );
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update village visibility');
      }
    }
  };

  return (
    <tr className={isEditing ? 'bg-blue-50' : ''}>
      {/* Village Name Column */}
      <td className="whitespace-nowrap px-6 py-4">
        {isEditing ? (
          <FormProvider {...methods}>
            <RHFInputField
              name="village_name"
              label=""
              type="text"
              isRequired={true}
            />
          </FormProvider>
        ) : (
          <div className="text-sm font-medium text-gray-900">
            {village.village_name}
          </div>
        )}
      </td>

      {/* Color Column */}
      <td className="whitespace-nowrap px-6 py-4">
        {isEditing ? (
          <FormProvider {...methods}>
            <RHFDropdown
              name="colour_code"
              label=""
              options={colorOptions}
              omitDefaultPrompt={true}
            />
          </FormProvider>
        ) : (
          <span className={`text-sm font-semibold ${village.colour_code}`}>
            ● {village.colour_code.replace('text-', '').replace('-400', '')}
          </span>
        )}
      </td>

      {/* Status Column - Shows visible/hidden badge */}
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            village.is_hidden
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {village.is_hidden ? 'Hidden' : 'Visible'}
        </span>
      </td>

      {/* Actions Column */}
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              {/* Save Button */}
              <button
                onClick={handleSubmit(saveVillage)}
                className="text-green-600 hover:text-green-900"
                title="Save changes"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
              {/* Cancel Button */}
              <button
                onClick={cancelEditing}
                className="text-gray-600 hover:text-gray-900"
                title="Cancel editing"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              {/* Edit Button */}
              <button
                onClick={startEditing}
                className="text-indigo-600 hover:text-indigo-900"
                title="Edit village"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              {/* Toggle Visibility Button */}
              <button
                onClick={toggleVisibility}
                className={`${
                  village.is_hidden
                    ? 'text-green-600 hover:text-green-900'
                    : 'text-red-600 hover:text-red-900'
                }`}
                title={village.is_hidden ? 'Show village' : 'Hide village'}
              >
                {village.is_hidden ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
