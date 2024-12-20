import { Axis, dummyPoint3d, dummyVector3d, PathArrayParams, PathObject, PathPointPose } from "./types";

export function isKGroupInstance(entity: KEntity): entity is KGroupInstance {
    return entity.getType() === KEntityType.GroupInstance;
}

export function isKFace(entity: KEntity): entity is KFace {
    return entity.getType() === KEntityType.Face;
}

export function isKAuxiliaryBoundedCurve(entity: KEntity): entity is KAuxiliaryBoundedCurve {
    return entity.getType() === KEntityType.AuxiliaryBoundedCurve;
}

export function isKLineSegment3d(entity: KBoundedCurve3d): entity is KLineSegment3d {
    return !!(entity as KLineSegment3d).direction;
}

export function isKArc3d(entity: KBoundedCurve3d): entity is KArc3d {
    return !!(entity as KArc3d).circle;
}

export type ConnectionResult = {
    connected: boolean;
    reversed: boolean;
}

export function boundedCurveConnectionDetect(auxiliaryVertex: KAuxiliaryVertex, auxiliaryBoundedCurve: KAuxiliaryBoundedCurve): ConnectionResult {
    const startVertex = auxiliaryBoundedCurve.getStartVertex();
    const endVertex = auxiliaryBoundedCurve.getStartVertex();
    if (startVertex.getKey() === auxiliaryVertex.getKey()) {
        return { connected: true, reversed: false };
    } else if (endVertex.getKey() === auxiliaryVertex.getKey()) {
        return { connected: true, reversed: true };
    }
    return { connected: false, reversed: false };
}

export type DiscreteResult = {
    discretePoints: KPoint3d[];
    length: number;
}

export function discreteAuxiliaryBoundedCurve(auxiliaryBoundedCurve: KAuxiliaryBoundedCurve): KPoint3d[] {
    const boundedCurve = auxiliaryBoundedCurve.getBoundedCurve();
    let discretePoints: KPoint3d[] = [];
    if (boundedCurve) {
        if (isKLineSegment3d(boundedCurve)) {
            discretePoints = [boundedCurve.startPoint, boundedCurve.endPoint];
        } else if (isKArc3d(boundedCurve)) {
            discretePoints = boundedCurve.getApproximatePointsByAngle();
        }
    }
    return discretePoints;
}

export function getAuxiliaryBoundedCurveNormal(auxiliaryBoundedCurve: KAuxiliaryBoundedCurve) {
    const boundedCurve = auxiliaryBoundedCurve.getBoundedCurve();
    if (boundedCurve) {
        if (isKArc3d(boundedCurve)) {
            return boundedCurve.normal;
        }
    }
    return undefined;
}

export function getNormalByX(xAxis: KVector3d) {
    if (xAxis.isParallel(dummyVector3d)) {
        if (xAxis.z > 0) {
            return GeomLib.createVector3d(-1, 0, 0);
        } else {
            return GeomLib.createVector3d(1, 0, 0);
        }
    } else {
        return xAxis.cross(dummyVector3d.cross(xAxis)).normalized();
    }
}

export function generatePathPoses(path: PathObject[]): { pathPointPoses: PathPointPose[], totalLength: number } {
    const pathPointPoses: PathPointPose[] = [];
    let accumulateLength: number = 0;
    for (let i = 0; i < path.length; i++) {
        const pathObject = path[i];
        const discretePoints = discreteAuxiliaryBoundedCurve(pathObject.curve);

        if (discretePoints.length) {
            const boundedCurveNormal = getAuxiliaryBoundedCurveNormal(pathObject.curve);
            for (let j = 0; j < discretePoints.length; j++) {
                const discretePoint = discretePoints[j];
                if (j === 0) {
                    if (i === 0) {
                        const nextDiscretePoint = discretePoints[j + 1];
                        pathPointPoses.push({ point: discretePoints[0], direction: nextDiscretePoint.subtracted(discretePoint).normalized(), accumulateLength });
                    }
                } else {
                    const prevDiscretePoint = discretePoints[j - 1];
                    const direction = discretePoint.subtracted(prevDiscretePoint).normalized();
                    const segmentLength = prevDiscretePoint.distanceTo(discretePoint);
                    accumulateLength += segmentLength;
                    pathPointPoses.push({ point: discretePoint, direction, accumulateLength });
                }
                pathPointPoses[pathPointPoses.length - 1].normal = boundedCurveNormal ? boundedCurveNormal : getNormalByX(pathPointPoses[pathPointPoses.length - 1].direction);
            }
        }
    }
    return { pathPointPoses, totalLength: accumulateLength };
}

