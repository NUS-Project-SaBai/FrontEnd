import { APIComponent, DebugCard } from '@/components/debug';
import { useState } from 'react';
import { getAPI_URL } from '@/utils/constants';
import useWithLoading from '@/utils/loading';
import { PageTitle } from '@/components/TextComponents/PageTitle';

const paths = [
  '/patients',
  '/visits',
  '/consults',
  '/diagnosis',
  '/medications',
  '/orders',
];

const ChangeBaseURLForm = props => {
  return (
    <div>
      <label
        htmlFor="baseURL"
        className="block text-sm font-medium text-gray-700"
      >
        Set Base URL:
      </label>
      <input
        type="text"
        id="baseURL"
        value={props.baseURL}
        onChange={e => props.setBaseURL(e.target.value)}
        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
      />
    </div>
  );
};

export default function DebuggingPage() {
  const [baseURL, setBaseURL] = useState(getAPI_URL());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const RefreshEndpointsButton = () => {
    return (
      <button
        onClick={handleRefresh}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Refresh Endpoints
      </button>
    );
  };

  const ErrorThrowingComponent = () => {
    const throwError = () => {
      throw new Error('Test Error');
    };

    return (
      <button
        onClick={throwError}
        className="mt-4 ml-2 p-2 bg-red-500 text-white rounded-md"
      >
        Throw Error
      </button>
    );
  };

  const SimulateLoadingComponent = () => {
    const simulateLoading = useWithLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate a 3-second loading time
    });

    return (
      <button
        onClick={simulateLoading}
        className="mt-4 ml-2 p-2 bg-yellow-500 text-white rounded-md"
      >
        Simulate Loading
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <PageTitle
        title="API Debugging Tool"
        desc="Use this tool to test and debug your API endpoints."
      />

      <DebugCard>
        <ChangeBaseURLForm baseURL={baseURL} setBaseURL={setBaseURL} />
        <RefreshEndpointsButton />
        <ErrorThrowingComponent />
        <SimulateLoadingComponent />
      </DebugCard>

      <div className="grid grid-cols-1 gap-6 w-full max-w-3xl">
        {paths.map(path => (
          <APIComponent
            key={`${path}-${refreshTrigger}`}
            baseURL={baseURL}
            path={path}
          />
        ))}
      </div>
    </div>
  );
}
