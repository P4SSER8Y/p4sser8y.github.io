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

let dst = join(dirname(fileURLToPath(import.meta.url)), '../dist');
let src = join(process.env.DATA_DIR, 'stream');
console.log(`copy "${src}" to "${dst}`);

let full = [];
let files = readdirSync(src, { withFileTypes: true })
    .filter((x) => x.isFile())
    .filter((x) => x.name.toLowerCase().endsWith('.md'));
for (let file of files) {
    let path = join(src, file.name);
    console.log(`processing ${path}`);
    let raw = readFileSync(path, { encoding: 'utf8' });
    let yml = '';
    let step = 0;
    let separator = '';
    for (let line of raw.split(/[\r\n]+/)) {
        switch (step) {
            case 0:
                if (line.trim().match(/^-{3,}\s*$/)) {
                    step = 1;
                    separator = line.trim();
                }
                break;
            case 1:
                if (line.trim() == separator) {
                    step = 2;
                    break;
                }
                yml += line + '\n';
                break;
        }
        if (step == 2) {
            break;
        }
    }
    if (step != 2) {
        yml = raw;
    }
    let datas = parseAllDocuments(yml);
    datas
        .map((x) => x.toJS())
        .filter((x) => x)
        .map((x) => full.push(x));
}
console.log(`found ${full.length} records`);

mkdirSync(dst, { recursive: true, mode: 0o777 });
writeFileSync(join(dst, 'records.json'), JSON.stringify(full), 'utf8');
