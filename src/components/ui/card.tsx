interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-navy-700 bg-navy-900/50 p-6 transition-colors hover:border-navy-600 ${className}`}
    >
      {children}
    </div>
  );
}
