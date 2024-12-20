import {
    ComponentPropertyKey, CountPropertyKey, DefaultPathArrayParams, IntervalPropertyKey, NormalAxisPropertyKey, PathArrayParams, PathAxisPropertyKey, PathDelimiter,
    PathListPropertyKey, PathObject, PathPointPose, PathReversedDelimiter, ScalePropertyKey
} from "./types";
import {
    boundedCurveConnectionDetect, ConnectionResult, findPathAfterMakeGroup, generatePathPoses, getBoundingBoxSizeInWorld, getTransformFromPathPointPoses, isKAuxiliaryBoundedCurve,
    isKFace, isKGroupInstance
} from "./utils";

export class PathArrayTool implements KTool {
    private model?: KGroupInstance | KFace;
    private path: PathObject[] = [];
    private pathPointPoses: PathPointPose[] = [];
    private totalLength: number = 0;
    private pathArrayParams: PathArrayParams = DefaultPathArrayParams;
    onToolActive(): void {
        const selection = app.getSelection();
        const toolHelper = app.getToolHelper();
        toolHelper.enablePicking(true);
        toolHelper.setDefaultSelectBehavior(KSelectBehavior.ADD);
        const allEntities = selection.getAllEntities();
        if (allEntities.length === 1 && (isKGroupInstance(allEntities[0]) || isKFace(allEntities[0]))) {
            this.model = allEntities[0];
        } else {
            selection.clear();
        }
    }

    onToolDeactive(): void {
        const pluginUI = app.getPluginUI();
        this.tryCommit();
        pluginUI.postMessage({ type: 'leavePathArrayTool' }, '*');
        const toolHelper = app.getToolHelper();
        toolHelper.enablePicking(false);
        toolHelper.setDefaultSelectBehavior(KSelectBehavior.REPLACE);
    }
    onMouseMove(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        ;
    }
    onLButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        const selection = app.getSelection();
        const pickHelper = app.getPickHelper();
        // const pickableEntityType = this.model ? [KEntityType.AuxiliaryBoundedCurve] : [KAppEntityType.GroupInstance, KEntityType.Face];
        const allPickedEntities = pickHelper.pickByPoint(event.clientX(), event.clientY()).getAllPicked();

