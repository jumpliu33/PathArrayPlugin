
export enum PropertyType {
    Interval = "interval",
    Count = "count",
    PathAxis = "pathAxis",
    NormalAxis = "normalAxis",
    Scale = "scale",
}

export const enum Axis {
    X = 'X',
    XMinus = '-X',
    Y = 'Y',
    YMinus = '-Y',
    Z = 'Z',
    ZMinus = '-Z',
}

type PropertyItem = {
    value: number;
    min: number;
    max: number;
}

export type PathArrayParams = {
    interval: PropertyItem;
    intervalLocked?: boolean;
    count: PropertyItem;
    pathAxis: Axis;
    normalAxis: Axis;
    scale: PropertyItem;
    scaleLocked?: boolean;
}

export const DefaultPathArrayParams: PathArrayParams = {
    interval: { value: 1000, min: 10, max: 9999999 },
    count: { value: 5, min: 1, max: 100 },
    pathAxis: Axis.X,
    normalAxis: Axis.Z,
    scale: { value: 1, min: 0.01, max: 1000 },
}