import {
    Axis, ComponentPropertyKey, CountPropertyKey, DefaultPathArrayParams, IntervalPropertyKey, isAxisValid, ManualPrefix, NormalAxisPropertyKey,
    PathArrayParams, PathAxisPropertyKey, PathDelimiter, PathListPropertyKey, PathObject, PathPointPose, PathReversedDelimiter, ScalePropertyKey
} from "./types";
import { generatePathPoses, getTransformFromPathPointPoses, isKAuxiliaryBoundedCurve, } from "./utils";

const design = app.getActiveDesign();

export class PathArrayParamsEditTool implements KTool {
    private model?: KGroupInstance;
    private components: { instance: KGroupInstance; index: number; }[] = [];
    private path: PathObject[] = [];
    private pathPointPoses: PathPointPose[] = [];
    private totalLength: number = 0;
    private pathArrayParams: PathArrayParams = DefaultPathArrayParams;

    getPathArrayParams() {
        return this.pathArrayParams;
    }

    setModel(model: KGroupInstance) {
        const groupDefinition = model.getGroupDefinition();
        const components = groupDefinition?.getSubGroupInstances().reduce((acc, instance) => {
            const componentProperty = instance.getCustomProperty(ComponentPropertyKey);
            const index = Number.parseInt(componentProperty);
            if (Number.isFinite(index)) {
                acc.push({ instance, index });
            }
            return acc;
        }, [] as { instance: KGroupInstance, index: number }[]).sort((a, b) => a.index - b.index);
        if (components?.length && groupDefinition) {
            const countProperty = groupDefinition.getCustomProperty(CountPropertyKey);
            const count = Number.parseInt(countProperty)
            const intervalProperty = groupDefinition.getCustomProperty(IntervalPropertyKey);
            const intervalLocked = intervalProperty.startsWith(ManualPrefix);
            const interval = intervalLocked ? Number.parseFloat(intervalProperty.slice(1)) : Number.parseFloat(intervalProperty);
            const pathAxisProperty = groupDefinition.getCustomProperty(PathAxisPropertyKey);
            const normalAxisProperty = groupDefinition.getCustomProperty(NormalAxisPropertyKey);
            const scaleProperty = groupDefinition.getCustomProperty(ScalePropertyKey);
            const scaleLocked = scaleProperty.startsWith(ManualPrefix);

            const scale = scaleLocked ? Number.parseFloat(scaleProperty.slice(1)) : Number.parseFloat(scaleProperty);
            if (Number.isFinite(count) && count > 1 && Number.isFinite(interval) && Number.isFinite(scale) && isAxisValid(pathAxisProperty) && isAxisValid(normalAxisProperty)) {
                const pathListProperty = groupDefinition.getCustomProperty(PathListPropertyKey);
                const auxiliaryBoundedCurveMap: Map<string, KAuxiliaryBoundedCurve> = new Map();
                groupDefinition?.getAuxiliaryCurves().forEach(curve => {
                    if (isKAuxiliaryBoundedCurve(curve)) {
                        auxiliaryBoundedCurveMap.set(curve.getKey(), curve);
                    }
                });
                let pathValid = true;
                const path: PathObject[] = [];
                for (const pathStr of pathListProperty.split(PathDelimiter)) {
                    const splitResult = pathStr.split(PathReversedDelimiter);
                    if (splitResult.length === 2) {
                        const auxiliaryBoundedCurve = auxiliaryBoundedCurveMap.get(splitResult[0]);
                        if (auxiliaryBoundedCurve) {
                            path.push({ curve: auxiliaryBoundedCurve, reversed: splitResult[1] === '1' });
                            continue;
                        }
                    }
                    pathValid = false;
                    break;
                }
                if (pathValid && path.length) {
                    this.model = model;
                    this.components = components;
                    this.path = path;
                    const { pathPointPoses, totalLength } = this.pathPointPoses.length ? { pathPointPoses: this.pathPointPoses, totalLength: this.totalLength } : generatePathPoses(this.path);
                    this.pathPointPoses = pathPointPoses;
                    this.totalLength = totalLength;
                    this.pathArrayParams = {
                        interval: { value: interval, min: 10, max: totalLength / (count - 1) },
                        intervalLocked,
                        count: { value: count, min: 1, max: intervalLocked ? Math.floor(totalLength / interval + 1) : 1000 },
                        pathAxis: pathAxisProperty as Axis,
                        normalAxis: normalAxisProperty as Axis,
                        scale: { value: scale, min: 0.01, max: 1000 },
                        scaleLocked
                    };
                    return true;
                }
            }
        }
        return false;
    }

