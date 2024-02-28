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
