import { usePathname } from 'next/navigation';

export const useLang = () => {
  const pathname = usePathname();
  return pathname.startsWith('/zh-CN') ? 'zh-CN' : 'en-US';
};
