export enum EditorType {
    String,
    Number,
    Object,
    List,
    Tags,
    Eposide,
    Status,
    Rating,
}

export type BaseType = {
    id: string | number;
    label?: string;
    isNullable: boolean;
}

export type ListType = BaseType & {
    type: EditorType.List,
    node: FieldDescription,
}

export type ObjectType = BaseType & {
    type: EditorType.Object,
    node: FieldDescription[],
}

export type StringType = BaseType  & { type: EditorType.String }

export type NumberType = BaseType  & { type: EditorType.Number }

export type TagsType = BaseType  & { type: EditorType.Tags }

export type EposideType = BaseType & { type: EditorType.Eposide }

export type StatusType = BaseType & { type: EditorType.Status }

export type RatingType = BaseType & { type: EditorType.Rating }

export type FieldDescription = StringType | NumberType | ObjectType | ListType | TagsType | EposideType | StatusType | RatingType

export const TvFieldDescription: ObjectType = {
    id: '',
    label: '',
    type: EditorType.Object,
    isNullable: false,
    node: [
        {
            id: 'info',
            label: 'infomation',
            type: EditorType.Object,
            isNullable: false,
            node: [
                {
                    id: 'title',
                    type: EditorType.String,
                    label: 'title',
                    isNullable: false,
                },
                {
                    id: 'localTitle',
                    type: EditorType.String,
                    label: 'local title',
                    isNullable: true,
                },
                {
                    id: 'tags',
                    type: EditorType.Tags,
                    label: 'tags',
                    isNullable: true,
                },
                {
                    id: 'poster',
                    type: EditorType.List,
                    label: 'poster',
                    isNullable: false,
                    node: {
                        id: 'poster',
                        type: EditorType.String,
                        label: 'link',
                        isNullable: false,
                    }
                }
            ]
        },
        {
            id: 'notes',
            label: 'notes',
            type: EditorType.List,
            isNullable: false,
            node: {
                id: 'round',
                type: EditorType.Object,
                label: '',
                isNullable: false,
                node: [
                    {
                        id: 'status',
                        type: EditorType.Status,
                        label: 'status',
                        isNullable: false,
                    },
                    {
                        id: 'rate',
                        type: EditorType.Rating,
                        label: 'rate',
                        isNullable: true,
                    },
                    {
                        id: 'eposides',
                        type: EditorType.Eposide,
                        label: 'eposides',
                        isNullable: false,
                    }
                ]
            }
        }
    ]
}

export const MovieFieldDescription: ObjectType = {
    id: '',
    label: '',
    type: EditorType.Object,
    isNullable: false,
    node: [
        {
            id: 'info',
            label: 'infomation',
            type: EditorType.Object,
            isNullable: false,
            node: [
                {
                    id: 'title',
                    type: EditorType.String,
                    label: 'title',
                    isNullable: false,
                },
                {
                    id: 'localTitle',
                    type: EditorType.String,
                    label: 'local title',
                    isNullable: true,
                },
                {
                    id: 'tags',
                    type: EditorType.Tags,
                    label: 'tags',
                    isNullable: true,
                },
                {
                    id: 'poster',
                    type: EditorType.List,
                    label: 'poster',
                    isNullable: false,
                    node: {
                        id: 'poster',
                        type: EditorType.String,
                        label: 'link',
                        isNullable: false,
                    }
                }
            ]
        },
        {
            id: 'notes',
            label: 'notes',
            type: EditorType.List,
            isNullable: false,
            node: {
                id: 'round',
                type: EditorType.Object,
                label: '',
                isNullable: false,
                node: [
                    {
                        id: 'status',
                        type: EditorType.Status,
                        label: 'status',
                        isNullable: false,
                    },
                    {
                        id: 'rate',
                        type: EditorType.Rating,
                        label: 'rate',
                        isNullable: true,
                    },
                    {
                        id: 'eposides',
                        type: EditorType.Eposide,
                        label: 'eposides',
                        isNullable: false,
                    }
                ]
            }
        }
    ]
}
