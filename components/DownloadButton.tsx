import React from 'react';

export default function DownloadButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="items-center justify-center border focus:outline-none focus:ring-0 inline-flex flex-row py-2.5 md:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium gap-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