    clearModel() {
        this.model = undefined;
        this.path = [];
        this.components = [];
        this.pathPointPoses = [];
        this.totalLength = 0;
        this.pathArrayParams = DefaultPathArrayParams;
    }

    private async doOperation(params: PathArrayParams, needTransform: boolean = true) {
        if (!this.model) return false;
        const { pathPointPoses, totalLength } = this.pathPointPoses.length ? { pathPointPoses: this.pathPointPoses, totalLength: this.totalLength } : generatePathPoses(this.path);
        this.pathPointPoses = pathPointPoses;
        this.totalLength = totalLength;
        const componentTransforms: KMatrix4[] = getTransformFromPathPointPoses(pathPointPoses, params);
        // const scaleMatrix = GeomLib.createScaleMatrix4(scale, scale, scale);

        let operationSuccess = (await design.activateGroupInstance(this.model)).isSuccess;
        if (needTransform) {
            for (const component of this.components) {
                if (component.index >= params.count.value) break;
                const componentTransform = component.instance.getTransform();
                const componentLocalBoundingBox = component.instance.getLocalBoundingBox();
                const componentPosition = componentLocalBoundingBox.center;
                const resetMatrix = GeomLib.createTranslationMatrix4(-componentPosition.x, -componentPosition.y, -componentPosition.z)
                    .multiplied(componentTransform.inversed());
                const transformResult = design.transformGroupInstances([component.instance], componentTransforms[component.index].multiplied(resetMatrix));
                if (!transformResult.isSuccess) {
                    operationSuccess = false;
                    break;
                }
            }
        }
        if (params.count.value > this.pathArrayParams.count.value) {
            const componentInstance = this.components[0].instance;
            const componentTransform = componentInstance.getTransform();
            const componentLocalBoundingBox = componentInstance.getLocalBoundingBox();
            const componentPosition = componentLocalBoundingBox.center;
            const baseTransformInverse = GeomLib.createTranslationMatrix4(-componentPosition.x, -componentPosition.y, -componentPosition.z)
                .multiplied(componentTransform.inversed());
            const newGroupInstances = design.bulkCopyGroupInstances([componentInstance], [componentTransforms.slice(this.pathArrayParams.count.value).map(matrix => matrix.multiplied(baseTransformInverse))])?.addedInstances;
            if (newGroupInstances?.length) {
                for (let index = this.pathArrayParams.count.value; index < params.count.value; index++) {
                    operationSuccess = operationSuccess && newGroupInstances[index - this.pathArrayParams.count.value].setCustomProperty(ComponentPropertyKey, `${index}`).isSuccess;
                }
                if (operationSuccess) {
                    this.components = [...this.components, ...newGroupInstances.map((instance, i) => { return { instance, index: this.pathArrayParams.count.value + i } })];
                }
            } else {
                operationSuccess = false;
            }
        } else if (params.count.value < this.pathArrayParams.count.value) {
            const componentIndex = this.components.findIndex(component => component.index === params.count.value);
            const toDeleteComponents = this.components.slice(componentIndex);
            for (const toDeleteComponent of toDeleteComponents) {
                operationSuccess = operationSuccess && design.removeGroupInstance(toDeleteComponent.instance).isSuccess;
            }
            if (operationSuccess) {
                this.components.splice(componentIndex, this.components.length - componentIndex + 1);
            }
        }
        operationSuccess = operationSuccess && (await design.deactivateGroupInstance()).isSuccess;
        app.getSelection().add([this.model]);
        return operationSuccess;
    }

