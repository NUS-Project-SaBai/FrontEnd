import { LoadingUI } from './LoadingUI';

export function LoadingPage({
  children,
  isLoading,
  message = 'Loading...',
}: {
  children: React.ReactNode;
  isLoading: boolean;
  message?: string;
}) {
  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingUI message={message} />
    </div>
  ) : (
    children
  );
}
