import dayjs, { Dayjs } from "dayjs";

export interface Record {
    type: string;
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
    poster?: string;
    thumbnail?: string;
    links?: string[];
    tags?: string[];
}

export interface TvInfo {
    title: string;
    localTitle?: string;
    poster?: string;
    thumbnail?: string;
    links?: string[];
    tags?: string[];
    season?: number;
    eposides?: number;
}

export function sever_record(record: Record): Record[] {
    const ret: Record[] = [];
    if (isMovieRecord(record)) {
        for (const item of record.notes ?? []) {
            ret.push({
                type: 'movie',
                info: record.info,
                notes: [item],
            } as Record);
        }
    } else if (isTvRecord(record)) {
        for (const item of record.notes ?? []) {
            ret.push({
                type: 'tv',
                info: record.info,
                notes: [item],
            } as Record);
        }
    }
    return ret;
}

export function get_latest_timestamp(record:Record): Dayjs {
    let ret: Dayjs | undefined = undefined;
    if (isMovieRecord(record)) {
        ret = record.notes?.map((x) => (dayjs(x.timestamp))).reduce((a, b) => (a > b ? a : b));
    }
    else if (isTvRecord(record)) {
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
