/**
 * Settings Page - Village Management (Refactored)
 *
 * Administrative page for managing villages in the system. This refactored version
 * separates concerns into individual components for better maintainability.
 *
 * Components:
 * - AddVillageForm: Handles new village creation with React Hook Form
 * - VillageTable: Displays the list of villages
 * - VillageTableRow: Individual row with inline editing capabilities
 */

'use client';

import { AddVillageForm } from '@/app/settings/AddVillageForm';
import { VillageTable } from '@/app/settings/VillageTable';
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface Village {
  id: number;
  village_name: string;
  colour_code: string;
  is_hidden: boolean;
}

export default function SettingsPage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Predefined color options
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

  // Fetch all villages including hidden ones
  const fetchAllVillages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClientInstance.get('/villages/', {
        params: { include_hidden: true },
      });
      setVillages(response.data);
    } catch (err) {
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

  // Handle successful village addition, close form and referesh data
  const handleVillageAdded = () => {
    setShowAddForm(false);
    fetchAllVillages();
  };

  // Handle village update from row - refresh data to show changes
  const handleVillageUpdated = () => {
    fetchAllVillages();
  };

  // Fetch villages on component mount
  useEffect(() => {
    fetchAllVillages();
  }, []);

  // Show loading state while fetching initial data
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
        {/* Header */}
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
          {/* Add Village Button, hidden when form is open */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Village
            </button>
          )}
        </div>

        {/* Content Area, contains add form (if open) and village table */}
        <div className="p-6">
          {/* Add Village Form */}
          {showAddForm && (
            <div className="mb-6">
              <AddVillageForm
                onSuccess={handleVillageAdded}
                onCancel={() => setShowAddForm(false)}
                colorOptions={colorOptions}
              />
            </div>
          )}

          {/* Village Table */}
          <VillageTable
            villages={villages}
            onUpdate={handleVillageUpdated}
            colorOptions={colorOptions}
          />
        </div>
      </div>
    </div>
  );
}
