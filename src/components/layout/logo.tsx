import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" className="fill-cyan-500" />
        <path
          d="M8 22L16 10L24 22H8Z"
          className="fill-navy-950"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight">
        Algo<span className="text-cyan-400">Dojo</span>
      </span>
    </Link>
  );
}
