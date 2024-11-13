import HomePage from '@/layouts/IndexPage';
import mdText from '../../../public/preview-en-US.md';

export default function Home() {
  return (
    <HomePage
      mdText={mdText}
      tips="Source code of mark, emoji, preview and time extension components in this page: "
    />
  );
}
