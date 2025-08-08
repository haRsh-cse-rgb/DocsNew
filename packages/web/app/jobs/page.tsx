'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = 'Jobs';
  }, []);

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null; // This component won't render anything as it immediately redirects
} 