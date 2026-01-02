import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';
import DojoMenu from '@/shared/components/Menu/DojoMenu';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kana');
}

export default function KanaPage() {
  return <DojoMenu />;
}
