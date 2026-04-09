import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/25',
  secondary:
    'bg-navy-700 text-white hover:bg-navy-600',
  outline:
    'border border-navy-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  type = 'button',
  onClick,
}: ButtonProps) {
  const styles = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
