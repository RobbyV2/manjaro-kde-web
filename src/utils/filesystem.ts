export type typeFile = {
    name: string;
    mime: string;
    isDir: boolean;
    sub?: Array<typeFile>;
};

export const dolphinFiles: Array<typeFile> = [
    {
        name: 'about.md',
        mime: 'text/markdown',
        isDir: false
    },
    {
        name: 'about.zh.md',
        mime: 'text/markdown',
        isDir: false
    },
    {
        name: 'images',
        mime: 'folder',
        isDir: true,
        sub: [
            {
                name: 'calendar',
                mime: 'folder',
                isDir: true,
                sub: [
                    { name: '1.png', mime: 'image/png', isDir: false }
                ]
            },
            { name: 'favicon.png', mime: 'image/png', isDir: false },
            { name: 'mushishi.jpg', mime: 'image/jpeg', isDir: false },
            { name: 'yunyuyuan.png', mime: 'image/png', isDir: false }
        ]
    },
    {
        name: 'musics',
        mime: 'folder',
        isDir: true,
        sub: [
            { name: 'The-Ludlows.mp3', mime: 'audio/mpeg', isDir: false },
            { name: '夜空中最亮的星.mp3', mime: 'audio/mpeg', isDir: false },
            { name: '未闻花名口琴版.mp3', mime: 'audio/mpeg', isDir: false },
            {
                name: 'vip',
                mime: 'folder',
                isDir: true,
                sub: [
                    { name: '失う.mp3', mime: 'audio/mpeg', isDir: false }
                ]
            }
        ]
    }
];
