import ConverterForm from "@/components/ConverterForm";
import DownloadButton from "@/components/DownloadButton";
import React from "react";
import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa6";

const downloadItems = [
  {
    href: "/api/clash?os=android-arm64-v8a.apk",
    label: "Android ARMv8",
    icon: <FaAndroid size={18} />,
  },
  {
    href: "/api/clash?os=android-armeabi-v7a.apk",
    label: "Android ARMv7",
    icon: <FaAndroid size={18} />,
  },
  {
    href: "/api/clash?os=android-x86_64.apk",
    label: "Android x64",
    icon: <FaAndroid size={18} />,
  },
  {
    href: "/api/clash?os=windows-amd64-setup.exe",
    label: "Windows",
    icon: <FaWindows size={18} />,
  },
  {
    href: "/api/clash?os=windows-arm64-setup.exe",
    label: "Windows ARM",
    icon: <FaWindows size={18} />,
  },
  {
    href: "/api/clash?os=macos-arm64.dmg",
    label: "macOS Apple Silicon",
    icon: <FaApple size={18} />,
  },
  {
    href: "/api/clash?os=macos-amd64.dmg",
    label: "macOS Intel",
    icon: <FaApple size={18} />,
  },
  {
    href: "/api/clash?os=linux-amd64.AppImage",
    label: "Linux AppImage",
    icon: <FaLinux size={18} />,
  },
  {
    href: "/api/clash?os=linux-amd64.deb",
    label: "Linux Deb",
    icon: <FaLinux size={18} />,
  },
  {
    href: "/api/clash?os=linux-amd64.rpm",
    label: "Linux Rpm",
    icon: <FaLinux size={18} />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-64 pb-16">
      <div className="w-full max-w-4xl px-4 mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-center md:text-left text-gray-800 dark:text-gray-100 md:text-5xl">
            Clash Subscription Converter
          </h1>
        </header>
        <main className="grid gap-6 md:gap-8">
          <ConverterForm />
          <section className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-3">
            {downloadItems.map((item, index, arr) => (
              <React.Fragment key={item.label}>
                {index > 0 && arr[index - 1].icon.type !== item.icon.type && (
                  <div className="basis-full h-0" />
                )}
                <DownloadButton
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              </React.Fragment>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
