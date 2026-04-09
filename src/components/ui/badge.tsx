type BadgeVariant = 'default' | 'cyan' | 'teal' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-navy-700 text-slate-300',
  cyan: 'bg-cyan-500/10 text-cyan-400',
  teal: 'bg-teal-500/10 text-teal-400',
  outline: 'border border-navy-600 text-slate-400',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