    async updateInterval(newInterval: number) {
        const modelGroupDefinition = this.model?.getGroupDefinition();
        if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams && newInterval !== this.pathArrayParams.interval.value) {
            const { scale, count, scaleLocked } = this.pathArrayParams;

            const componentInstance = this.components[0].instance;
            const componentLocalBoundingBox = componentInstance.getLocalBoundingBox();
            const needNewCount = newInterval * count.value > this.totalLength;
            const newCount = needNewCount ? Math.floor(this.totalLength / newInterval + 1) : count.value;
            const actualScale = scaleLocked ? scale.value : (componentLocalBoundingBox.width > (newInterval / 2) ? (newInterval / 2 / componentLocalBoundingBox.width) : scale.value);
            design.startOperation();

            const newParams = { ...this.pathArrayParams, interval: { value: newInterval, min: 10, max: this.totalLength / (newCount - 1) }, intervalLocked: true, count: { value: newCount, min: 1, max: Math.floor(this.totalLength / newInterval + 1) }, scale: { ...scale, value: actualScale } };
            const operationSuccess = await this.doOperation(newParams);

            if (operationSuccess) {
                modelGroupDefinition.setCustomProperty(IntervalPropertyKey, `${ManualPrefix}${newInterval}`);
                if (!scaleLocked && actualScale !== scale.value) {
                    modelGroupDefinition.setCustomProperty(ScalePropertyKey, `${actualScale}`);
                }
                this.pathArrayParams = newParams;
                design.commitOperation();
            } else {
                design.abortOperation();
            }
            return operationSuccess;

        }
    }

    async updateCount(newCount: number) {
        const modelGroupDefinition = this.model?.getGroupDefinition();
        if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams && newCount !== this.pathArrayParams.count.value) {
            const { interval, intervalLocked, count, scale, scaleLocked } = this.pathArrayParams;
            const totalLength = this.pathPointPoses.length ? this.totalLength : generatePathPoses(this.path).totalLength;
            this.totalLength = totalLength;

            const componentInstance = this.components[0].instance;
            const componentLocalBoundingBox = componentInstance.getLocalBoundingBox();
            const needNewInterval = (newCount > count.value && (this.totalLength > interval.value * newCount)) || (newCount < count.value && !intervalLocked);
            const actualInterval = needNewInterval ? this.totalLength / (newCount - 1) : interval.value;
            const needNewScale = needNewInterval || (!scaleLocked && componentLocalBoundingBox.width > (actualInterval / 2));
            const actualScale = needNewScale ? (actualInterval / 2 / componentLocalBoundingBox.width) : scale.value;
            design.startOperation();

            const newParams = { ...this.pathArrayParams, interval: { value: actualInterval, min: 10, max: totalLength / (newCount - 1) }, count: { ...this.pathArrayParams.count, value: newCount }, scale: { ...this.pathArrayParams.scale, value: actualScale } };
            const operationSuccess = await this.doOperation(newParams, needNewInterval || needNewScale);

            if (operationSuccess) {
                modelGroupDefinition.setCustomProperty(CountPropertyKey, `${newCount}`);
                if (needNewInterval) {
                    modelGroupDefinition.setCustomProperty(IntervalPropertyKey, `${actualInterval}`);
                }
                if (needNewScale) {
                    modelGroupDefinition.setCustomProperty(ScalePropertyKey, `${scaleLocked ? ManualPrefix : ''}${actualScale}`);
                }
                this.pathArrayParams = newParams;
                design.commitOperation();
            } else {
                design.abortOperation();
            }
            return operationSuccess;
        }
    }

    async updatePathAxis(newPathAxis: Axis) {
        const modelGroupDefinition = this.model?.getGroupDefinition();
        if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams) {

            design.startOperation();

            const newParams = { ...this.pathArrayParams, pathAxis: newPathAxis };
            const operationSuccess = await this.doOperation(newParams);

            if (operationSuccess) {
                modelGroupDefinition.setCustomProperty(PathAxisPropertyKey, `${newPathAxis}`);
                this.pathArrayParams = newParams;
                design.commitOperation();
            } else {
                design.abortOperation();
            }
            return operationSuccess;
        }
    }

    async updateNormalAxis(newNormalAxis: Axis) {
        const modelGroupDefinition = this.model?.getGroupDefinition();
        if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams) {

            design.startOperation();

            const newParams = { ...this.pathArrayParams, normalAxis: newNormalAxis };
            const operationSuccess = await this.doOperation(newParams);

            if (operationSuccess) {
                modelGroupDefinition.setCustomProperty(NormalAxisPropertyKey, `${newNormalAxis}`);
                this.pathArrayParams = newParams;
                design.commitOperation();
            } else {
                design.abortOperation();
            }
            return operationSuccess;
        }
    }

    async updateScale(newScale: number) {
        const modelGroupDefinition = this.model?.getGroupDefinition();
        if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams && newScale !== this.pathArrayParams.scale.value) {
            design.startOperation();

            const newParams = { ...this.pathArrayParams, scale: { ...this.pathArrayParams.scale, value: newScale }, scaleLocked: true };
            const operationSuccess = await this.doOperation(newParams);

            if (operationSuccess) {
                modelGroupDefinition.setCustomProperty(ScalePropertyKey, `${ManualPrefix}${newScale}`);
                this.pathArrayParams = newParams;
                design.commitOperation();
            } else {
                design.abortOperation();
            }
            return operationSuccess;
        }
    }

    onToolActive(): void {
    }

    onToolDeactive(): void {
    }
    onMouseMove(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
    }
    onLButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {

    }

    onRButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        app.deactivateCustomTool(this);
    }
    onLButtonDbClick(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        ;
    }
    allowUsingInference(): boolean {
        return false;
    }
    onKeyDown(event: KKeyBoardEvent): void {
        ;
    }
    onKeyUp(event: KKeyBoardEvent): void {
        ;
    }
}

export const pathArrayParamsEditTool = new PathArrayParamsEditTool();