import { Icon } from '@/components/Icon';
import React from 'react';

export const About = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col text-black overflow-auto">
      <p className="text-base p-2">For learning Vue3 and Vite, I wrote this project.</p>
      
      <div className="flex items-center m-4 pb-4 border-b border-gray-200">
        <b className="mr-8">Author:</b>
        <img src="https://blog.yunyuyuan.net/favicon.png" alt="avatar" className="w-12 h-12 rounded-full" />
        <a target="_blank" href="https://github.com/yunyuyuan" className="ml-4 text-blue-600 hover:underline">yunyuyuan</a>
      </div>
      
      <div className="flex items-center m-4 pb-4">
        <b className="mr-8">Contributors:</b>
        <span>Need your code!</span>
      </div>
      
      <hr className="mx-4" />
      
      <strong className="text-base m-3 block">
        Go to <a target="_blank" href="https://github.com/yunyuyuan/vue3-manjaro-ui#readme" className="text-blue-600 hover:underline">github</a> to get more information!
      </strong>
      
      <a href="mailto:yun-yu-yuan@qq.com" className="m-4 text-orange-500 hover:underline">Email to me</a>
    </div>
  );
};
