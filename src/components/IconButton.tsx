import { useLoadingState } from '@/hooks/useLoadingState';
import {
  BASE_BUTTON_STYLES,
  ButtonStyle,
  ButtonVariant,
  COLOUR_MAP,
} from '@/components/buttonStyles';
import { LoaderCircle } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  colour?: ButtonVariant;
  variant?: ButtonStyle;
  label: string;
}

export function IconButton({
  icon,
  label,
  onClick = () => {},
  colour = 'blue',
  variant = 'ghost',
  className = '',
  ...props
}: IconButtonProps) {
  const { isLoading, withLoading } = useLoadingState(false);

  const colorStyles = COLOUR_MAP[colour][variant];

  return (
    <button
      type="button"
      className={`${BASE_BUTTON_STYLES} ${colorStyles} ${className} ${isLoading && 'cursor-progress'}`}
      aria-label={label}
      title={label}
      disabled={isLoading || props.disabled}
      onClick={withLoading(async e => onClick(e))}
      {...props}
    >
      {isLoading ? <LoaderCircle className={'animate-spin'} /> : icon}
    </button>
  );
}
