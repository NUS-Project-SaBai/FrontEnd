'use client';

import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function AccountLockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <LockClosedIcon className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="mb-3 text-center text-2xl font-bold text-gray-900">
            Account Locked
          </h1>

          <div className="mb-6 text-center">
            <p className="mb-2 text-gray-600">
              Your account has been locked by an administrator.
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact your system
              administrator for assistance.
            </p>
          </div>

          {/* Support Info */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Need Help?
            </p>
            <p className="text-sm text-gray-700">
              Contact your administrator to request account access.
            </p>
          </div>

          {/* Sign Out Button */}
          <a
            href="/auth/logout"
            className="block w-full rounded-lg bg-red-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign Out
          </a>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Sa&apros;Bai Health System
        </p>
      </div>
    </div>
  );
}
