import {
    copyFileSync,
    fstat,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmdirSync,
    unlinkSync,
    writeFileSync,
} from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseAllDocuments } from 'yaml';
import fse from 'fs-extra';
const { copySync, removeSync } = fse;

let dst = join(dirname(fileURLToPath(import.meta.url)), '../dist/data');
let src = join(dirname(fileURLToPath(import.meta.url)), '../../data/stream');
console.log(`copy "${src}" to "${dst}`);

let full = [];
let files = readdirSync(src, { withFileTypes: true })
    .filter((x) => x.isFile())
    .filter((x) => x.name.toLowerCase().endsWith('.yml'));
for (let file of files) {
    let path = join(src, file.name);
    let raw = readFileSync(path, { encoding: 'utf8' });
    let datas = parseAllDocuments(raw);
    datas
        .map((x) => x.toJS())
        .filter((x) => x)
        .map((x) => full.push(x));
}

removeSync(dst);
mkdirSync(dst, { recursive: true, mode: 0o777 });
writeFileSync(join(dst, 'records.json'), JSON.stringify(full), 'utf8');
copySync(join(src, 'assets'), join(dst, 'assets'));
