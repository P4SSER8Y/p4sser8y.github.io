import dayjs, { Dayjs } from 'dayjs';

export interface Record {
    type: string;
    info: unknown;
    notes?: unknown[];
}

export interface MovieRecord extends Record {
    info: MovieInfo;
    notes?: MovieNote[];
}

export function isMovieRecord(obj: Record): obj is MovieRecord {
    return obj.type === 'movie';
}

export interface TvRecord extends Record {
    info: TvInfo;
    notes?: TvNote[];
}

export function isTvRecord(obj: Record): obj is TvRecord {
    return obj.type === 'tv';
}

export interface MovieNote {
    rate: number;
    timestamp: string;
    comment?: string;
}

export interface TvNote {
    status: string;
    rate?: number;
    comment?: string;
    eposides: {
        eposide: string;
        timestamp: string;
    }[];
}

export interface MovieInfo {
    title: string;
    localTitle?: string;
    poster?: string[];
    thumbnail?: string;
    links?: string[];
    tags?: string[];
}

export interface TvInfo {
    title: string;
    localTitle?: string;
    poster?: string[];
    thumbnail?: string;
    links?: string[];
    tags?: string[];
    season?: number;
    eposides?: number;
}

export function sever_record(record: Record): Record[] {
    const ret: Record[] = [];
    for (const item of record.notes ?? []) {
        const t = {...record};
        t.notes = [item];
        ret.push(t);
    }
    return ret;
}

export function classify_by_timestamp_format(
    record: Record,
    format: string
): Record[] {
    interface Eposide {
        eposide: string;
        timestamp: string;
    }
    const ret: Record[] = [];
    if (isTvRecord(record)) {
        for (const note of record.notes ?? []) {
            const tmp = new Map<string, object[]>();
            for (const eposide of note.eposides) {
                const key = dayjs(eposide.timestamp).format(format);
                const values = tmp.get(key) ?? [];
                values.push(eposide);
                tmp.set(key, values);
            }
            for (const eposides of tmp.values()) {
                const t = {...record};
                t.notes = [{ ...note }];
                t.notes[0].eposides = eposides as Eposide[];
                ret.push(t);
            }
        }
    } else {
        ret.push(record);
    }
    return ret;
}

export function get_latest_timestamp(record: Record): Dayjs {
    let ret: Dayjs | undefined = undefined;
    if (isMovieRecord(record)) {
        ret = record.notes
            ?.map((x) => dayjs(x.timestamp))
            .reduce((a, b) => (a > b ? a : b));
    } else if (isTvRecord(record)) {
        ret = record.notes
            ?.map((x) =>
                x.eposides
                    .map((x) => dayjs(x.timestamp))
                    .reduce((a, b) => (a > b ? a : b))
            )
            .reduce((a, b) => (a > b ? a : b));
    }
    return dayjs(ret);
}