export function getTransformFromPathPointPoses(pathPointPoses: PathPointPose[], params: PathArrayParams) {
    const { count, interval, scale, pathAxis, normalAxis } = params;
    const componentTransforms: KMatrix4[] = [];
    const scaleMatrix = GeomLib.createScaleMatrix4(scale.value, scale.value, scale.value);

    let componentIndex: number = 0;
    let componentPositionLength = componentIndex * interval.value;

    for (let k = 0; k < pathPointPoses.length; k++) {
        const { point, normal, direction, accumulateLength } = pathPointPoses[k];
        const prevAccumulateLength = k === 0 ? -1 : pathPointPoses[k - 1].accumulateLength;
        let componentTransform: KMatrix4 | undefined;
        const pathNormal: KVector3d = normal || dummyVector3d;
        let ccsX: KVector3d | undefined;
        let ccsY: KVector3d | undefined;
        let ccsZ: KVector3d | undefined;
        switch (pathAxis) {
            case Axis.X: ccsX = direction; break;
            case Axis.XMinus: ccsX = direction.reversed(); break;
            case Axis.Y: ccsY = direction; break;
            case Axis.YMinus: ccsY = direction.reversed(); break;
            case Axis.Z: ccsZ = direction; break;
            case Axis.ZMinus: ccsZ = direction.reversed(); break;
        }

        switch (normalAxis) {
            case Axis.X: ccsX = pathNormal; break;
            case Axis.XMinus: ccsX = pathNormal.reversed(); break;
            case Axis.Y: ccsY = pathNormal; break;
            case Axis.YMinus: ccsY = pathNormal.reversed(); break;
            case Axis.Z: ccsZ = pathNormal; break;
            case Axis.ZMinus: ccsZ = pathNormal.reversed(); break;
        }
        if (!ccsX) {
            ccsX = ccsY!.cross(ccsZ!);
        }
        if (!ccsY) {
            ccsY = ccsZ!.cross(ccsX);
        }
        if (!ccsZ) {
            ccsZ = ccsX.cross(ccsY);
        }

        while (componentIndex < count.value && componentPositionLength > prevAccumulateLength && componentPositionLength <= accumulateLength) {
            const componentPosition = point.added(direction.multiplied(componentPositionLength - accumulateLength));
            componentTransform = GeomLib.createTranslationMatrix4(componentPosition.x, componentPosition.y, componentPosition.z)
                .multiplied(GeomLib.createAlignCCSMatrix4(ccsX, ccsY, ccsZ, dummyPoint3d))
                .multiplied(scaleMatrix);
            componentTransforms.push(componentTransform);
            componentIndex++;
            componentPositionLength = componentIndex * interval.value;
        }
    }
    return componentTransforms;
}

export function getBoundingBoxSizeInWorld(groupInstance: KGroupInstance) {
    const localBoundingBox = groupInstance.getLocalBoundingBox();
    const transform = groupInstance.getTransform();
    const oldSize = [GeomLib.createVector3d(localBoundingBox.width, 0, 0), GeomLib.createVector3d(0, localBoundingBox.height, 0), GeomLib.createVector3d(0, 0, localBoundingBox.depth)];
    return oldSize.map(vec => vec.appliedMatrix4(transform).length);
}

export function getExtendedTransform() {
    const design = app.getActiveDesign();
    const editPath = design.getEditPath();
    const extendedTransform = GeomLib.createIdentityMatrix4();
    for (const path of editPath) {
        extendedTransform.multiply(path.getTransform());
    }
    return extendedTransform;
}

export function findPathAfterMakeGroup(path: PathObject[], newGroupInstance: KGroupInstance) {
    const auxiliaryBoundedCurves: KAuxiliaryBoundedCurve[] = [];
    newGroupInstance.getGroupDefinition()?.getAuxiliaryCurves().forEach(curve => {
        if (isKAuxiliaryBoundedCurve(curve)) {
            auxiliaryBoundedCurves.push(curve);
        }
    });

    const newPath: PathObject[] = [];
    for (const { curve, reversed } of path) {
        const startPoint = curve.getStartVertex().getPoint();
        const endPoint = curve.getEndVertex().getPoint();
        const newCurveIndex = auxiliaryBoundedCurves.findIndex(newCurve => {
            const newStartPoint = newCurve.getStartVertex().getPoint();
            const newEndPoint = newCurve.getEndVertex().getPoint();
            if (newStartPoint.isEqual(startPoint) && newEndPoint.isEqual(endPoint)) {
                return true;
            }
            return false;
        });
        if (newCurveIndex > -1) {
            newPath.push({ curve: auxiliaryBoundedCurves[newCurveIndex], reversed });
            auxiliaryBoundedCurves.splice(newCurveIndex, 1);
        } else {
            return undefined;
        }
    }
    return newPath;
}