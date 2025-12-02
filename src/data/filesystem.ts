// Hardcoded filesystem structure to avoid server-side fs dependency in client build
// This mimics the result of the recursiveReadDir

export type typeFile = {
  name: string;
  mime: string;
  isDir: boolean;
  sub?: Array<typeFile>;
};

// Manually constructed file tree based on known assets
export const dolphinFiles: typeFile[] = [
  {
    name: "dolphin-files",
    mime: "folder",
    isDir: true,
    sub: [
        {
            name: "images",
            mime: "folder",
            isDir: true,
            sub: [
                {
                    name: "calendar",
                    mime: "folder",
                    isDir: true,
                    sub: [
                         { name: "1.png", mime: "image/png", isDir: false }
                    ]
                },
                { name: "favicon.png", mime: "image/png", isDir: false },
                { name: "mushishi.jpg", mime: "image/jpeg", isDir: false },
                { name: "yunyuyuan.png", mime: "image/png", isDir: false } // Added this one manually as I saw it in list before?
            ]
        },
        {
            name: "musics",
            mime: "folder",
            isDir: true,
            sub: [
                {
                    name: "vip",
                    mime: "folder",
                    isDir: true,
                    sub: [
                        { name: "失う.mp3", mime: "audio/mpeg", isDir: false }
                    ]
                },
                { name: "The-Ludlows.mp3", mime: "audio/mpeg", isDir: false },
                { name: "夜空中最亮的星.mp3", mime: "audio/mpeg", isDir: false },
                { name: "未闻花名口琴版.mp3", mime: "audio/mpeg", isDir: false }
            ]
        }
    ]
  },
  // Home folder structure simulation
  { name: "Desktop", mime: "folder", isDir: true, sub: [] },
  { name: "Documents", mime: "folder", isDir: true, sub: [] },
  { name: "Downloads", mime: "folder", isDir: true, sub: [] },
  { name: "Music", mime: "folder", isDir: true, sub: [] },
  { name: "Pictures", mime: "folder", isDir: true, sub: [] },
  { name: "Videos", mime: "folder", isDir: true, sub: [] },
];