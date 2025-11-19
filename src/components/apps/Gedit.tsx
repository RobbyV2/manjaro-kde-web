import { useDesktopStore } from '@/store/useDesktopStore';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPublicUrl } from '@/utils/publicUrl';

export const Gedit = () => {
  const { apps } = useDesktopStore();
  const app = apps.find(a => a.id === 'gedit');
  const [text, setText] = useState('');

  useEffect(() => {
    const filepath = app?.params?.filepath;
    if (filepath) {
      fetch(getPublicUrl(`/dolphin-files/${filepath}`))
        .then(res => res.text())
        .then(setText)
        .catch(err => console.error("Failed to load file:", err));
    } else {
        setText('');
    }
  }, [app?.params?.filepath]);

  return (
    <div className="w-full h-full bg-white text-black overflow-auto p-4">
       <div className="prose max-w-none">
           <ReactMarkdown remarkPlugins={[remarkGfm]}>
             {text}
           </ReactMarkdown>
       </div>
       {!app?.params?.filepath && !text && (
           <textarea 
            className="w-full h-full outline-none resize-none"
            placeholder="Type here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
           />
       )}
    </div>
  );
};