        if (allPickedEntities.length) {
            if (this.model) {
                let isValidPath = false;
                if (isKAuxiliaryBoundedCurve(allPickedEntities[0])) {
                    const auxiliaryBoundedCurve = allPickedEntities[0];
                    if (this.path.length) {
                        const lastPath = this.path[this.path.length - 1];
                        let pathEndVertex = lastPath.reversed ? lastPath.curve.getStartVertex() : lastPath.curve.getEndVertex();
                        let connectionResult: ConnectionResult | undefined;
                        if (this.path.length === 1) {
                            connectionResult = boundedCurveConnectionDetect(pathEndVertex, auxiliaryBoundedCurve);
                            if (!connectionResult.connected) {
                                pathEndVertex = lastPath.curve.getStartVertex();
                                connectionResult = boundedCurveConnectionDetect(pathEndVertex, auxiliaryBoundedCurve);
                                if (connectionResult.connected) {
                                    lastPath.reversed = !lastPath.reversed;
                                }
                            }
                        } else {
                            connectionResult = boundedCurveConnectionDetect(pathEndVertex, auxiliaryBoundedCurve);
                        }

                        if (connectionResult.connected) {
                            this.path.push({ curve: auxiliaryBoundedCurve, reversed: connectionResult.reversed });
                            isValidPath = true;
                        }
                    } else {
                        this.path.push({ curve: auxiliaryBoundedCurve, reversed: false });
                        isValidPath = true;
                    }
                }
                if (isValidPath) {
                    selection.remove(allPickedEntities.slice(1));
                } else {
                    selection.remove(allPickedEntities);
                }
            } else {
                this.model = allPickedEntities[0] as (KGroupInstance | KFace);
            }
        } else {
            this.tryCommit();
        }
    }

    private tryCommit() {
        if (this.model && this.path.length) {
            const design = app.getActiveDesign();
            design.startOperation();
            let component;
            if (isKGroupInstance(this.model)) {
                component = this.model;
            } else if (isKFace(this.model)) {
                component = design.makeGroup([this.model], [], [])?.addedInstance;
            }

            if (component) {
                const { pathPointPoses, totalLength } = this.pathPointPoses.length ? { pathPointPoses: this.pathPointPoses, totalLength: this.totalLength } : generatePathPoses(this.path);
                this.pathPointPoses = pathPointPoses;
                this.totalLength = totalLength;

                const components: KGroupInstance[] = [component];
                const automaticInterval = totalLength / (this.pathArrayParams.count.value - 1);
                const worldSize = getBoundingBoxSizeInWorld(component);
                const scale = worldSize[0] > (automaticInterval / 2) ? (automaticInterval / 2 / worldSize[0]) : 1;
                const componentLocalBoundingBox = component.getLocalBoundingBox();
                const componentTransform = component.getTransform();
                const componentPosition = componentLocalBoundingBox.center;
                const resetMatrix = GeomLib.createTranslationMatrix4(-componentPosition.x, -componentPosition.y, -componentPosition.z)
                    .multiplied(componentTransform.inversed());
                const newPathArrayParams = { ...this.pathArrayParams, interval: { ...this.pathArrayParams.interval, value: automaticInterval }, scale: { ...this.pathArrayParams.scale, value: scale } };
                const componentTransforms = getTransformFromPathPointPoses(this.pathPointPoses, newPathArrayParams);
                let operationSuccess = design.transformGroupInstances([component], componentTransforms[0].multiplied(resetMatrix)).isSuccess;
                if (operationSuccess) {
                    const baseTransformInverse: KMatrix4 = componentTransforms[0].inversed();

                    const newComponents = design.bulkCopyGroupInstances([component], [componentTransforms.slice(1).map(matrix => matrix.multiplied(baseTransformInverse))])?.addedInstances;

                    if (newComponents?.length) {
                        components.push(...newComponents);

                        for (let index = 0; index < components.length; index++) {
                            operationSuccess = operationSuccess && components[index].setCustomProperty(ComponentPropertyKey, `${index}`).isSuccess;
                        }
                        const parentGroupInstance = design.makeGroup([], components, this.path.map(pathObject => pathObject.curve))?.addedInstance;
                        const parentGroupDefinition = parentGroupInstance?.getGroupDefinition();
                        if (parentGroupDefinition && parentGroupInstance) {
                            const pathCount = this.path.length;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(IntervalPropertyKey, `${automaticInterval}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(CountPropertyKey, `${this.pathArrayParams.count.value}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(PathAxisPropertyKey, `${this.pathArrayParams.pathAxis}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(NormalAxisPropertyKey, `${this.pathArrayParams.normalAxis}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(ScalePropertyKey, `${scale}`).isSuccess;
                            const newPath = findPathAfterMakeGroup(this.path, parentGroupInstance);
                            operationSuccess = operationSuccess && newPath?.length === this.path.length;
                            if (operationSuccess && newPath?.length) {
                                this.path = newPath;
                            }
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(PathListPropertyKey, this.path.reduce<string>((acc, pathObject, index) => {
                                acc += `${pathObject.curve.getKey()}${PathReversedDelimiter}${pathObject.reversed ? 1 : 0}`;
                                if (index < pathCount - 1) {
                                    acc += `${PathDelimiter}`;
                                }
                                return acc;
                            }, '')).isSuccess;
                            if (operationSuccess) {
                                this.pathArrayParams = newPathArrayParams;
                                design.commitOperation();
                                const selection = app.getSelection();
                                selection.clear();
                                selection.add([parentGroupInstance]);
                            } else {
                                design.abortOperation();
                            }
                        } else {
                            design.abortOperation();
                        }
                    } else {
                        design.abortOperation();
                    }
                }
                app.deactivateCustomTool(this, false);
            } else {
                design.abortOperation();
            }
        }
        this.clear();
    }

    private clear() {
        this.model = undefined;
        this.path = [];
        this.pathPointPoses = [];
        this.totalLength = 0;
        this.pathArrayParams = { ...DefaultPathArrayParams, count: this.pathArrayParams.count };
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

export const pathArrayTool = new PathArrayTool();