
export const ComponentPropertyKey = 'PAComponent';

export const IntervalPropertyKey = 'PAInterval';
export const CountPropertyKey = 'PACount';
export const PathAxisPropertyKey = 'PAPathAxis';
export const NormalAxisPropertyKey = 'PANormalAxis';
export const ScalePropertyKey = 'PAScale';
export const PathListPropertyKey = 'PAPathList';
export const PathReversedDelimiter = '-';
export const PathDelimiter = '&';
export const ManualPrefix = 'm';

export const enum Axis {
    X = 'X',
    XMinus = '-X',
    Y = 'Y',
    YMinus = '-Y',
    Z = 'Z',
    ZMinus = '-Z',
}

export function isAxisValid(axis: string) {
    return axis === Axis.X || axis === Axis.XMinus || axis === Axis.Y || axis === Axis.YMinus || axis === Axis.Z || axis === Axis.ZMinus;
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

export type PathObject = { curve: KAuxiliaryBoundedCurve, reversed: boolean };
export type PathPointPose = { point: KPoint3d, direction: KVector3d, normal?: KVector3d, accumulateLength: number };

export const DefaultPathArrayParams: PathArrayParams = {
    interval: { value: 1000, min: 10, max: 9999999 },
    count: { value: 5, min: 1, max: 100 },
    pathAxis: Axis.X,
    normalAxis: Axis.Z,
    scale: { value: 1, min: 0.01, max: 1000 },
}

export const dummyMatrix4 = GeomLib.createIdentityMatrix4();
export const dummyVector3d = GeomLib.createVector3d(0, 0, 1);
export const dummyPoint3d = GeomLib.createPoint3d(0, 0, 0);