"use client";

import { useCallback, useEffect, useState } from "react";
import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa6";
import { FiCheck, FiCopy } from "react-icons/fi";

function useCopy(duration = 1000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), duration);
        return true;
      } catch (error) {
        console.error("Failed to copy:", error);
        return false;
      }
    },
    [duration]
  );

  return { copied, copy };
}

// 下载按钮组件
function DownloadButton({
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
      className="items-center justify-center border focus:outline-none focus:ring-0 inline-flex flex-row items-center py-2.5 md:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium gap-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function Home() {
  const [proxy, setProxy] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const { copied, copy } = useCopy();

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleProxyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setProxy(value);
    setError("");

    if (value && !isValidUrl(value)) {
      setError("Invalid URL");
    }
  };

  useEffect(() => {
    if (proxy && isValidUrl(proxy)) {
      const currentUrl = window.location.origin;
      const encodedUrl = encodeURIComponent(proxy);
      const fullUrl = `${currentUrl}/api/config?proxy=${encodedUrl}`;
      setUrl(fullUrl);
    } else {
      setUrl("");
    }
  }, [proxy]);

  const handleCopy = async () => {
    if (!url) return;
    const success = await copy(url);
    if (!success) {
      setError("Unable to copy. Please copy manually");
    }
  };

  // 下载项数据
  const downloadGroups = [
    {
      key: "android",
      items: [
        {
          href: "/api/clash?os=android-arm64-v8a.apk",
          icon: <FaAndroid size={18} />,
          label: "Android ARMv8",
        },
        {
          href: "/api/clash?os=android-armeabi-v7a.apk",
          icon: <FaAndroid size={18} />,
          label: "Android ARMv7",
        },
        {
          href: "/api/clash?os=android-x86_64.apk",
          icon: <FaAndroid size={18} />,
          label: "Android x64",
        },
      ],
    },
    {
      key: "windows",
      items: [
        {
          href: "/api/clash?os=windows-amd64-setup.exe",
          icon: <FaWindows size={18} />,
          label: "Windows",
        },
        {
          href: "/api/clash?os=windows-arm64-setup.exe",
          icon: <FaWindows size={18} />,
          label: "Windows ARM",
        },
      ],
    },
    {
      key: "mac",
      items: [
        {
          href: "/api/clash?os=macos-arm64.dmg",
          icon: <FaApple size={18} />,
          label: "macOS",
        },
        {
          href: "/api/clash?os=macos-amd64.dmg",
          icon: <FaApple size={18} />,
          label: "macOS Intel",
        },
      ],
    },
    {
      key: "linux",
      items: [
        {
          href: "/api/clash?os=linux-amd64.AppImage",
          icon: <FaLinux size={18} />,
          label: "Linux AppImage",
        },
        {
          href: "/api/clash?os=linux-amd64.deb",
          icon: <FaLinux size={18} />,
          label: "Linux Deb",
        },
        {
          href: "/api/clash?os=linux-amd64.rpm",
          icon: <FaLinux size={18} />,
          label: "Linux Rpm",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-64 pb-16">
      <div className="w-full max-w-4xl px-4 mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-center md:text-left text-gray-800 dark:text-gray-100 md:text-5xl">
            Clash Subscription Converter
          </h1>
        </header>
        <main className="grid gap-6 md:gap-8">
          <section className="w-full max-w-full">
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <input
                  id="proxy"
                  type="url"
                  value={proxy}
                  onChange={handleProxyChange}
                  required
                  placeholder="Enter subscription link"
                  className={`block w-full border focus:outline-none text-base md:text-lg truncate px-6 py-3.5 md:py-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500${
                    error
                      ? " border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 pl-6">
                    {error}
                  </p>
                )}
              </div>
            </form>
            {url && (
              <div className="flow-root mt-4 md:mt-6 p-3.5 md:p-5 bg-gray-200 dark:bg-gray-800/50 rounded-3xl border border-gray-300 dark:border-gray-600 relative break-all">
                <button
                  onClick={handleCopy}
                  className={`items-center justify-center border focus:outline-none focus:ring-0 grid place-items-center rounded-lg transition-all duration-200 ease-in-out float-right ml-2 w-8 h-8 ${
                    copied
                      ? "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/90"
                  }`}
                >
                  <div className="relative w-5 h-5">
                    <div
                      className={`absolute inset-0 transition-all duration-200 ease-in-out ${
                        copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      }`}
                    >
                      <FiCheck size={20} />
                    </div>
                    <div
                      className={`absolute inset-0 transition-all duration-200 ease-in-out ${
                        copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
                      }`}
                    >
                      <FiCopy size={20} />
                    </div>
                  </div>
                </button>
                <p className="break-all font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                  {url}
                </p>
              </div>
            )}
          </section>
          <section className="grid gap-4 md:gap-6">
            {downloadGroups.map((group) => (
              <div className="flex flex-wrap gap-4 md:gap-6" key={group.key}>
                {group.items.map((item) => (
                  <DownloadButton key={item.label} {...item} />
                ))}
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
