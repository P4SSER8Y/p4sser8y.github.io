export interface MovieRecord {
    info: MovieInfo;
    notes?: Note[];
}

export interface Note {
    rate: number;
    timestamp: string;
    comment?: string;
}

export interface MovieInfo {
    title: string;
    localTitle?: string;
    poster?: string;
    thumbnail?: string;
    links?: string[];
    tags?: string[];
}
