import HomePage from '@/layouts/IndexPage';
import mdText from '../../../public/preview-zh-CN.md';

export default function Home() {
  return (
    <HomePage
      mdText={mdText}
      tips="示例中的标记、emoji、预览和时间扩展组件源码："
    />
  );
}
