"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 重定向到新的路径
export default function ModelTrainRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/categories/model-lab/training/training-tasks');
  }, [router]);

  return null;
}
