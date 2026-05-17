"use client";

import { useEffect, useState } from "react";

const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;
  return (
    <div className="fixed left-0 top-0 z-[100000] h-[500vh] w-screen bg-gray-700 bg-opacity-30">
      <div className="fixed left-0 top-0 z-[100000] flex h-screen w-screen items-center justify-center">
        <div className="absolute h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-green-500"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
