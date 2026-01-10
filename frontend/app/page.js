// app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Gymnasieval</h1>
        <p className="text-gray-600">Redirecting to admin...</p>
      </div>
    </div>
  );
};

export default HomePage;
