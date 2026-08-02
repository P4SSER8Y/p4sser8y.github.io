import { GM_xmlhttpRequest } from '$';
import axios from 'axios';
import Compressor from 'compressorjs';

export function get_year() {
    let el = document.getElementsByClassName('year')[0];
    if (!el) return null;
    let re = /\d+/;
    let m = re.exec(el.textContent ?? '');
    if (!m) return null;
    return parseInt(m[0]);
}

export function get_titles() {
    let el = document.getElementsByTagName('h1')[0];
    if (!el) return [null, null];
    let raw = el.children[0].textContent;
    let ref = document.getElementsByTagName('h2')[0]?.getElementsByTagName('i')[0]?.textContent;
    if (!raw || !ref) return [null, null];
    let i = 0;
    for (i = 0; i < Math.min(raw.length, ref.length); i++) {
        if (raw[i] != ref[i]) break;
    }
    let ret = [null, null];
    let t0 = raw.slice(0, i).trim();
    let t1 = raw.slice(i).trim();
    if (t1.length > 0) {
        return [t1, t0];
    }
    return [t0, null];
}

export function get_tags() {
    let el = document.querySelectorAll("span + [property='v:genre']");
    let ret: string[] = [];
    el.forEach((element) => {
        if (element.textContent) ret.push(element.textContent);
    });
    return ret;
}

export function get_db_link() {
    let href = window.location.href;
    let re = /(?<=subject\/)\d+/;
    let m = re.exec(href);
    if (m) return `db:${m[0]}`;
    return null;
}

export function get_watched_note() {
    let el = document.getElementById('n_rating');
    let rating = parseInt(el?.getAttribute('value') ?? '-1');
    let date = document.getElementsByClassName('collection_date')[0]?.textContent ?? '';
    return {
        rate: rating,
        timestamp: date,
    };
}

export function get_poster_link() {
    let el = document.getElementById('mainpic');
    if (!el) return null;
    console.log("[DBFMT] get element");
    let img = el.getElementsByTagName('img');
    if (img.length == 0) return null;
    console.log("[DBFMT] get img");
    let src = img[0].getAttribute('src');
    if (!src) return null;
    console.log("[DBFMT] get img src: ", src);
    let re = /(?<=photo\/)\w+(?=\/public)/;
    console.log("[DBFMT] create re: ", re);
    let link = src.replace(re, 'm');
    console.log("[DBFMT] ", re.exec(src));
    console.log("[DBFMT] ", link);
    return link;
}

export function get_photo_img() {
    let el = document.querySelector('img.media');
    if (!el) return null;
    let src = el.getAttribute('src');
    if (!src) return null;
    // photo 页主图是 l 大图，直接用它
    let re = /(?<=photo\/)\w+(?=\/public)/;
    let link = src.replace(re, 'l');
    console.log('[DBFMT] photo img:', link);
    return link;
}

export function resize_poster(link: string, callback: (file: Blob | null) => void) {
    callback(null);
    GM_xmlhttpRequest({
        url: link,
        method: 'GET',
        responseType: 'blob',
        headers: {
            referer: document.referrer || 'https://movie.douban.com/',
        },
        onload: (response) => {
            new Compressor(response.response, {
                checkOrientation: true,
                width: 512,
                mimeType: 'image/webp',
                success: (blob) => callback(blob),
            });
        },
        onerror: (err) => {
            console.log('[DBFMT] fetch', link, ' failed: %s', err);
        },
    });
}

export function get_type(): 'movie' | 'tv' {
    let info = document.getElementById('info');
    if (info) {
        let text = info.textContent ?? '';
        if (text.includes('集数:') || text.includes('季数:')) return 'tv';
    }
    return 'movie';
}

export function get_subject_id(): string | null {
    let href = window.location.href;
    let re = /(?<=subject\/)\d+/;
    let m = re.exec(href);
    return m ? m[0] : null;
}

// 从 j/subject_abstract API 探测类型 + 集数；失败返回 null（调用方 fallback 到 DOM）
export function fetch_subject_meta(id: string): Promise<{ type: 'movie' | 'tv'; episodes: number | null } | null> {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            url: `https://movie.douban.com/j/subject_abstract?subject_id=${id}`,
            method: 'GET',
            responseType: 'json',
            headers: {
                referer: document.referrer,
            },
            onload: (resp) => {
                try {
                    let data = resp.response;
                    if (data && typeof data.is_tv === 'boolean') {
                        let episodes = parseInt(data.episodes_count ?? '') || null;
                        resolve({ type: data.is_tv ? 'tv' : 'movie', episodes });
                        return;
                    }
                    resolve(null);
                } catch (e) {
                    resolve(null);
                }
            },
            onerror: () => resolve(null),
        });
    });
}

// 系列名：中文标题去掉「第X季」/「Season N」后缀
export function get_series(): string | null {
    let titles = get_titles();
    let cn = titles[1] ?? titles[0] ?? '';
    let series = cn.replace(/\s*第[0-9一二三四五六七八九十百千]+季\s*$/, '').trim();
    return series.length > 0 && series !== cn ? series : null;
}

export function get_season(): number | null {
    let info = document.getElementById('info');
    if (!info) return null;
    let spans = info.querySelectorAll('span.pl');
    for (let i = 0; i < spans.length; i++) {
        if (spans[i].textContent?.includes('季数')) {
            let node = spans[i].nextSibling;
            while (node && node.nodeType !== Node.TEXT_NODE) node = node.nextSibling;
            let m = /\d+/.exec(node?.textContent ?? '');
            if (m) return parseInt(m[0]);
        }
    }
    return null;
}

export function get_episodes_count(): number | null {
    let info = document.getElementById('info');
    if (!info) return null;
    let spans = info.querySelectorAll('span.pl');
    for (let i = 0; i < spans.length; i++) {
        if (spans[i].textContent?.includes('集数')) {
            let node = spans[i].nextSibling;
            while (node && node.nodeType !== Node.TEXT_NODE) node = node.nextSibling;
            let m = /\d+/.exec(node?.textContent ?? '');
            if (m) return parseInt(m[0]);
        }
    }
    return null;
}

export function safe_filename(name: string) {
    name = name.replaceAll(/[@\/\\:：\?\*#\+]|\s/g, '_');
    name = name.replace(/^[\._]*/, '');
    return name;
}
