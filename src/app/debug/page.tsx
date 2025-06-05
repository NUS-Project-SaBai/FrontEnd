'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingUI } from '@/components/LoadingUI';
import { APP_CONFIG } from '@/config';
import { useLoadingState } from '@/hooks/useLoadingState';
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

export default function DebugPage() {
  const useFormReturn = useForm({
    defaultValues: {
      method: 'GET',
      url: APP_CONFIG.BACKEND_API_URL + '/',
      payload: '',
    },
  });
  const { isLoading, withLoading } = useLoadingState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = withLoading(
    useFormReturn.handleSubmit(
      async data => {
        setResponse(null);
        setError(null);
        const { method, url, payload } = data;
        let res;
        try {
          switch (method) {
            case 'GET':
              res = await axiosClientInstance.get(url, {
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            case 'POST':
              res = await axiosClientInstance.post(url, payload, {
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            case 'PUT':
              res = await axiosClientInstance.put(url, payload, {
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            case 'DELETE':
              res = await axiosClientInstance.delete(url, {
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            case 'PATCH':
              res = await axiosClientInstance.patch(url, payload, {
                headers: { 'Content-Type': 'application/json' },
              });
              break;
            default:
              throw new Error('Invalid HTTP method');
          }
          setResponse(JSON.stringify(res.data, null, 2));
        } catch (err: unknown) {
          console.error('Error fetching data:\n', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      },
      err => {
        console.error('Error submitting form:' + err);
        setError(
          'An error occurred while processing the request\n' + err.root?.message
        );
      }
    )
  );

  return (
    <div className="flex min-h-full flex-col gap-4 bg-gray-100 p-4">
      <h1>Debug Page</h1>
      <DisplayField
        label="Current Backend URL"
        content={APP_CONFIG.BACKEND_API_URL + '/'}
      />
      <div
        className={
          'flex flex-col gap-4 rounded-lg p-4 shadow-md ' +
          (error === null ? 'bg-white' : 'bg-red-100')
        }
      >
        <FormProvider {...useFormReturn}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <Controller
                name="url"
                control={useFormReturn.control}
                render={({ field: { value, onChange } }) => (
                  <div className="w-full">
                    <label>Endpoint URL:</label>
                    <input
                      type="text"
                      className="w-full"
                      placeholder="Enter the endpoint URL"
                      onChange={e => onChange(e.target.value)}
                      value={value}
                    />
                  </div>
                )}
              />
              <div className="flex w-full flex-col gap-2 first:min-w-full sm:flex-row">
                <RHFDropdown
                  className="w-full"
                  label="HTTP Method"
                  name="method"
                  defaultValue="GET"
                  options={[
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' },
                    { label: 'PUT', value: 'PUT' },
                    { label: 'DELETE', value: 'DELETE' },
                    { label: 'PATCH', value: 'PATCH' },
                  ]}
                />
                <Button text="Submit" type="submit" colour="green" />
                <Button
                  text="Reset"
                  type="reset"
                  colour="red"
                  onClick={() => {
                    setResponse(null);
                    setError(null);
                    useFormReturn.setValue(
                      'url',
                      APP_CONFIG.BACKEND_API_URL + '/'
                    );
                  }}
                />
              </div>
              {useFormReturn.watch('method') !== 'GET' && (
                <RHFInputField
                  type="textarea"
                  name="payload"
                  label="Payload"
                  placeholder="Enter JSON payload"
                />
              )}
            </div>
          </form>
        </FormProvider>
        <div>
          <label>{error !== null ? 'Error:' : 'Response:'}</label>
          <div className="overflow-x-auto rounded-md border border-gray-200 bg-gray-100 p-2 text-sm">
            {isLoading ? (
              <LoadingUI message="Fetching Data..." />
            ) : (
              <pre>{response || error || 'No Response Yet'}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
