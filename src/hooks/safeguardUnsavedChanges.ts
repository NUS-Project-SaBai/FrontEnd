import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function useSafeguardUnsavedChanges(
  isDirty: boolean,
  message: string,
  onConfirm?: () => void
) {
  const pathname = usePathname();

  const isDirtyRef = useRef(isDirty);
  const onConfirmRef = useRef(onConfirm);

  isDirtyRef.current = isDirty;
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement | null;

      if (!link || !link.href) return;
      const linkUrl = new URL(link.href);

      if (
        linkUrl.pathname === pathname &&
        linkUrl.search === window.location.search
      ) {
        return;
      }

      if (isDirtyRef.current) {
        if (window.confirm(message)) {
          isDirtyRef.current = false;
        } else {
          e.preventDefault();
          e.stopPropagation(); //kills event before it reaches the Next.js Link component
        }
      }
    };

    // Handle pressing of back button
    const handlePopState = (e: PopStateEvent) => {
      if (isDirtyRef.current) {
        if (window.confirm(message)) {
          isDirtyRef.current = false;
        } else {
          // Push state to "undo" the back button action
          window.history.pushState(null, '', window.location.href);
          e.preventDefault();
        }
      }
    };

    window.history.pushState(null, '', window.location.href);

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
    //ref handles the life values
  }, [message, pathname]);
}
