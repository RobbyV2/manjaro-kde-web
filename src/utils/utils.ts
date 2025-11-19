import { dolphinFiles, typeFile } from './filesystem';

export function findMimeFiles(type: RegExp): string[] {
    const ret: string[] = [];
    function findImage(path: string[], files: typeFile[]) {
        files.forEach(file => {
            if (file.isDir && file.sub) {
                findImage([...path, file.name], file.sub);
            } else if (type.test(file.mime)) {
                ret.push([...path, file.name].join('/'));
            }
        });
    }
    findImage([], dolphinFiles);
    return ret;
}
