/**
 * Settings Page - Village Management
 *
 * Administrative page for managing villages in the system. Provides functionality to:
 * - View all villages (including hidden ones)
 * - Add new villages with name and color
 * - Edit existing village names and colors
 * - Hide/show villages (soft delete for data compatibility)
 *
 * Villages are never actually deleted. Villages
 * can be hidden to prevent them from appearing in new forms while preserving
 * historical data relationships.
 */

'use client';
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface Village {
  id: number;
  village_name: string;
  colour_code: string;
  is_hidden: boolean;
}

interface NewVillageForm {
  village_name: string;
  colour_code: string;
}

export default function SettingsPage() {
  // State for storing all villages (including hidden ones)
  const [villages, setVillages] = useState<Village[]>([]);
  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);
  // Error state for displaying error messages
  const [error, setError] = useState<string | null>(null);
  // State for tracking which village is currently being edited
  const [editingId, setEditingId] = useState<number | null>(null);
  // Form data for editing existing villages
  const [editForm, setEditForm] = useState({
    village_name: '',
    colour_code: '',
  });
  // State for controlling the visibility of the add new village form
  const [showAddForm, setShowAddForm] = useState(false);
  // Form data for adding new villages
  const [addForm, setAddForm] = useState<NewVillageForm>({
    village_name: '',
    colour_code: '',
  });

  //const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';
  //const backendUrl = APP_CONFIG.BACKEND_API_URL;

  // Predefined color options for easy selection
  const colorOptions = [
    { label: 'Red', value: 'text-red-400' },
    { label: 'Blue', value: 'text-blue-400' },
    { label: 'Green', value: 'text-green-400' },
    { label: 'Yellow', value: 'text-yellow-400' },
    { label: 'Purple', value: 'text-purple-400' },
    { label: 'Pink', value: 'text-pink-400' },
    { label: 'Indigo', value: 'text-indigo-400' },
    { label: 'Orange', value: 'text-orange-400' },
    { label: 'Teal', value: 'text-teal-400' },
    { label: 'Gray', value: 'text-gray-400' },
  ];

  // Fetch all villages (including hidden ones)
  const fetchAllVillages = async () => {
    try {
      setLoading(true);
      // Use include_hidden=true to get all villages for admin management
      const response = await axiosClientInstance.get(
        '/villages/?include_hidden=true'
      );
      setVillages(response.data);
    } catch (err) {
      // Handle different error types with appropriate messaging
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch villages'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch villages');
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle village visibility
  const toggleVillageVisibility = async (
    villageId: number,
    currentVisibility: boolean
  ) => {
    try {
      // Send PATCH request to update only the is_hidden field
      await axiosClientInstance.patch(`/villages/${villageId}/`, {
        is_hidden: !currentVisibility,
      });

      // Update local state to reflect the change immediately
      setVillages(villages =>
        villages.map(village =>
          village.id === villageId
            ? { ...village, is_hidden: !currentVisibility }
            : village
        )
      );
    } catch (err) {
      // Handle errors and display to user
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to update village'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update village');
      }
    }
  };

  // Add new village
  const addVillage = async () => {
    // Validate form data before submission
    if (!addForm.village_name || !addForm.colour_code) {
      setError('Please fill in all fields for the new village');
      return;
    }

    try {
      // Create new village (is_hidden defaults to false for new villages)
      const response = await axiosClientInstance.post('/villages/', {
        ...addForm,
        is_hidden: false,
      });

      // Add the new village to local state
      setVillages(villages => [...villages, response.data]);

      // Reset form and hide the add form
      setAddForm({ village_name: '', colour_code: '' });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      // Handle validation errors and other errors
      if (err instanceof AxiosError) {
        const errorData = err.response?.data;

        // Check for specific field validation errors
        if (errorData?.village_name?.[0]) {
          setError(errorData.village_name[0]);
        } else if (errorData?.message) {
          setError(errorData.message);
        } else {
          setError(err.message || 'Failed to create village');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create village');
      }
    }
  };

  // Start editing a village
  const startEditing = (village: Village) => {
    setEditingId(village.id);
    setEditForm({
      village_name: village.village_name,
      colour_code: village.colour_code,
    });
  };

  // Save village edits
  const saveVillage = async () => {
    if (!editingId) return;

    try {
      // Send PATCH request with updated village data
      await axiosClientInstance.patch(`/villages/${editingId}/`, editForm);

      // Update local state with the changes
      setVillages(villages =>
        villages.map(village =>
          village.id === editingId ? { ...village, ...editForm } : village
        )
      );

      // Exit editing mode and clear form
      setEditingId(null);
      setEditForm({ village_name: '', colour_code: '' });
    } catch (err) {
      // Handle errors during update
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to update village'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update village');
      }
    }
  };

  /**
   * Cancels editing mode without saving changes
   * Resets edit form and editing state
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ village_name: '', colour_code: '' });
  };

  /**
   * Cancels adding a new village
   * Hides the add form and resets form data
   */
  const cancelAdding = () => {
    setShowAddForm(false);
    setAddForm({ village_name: '', colour_code: '' });
    setError(null);
  };

  // Fetch villages when component mounts
  useEffect(() => {
    fetchAllVillages();
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Settings</h1>
        <div className="text-gray-600">Loading villages...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          Error: {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Village Management Section */}
      <div className="rounded-lg bg-white shadow">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Village Management
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage villages that appear in dropdown menus. Hidden villages
              will not appear in new forms but existing data remains unchanged.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Village
          </button>
        </div>

        <div className="p-6">
          {/* Add Village Form - Only shown when showAddForm is true */}
          {showAddForm && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-md mb-4 font-medium text-gray-900">
                Add New Village
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Village Name Input */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Village Name/Code
                  </label>
                  <input
                    type="text"
                    value={addForm.village_name}
                    onChange={e =>
                      setAddForm({
                        ...addForm,
                        village_name: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g., AB"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {/* Color Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <select
                    value={addForm.colour_code}
                    onChange={e =>
                      setAddForm({ ...addForm, colour_code: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a color...</option>
                    {colorOptions.map(color => (
                      <option
                        key={color.value}
                        value={color.value}
                        className={color.value}
                      >
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Form Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={addVillage}
                  className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  <CheckIcon className="mr-1 h-4 w-4" />
                  Add Village
                </button>
                <button
                  onClick={cancelAdding}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <XMarkIcon className="mr-1 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Villages Table */}
          {villages.length === 0 ? (
            <p className="text-gray-500">No villages found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Village Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Color Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Color Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="divide-y divide-gray-200 bg-white">
                  {villages.map(village => (
                    <tr
                      key={village.id}
                      className={village.is_hidden ? 'bg-gray-50' : ''}
                    >
                      {/* Village Name Column - Editable */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {editingId === village.id ? (
                          <input
                            type="text"
                            value={editForm.village_name}
                            onChange={e =>
                              setEditForm({
                                ...editForm,
                                village_name: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {village.village_name}
                          </div>
                        )}
                      </td>
                      {/* Color Preview Column */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div
                          className={`text-sm font-bold ${village.colour_code}`}
                        >
                          {village.village_name}
                        </div>
                      </td>
                      {/* Color Code Column - Editable */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {editingId === village.id ? (
                          <select
                            value={editForm.colour_code}
                            onChange={e =>
                              setEditForm({
                                ...editForm,
                                colour_code: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {colorOptions.map(color => (
                              <option
                                key={color.value}
                                value={color.value}
                                className={color.value}
                              >
                                {color.label} ({color.value})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {village.colour_code}
                          </div>
                        )}
                      </td>
                      {/* Status Column */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
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
                        <div className="flex space-x-2">
                          {/* Edit/Save/Cancel Buttons */}
                          {editingId === village.id ? (
                            <>
                              {/* Save Changes Button */}
                              <button
                                onClick={saveVillage}
                                className="text-green-600 hover:text-green-900"
                                title="Save changes"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              {/* Cancel Edit Button */}
                              <button
                                onClick={cancelEditing}
                                className="text-gray-600 hover:text-gray-900"
                                title="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </>
                          ) : (
                            /* Start Edit Button */
                            <button
                              onClick={() => startEditing(village)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit village"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                          )}
                          {/* Hide/Show Toggle Button */}
                          <button
                            onClick={() =>
                              toggleVillageVisibility(
                                village.id,
                                village.is_hidden
                              )
                            }
                            className={`${
                              village.is_hidden
                                ? 'text-green-600 hover:text-green-900'
                                : 'text-red-600 hover:text-red-900'
                            }`}
                            title={
                              village.is_hidden
                                ? 'Show village'
                                : 'Hide village'
                            }
                          >
                            {village.is_hidden ? (
                              <EyeIcon className="h-5 w-5" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
