/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/PathArrayParamsEditTool.ts":
/*!*********************************************!*\
  !*** ./src/main/PathArrayParamsEditTool.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PathArrayParamsEditTool: () => (/* binding */ PathArrayParamsEditTool),
/* harmony export */   pathArrayParamsEditTool: () => (/* binding */ pathArrayParamsEditTool)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/main/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/main/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const design = app.getActiveDesign();
class PathArrayParamsEditTool {
    constructor() {
        this.components = [];
        this.path = [];
        this.pathPointPoses = [];
        this.totalLength = 0;
        this.pathArrayParams = _types__WEBPACK_IMPORTED_MODULE_0__.DefaultPathArrayParams;
    }
    getPathArrayParams() {
        return this.pathArrayParams;
    }
    setModel(model) {
        const groupDefinition = model.getGroupDefinition();
        const components = groupDefinition === null || groupDefinition === void 0 ? void 0 : groupDefinition.getSubGroupInstances().reduce((acc, instance) => {
            const componentProperty = instance.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ComponentPropertyKey);
            const index = Number.parseInt(componentProperty);
            if (Number.isFinite(index)) {
                acc.push({ instance, index });
            }
            // return { instance, index: Number.};
            return acc;
        }, []).sort((a, b) => a.index - b.index);
        if ((components === null || components === void 0 ? void 0 : components.length) && groupDefinition) {
            const countProperty = groupDefinition.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.CountPropertyKey);
            const count = Number.parseInt(countProperty);
            const intervalProperty = groupDefinition.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.IntervalPropertyKey);
            const intervalLocked = intervalProperty.startsWith(_types__WEBPACK_IMPORTED_MODULE_0__.ManualPrefix);
            const interval = intervalLocked ? Number.parseFloat(intervalProperty.slice(1)) : Number.parseFloat(intervalProperty);
            const pathAxisProperty = groupDefinition.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.PathAxisPropertyKey);
            const normalAxisProperty = groupDefinition.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.NormalAxisPropertyKey);
            const scaleProperty = groupDefinition.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ScalePropertyKey);
            const scaleLocked = scaleProperty.startsWith(_types__WEBPACK_IMPORTED_MODULE_0__.ManualPrefix);
            const scale = scaleLocked ? Number.parseFloat(scaleProperty.slice(1)) : Number.parseFloat(scaleProperty);
            if (Number.isFinite(count) && count > 1 && Number.isFinite(interval) && Number.isFinite(scale) && (0,_types__WEBPACK_IMPORTED_MODULE_0__.isAxisValid)(pathAxisProperty) && (0,_types__WEBPACK_IMPORTED_MODULE_0__.isAxisValid)(normalAxisProperty)) {
                const pathListProperty = groupDefinition.getCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.PathListPropertyKey);
                const auxiliaryBoundedCurveMap = new Map();
                groupDefinition === null || groupDefinition === void 0 ? void 0 : groupDefinition.getAuxiliaryCurves().forEach(curve => {
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isKAuxiliaryBoundedCurve)(curve)) {
                        auxiliaryBoundedCurveMap.set(curve.getKey(), curve);
                    }
                });
                let pathValid = true;
                const path = [];
                for (const pathStr of pathListProperty.split(_types__WEBPACK_IMPORTED_MODULE_0__.PathDelimiter)) {
                    const splitResult = pathStr.split(_types__WEBPACK_IMPORTED_MODULE_0__.PathReversedDelimiter);
                    if (splitResult.length === 2) {
                        const auxiliaryBoundedCurve = auxiliaryBoundedCurveMap.get(splitResult[0]);
                        if (auxiliaryBoundedCurve) {
                            // const discreteResult = discreteAuxiliaryBoundedCurve(auxiliaryBoundedCurve);
                            // if (discreteResult.discretePoints.length) {
                            path.push({ curve: auxiliaryBoundedCurve, reversed: splitResult[1] === '1' });
                            continue;
                            // }
                        }
                    }
                    pathValid = false;
                    break;
                }
                if (pathValid && path.length) {
                    this.model = model;
                    this.components = components;
                    this.path = path;
                    const { pathPointPoses, totalLength } = this.pathPointPoses.length ? { pathPointPoses: this.pathPointPoses, totalLength: this.totalLength } : (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generatePathPoses)(this.path);
                    this.pathPointPoses = pathPointPoses;
                    this.totalLength = totalLength;
                    this.pathArrayParams = {
                        interval: { value: interval, min: 10, max: totalLength / (count - 1) },
                        intervalLocked,
                        count: { value: count, min: 1, max: intervalLocked ? Math.floor(totalLength / interval + 1) : 1000 },
                        pathAxis: pathAxisProperty,
                        normalAxis: normalAxisProperty,
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
        this.pathArrayParams = _types__WEBPACK_IMPORTED_MODULE_0__.DefaultPathArrayParams;
    }
    // getModel() {
    //     return this.model;
    // }
    doOperation(params, needTransform = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.model)
                return false;
            const { pathPointPoses, totalLength } = this.pathPointPoses.length ? { pathPointPoses: this.pathPointPoses, totalLength: this.totalLength } : (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generatePathPoses)(this.path);
            this.pathPointPoses = pathPointPoses;
            this.totalLength = totalLength;
            const componentTransforms = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getTransformFromPathPointPoses)(pathPointPoses, params);
            // const scaleMatrix = GeomLib.createScaleMatrix4(scale, scale, scale);
            let operationSuccess = (yield design.activateGroupInstance(this.model)).isSuccess;
            if (needTransform) {
                for (const component of this.components) {
                    if (component.index >= params.count.value)
                        break;
                    const componentTransform = component.instance.getTransform();
                    // const extendedTransform = getExtendedTransform();
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
                const newGroupInstances = (_a = design.bulkCopyGroupInstances([componentInstance], [componentTransforms.slice(this.pathArrayParams.count.value).map(matrix => matrix.multiplied(baseTransformInverse))])) === null || _a === void 0 ? void 0 : _a.addedInstances;
                if (newGroupInstances === null || newGroupInstances === void 0 ? void 0 : newGroupInstances.length) {
                    for (let index = this.pathArrayParams.count.value; index < params.count.value; index++) {
                        operationSuccess = operationSuccess && newGroupInstances[index - this.pathArrayParams.count.value].setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ComponentPropertyKey, `${index}`).isSuccess;
                    }
                    if (operationSuccess) {
                        this.components = [...this.components, ...newGroupInstances.map((instance, i) => { return { instance, index: this.pathArrayParams.count.value + i }; })];
                    }
                }
                else {
                    operationSuccess = false;
                }
            }
            else if (params.count.value < this.pathArrayParams.count.value) {
                const componentIndex = this.components.findIndex(component => component.index === params.count.value);
                const toDeleteComponents = this.components.slice(componentIndex);
                for (const toDeleteComponent of toDeleteComponents) {
                    operationSuccess = operationSuccess && design.removeGroupInstance(toDeleteComponent.instance).isSuccess;
                }
                if (operationSuccess) {
                    this.components.splice(componentIndex, this.components.length - componentIndex + 1);
                }
            }
            operationSuccess = operationSuccess && (yield design.deactivateGroupInstance()).isSuccess;
            app.getSelection().add([this.model]);
            return operationSuccess;
        });
    }
    updateInterval(newInterval) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const modelGroupDefinition = (_a = this.model) === null || _a === void 0 ? void 0 : _a.getGroupDefinition();
            if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams && newInterval !== this.pathArrayParams.interval.value) {
                const { scale, count, scaleLocked } = this.pathArrayParams;
                const componentInstance = this.components[0].instance;
                const componentLocalBoundingBox = componentInstance.getLocalBoundingBox();
                // const components: KGroupInstance[] = [component];
                // const automaticInterval = totalLength / (this.pathArrayParams.count - 1);
                // const worldSize = getBoundingBoxSizeInWorld(componentInstance);
                const needNewCount = newInterval * count.value > this.totalLength;
                const newCount = needNewCount ? Math.floor(this.totalLength / newInterval + 1) : count.value;
                const actualScale = scaleLocked ? scale.value : (componentLocalBoundingBox.width > (newInterval / 2) ? (newInterval / 2 / componentLocalBoundingBox.width) : scale.value);
                design.startOperation();
                const newParams = Object.assign(Object.assign({}, this.pathArrayParams), { interval: { value: newInterval, min: 10, max: this.totalLength / (newCount - 1) }, intervalLocked: true, count: { value: newCount, min: 1, max: Math.floor(this.totalLength / newInterval + 1) }, scale: Object.assign(Object.assign({}, scale), { value: actualScale }) });
                const operationSuccess = yield this.doOperation(newParams);
                // const componentTransforms: KMatrix4[] = getTransformFromPathPointPoses(pathPointPoses, { ...this.pathArrayParams, interval, scale: actualScale });
                if (operationSuccess) {
                    modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.IntervalPropertyKey, `${_types__WEBPACK_IMPORTED_MODULE_0__.ManualPrefix}${newInterval}`);
                    if (!scaleLocked && actualScale !== scale.value) {
                        modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ScalePropertyKey, `${actualScale}`);
                    }
                    this.pathArrayParams = newParams;
                    design.commitOperation();
                }
                else {
                    design.abortOperation();
                }
                return operationSuccess;
            }
        });
    }
    updateCount(newCount) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const modelGroupDefinition = (_a = this.model) === null || _a === void 0 ? void 0 : _a.getGroupDefinition();
            if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams && newCount !== this.pathArrayParams.count.value) {
                const { interval, intervalLocked, count, scale, scaleLocked } = this.pathArrayParams;
                const totalLength = this.pathPointPoses.length ? this.totalLength : (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generatePathPoses)(this.path).totalLength;
                this.totalLength = totalLength;
                const componentInstance = this.components[0].instance;
                const componentLocalBoundingBox = componentInstance.getLocalBoundingBox();
                // const components: KGroupInstance[] = [component];
                // const automaticInterval = totalLength / (this.pathArrayParams.count - 1);
                // const worldSize = getBoundingBoxSizeInWorld(componentInstance);
                const needNewInterval = (newCount > count.value && (this.totalLength > interval.value * newCount)) || (newCount < count.value && !intervalLocked);
                const actualInterval = needNewInterval ? this.totalLength / (newCount - 1) : interval.value;
                const needNewScale = needNewInterval || (!scaleLocked && componentLocalBoundingBox.width > (actualInterval / 2));
                const actualScale = needNewScale ? (actualInterval / 2 / componentLocalBoundingBox.width) : scale.value;
                design.startOperation();
                const newParams = Object.assign(Object.assign({}, this.pathArrayParams), { interval: { value: actualInterval, min: 10, max: totalLength / (newCount - 1) }, count: Object.assign(Object.assign({}, this.pathArrayParams.count), { value: newCount }), scale: Object.assign(Object.assign({}, this.pathArrayParams.scale), { value: actualScale }) });
                const operationSuccess = yield this.doOperation(newParams, needNewInterval || needNewScale);
                // const componentTransforms: KMatrix4[] = getTransformFromPathPointPoses(pathPointPoses, { ...this.pathArrayParams, interval, scale: actualScale });
                if (operationSuccess) {
                    modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.CountPropertyKey, `${newCount}`);
                    if (needNewInterval) {
                        modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.IntervalPropertyKey, `${actualInterval}`);
                    }
                    if (needNewScale) {
                        modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ScalePropertyKey, `${scaleLocked ? _types__WEBPACK_IMPORTED_MODULE_0__.ManualPrefix : ''}${actualScale}`);
                    }
                    this.pathArrayParams = newParams;
                    design.commitOperation();
                }
                else {
                    design.abortOperation();
                }
                return operationSuccess;
            }
        });
    }
    updatePathAxis(newPathAxis) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const modelGroupDefinition = (_a = this.model) === null || _a === void 0 ? void 0 : _a.getGroupDefinition();
            if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams) {
                design.startOperation();
                const newParams = Object.assign(Object.assign({}, this.pathArrayParams), { pathAxis: newPathAxis });
                const operationSuccess = yield this.doOperation(newParams);
                // const componentTransforms: KMatrix4[] = getTransformFromPathPointPoses(pathPointPoses, { ...this.pathArrayParams, interval, scale: actualScale });
                if (operationSuccess) {
                    modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.PathAxisPropertyKey, `${newPathAxis}`);
                    this.pathArrayParams = newParams;
                    design.commitOperation();
                }
                else {
                    design.abortOperation();
                }
                return operationSuccess;
            }
        });
    }
    updateNormalAxis(newNormalAxis) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const modelGroupDefinition = (_a = this.model) === null || _a === void 0 ? void 0 : _a.getGroupDefinition();
            if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams) {
                design.startOperation();
                const newParams = Object.assign(Object.assign({}, this.pathArrayParams), { normalAxis: newNormalAxis });
                const operationSuccess = yield this.doOperation(newParams);
                // const componentTransforms: KMatrix4[] = getTransformFromPathPointPoses(pathPointPoses, { ...this.pathArrayParams, interval, scale: actualScale });
                if (operationSuccess) {
                    modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.NormalAxisPropertyKey, `${newNormalAxis}`);
                    this.pathArrayParams = newParams;
                    design.commitOperation();
                }
                else {
                    design.abortOperation();
                }
                return operationSuccess;
            }
        });
    }
    updateScale(newScale) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const modelGroupDefinition = (_a = this.model) === null || _a === void 0 ? void 0 : _a.getGroupDefinition();
            if (this.model && modelGroupDefinition && this.components.length && this.path.length && this.pathArrayParams && newScale !== this.pathArrayParams.scale.value) {
                design.startOperation();
                const newParams = Object.assign(Object.assign({}, this.pathArrayParams), { scale: Object.assign(Object.assign({}, this.pathArrayParams.scale), { value: newScale }), scaleLocked: true });
                const operationSuccess = yield this.doOperation(newParams);
                if (operationSuccess) {
                    modelGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ScalePropertyKey, `${_types__WEBPACK_IMPORTED_MODULE_0__.ManualPrefix}${newScale}`);
                    this.pathArrayParams = newParams;
                    design.commitOperation();
                }
                else {
                    design.abortOperation();
                }
                return operationSuccess;
            }
        });
    }
    onToolActive() {
        // const selection = app.getSelection();
        // const toolHelper = app.getToolHelper();
        // toolHelper.enablePicking(true);
        // toolHelper.setDefaultSelectBehavior(KSelectBehavior.ADD);
        // const allEntities = selection.getAllEntities();
        // if (allEntities.length === 1 && (isKGroupInstance(allEntities[0]) || isKFace(allEntities[0]))) {
        //     this.model = allEntities[0];
        // } else {
        //     selection.clear();
        // }
        // selection.addObserver({ onSelectionChange: this.selectionObserver });
    }
    // private selectionObserver = () => {
    //     const selection = app.getSelection();
    //     selection.
    //     const allEntities = selection.getAllEntities();
    //     if (this.model) {
    //     } else {
    //     }
    // }
    onToolDeactive() {
        // const pluginUI = app.getPluginUI();
        // this.tryCommit();
        // pluginUI.postMessage({ type: 'deActivatePathArray' }, '*');
    }
    onMouseMove(event, inferenceResult) {
        ;
    }
    onLButtonUp(event, inferenceResult) {
    }
    onRButtonUp(event, inferenceResult) {
        app.deactivateCustomTool(this);
    }
    onLButtonDbClick(event, inferenceResult) {
        ;
    }
    allowUsingInference() {
        return false;
    }
    onKeyDown(event) {
        ;
    }
    onKeyUp(event) {
        ;
    }
}
const pathArrayParamsEditTool = new PathArrayParamsEditTool();


/***/ }),

/***/ "./src/main/PathArrayTool.ts":
/*!***********************************!*\
  !*** ./src/main/PathArrayTool.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PathArrayTool: () => (/* binding */ PathArrayTool),
/* harmony export */   pathArrayTool: () => (/* binding */ pathArrayTool)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/main/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/main/utils.ts");


class PathArrayTool {
    constructor() {
        this.path = [];
        this.pathPointPoses = [];
        this.totalLength = 0;
        this.pathArrayParams = _types__WEBPACK_IMPORTED_MODULE_0__.DefaultPathArrayParams;
    }
    onToolActive() {
        const selection = app.getSelection();
        const toolHelper = app.getToolHelper();
        toolHelper.enablePicking(true);
        toolHelper.setDefaultSelectBehavior(KSelectBehavior.ADD);
        const allEntities = selection.getAllEntities();
        if (allEntities.length === 1 && ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isKGroupInstance)(allEntities[0]) || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isKFace)(allEntities[0]))) {
            this.model = allEntities[0];
        }
        else {
            selection.clear();
        }
        // selection.addObserver({ onSelectionChange: this.selectionObserver });
    }
    // private selectionObserver = () => {
    //     const selection = app.getSelection();
    //     selection.
    //     const allEntities = selection.getAllEntities();
    //     if (this.model) {
    //     } else {
    //     }
    // }
    onToolDeactive() {
        const pluginUI = app.getPluginUI();
        this.tryCommit();
        pluginUI.postMessage({ type: 'leavePathArrayTool' }, '*');
        const toolHelper = app.getToolHelper();
        toolHelper.enablePicking(false);
        toolHelper.setDefaultSelectBehavior(KSelectBehavior.REPLACE);
    }
    onMouseMove(event, inferenceResult) {
        ;
    }
    onLButtonUp(event, inferenceResult) {
        const selection = app.getSelection();
        const pickHelper = app.getPickHelper();
        // const pickableEntityType = this.model ? [KEntityType.AuxiliaryBoundedCurve] : [KAppEntityType.GroupInstance, KEntityType.Face];
        const allPickedEntities = pickHelper.pickByPoint(event.clientX(), event.clientY()).getAllPicked();
        if (allPickedEntities.length) {
            if (this.model) {
                let isValidPath = false;
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isKAuxiliaryBoundedCurve)(allPickedEntities[0])) {
                    const auxiliaryBoundedCurve = allPickedEntities[0];
                    // let discreteResult: DiscreteResult = { discretePoints: [], length: 0 };
                    if (this.path.length) {
                        const lastPath = this.path[this.path.length - 1];
                        let pathEndVertex = lastPath.reversed ? lastPath.curve.getStartVertex() : lastPath.curve.getEndVertex();
                        let connectionResult;
                        if (this.path.length === 1) {
                            connectionResult = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.boundedCurveConnectionDetect)(pathEndVertex, auxiliaryBoundedCurve);
                            if (!connectionResult.connected) {
                                pathEndVertex = lastPath.curve.getStartVertex();
                                connectionResult = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.boundedCurveConnectionDetect)(pathEndVertex, auxiliaryBoundedCurve);
                                if (connectionResult.connected) {
                                    lastPath.reversed = !lastPath.reversed;
                                    // lastPath.discretePoints.reverse();
                                    // this.path.push({ curve: auxiliaryBoundedCurve, reversed: connection.reversed });
                                    // // selection.add([allPickedEntities[0]]);
                                    // isValidPath = true;
                                }
                            }
                        }
                        else {
                            connectionResult = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.boundedCurveConnectionDetect)(pathEndVertex, auxiliaryBoundedCurve);
                        }
                        if (connectionResult.connected) {
                            // discreteResult = discreteAuxiliaryBoundedCurve(auxiliaryBoundedCurve);
                            // if (connectionResult.reversed) {
                            //     discreteResult.discretePoints.reverse();
                            // }
                            this.path.push({ curve: auxiliaryBoundedCurve, reversed: connectionResult.reversed });
                            // selection.add([allPickedEntities[0]]);
                            isValidPath = true;
                        }
                    }
                    else {
                        // discreteResult = discreteAuxiliaryBoundedCurve(auxiliaryBoundedCurve);
                        this.path.push({ curve: auxiliaryBoundedCurve, reversed: false });
                        // selection.add([allPickedEntities[0]]);
                        isValidPath = true;
                    }
                }
                if (isValidPath) {
                    selection.remove(allPickedEntities.slice(1));
                }
                else {
                    selection.remove(allPickedEntities);
                }
            }
            else {
                this.model = allPickedEntities[0];
                // selection.add([allPickedEntities[0]]);
            }
        }
        else {
            this.tryCommit();
        }
    }
    tryCommit() {
        var _a, _b, _c;
        if (this.model && this.path.length) {
            const design = app.getActiveDesign();
            design.startOperation();
            let component;
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isKGroupInstance)(this.model)) {
                component = this.model;
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isKFace)(this.model)) {
                component = (_a = design.makeGroup([this.model], [], [])) === null || _a === void 0 ? void 0 : _a.addedInstance;
            }
            if (component) {
                // const totalLength = this.path.reduce<number>((acc, pathObject) => { acc += pathObject.length; return acc }, 0);
                const { pathPointPoses, totalLength } = this.pathPointPoses.length ? { pathPointPoses: this.pathPointPoses, totalLength: this.totalLength } : (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generatePathPoses)(this.path);
                this.pathPointPoses = pathPointPoses;
                this.totalLength = totalLength;
                // const componentTransforms: KMatrix4[] = [];
                const components = [component];
                const automaticInterval = totalLength / (this.pathArrayParams.count.value - 1);
                const worldSize = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBoundingBoxSizeInWorld)(component);
                const scale = worldSize[0] > (automaticInterval / 2) ? (automaticInterval / 2 / worldSize[0]) : 1;
                const componentLocalBoundingBox = component.getLocalBoundingBox();
                const componentTransform = component.getTransform();
                // const extendedTransform = getExtendedTransform();
                const componentPosition = componentLocalBoundingBox.center;
                const resetMatrix = GeomLib.createTranslationMatrix4(-componentPosition.x, -componentPosition.y, -componentPosition.z)
                    .multiplied(componentTransform.inversed());
                // const scaleMatrix = GeomLib.createScaleMatrix4(scale, scale, scale);
                const newPathArrayParams = Object.assign(Object.assign({}, this.pathArrayParams), { interval: Object.assign(Object.assign({}, this.pathArrayParams.interval), { value: automaticInterval }), scale: Object.assign(Object.assign({}, this.pathArrayParams.scale), { value: scale }) });
                const componentTransforms = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getTransformFromPathPointPoses)(this.pathPointPoses, newPathArrayParams);
                let operationSuccess = design.transformGroupInstances([component], componentTransforms[0].multiplied(resetMatrix)).isSuccess;
                // GeomLib.createTranslationMatrix4(componentPositions[0].x - currentComponentPosition.x, componentPositions[0].y - currentComponentPosition.y, componentPositions[0].z - currentComponentPosition.z)
                if (operationSuccess) {
                    // if (componentTransforms.length > 1) {
                    const baseTransformInverse = componentTransforms[0].inversed();
                    const newComponents = (_b = design.bulkCopyGroupInstances([component], [componentTransforms.slice(1).map(matrix => matrix.multiplied(baseTransformInverse))])) === null || _b === void 0 ? void 0 : _b.addedInstances;
                    // [componentPositions.slice(1).map(position => GeomLib.createTranslationMatrix4(position.x - componentPositions[0].x, position.y - componentPositions[0].y, position.z - componentPositions[0].z))]
                    if (newComponents === null || newComponents === void 0 ? void 0 : newComponents.length) {
                        components.push(...newComponents);
                        for (let index = 0; index < components.length; index++) {
                            operationSuccess = operationSuccess && components[index].setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ComponentPropertyKey, `${index}`).isSuccess;
                        }
                        const parentGroupInstance = (_c = design.makeGroup([], components, this.path.map(pathObject => pathObject.curve))) === null || _c === void 0 ? void 0 : _c.addedInstance;
                        const parentGroupDefinition = parentGroupInstance === null || parentGroupInstance === void 0 ? void 0 : parentGroupInstance.getGroupDefinition();
                        if (parentGroupDefinition && parentGroupInstance) {
                            const pathCount = this.path.length;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.IntervalPropertyKey, `${automaticInterval}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.CountPropertyKey, `${this.pathArrayParams.count.value}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.PathAxisPropertyKey, `${this.pathArrayParams.pathAxis}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.NormalAxisPropertyKey, `${this.pathArrayParams.normalAxis}`).isSuccess;
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.ScalePropertyKey, `${scale}`).isSuccess;
                            const newPath = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.findPathAfterMakeGroup)(this.path, parentGroupInstance);
                            operationSuccess = operationSuccess && (newPath === null || newPath === void 0 ? void 0 : newPath.length) === this.path.length;
                            if (operationSuccess && (newPath === null || newPath === void 0 ? void 0 : newPath.length)) {
                                this.path = newPath;
                            }
                            operationSuccess = operationSuccess && parentGroupDefinition.setCustomProperty(_types__WEBPACK_IMPORTED_MODULE_0__.PathListPropertyKey, this.path.reduce((acc, pathObject, index) => {
                                acc += `${pathObject.curve.getKey()}${_types__WEBPACK_IMPORTED_MODULE_0__.PathReversedDelimiter}${pathObject.reversed ? 1 : 0}`;
                                if (index < pathCount - 1) {
                                    acc += `${_types__WEBPACK_IMPORTED_MODULE_0__.PathDelimiter}`;
                                }
                                return acc;
                            }, '')).isSuccess;
                            if (operationSuccess) {
                                this.pathArrayParams = newPathArrayParams;
                                design.commitOperation();
                                const selection = app.getSelection();
                                selection.clear();
                                selection.add([parentGroupInstance]);
                            }
                            else {
                                design.abortOperation();
                            }
                        }
                        else {
                            design.abortOperation();
                        }
                    }
                    else {
                        design.abortOperation();
                    }
                    // }
                }
                app.deactivateCustomTool(this, false);
            }
            else {
                design.abortOperation();
            }
        }
        this.clear();
    }
    clear() {
        this.model = undefined;
        this.path = [];
        this.pathPointPoses = [];
        this.totalLength = 0;
        this.pathArrayParams = Object.assign(Object.assign({}, _types__WEBPACK_IMPORTED_MODULE_0__.DefaultPathArrayParams), { count: this.pathArrayParams.count });
        // this.interval = DefaultInterval;
    }
    onRButtonUp(event, inferenceResult) {
        app.deactivateCustomTool(this);
    }
    onLButtonDbClick(event, inferenceResult) {
        ;
    }
    allowUsingInference() {
        return false;
    }
    onKeyDown(event) {
        ;
    }
    onKeyUp(event) {
        ;
    }
}
const pathArrayTool = new PathArrayTool();


/***/ }),

/***/ "./src/main/types.ts":
/*!***************************!*\
  !*** ./src/main/types.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentPropertyKey: () => (/* binding */ ComponentPropertyKey),
/* harmony export */   CountPropertyKey: () => (/* binding */ CountPropertyKey),
/* harmony export */   DefaultPathArrayParams: () => (/* binding */ DefaultPathArrayParams),
/* harmony export */   IntervalPropertyKey: () => (/* binding */ IntervalPropertyKey),
/* harmony export */   ManualPrefix: () => (/* binding */ ManualPrefix),
/* harmony export */   NormalAxisPropertyKey: () => (/* binding */ NormalAxisPropertyKey),
/* harmony export */   PathAxisPropertyKey: () => (/* binding */ PathAxisPropertyKey),
/* harmony export */   PathDelimiter: () => (/* binding */ PathDelimiter),
/* harmony export */   PathListPropertyKey: () => (/* binding */ PathListPropertyKey),
/* harmony export */   PathReversedDelimiter: () => (/* binding */ PathReversedDelimiter),
/* harmony export */   ScalePropertyKey: () => (/* binding */ ScalePropertyKey),
/* harmony export */   dummyMatrix4: () => (/* binding */ dummyMatrix4),
/* harmony export */   dummyPoint3d: () => (/* binding */ dummyPoint3d),
/* harmony export */   dummyVector3d: () => (/* binding */ dummyVector3d),
/* harmony export */   isAxisValid: () => (/* binding */ isAxisValid)
/* harmony export */ });
const ComponentPropertyKey = 'PAComponent';
const IntervalPropertyKey = 'PAInterval';
const CountPropertyKey = 'PACount';
const PathAxisPropertyKey = 'PAPathAxis';
const NormalAxisPropertyKey = 'PANormalAxis';
const ScalePropertyKey = 'PAScale';
const PathListPropertyKey = 'PAPathList';
const PathReversedDelimiter = '-';
const PathDelimiter = '&';
const ManualPrefix = 'm';
function isAxisValid(axis) {
    return axis === "X" /* Axis.X */ || axis === "-X" /* Axis.XMinus */ || axis === "Y" /* Axis.Y */ || axis === "-Y" /* Axis.YMinus */ || axis === "Z" /* Axis.Z */ || axis === "-Z" /* Axis.ZMinus */;
}
const DefaultPathArrayParams = {
    interval: { value: 1000, min: 10, max: 9999999 },
    count: { value: 5, min: 1, max: 100 },
    pathAxis: "X" /* Axis.X */,
    normalAxis: "Z" /* Axis.Z */,
    scale: { value: 1, min: 0.01, max: 1000 },
};
const dummyMatrix4 = GeomLib.createIdentityMatrix4();
const dummyVector3d = GeomLib.createVector3d(0, 0, 1);
const dummyPoint3d = GeomLib.createPoint3d(0, 0, 0);


/***/ }),

/***/ "./src/main/utils.ts":
/*!***************************!*\
  !*** ./src/main/utils.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   boundedCurveConnectionDetect: () => (/* binding */ boundedCurveConnectionDetect),
/* harmony export */   discreteAuxiliaryBoundedCurve: () => (/* binding */ discreteAuxiliaryBoundedCurve),
/* harmony export */   findPathAfterMakeGroup: () => (/* binding */ findPathAfterMakeGroup),
/* harmony export */   generatePathPoses: () => (/* binding */ generatePathPoses),
/* harmony export */   getAuxiliaryBoundedCurveNormal: () => (/* binding */ getAuxiliaryBoundedCurveNormal),
/* harmony export */   getBoundingBoxSizeInWorld: () => (/* binding */ getBoundingBoxSizeInWorld),
/* harmony export */   getExtendedTransform: () => (/* binding */ getExtendedTransform),
/* harmony export */   getNormalByX: () => (/* binding */ getNormalByX),
/* harmony export */   getTransformFromPathPointPoses: () => (/* binding */ getTransformFromPathPointPoses),
/* harmony export */   isKArc3d: () => (/* binding */ isKArc3d),
/* harmony export */   isKAuxiliaryBoundedCurve: () => (/* binding */ isKAuxiliaryBoundedCurve),
/* harmony export */   isKFace: () => (/* binding */ isKFace),
/* harmony export */   isKGroupInstance: () => (/* binding */ isKGroupInstance),
/* harmony export */   isKLineSegment3d: () => (/* binding */ isKLineSegment3d)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/main/types.ts");

function isKGroupInstance(entity) {
    return entity.getType() === KEntityType.GroupInstance;
}
function isKFace(entity) {
    return entity.getType() === KEntityType.Face;
}
function isKAuxiliaryBoundedCurve(entity) {
    return entity.getType() === KEntityType.AuxiliaryBoundedCurve;
}
function isKLineSegment3d(entity) {
    return !!entity.direction;
}
function isKArc3d(entity) {
    return !!entity.circle;
}
function boundedCurveConnectionDetect(auxiliaryVertex, auxiliaryBoundedCurve) {
    const startVertex = auxiliaryBoundedCurve.getStartVertex();
    const endVertex = auxiliaryBoundedCurve.getStartVertex();
    if (startVertex.getKey() === auxiliaryVertex.getKey()) {
        return { connected: true, reversed: false };
    }
    else if (endVertex.getKey() === auxiliaryVertex.getKey()) {
        return { connected: true, reversed: true };
    }
    return { connected: false, reversed: false };
}
function discreteAuxiliaryBoundedCurve(auxiliaryBoundedCurve) {
    const boundedCurve = auxiliaryBoundedCurve.getBoundedCurve();
    let discretePoints = [];
    // const result: DiscreteResult = { discretePoints, length: 0 };
    if (boundedCurve) {
        if (isKLineSegment3d(boundedCurve)) {
            discretePoints = [boundedCurve.startPoint, boundedCurve.endPoint];
            // result.discretePoints = discretePoints;
            // result.length = discretePoints[0].distanceTo(discretePoints[1]);
            // return { discretePoints, length: discretePoints[0].distanceTo(discretePoints[1]) };
        }
        else if (isKArc3d(boundedCurve)) {
            discretePoints = boundedCurve.getApproximatePointsByAngle();
            // result.discretePoints = discretePoints;
            // result.length = discretePoints.reduce<number>((acc, point, index) => {
            //     if (index > 0) {
            //         const prevPoint = discretePoints[index - 1];
            //         acc += point.distanceTo(prevPoint);
            //     }
            //     return acc;
            // }, 0);
            // return {
            //     discretePoints, length: discretePoints.reduce<number>((acc, point, index) => {
            //         if (index > 0) {
            //             const prevPoint = discretePoints[index - 1];
            //             acc += point.distanceTo(prevPoint);
            //         }
            //         return acc;
            //     }, 0)
            // };
        }
    }
    return discretePoints;
}
function getAuxiliaryBoundedCurveNormal(auxiliaryBoundedCurve) {
    const boundedCurve = auxiliaryBoundedCurve.getBoundedCurve();
    if (boundedCurve) {
        if (isKArc3d(boundedCurve)) {
            return boundedCurve.normal;
        }
    }
    return undefined;
}
function getNormalByX(xAxis) {
    if (xAxis.isParallel(_types__WEBPACK_IMPORTED_MODULE_0__.dummyVector3d)) {
        if (xAxis.z > 0) {
            return GeomLib.createVector3d(-1, 0, 0);
        }
        else {
            return GeomLib.createVector3d(1, 0, 0);
        }
    }
    else {
        return xAxis.cross(_types__WEBPACK_IMPORTED_MODULE_0__.dummyVector3d.cross(xAxis)).normalized();
    }
}
function generatePathPoses(path) {
    // const allDiscretePoints: KPoint3d[] = [];
    // const componentPositions: KPoint3d[] = [];
    const pathPointPoses = [];
    // let totalLength: number = 0;
    let accumulateLength = 0;
    // let prevNormal: KVector3d | undefined;
    // let firstValidNormal: KVector3d = dummyVector3d;
    for (let i = 0; i < path.length; i++) {
        const pathObject = path[i];
        // const { discretePoints, length } = pathObject;
        const discretePoints = discreteAuxiliaryBoundedCurve(pathObject.curve);
        // totalLength += length;
        if (discretePoints.length) {
            const boundedCurveNormal = getAuxiliaryBoundedCurveNormal(pathObject.curve);
            // prevNormal = normal;
            // if (normal) {
            //     firstValidNormal = normal;
            // }
            // discretePoints = pathObject.reversed ? discretePoints.reverse() : discretePoints;
            for (let j = 0; j < discretePoints.length; j++) {
                const discretePoint = discretePoints[j];
                if (j === 0) {
                    if (i === 0) {
                        // componentPositions.push(discretePoints[0]);
                        const nextDiscretePoint = discretePoints[j + 1];
                        pathPointPoses.push({ point: discretePoints[0], direction: nextDiscretePoint.subtracted(discretePoint).normalized(), accumulateLength });
                    }
                }
                else {
                    const prevDiscretePoint = discretePoints[j - 1];
                    const direction = discretePoint.subtracted(prevDiscretePoint).normalized();
                    const segmentLength = prevDiscretePoint.distanceTo(discretePoint);
                    accumulateLength += segmentLength;
                    pathPointPoses.push({ point: discretePoint, direction, accumulateLength });
                }
                pathPointPoses[pathPointPoses.length - 1].normal = boundedCurveNormal ? boundedCurveNormal : getNormalByX(pathPointPoses[pathPointPoses.length - 1].direction);
            }
            // if (i !== 0) {
            //     discretePoints.shift();
            // }
            // allDiscretePoints.push(...discretePoints);
        }
    }
    // for (const pathPointPose of pathPointPoses) {
    //     if (!pathPointPose.normal) {
    //         pathPointPose.normal = firstValidNormal;
    //     } else {
    //         break;
    //     }
    // }
    return { pathPointPoses, totalLength: accumulateLength };
}
function getTransformFromPathPointPoses(pathPointPoses, params) {
    const { count, interval, scale, pathAxis, normalAxis } = params;
    // const { count, interval, pathAxis, normalAxis, scale } = params;
    const componentTransforms = [];
    const scaleMatrix = GeomLib.createScaleMatrix4(scale.value, scale.value, scale.value);
    let componentIndex = 0;
    let componentPositionLength = componentIndex * interval.value;
    // let baseTransformInverse: KMatrix4 = dummyMatrix4;
    for (let k = 0; k < pathPointPoses.length; k++) {
        const { point, normal, direction, accumulateLength } = pathPointPoses[k];
        const prevAccumulateLength = k === 0 ? -1 : pathPointPoses[k - 1].accumulateLength;
        let componentTransform;
        const pathNormal = normal || _types__WEBPACK_IMPORTED_MODULE_0__.dummyVector3d;
        // if (k === 0) {
        //     componentTransform = GeomLib.createTranslationMatrix4(point.x, point.y, point.z)
        //         .multiplied(GeomLib.createAlignCCSMatrix4(direction, pathNormal.cross(direction).normalized(), pathNormal, dummyPoint3d))
        //         .multiplied(scaleMatrix);
        //     baseTransformInverse = componentTransform.inversed();
        //     componentTransforms.push(componentTransform.multiplied(resetMatrix));
        // } else {
        // const prevDiscreteSegment = pathPointPoses[k - 1];
        // const segmentLength = prevDiscreteSegment.point.distanceTo(point);
        let ccsX;
        let ccsY;
        let ccsZ;
        switch (pathAxis) {
            case "X" /* Axis.X */:
                ccsX = direction;
                break;
            case "-X" /* Axis.XMinus */:
                ccsX = direction.reversed();
                break;
            case "Y" /* Axis.Y */:
                ccsY = direction;
                break;
            case "-Y" /* Axis.YMinus */:
                ccsY = direction.reversed();
                break;
            case "Z" /* Axis.Z */:
                ccsZ = direction;
                break;
            case "-Z" /* Axis.ZMinus */:
                ccsZ = direction.reversed();
                break;
        }
        switch (normalAxis) {
            case "X" /* Axis.X */:
                ccsX = pathNormal;
                break;
            case "-X" /* Axis.XMinus */:
                ccsX = pathNormal.reversed();
                break;
            case "Y" /* Axis.Y */:
                ccsY = pathNormal;
                break;
            case "-Y" /* Axis.YMinus */:
                ccsY = pathNormal.reversed();
                break;
            case "Z" /* Axis.Z */:
                ccsZ = pathNormal;
                break;
            case "-Z" /* Axis.ZMinus */:
                ccsZ = pathNormal.reversed();
                break;
        }
        if (!ccsX) {
            ccsX = ccsY.cross(ccsZ);
        }
        if (!ccsY) {
            ccsY = ccsZ.cross(ccsX);
        }
        if (!ccsZ) {
            ccsZ = ccsX.cross(ccsY);
        }
        while (componentIndex < count.value && componentPositionLength > prevAccumulateLength && componentPositionLength <= accumulateLength) {
            // const segmentDirection = point.subtracted(prevDiscreteSegment.point).normalized();
            const componentPosition = point.added(direction.multiplied(componentPositionLength - accumulateLength));
            componentTransform = GeomLib.createTranslationMatrix4(componentPosition.x, componentPosition.y, componentPosition.z)
                .multiplied(GeomLib.createAlignCCSMatrix4(ccsX, ccsY, ccsZ, _types__WEBPACK_IMPORTED_MODULE_0__.dummyPoint3d))
                .multiplied(scaleMatrix);
            // componentPositions.push();
            componentTransforms.push(componentTransform);
            componentIndex++;
            componentPositionLength = componentIndex * interval.value;
        }
        // currentLength += segmentLength;
    }
    return componentTransforms;
    // }
}
function getBoundingBoxSizeInWorld(groupInstance) {
    const localBoundingBox = groupInstance.getLocalBoundingBox();
    const transform = groupInstance.getTransform();
    const oldSize = [GeomLib.createVector3d(localBoundingBox.width, 0, 0), GeomLib.createVector3d(0, localBoundingBox.height, 0), GeomLib.createVector3d(0, 0, localBoundingBox.depth)];
    return oldSize.map(vec => vec.appliedMatrix4(transform).length);
}
function getExtendedTransform() {
    const design = app.getActiveDesign();
    const editPath = design.getEditPath();
    const extendedTransform = GeomLib.createIdentityMatrix4();
    for (const path of editPath) {
        extendedTransform.multiply(path.getTransform());
    }
    return extendedTransform;
}
function findPathAfterMakeGroup(path, newGroupInstance) {
    var _a;
    // const auxiliaryBoundedCurveMap: Map<string, KAuxiliaryBoundedCurve> = new Map();
    const auxiliaryBoundedCurves = [];
    (_a = newGroupInstance.getGroupDefinition()) === null || _a === void 0 ? void 0 : _a.getAuxiliaryCurves().forEach(curve => {
        if (isKAuxiliaryBoundedCurve(curve)) {
            // auxiliaryBoundedCurveMap.set(curve.getKey(), curve);
            auxiliaryBoundedCurves.push(curve);
        }
    });
    const newPath = [];
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
        }
        else {
            return undefined;
        }
    }
    return newPath;
}
// let currentLength: number = 0;
// let componentIndex: number = 1;
// let componentPositionLength = componentIndex * automaticInterval;
// let baseTransformInverse: KMatrix4 = dummyMatrix4;
// for (let k = 0; k < pathPointPoses.length; k++) {
//     const pathPointPose = pathPointPoses[k];
//     let componentTransform: KMatrix4 | undefined;
//     const pathNormal: KVector3d = pathPointPose.normal || dummyVector3d;
//     if (k === 0) {
//         componentTransform = GeomLib.createTranslationMatrix4(pathPointPose.point.x, pathPointPose.point.y, pathPointPose.point.z)
//             .multiplied(GeomLib.createAlignCCSMatrix4(pathPointPose.direction, pathNormal.cross(pathPointPose.direction).normalized(), pathNormal, dummyPoint3d))
//             .multiplied(scaleMatrix);
//         baseTransformInverse = componentTransform.inversed();
//         componentTransforms.push(componentTransform.multiplied(resetMatrix));
//     } else {
//         const prevDiscreteSegment = pathPointPoses[k - 1];
//         const segmentLength = prevDiscreteSegment.point.distanceTo(pathPointPose.point);
//         while (componentIndex < this.pathArrayParams.count && componentPositionLength > currentLength && componentPositionLength <= (currentLength + segmentLength)) {
//             const segmentDirection = pathPointPose.point.subtracted(prevDiscreteSegment.point).normalized();
//             const componentPosition = prevDiscreteSegment.point.added(segmentDirection.multiplied(componentPositionLength - currentLength));
//             componentTransform = GeomLib.createTranslationMatrix4(componentPosition.x, componentPosition.y, componentPosition.z)
//                 .multiplied(GeomLib.createAlignCCSMatrix4(pathPointPose.direction, pathNormal.cross(pathPointPose.direction).normalized(), pathNormal, dummyPoint3d))
//                 .multiplied(scaleMatrix);
//             // componentPositions.push();
//             componentTransforms.push(componentTransform.multiplied(baseTransformInverse));
//             componentIndex++;
//             componentPositionLength = componentIndex * automaticInterval;
//         }
//         currentLength += segmentLength;
//     }
// }
// if (componentIndex < this.count) {
//     const componentIndexInPath = componentIndex - 1;
//     const tailLength: number = totalLength - (componentIndex - 1) * this.interval;
//     const tailDirection = allDiscretePoints[allDiscretePoints.length - 1].subtracted(allDiscretePoints[allDiscretePoints.length - 2]).normalized();
//     componentPositionLength = (componentIndex - componentIndexInPath) * this.interval;
//     componentPositions.push(allDiscretePoints[allDiscretePoints.length - 1].added(tailDirection.multiplied(componentPositionLength - tailLength)));
//     componentIndex++;
//     componentPositionLength = (componentIndex - componentIndexInPath) * this.interval;
//     while (componentIndex < this.count) {
//         componentPositions.push(componentPositions[componentPositions.length - 1].added(tailDirection.multiplied(componentPositionLength)));
//         componentIndex++;
//         componentPositionLength = (componentIndex - componentIndexInPath) * this.interval;
//     }
// }


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PathArrayParamsEditTool */ "./src/main/PathArrayParamsEditTool.ts");
/* harmony import */ var _PathArrayTool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PathArrayTool */ "./src/main/PathArrayTool.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/main/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const pluginUI = app.getPluginUI();
pluginUI.resize(240, 700);
pluginUI.mount();
let activatedCustomTool;
function onUIMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (data.type === 'activatePathArray') {
                app.activateCustomTool(_PathArrayTool__WEBPACK_IMPORTED_MODULE_1__.pathArrayTool, false);
                activatedCustomTool = _PathArrayTool__WEBPACK_IMPORTED_MODULE_1__.pathArrayTool;
            }
            else if (data.type === 'deActivatePathArray') {
                app.deactivateCustomTool(_PathArrayTool__WEBPACK_IMPORTED_MODULE_1__.pathArrayTool);
                activatedCustomTool = undefined;
            }
            else if (data.type === 'pathArrayParamsChange') {
                if (activatedCustomTool !== _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool) {
                    app.activateCustomTool(_PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool, false);
                    activatedCustomTool = _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool;
                }
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const value = data.value;
                    let paramsChangeResult;
                    if (data.subType === 'intervalChange') {
                        paramsChangeResult = yield _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.updateInterval(value);
                    }
                    else if (data.subType === 'countChange') {
                        paramsChangeResult = yield _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.updateCount(value);
                    }
                    else if (data.subType === 'scaleChange') {
                        paramsChangeResult = yield _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.updateScale(value);
                    }
                    else if (data.subType === 'pathAxisChange') {
                        paramsChangeResult = yield _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.updatePathAxis(value);
                    }
                    else if (data.subType === 'normalAxisChange') {
                        paramsChangeResult = yield _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.updateNormalAxis(value);
                    }
                    if (paramsChangeResult) {
                        pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.getPathArrayParams() });
                    }
                    app.deactivateCustomTool(_PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool, false);
                    activatedCustomTool = undefined;
                }), 150);
            }
        }
        catch (error) {
            console.error(error);
            closePlugin();
        }
    });
}
pluginUI.onMessage(onUIMessage);
const selection = app.getSelection();
selection.addObserver({
    onSelectionChange: () => {
        if (activatedCustomTool !== _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool) {
            const allEntities = selection.getAllEntities();
            if (allEntities.length === 1 && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isKGroupInstance)(allEntities[0])) {
                const isPathArrayModel = _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.setModel(allEntities[0]);
                if (isPathArrayModel) {
                    pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.getPathArrayParams() });
                    return;
                }
            }
            _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.clearModel();
            pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: undefined });
        }
    }
});
function onPluginStartUp() {
    const allEntities = selection.getAllEntities();
    if (allEntities.length === 1 && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isKGroupInstance)(allEntities[0])) {
        const isPathArrayModel = _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.setModel(allEntities[0]);
        if (isPathArrayModel) {
            pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: _PathArrayParamsEditTool__WEBPACK_IMPORTED_MODULE_0__.pathArrayParamsEditTool.getPathArrayParams() });
        }
    }
}
onPluginStartUp();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQSxvQ0FBb0Msd0RBQWdCO0FBQ3BELGlDQUFpQyw2RUFBdUI7QUFDeEQ7QUFDQSxtQ0FBbUMsaURBQWlELDZFQUF1Qix1QkFBdUI7QUFDbEk7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYXRoLWFycmF5LXRvb2wvLi9zcmMvbWFpbi9QYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC50cyIsIndlYnBhY2s6Ly9wYXRoLWFycmF5LXRvb2wvLi9zcmMvbWFpbi9QYXRoQXJyYXlUb29sLnRzIiwid2VicGFjazovL3BhdGgtYXJyYXktdG9vbC8uL3NyYy9tYWluL3R5cGVzLnRzIiwid2VicGFjazovL3BhdGgtYXJyYXktdG9vbC8uL3NyYy9tYWluL3V0aWxzLnRzIiwid2VicGFjazovL3BhdGgtYXJyYXktdG9vbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYXRoLWFycmF5LXRvb2wvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhdGgtYXJyYXktdG9vbC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BhdGgtYXJyYXktdG9vbC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhdGgtYXJyYXktdG9vbC8uL3NyYy9tYWluL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBDb21wb25lbnRQcm9wZXJ0eUtleSwgQ291bnRQcm9wZXJ0eUtleSwgRGVmYXVsdFBhdGhBcnJheVBhcmFtcywgSW50ZXJ2YWxQcm9wZXJ0eUtleSwgaXNBeGlzVmFsaWQsIE1hbnVhbFByZWZpeCwgTm9ybWFsQXhpc1Byb3BlcnR5S2V5LCBQYXRoQXhpc1Byb3BlcnR5S2V5LCBQYXRoRGVsaW1pdGVyLCBQYXRoTGlzdFByb3BlcnR5S2V5LCBQYXRoUmV2ZXJzZWREZWxpbWl0ZXIsIFNjYWxlUHJvcGVydHlLZXkgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZVBhdGhQb3NlcywgZ2V0VHJhbnNmb3JtRnJvbVBhdGhQb2ludFBvc2VzLCBpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUsIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuY29uc3QgZGVzaWduID0gYXBwLmdldEFjdGl2ZURlc2lnbigpO1xyXG5leHBvcnQgY2xhc3MgUGF0aEFycmF5UGFyYW1zRWRpdFRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5wYXRoID0gW107XHJcbiAgICAgICAgdGhpcy5wYXRoUG9pbnRQb3NlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudG90YWxMZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMucGF0aEFycmF5UGFyYW1zID0gRGVmYXVsdFBhdGhBcnJheVBhcmFtcztcclxuICAgIH1cclxuICAgIGdldFBhdGhBcnJheVBhcmFtcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoQXJyYXlQYXJhbXM7XHJcbiAgICB9XHJcbiAgICBzZXRNb2RlbChtb2RlbCkge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwRGVmaW5pdGlvbiA9IG1vZGVsLmdldEdyb3VwRGVmaW5pdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBncm91cERlZmluaXRpb24gPT09IG51bGwgfHwgZ3JvdXBEZWZpbml0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBncm91cERlZmluaXRpb24uZ2V0U3ViR3JvdXBJbnN0YW5jZXMoKS5yZWR1Y2UoKGFjYywgaW5zdGFuY2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50UHJvcGVydHkgPSBpbnN0YW5jZS5nZXRDdXN0b21Qcm9wZXJ0eShDb21wb25lbnRQcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyLnBhcnNlSW50KGNvbXBvbmVudFByb3BlcnR5KTtcclxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIGFjYy5wdXNoKHsgaW5zdGFuY2UsIGluZGV4IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB7IGluc3RhbmNlLCBpbmRleDogTnVtYmVyLn07XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwgW10pLnNvcnQoKGEsIGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcclxuICAgICAgICBpZiAoKGNvbXBvbmVudHMgPT09IG51bGwgfHwgY29tcG9uZW50cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29tcG9uZW50cy5sZW5ndGgpICYmIGdyb3VwRGVmaW5pdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudFByb3BlcnR5ID0gZ3JvdXBEZWZpbml0aW9uLmdldEN1c3RvbVByb3BlcnR5KENvdW50UHJvcGVydHlLZXkpO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IE51bWJlci5wYXJzZUludChjb3VudFByb3BlcnR5KTtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWxQcm9wZXJ0eSA9IGdyb3VwRGVmaW5pdGlvbi5nZXRDdXN0b21Qcm9wZXJ0eShJbnRlcnZhbFByb3BlcnR5S2V5KTtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWxMb2NrZWQgPSBpbnRlcnZhbFByb3BlcnR5LnN0YXJ0c1dpdGgoTWFudWFsUHJlZml4KTtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBpbnRlcnZhbExvY2tlZCA/IE51bWJlci5wYXJzZUZsb2F0KGludGVydmFsUHJvcGVydHkuc2xpY2UoMSkpIDogTnVtYmVyLnBhcnNlRmxvYXQoaW50ZXJ2YWxQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhBeGlzUHJvcGVydHkgPSBncm91cERlZmluaXRpb24uZ2V0Q3VzdG9tUHJvcGVydHkoUGF0aEF4aXNQcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbEF4aXNQcm9wZXJ0eSA9IGdyb3VwRGVmaW5pdGlvbi5nZXRDdXN0b21Qcm9wZXJ0eShOb3JtYWxBeGlzUHJvcGVydHlLZXkpO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZVByb3BlcnR5ID0gZ3JvdXBEZWZpbml0aW9uLmdldEN1c3RvbVByb3BlcnR5KFNjYWxlUHJvcGVydHlLZXkpO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZUxvY2tlZCA9IHNjYWxlUHJvcGVydHkuc3RhcnRzV2l0aChNYW51YWxQcmVmaXgpO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IHNjYWxlTG9ja2VkID8gTnVtYmVyLnBhcnNlRmxvYXQoc2NhbGVQcm9wZXJ0eS5zbGljZSgxKSkgOiBOdW1iZXIucGFyc2VGbG9hdChzY2FsZVByb3BlcnR5KTtcclxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjb3VudCkgJiYgY291bnQgPiAxICYmIE51bWJlci5pc0Zpbml0ZShpbnRlcnZhbCkgJiYgTnVtYmVyLmlzRmluaXRlKHNjYWxlKSAmJiBpc0F4aXNWYWxpZChwYXRoQXhpc1Byb3BlcnR5KSAmJiBpc0F4aXNWYWxpZChub3JtYWxBeGlzUHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoTGlzdFByb3BlcnR5ID0gZ3JvdXBEZWZpbml0aW9uLmdldEN1c3RvbVByb3BlcnR5KFBhdGhMaXN0UHJvcGVydHlLZXkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBEZWZpbml0aW9uID09PSBudWxsIHx8IGdyb3VwRGVmaW5pdGlvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ3JvdXBEZWZpbml0aW9uLmdldEF1eGlsaWFyeUN1cnZlcygpLmZvckVhY2goY3VydmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoY3VydmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZU1hcC5zZXQoY3VydmUuZ2V0S2V5KCksIGN1cnZlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRoVmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXRoU3RyIG9mIHBhdGhMaXN0UHJvcGVydHkuc3BsaXQoUGF0aERlbGltaXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGxpdFJlc3VsdCA9IHBhdGhTdHIuc3BsaXQoUGF0aFJldmVyc2VkRGVsaW1pdGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3BsaXRSZXN1bHQubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZSA9IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZU1hcC5nZXQoc3BsaXRSZXN1bHRbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBkaXNjcmV0ZVJlc3VsdCA9IGRpc2NyZXRlQXV4aWxpYXJ5Qm91bmRlZEN1cnZlKGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZGlzY3JldGVSZXN1bHQuZGlzY3JldGVQb2ludHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnB1c2goeyBjdXJ2ZTogYXV4aWxpYXJ5Qm91bmRlZEN1cnZlLCByZXZlcnNlZDogc3BsaXRSZXN1bHRbMV0gPT09ICcxJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhWYWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGhWYWxpZCAmJiBwYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwYXRoUG9pbnRQb3NlcywgdG90YWxMZW5ndGggfSA9IHRoaXMucGF0aFBvaW50UG9zZXMubGVuZ3RoID8geyBwYXRoUG9pbnRQb3NlczogdGhpcy5wYXRoUG9pbnRQb3NlcywgdG90YWxMZW5ndGg6IHRoaXMudG90YWxMZW5ndGggfSA6IGdlbmVyYXRlUGF0aFBvc2VzKHRoaXMucGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoUG9pbnRQb3NlcyA9IHBhdGhQb2ludFBvc2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxMZW5ndGggPSB0b3RhbExlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhBcnJheVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWw6IHsgdmFsdWU6IGludGVydmFsLCBtaW46IDEwLCBtYXg6IHRvdGFsTGVuZ3RoIC8gKGNvdW50IC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxMb2NrZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB7IHZhbHVlOiBjb3VudCwgbWluOiAxLCBtYXg6IGludGVydmFsTG9ja2VkID8gTWF0aC5mbG9vcih0b3RhbExlbmd0aCAvIGludGVydmFsICsgMSkgOiAxMDAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhBeGlzOiBwYXRoQXhpc1Byb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxBeGlzOiBub3JtYWxBeGlzUHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiB7IHZhbHVlOiBzY2FsZSwgbWluOiAwLjAxLCBtYXg6IDEwMDAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMb2NrZWRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNsZWFyTW9kZWwoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnBhdGggPSBbXTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLnBhdGhQb2ludFBvc2VzID0gW107XHJcbiAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYXRoQXJyYXlQYXJhbXMgPSBEZWZhdWx0UGF0aEFycmF5UGFyYW1zO1xyXG4gICAgfVxyXG4gICAgLy8gZ2V0TW9kZWwoKSB7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMubW9kZWw7XHJcbiAgICAvLyB9XHJcbiAgICBkb09wZXJhdGlvbihwYXJhbXMsIG5lZWRUcmFuc2Zvcm0gPSB0cnVlKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb2RlbClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgeyBwYXRoUG9pbnRQb3NlcywgdG90YWxMZW5ndGggfSA9IHRoaXMucGF0aFBvaW50UG9zZXMubGVuZ3RoID8geyBwYXRoUG9pbnRQb3NlczogdGhpcy5wYXRoUG9pbnRQb3NlcywgdG90YWxMZW5ndGg6IHRoaXMudG90YWxMZW5ndGggfSA6IGdlbmVyYXRlUGF0aFBvc2VzKHRoaXMucGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aFBvaW50UG9zZXMgPSBwYXRoUG9pbnRQb3NlcztcclxuICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IHRvdGFsTGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRUcmFuc2Zvcm1zID0gZ2V0VHJhbnNmb3JtRnJvbVBhdGhQb2ludFBvc2VzKHBhdGhQb2ludFBvc2VzLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBzY2FsZU1hdHJpeCA9IEdlb21MaWIuY3JlYXRlU2NhbGVNYXRyaXg0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xyXG4gICAgICAgICAgICBsZXQgb3BlcmF0aW9uU3VjY2VzcyA9ICh5aWVsZCBkZXNpZ24uYWN0aXZhdGVHcm91cEluc3RhbmNlKHRoaXMubW9kZWwpKS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgIGlmIChuZWVkVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmluZGV4ID49IHBhcmFtcy5jb3VudC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50VHJhbnNmb3JtID0gY29tcG9uZW50Lmluc3RhbmNlLmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IGV4dGVuZGVkVHJhbnNmb3JtID0gZ2V0RXh0ZW5kZWRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRMb2NhbEJvdW5kaW5nQm94ID0gY29tcG9uZW50Lmluc3RhbmNlLmdldExvY2FsQm91bmRpbmdCb3goKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRQb3NpdGlvbiA9IGNvbXBvbmVudExvY2FsQm91bmRpbmdCb3guY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc2V0TWF0cml4ID0gR2VvbUxpYi5jcmVhdGVUcmFuc2xhdGlvbk1hdHJpeDQoLWNvbXBvbmVudFBvc2l0aW9uLngsIC1jb21wb25lbnRQb3NpdGlvbi55LCAtY29tcG9uZW50UG9zaXRpb24ueilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm11bHRpcGxpZWQoY29tcG9uZW50VHJhbnNmb3JtLmludmVyc2VkKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVJlc3VsdCA9IGRlc2lnbi50cmFuc2Zvcm1Hcm91cEluc3RhbmNlcyhbY29tcG9uZW50Lmluc3RhbmNlXSwgY29tcG9uZW50VHJhbnNmb3Jtc1tjb21wb25lbnQuaW5kZXhdLm11bHRpcGxpZWQocmVzZXRNYXRyaXgpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyYW5zZm9ybVJlc3VsdC5pc1N1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5jb3VudC52YWx1ZSA+IHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50c1swXS5pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFRyYW5zZm9ybSA9IGNvbXBvbmVudEluc3RhbmNlLmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50TG9jYWxCb3VuZGluZ0JveCA9IGNvbXBvbmVudEluc3RhbmNlLmdldExvY2FsQm91bmRpbmdCb3goKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFBvc2l0aW9uID0gY29tcG9uZW50TG9jYWxCb3VuZGluZ0JveC5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVHJhbnNmb3JtSW52ZXJzZSA9IEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KC1jb21wb25lbnRQb3NpdGlvbi54LCAtY29tcG9uZW50UG9zaXRpb24ueSwgLWNvbXBvbmVudFBvc2l0aW9uLnopXHJcbiAgICAgICAgICAgICAgICAgICAgLm11bHRpcGxpZWQoY29tcG9uZW50VHJhbnNmb3JtLmludmVyc2VkKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3R3JvdXBJbnN0YW5jZXMgPSAoX2EgPSBkZXNpZ24uYnVsa0NvcHlHcm91cEluc3RhbmNlcyhbY29tcG9uZW50SW5zdGFuY2VdLCBbY29tcG9uZW50VHJhbnNmb3Jtcy5zbGljZSh0aGlzLnBhdGhBcnJheVBhcmFtcy5jb3VudC52YWx1ZSkubWFwKG1hdHJpeCA9PiBtYXRyaXgubXVsdGlwbGllZChiYXNlVHJhbnNmb3JtSW52ZXJzZSkpXSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRlZEluc3RhbmNlcztcclxuICAgICAgICAgICAgICAgIGlmIChuZXdHcm91cEluc3RhbmNlcyA9PT0gbnVsbCB8fCBuZXdHcm91cEluc3RhbmNlcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmV3R3JvdXBJbnN0YW5jZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSB0aGlzLnBhdGhBcnJheVBhcmFtcy5jb3VudC52YWx1ZTsgaW5kZXggPCBwYXJhbXMuY291bnQudmFsdWU7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IG9wZXJhdGlvblN1Y2Nlc3MgJiYgbmV3R3JvdXBJbnN0YW5jZXNbaW5kZXggLSB0aGlzLnBhdGhBcnJheVBhcmFtcy5jb3VudC52YWx1ZV0uc2V0Q3VzdG9tUHJvcGVydHkoQ29tcG9uZW50UHJvcGVydHlLZXksIGAke2luZGV4fWApLmlzU3VjY2VzcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvblN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gWy4uLnRoaXMuY29tcG9uZW50cywgLi4ubmV3R3JvdXBJbnN0YW5jZXMubWFwKChpbnN0YW5jZSwgaSkgPT4geyByZXR1cm4geyBpbnN0YW5jZSwgaW5kZXg6IHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50LnZhbHVlICsgaSB9OyB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBhcmFtcy5jb3VudC52YWx1ZSA8IHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRJbmRleCA9IHRoaXMuY29tcG9uZW50cy5maW5kSW5kZXgoY29tcG9uZW50ID0+IGNvbXBvbmVudC5pbmRleCA9PT0gcGFyYW1zLmNvdW50LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvRGVsZXRlQ29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50cy5zbGljZShjb21wb25lbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRvRGVsZXRlQ29tcG9uZW50IG9mIHRvRGVsZXRlQ29tcG9uZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblN1Y2Nlc3MgPSBvcGVyYXRpb25TdWNjZXNzICYmIGRlc2lnbi5yZW1vdmVHcm91cEluc3RhbmNlKHRvRGVsZXRlQ29tcG9uZW50Lmluc3RhbmNlKS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zcGxpY2UoY29tcG9uZW50SW5kZXgsIHRoaXMuY29tcG9uZW50cy5sZW5ndGggLSBjb21wb25lbnRJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wZXJhdGlvblN1Y2Nlc3MgPSBvcGVyYXRpb25TdWNjZXNzICYmICh5aWVsZCBkZXNpZ24uZGVhY3RpdmF0ZUdyb3VwSW5zdGFuY2UoKSkuaXNTdWNjZXNzO1xyXG4gICAgICAgICAgICBhcHAuZ2V0U2VsZWN0aW9uKCkuYWRkKFt0aGlzLm1vZGVsXSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcGVyYXRpb25TdWNjZXNzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlSW50ZXJ2YWwobmV3SW50ZXJ2YWwpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWxHcm91cERlZmluaXRpb24gPSAoX2EgPSB0aGlzLm1vZGVsKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0R3JvdXBEZWZpbml0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsICYmIG1vZGVsR3JvdXBEZWZpbml0aW9uICYmIHRoaXMuY29tcG9uZW50cy5sZW5ndGggJiYgdGhpcy5wYXRoLmxlbmd0aCAmJiB0aGlzLnBhdGhBcnJheVBhcmFtcyAmJiBuZXdJbnRlcnZhbCAhPT0gdGhpcy5wYXRoQXJyYXlQYXJhbXMuaW50ZXJ2YWwudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2NhbGUsIGNvdW50LCBzY2FsZUxvY2tlZCB9ID0gdGhpcy5wYXRoQXJyYXlQYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50c1swXS5pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudExvY2FsQm91bmRpbmdCb3ggPSBjb21wb25lbnRJbnN0YW5jZS5nZXRMb2NhbEJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBjb21wb25lbnRzOiBLR3JvdXBJbnN0YW5jZVtdID0gW2NvbXBvbmVudF07XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBhdXRvbWF0aWNJbnRlcnZhbCA9IHRvdGFsTGVuZ3RoIC8gKHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCB3b3JsZFNpemUgPSBnZXRCb3VuZGluZ0JveFNpemVJbldvcmxkKGNvbXBvbmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5lZWROZXdDb3VudCA9IG5ld0ludGVydmFsICogY291bnQudmFsdWUgPiB0aGlzLnRvdGFsTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Q291bnQgPSBuZWVkTmV3Q291bnQgPyBNYXRoLmZsb29yKHRoaXMudG90YWxMZW5ndGggLyBuZXdJbnRlcnZhbCArIDEpIDogY291bnQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWxTY2FsZSA9IHNjYWxlTG9ja2VkID8gc2NhbGUudmFsdWUgOiAoY29tcG9uZW50TG9jYWxCb3VuZGluZ0JveC53aWR0aCA+IChuZXdJbnRlcnZhbCAvIDIpID8gKG5ld0ludGVydmFsIC8gMiAvIGNvbXBvbmVudExvY2FsQm91bmRpbmdCb3gud2lkdGgpIDogc2NhbGUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVzaWduLnN0YXJ0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQYXJhbXMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGF0aEFycmF5UGFyYW1zKSwgeyBpbnRlcnZhbDogeyB2YWx1ZTogbmV3SW50ZXJ2YWwsIG1pbjogMTAsIG1heDogdGhpcy50b3RhbExlbmd0aCAvIChuZXdDb3VudCAtIDEpIH0sIGludGVydmFsTG9ja2VkOiB0cnVlLCBjb3VudDogeyB2YWx1ZTogbmV3Q291bnQsIG1pbjogMSwgbWF4OiBNYXRoLmZsb29yKHRoaXMudG90YWxMZW5ndGggLyBuZXdJbnRlcnZhbCArIDEpIH0sIHNjYWxlOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHNjYWxlKSwgeyB2YWx1ZTogYWN0dWFsU2NhbGUgfSkgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25TdWNjZXNzID0geWllbGQgdGhpcy5kb09wZXJhdGlvbihuZXdQYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgY29tcG9uZW50VHJhbnNmb3JtczogS01hdHJpeDRbXSA9IGdldFRyYW5zZm9ybUZyb21QYXRoUG9pbnRQb3NlcyhwYXRoUG9pbnRQb3NlcywgeyAuLi50aGlzLnBhdGhBcnJheVBhcmFtcywgaW50ZXJ2YWwsIHNjYWxlOiBhY3R1YWxTY2FsZSB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxHcm91cERlZmluaXRpb24uc2V0Q3VzdG9tUHJvcGVydHkoSW50ZXJ2YWxQcm9wZXJ0eUtleSwgYCR7TWFudWFsUHJlZml4fSR7bmV3SW50ZXJ2YWx9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzY2FsZUxvY2tlZCAmJiBhY3R1YWxTY2FsZSAhPT0gc2NhbGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxHcm91cERlZmluaXRpb24uc2V0Q3VzdG9tUHJvcGVydHkoU2NhbGVQcm9wZXJ0eUtleSwgYCR7YWN0dWFsU2NhbGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEFycmF5UGFyYW1zID0gbmV3UGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5jb21taXRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5hYm9ydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhdGlvblN1Y2Nlc3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUNvdW50KG5ld0NvdW50KSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsR3JvdXBEZWZpbml0aW9uID0gKF9hID0gdGhpcy5tb2RlbCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEdyb3VwRGVmaW5pdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCAmJiBtb2RlbEdyb3VwRGVmaW5pdGlvbiAmJiB0aGlzLmNvbXBvbmVudHMubGVuZ3RoICYmIHRoaXMucGF0aC5sZW5ndGggJiYgdGhpcy5wYXRoQXJyYXlQYXJhbXMgJiYgbmV3Q291bnQgIT09IHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGludGVydmFsLCBpbnRlcnZhbExvY2tlZCwgY291bnQsIHNjYWxlLCBzY2FsZUxvY2tlZCB9ID0gdGhpcy5wYXRoQXJyYXlQYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3RhbExlbmd0aCA9IHRoaXMucGF0aFBvaW50UG9zZXMubGVuZ3RoID8gdGhpcy50b3RhbExlbmd0aCA6IGdlbmVyYXRlUGF0aFBvc2VzKHRoaXMucGF0aCkudG90YWxMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTGVuZ3RoID0gdG90YWxMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50c1swXS5pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudExvY2FsQm91bmRpbmdCb3ggPSBjb21wb25lbnRJbnN0YW5jZS5nZXRMb2NhbEJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBjb21wb25lbnRzOiBLR3JvdXBJbnN0YW5jZVtdID0gW2NvbXBvbmVudF07XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBhdXRvbWF0aWNJbnRlcnZhbCA9IHRvdGFsTGVuZ3RoIC8gKHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCB3b3JsZFNpemUgPSBnZXRCb3VuZGluZ0JveFNpemVJbldvcmxkKGNvbXBvbmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5lZWROZXdJbnRlcnZhbCA9IChuZXdDb3VudCA+IGNvdW50LnZhbHVlICYmICh0aGlzLnRvdGFsTGVuZ3RoID4gaW50ZXJ2YWwudmFsdWUgKiBuZXdDb3VudCkpIHx8IChuZXdDb3VudCA8IGNvdW50LnZhbHVlICYmICFpbnRlcnZhbExvY2tlZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWxJbnRlcnZhbCA9IG5lZWROZXdJbnRlcnZhbCA/IHRoaXMudG90YWxMZW5ndGggLyAobmV3Q291bnQgLSAxKSA6IGludGVydmFsLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmVlZE5ld1NjYWxlID0gbmVlZE5ld0ludGVydmFsIHx8ICghc2NhbGVMb2NrZWQgJiYgY29tcG9uZW50TG9jYWxCb3VuZGluZ0JveC53aWR0aCA+IChhY3R1YWxJbnRlcnZhbCAvIDIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbFNjYWxlID0gbmVlZE5ld1NjYWxlID8gKGFjdHVhbEludGVydmFsIC8gMiAvIGNvbXBvbmVudExvY2FsQm91bmRpbmdCb3gud2lkdGgpIDogc2NhbGUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBkZXNpZ24uc3RhcnRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhcmFtcyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXRoQXJyYXlQYXJhbXMpLCB7IGludGVydmFsOiB7IHZhbHVlOiBhY3R1YWxJbnRlcnZhbCwgbWluOiAxMCwgbWF4OiB0b3RhbExlbmd0aCAvIChuZXdDb3VudCAtIDEpIH0sIGNvdW50OiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGF0aEFycmF5UGFyYW1zLmNvdW50KSwgeyB2YWx1ZTogbmV3Q291bnQgfSksIHNjYWxlOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGF0aEFycmF5UGFyYW1zLnNjYWxlKSwgeyB2YWx1ZTogYWN0dWFsU2NhbGUgfSkgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25TdWNjZXNzID0geWllbGQgdGhpcy5kb09wZXJhdGlvbihuZXdQYXJhbXMsIG5lZWROZXdJbnRlcnZhbCB8fCBuZWVkTmV3U2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgY29tcG9uZW50VHJhbnNmb3JtczogS01hdHJpeDRbXSA9IGdldFRyYW5zZm9ybUZyb21QYXRoUG9pbnRQb3NlcyhwYXRoUG9pbnRQb3NlcywgeyAuLi50aGlzLnBhdGhBcnJheVBhcmFtcywgaW50ZXJ2YWwsIHNjYWxlOiBhY3R1YWxTY2FsZSB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxHcm91cERlZmluaXRpb24uc2V0Q3VzdG9tUHJvcGVydHkoQ291bnRQcm9wZXJ0eUtleSwgYCR7bmV3Q291bnR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZWROZXdJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbEdyb3VwRGVmaW5pdGlvbi5zZXRDdXN0b21Qcm9wZXJ0eShJbnRlcnZhbFByb3BlcnR5S2V5LCBgJHthY3R1YWxJbnRlcnZhbH1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZWROZXdTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbEdyb3VwRGVmaW5pdGlvbi5zZXRDdXN0b21Qcm9wZXJ0eShTY2FsZVByb3BlcnR5S2V5LCBgJHtzY2FsZUxvY2tlZCA/IE1hbnVhbFByZWZpeCA6ICcnfSR7YWN0dWFsU2NhbGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEFycmF5UGFyYW1zID0gbmV3UGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5jb21taXRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5hYm9ydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhdGlvblN1Y2Nlc3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVBhdGhBeGlzKG5ld1BhdGhBeGlzKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsR3JvdXBEZWZpbml0aW9uID0gKF9hID0gdGhpcy5tb2RlbCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEdyb3VwRGVmaW5pdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCAmJiBtb2RlbEdyb3VwRGVmaW5pdGlvbiAmJiB0aGlzLmNvbXBvbmVudHMubGVuZ3RoICYmIHRoaXMucGF0aC5sZW5ndGggJiYgdGhpcy5wYXRoQXJyYXlQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGRlc2lnbi5zdGFydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UGFyYW1zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBhdGhBcnJheVBhcmFtcyksIHsgcGF0aEF4aXM6IG5ld1BhdGhBeGlzIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uU3VjY2VzcyA9IHlpZWxkIHRoaXMuZG9PcGVyYXRpb24obmV3UGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGNvbXBvbmVudFRyYW5zZm9ybXM6IEtNYXRyaXg0W10gPSBnZXRUcmFuc2Zvcm1Gcm9tUGF0aFBvaW50UG9zZXMocGF0aFBvaW50UG9zZXMsIHsgLi4udGhpcy5wYXRoQXJyYXlQYXJhbXMsIGludGVydmFsLCBzY2FsZTogYWN0dWFsU2NhbGUgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsR3JvdXBEZWZpbml0aW9uLnNldEN1c3RvbVByb3BlcnR5KFBhdGhBeGlzUHJvcGVydHlLZXksIGAke25ld1BhdGhBeGlzfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEFycmF5UGFyYW1zID0gbmV3UGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5jb21taXRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5hYm9ydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhdGlvblN1Y2Nlc3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZU5vcm1hbEF4aXMobmV3Tm9ybWFsQXhpcykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbEdyb3VwRGVmaW5pdGlvbiA9IChfYSA9IHRoaXMubW9kZWwpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRHcm91cERlZmluaXRpb24oKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZWwgJiYgbW9kZWxHcm91cERlZmluaXRpb24gJiYgdGhpcy5jb21wb25lbnRzLmxlbmd0aCAmJiB0aGlzLnBhdGgubGVuZ3RoICYmIHRoaXMucGF0aEFycmF5UGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBkZXNpZ24uc3RhcnRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhcmFtcyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXRoQXJyYXlQYXJhbXMpLCB7IG5vcm1hbEF4aXM6IG5ld05vcm1hbEF4aXMgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25TdWNjZXNzID0geWllbGQgdGhpcy5kb09wZXJhdGlvbihuZXdQYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgY29tcG9uZW50VHJhbnNmb3JtczogS01hdHJpeDRbXSA9IGdldFRyYW5zZm9ybUZyb21QYXRoUG9pbnRQb3NlcyhwYXRoUG9pbnRQb3NlcywgeyAuLi50aGlzLnBhdGhBcnJheVBhcmFtcywgaW50ZXJ2YWwsIHNjYWxlOiBhY3R1YWxTY2FsZSB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxHcm91cERlZmluaXRpb24uc2V0Q3VzdG9tUHJvcGVydHkoTm9ybWFsQXhpc1Byb3BlcnR5S2V5LCBgJHtuZXdOb3JtYWxBeGlzfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEFycmF5UGFyYW1zID0gbmV3UGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5jb21taXRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5hYm9ydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhdGlvblN1Y2Nlc3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVNjYWxlKG5ld1NjYWxlKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsR3JvdXBEZWZpbml0aW9uID0gKF9hID0gdGhpcy5tb2RlbCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEdyb3VwRGVmaW5pdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCAmJiBtb2RlbEdyb3VwRGVmaW5pdGlvbiAmJiB0aGlzLmNvbXBvbmVudHMubGVuZ3RoICYmIHRoaXMucGF0aC5sZW5ndGggJiYgdGhpcy5wYXRoQXJyYXlQYXJhbXMgJiYgbmV3U2NhbGUgIT09IHRoaXMucGF0aEFycmF5UGFyYW1zLnNjYWxlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBkZXNpZ24uc3RhcnRPcGVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhcmFtcyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXRoQXJyYXlQYXJhbXMpLCB7IHNjYWxlOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGF0aEFycmF5UGFyYW1zLnNjYWxlKSwgeyB2YWx1ZTogbmV3U2NhbGUgfSksIHNjYWxlTG9ja2VkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uU3VjY2VzcyA9IHlpZWxkIHRoaXMuZG9PcGVyYXRpb24obmV3UGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxHcm91cERlZmluaXRpb24uc2V0Q3VzdG9tUHJvcGVydHkoU2NhbGVQcm9wZXJ0eUtleSwgYCR7TWFudWFsUHJlZml4fSR7bmV3U2NhbGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoQXJyYXlQYXJhbXMgPSBuZXdQYXJhbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduLmNvbW1pdE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduLmFib3J0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlcmF0aW9uU3VjY2VzcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb25Ub29sQWN0aXZlKCkge1xyXG4gICAgICAgIC8vIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAvLyBjb25zdCB0b29sSGVscGVyID0gYXBwLmdldFRvb2xIZWxwZXIoKTtcclxuICAgICAgICAvLyB0b29sSGVscGVyLmVuYWJsZVBpY2tpbmcodHJ1ZSk7XHJcbiAgICAgICAgLy8gdG9vbEhlbHBlci5zZXREZWZhdWx0U2VsZWN0QmVoYXZpb3IoS1NlbGVjdEJlaGF2aW9yLkFERCk7XHJcbiAgICAgICAgLy8gY29uc3QgYWxsRW50aXRpZXMgPSBzZWxlY3Rpb24uZ2V0QWxsRW50aXRpZXMoKTtcclxuICAgICAgICAvLyBpZiAoYWxsRW50aXRpZXMubGVuZ3RoID09PSAxICYmIChpc0tHcm91cEluc3RhbmNlKGFsbEVudGl0aWVzWzBdKSB8fCBpc0tGYWNlKGFsbEVudGl0aWVzWzBdKSkpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5tb2RlbCA9IGFsbEVudGl0aWVzWzBdO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHNlbGVjdGlvbi5jbGVhcigpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBzZWxlY3Rpb24uYWRkT2JzZXJ2ZXIoeyBvblNlbGVjdGlvbkNoYW5nZTogdGhpcy5zZWxlY3Rpb25PYnNlcnZlciB9KTtcclxuICAgIH1cclxuICAgIC8vIHByaXZhdGUgc2VsZWN0aW9uT2JzZXJ2ZXIgPSAoKSA9PiB7XHJcbiAgICAvLyAgICAgY29uc3Qgc2VsZWN0aW9uID0gYXBwLmdldFNlbGVjdGlvbigpO1xyXG4gICAgLy8gICAgIHNlbGVjdGlvbi5cclxuICAgIC8vICAgICBjb25zdCBhbGxFbnRpdGllcyA9IHNlbGVjdGlvbi5nZXRBbGxFbnRpdGllcygpO1xyXG4gICAgLy8gICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICBvblRvb2xEZWFjdGl2ZSgpIHtcclxuICAgICAgICAvLyBjb25zdCBwbHVnaW5VSSA9IGFwcC5nZXRQbHVnaW5VSSgpO1xyXG4gICAgICAgIC8vIHRoaXMudHJ5Q29tbWl0KCk7XHJcbiAgICAgICAgLy8gcGx1Z2luVUkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZGVBY3RpdmF0ZVBhdGhBcnJheScgfSwgJyonKTtcclxuICAgIH1cclxuICAgIG9uTW91c2VNb3ZlKGV2ZW50LCBpbmZlcmVuY2VSZXN1bHQpIHtcclxuICAgICAgICA7XHJcbiAgICB9XHJcbiAgICBvbkxCdXR0b25VcChldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICB9XHJcbiAgICBvblJCdXR0b25VcChldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgb25MQnV0dG9uRGJDbGljayhldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG4gICAgYWxsb3dVc2luZ0luZmVyZW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBvbktleURvd24oZXZlbnQpIHtcclxuICAgICAgICA7XHJcbiAgICB9XHJcbiAgICBvbktleVVwKGV2ZW50KSB7XHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjb25zdCBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbCA9IG5ldyBQYXRoQXJyYXlQYXJhbXNFZGl0VG9vbCgpO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnRQcm9wZXJ0eUtleSwgQ291bnRQcm9wZXJ0eUtleSwgRGVmYXVsdFBhdGhBcnJheVBhcmFtcywgSW50ZXJ2YWxQcm9wZXJ0eUtleSwgTm9ybWFsQXhpc1Byb3BlcnR5S2V5LCBQYXRoQXhpc1Byb3BlcnR5S2V5LCBQYXRoRGVsaW1pdGVyLCBQYXRoTGlzdFByb3BlcnR5S2V5LCBQYXRoUmV2ZXJzZWREZWxpbWl0ZXIsIFNjYWxlUHJvcGVydHlLZXkgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgeyBib3VuZGVkQ3VydmVDb25uZWN0aW9uRGV0ZWN0LCBmaW5kUGF0aEFmdGVyTWFrZUdyb3VwLCBnZW5lcmF0ZVBhdGhQb3NlcywgZ2V0Qm91bmRpbmdCb3hTaXplSW5Xb3JsZCwgZ2V0VHJhbnNmb3JtRnJvbVBhdGhQb2ludFBvc2VzLCBpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUsIGlzS0ZhY2UsIGlzS0dyb3VwSW5zdGFuY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5leHBvcnQgY2xhc3MgUGF0aEFycmF5VG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBhdGggPSBbXTtcclxuICAgICAgICB0aGlzLnBhdGhQb2ludFBvc2VzID0gW107XHJcbiAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYXRoQXJyYXlQYXJhbXMgPSBEZWZhdWx0UGF0aEFycmF5UGFyYW1zO1xyXG4gICAgfVxyXG4gICAgb25Ub29sQWN0aXZlKCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICBjb25zdCB0b29sSGVscGVyID0gYXBwLmdldFRvb2xIZWxwZXIoKTtcclxuICAgICAgICB0b29sSGVscGVyLmVuYWJsZVBpY2tpbmcodHJ1ZSk7XHJcbiAgICAgICAgdG9vbEhlbHBlci5zZXREZWZhdWx0U2VsZWN0QmVoYXZpb3IoS1NlbGVjdEJlaGF2aW9yLkFERCk7XHJcbiAgICAgICAgY29uc3QgYWxsRW50aXRpZXMgPSBzZWxlY3Rpb24uZ2V0QWxsRW50aXRpZXMoKTtcclxuICAgICAgICBpZiAoYWxsRW50aXRpZXMubGVuZ3RoID09PSAxICYmIChpc0tHcm91cEluc3RhbmNlKGFsbEVudGl0aWVzWzBdKSB8fCBpc0tGYWNlKGFsbEVudGl0aWVzWzBdKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGFsbEVudGl0aWVzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZWN0aW9uLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNlbGVjdGlvbi5hZGRPYnNlcnZlcih7IG9uU2VsZWN0aW9uQ2hhbmdlOiB0aGlzLnNlbGVjdGlvbk9ic2VydmVyIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gcHJpdmF0ZSBzZWxlY3Rpb25PYnNlcnZlciA9ICgpID0+IHtcclxuICAgIC8vICAgICBjb25zdCBzZWxlY3Rpb24gPSBhcHAuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAvLyAgICAgc2VsZWN0aW9uLlxyXG4gICAgLy8gICAgIGNvbnN0IGFsbEVudGl0aWVzID0gc2VsZWN0aW9uLmdldEFsbEVudGl0aWVzKCk7XHJcbiAgICAvLyAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIG9uVG9vbERlYWN0aXZlKCkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpblVJID0gYXBwLmdldFBsdWdpblVJKCk7XHJcbiAgICAgICAgdGhpcy50cnlDb21taXQoKTtcclxuICAgICAgICBwbHVnaW5VSS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdsZWF2ZVBhdGhBcnJheVRvb2wnIH0sICcqJyk7XHJcbiAgICAgICAgY29uc3QgdG9vbEhlbHBlciA9IGFwcC5nZXRUb29sSGVscGVyKCk7XHJcbiAgICAgICAgdG9vbEhlbHBlci5lbmFibGVQaWNraW5nKGZhbHNlKTtcclxuICAgICAgICB0b29sSGVscGVyLnNldERlZmF1bHRTZWxlY3RCZWhhdmlvcihLU2VsZWN0QmVoYXZpb3IuUkVQTEFDRSk7XHJcbiAgICB9XHJcbiAgICBvbk1vdXNlTW92ZShldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG4gICAgb25MQnV0dG9uVXAoZXZlbnQsIGluZmVyZW5jZVJlc3VsdCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICBjb25zdCBwaWNrSGVscGVyID0gYXBwLmdldFBpY2tIZWxwZXIoKTtcclxuICAgICAgICAvLyBjb25zdCBwaWNrYWJsZUVudGl0eVR5cGUgPSB0aGlzLm1vZGVsID8gW0tFbnRpdHlUeXBlLkF1eGlsaWFyeUJvdW5kZWRDdXJ2ZV0gOiBbS0FwcEVudGl0eVR5cGUuR3JvdXBJbnN0YW5jZSwgS0VudGl0eVR5cGUuRmFjZV07XHJcbiAgICAgICAgY29uc3QgYWxsUGlja2VkRW50aXRpZXMgPSBwaWNrSGVscGVyLnBpY2tCeVBvaW50KGV2ZW50LmNsaWVudFgoKSwgZXZlbnQuY2xpZW50WSgpKS5nZXRBbGxQaWNrZWQoKTtcclxuICAgICAgICBpZiAoYWxsUGlja2VkRW50aXRpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZFBhdGggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoYWxsUGlja2VkRW50aXRpZXNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlID0gYWxsUGlja2VkRW50aXRpZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGV0IGRpc2NyZXRlUmVzdWx0OiBEaXNjcmV0ZVJlc3VsdCA9IHsgZGlzY3JldGVQb2ludHM6IFtdLCBsZW5ndGg6IDAgfTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0UGF0aCA9IHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRoRW5kVmVydGV4ID0gbGFzdFBhdGgucmV2ZXJzZWQgPyBsYXN0UGF0aC5jdXJ2ZS5nZXRTdGFydFZlcnRleCgpIDogbGFzdFBhdGguY3VydmUuZ2V0RW5kVmVydGV4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb25uZWN0aW9uUmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXRoLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvblJlc3VsdCA9IGJvdW5kZWRDdXJ2ZUNvbm5lY3Rpb25EZXRlY3QocGF0aEVuZFZlcnRleCwgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29ubmVjdGlvblJlc3VsdC5jb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoRW5kVmVydGV4ID0gbGFzdFBhdGguY3VydmUuZ2V0U3RhcnRWZXJ0ZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uUmVzdWx0ID0gYm91bmRlZEN1cnZlQ29ubmVjdGlvbkRldGVjdChwYXRoRW5kVmVydGV4LCBhdXhpbGlhcnlCb3VuZGVkQ3VydmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25uZWN0aW9uUmVzdWx0LmNvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGF0aC5yZXZlcnNlZCA9ICFsYXN0UGF0aC5yZXZlcnNlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGFzdFBhdGguZGlzY3JldGVQb2ludHMucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnBhdGgucHVzaCh7IGN1cnZlOiBhdXhpbGlhcnlCb3VuZGVkQ3VydmUsIHJldmVyc2VkOiBjb25uZWN0aW9uLnJldmVyc2VkIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyBzZWxlY3Rpb24uYWRkKFthbGxQaWNrZWRFbnRpdGllc1swXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpc1ZhbGlkUGF0aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvblJlc3VsdCA9IGJvdW5kZWRDdXJ2ZUNvbm5lY3Rpb25EZXRlY3QocGF0aEVuZFZlcnRleCwgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29ubmVjdGlvblJlc3VsdC5jb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc2NyZXRlUmVzdWx0ID0gZGlzY3JldGVBdXhpbGlhcnlCb3VuZGVkQ3VydmUoYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChjb25uZWN0aW9uUmVzdWx0LnJldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgZGlzY3JldGVSZXN1bHQuZGlzY3JldGVQb2ludHMucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoLnB1c2goeyBjdXJ2ZTogYXV4aWxpYXJ5Qm91bmRlZEN1cnZlLCByZXZlcnNlZDogY29ubmVjdGlvblJlc3VsdC5yZXZlcnNlZCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdGlvbi5hZGQoW2FsbFBpY2tlZEVudGl0aWVzWzBdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkUGF0aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc2NyZXRlUmVzdWx0ID0gZGlzY3JldGVBdXhpbGlhcnlCb3VuZGVkQ3VydmUoYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoLnB1c2goeyBjdXJ2ZTogYXV4aWxpYXJ5Qm91bmRlZEN1cnZlLCByZXZlcnNlZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdGlvbi5hZGQoW2FsbFBpY2tlZEVudGl0aWVzWzBdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWRQYXRoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZFBhdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24ucmVtb3ZlKGFsbFBpY2tlZEVudGl0aWVzLnNsaWNlKDEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5yZW1vdmUoYWxsUGlja2VkRW50aXRpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGFsbFBpY2tlZEVudGl0aWVzWzBdO1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0aW9uLmFkZChbYWxsUGlja2VkRW50aXRpZXNbMF1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cnlDb21taXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0cnlDb21taXQoKSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwgJiYgdGhpcy5wYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZXNpZ24gPSBhcHAuZ2V0QWN0aXZlRGVzaWduKCk7XHJcbiAgICAgICAgICAgIGRlc2lnbi5zdGFydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50O1xyXG4gICAgICAgICAgICBpZiAoaXNLR3JvdXBJbnN0YW5jZSh0aGlzLm1vZGVsKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gdGhpcy5tb2RlbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0tGYWNlKHRoaXMubW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAoX2EgPSBkZXNpZ24ubWFrZUdyb3VwKFt0aGlzLm1vZGVsXSwgW10sIFtdKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZGVkSW5zdGFuY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgdG90YWxMZW5ndGggPSB0aGlzLnBhdGgucmVkdWNlPG51bWJlcj4oKGFjYywgcGF0aE9iamVjdCkgPT4geyBhY2MgKz0gcGF0aE9iamVjdC5sZW5ndGg7IHJldHVybiBhY2MgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBhdGhQb2ludFBvc2VzLCB0b3RhbExlbmd0aCB9ID0gdGhpcy5wYXRoUG9pbnRQb3Nlcy5sZW5ndGggPyB7IHBhdGhQb2ludFBvc2VzOiB0aGlzLnBhdGhQb2ludFBvc2VzLCB0b3RhbExlbmd0aDogdGhpcy50b3RhbExlbmd0aCB9IDogZ2VuZXJhdGVQYXRoUG9zZXModGhpcy5wYXRoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGF0aFBvaW50UG9zZXMgPSBwYXRoUG9pbnRQb3NlcztcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxMZW5ndGggPSB0b3RhbExlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGNvbXBvbmVudFRyYW5zZm9ybXM6IEtNYXRyaXg0W10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBbY29tcG9uZW50XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF1dG9tYXRpY0ludGVydmFsID0gdG90YWxMZW5ndGggLyAodGhpcy5wYXRoQXJyYXlQYXJhbXMuY291bnQudmFsdWUgLSAxKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkU2l6ZSA9IGdldEJvdW5kaW5nQm94U2l6ZUluV29ybGQoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gd29ybGRTaXplWzBdID4gKGF1dG9tYXRpY0ludGVydmFsIC8gMikgPyAoYXV0b21hdGljSW50ZXJ2YWwgLyAyIC8gd29ybGRTaXplWzBdKSA6IDE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRMb2NhbEJvdW5kaW5nQm94ID0gY29tcG9uZW50LmdldExvY2FsQm91bmRpbmdCb3goKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFRyYW5zZm9ybSA9IGNvbXBvbmVudC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGV4dGVuZGVkVHJhbnNmb3JtID0gZ2V0RXh0ZW5kZWRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFBvc2l0aW9uID0gY29tcG9uZW50TG9jYWxCb3VuZGluZ0JveC5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNldE1hdHJpeCA9IEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KC1jb21wb25lbnRQb3NpdGlvbi54LCAtY29tcG9uZW50UG9zaXRpb24ueSwgLWNvbXBvbmVudFBvc2l0aW9uLnopXHJcbiAgICAgICAgICAgICAgICAgICAgLm11bHRpcGxpZWQoY29tcG9uZW50VHJhbnNmb3JtLmludmVyc2VkKCkpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgc2NhbGVNYXRyaXggPSBHZW9tTGliLmNyZWF0ZVNjYWxlTWF0cml4NChzY2FsZSwgc2NhbGUsIHNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhBcnJheVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXRoQXJyYXlQYXJhbXMpLCB7IGludGVydmFsOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGF0aEFycmF5UGFyYW1zLmludGVydmFsKSwgeyB2YWx1ZTogYXV0b21hdGljSW50ZXJ2YWwgfSksIHNjYWxlOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGF0aEFycmF5UGFyYW1zLnNjYWxlKSwgeyB2YWx1ZTogc2NhbGUgfSkgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRUcmFuc2Zvcm1zID0gZ2V0VHJhbnNmb3JtRnJvbVBhdGhQb2ludFBvc2VzKHRoaXMucGF0aFBvaW50UG9zZXMsIG5ld1BhdGhBcnJheVBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3BlcmF0aW9uU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1Hcm91cEluc3RhbmNlcyhbY29tcG9uZW50XSwgY29tcG9uZW50VHJhbnNmb3Jtc1swXS5tdWx0aXBsaWVkKHJlc2V0TWF0cml4KSkuaXNTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgLy8gR2VvbUxpYi5jcmVhdGVUcmFuc2xhdGlvbk1hdHJpeDQoY29tcG9uZW50UG9zaXRpb25zWzBdLnggLSBjdXJyZW50Q29tcG9uZW50UG9zaXRpb24ueCwgY29tcG9uZW50UG9zaXRpb25zWzBdLnkgLSBjdXJyZW50Q29tcG9uZW50UG9zaXRpb24ueSwgY29tcG9uZW50UG9zaXRpb25zWzBdLnogLSBjdXJyZW50Q29tcG9uZW50UG9zaXRpb24ueilcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGNvbXBvbmVudFRyYW5zZm9ybXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VUcmFuc2Zvcm1JbnZlcnNlID0gY29tcG9uZW50VHJhbnNmb3Jtc1swXS5pbnZlcnNlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvbXBvbmVudHMgPSAoX2IgPSBkZXNpZ24uYnVsa0NvcHlHcm91cEluc3RhbmNlcyhbY29tcG9uZW50XSwgW2NvbXBvbmVudFRyYW5zZm9ybXMuc2xpY2UoMSkubWFwKG1hdHJpeCA9PiBtYXRyaXgubXVsdGlwbGllZChiYXNlVHJhbnNmb3JtSW52ZXJzZSkpXSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5hZGRlZEluc3RhbmNlcztcclxuICAgICAgICAgICAgICAgICAgICAvLyBbY29tcG9uZW50UG9zaXRpb25zLnNsaWNlKDEpLm1hcChwb3NpdGlvbiA9PiBHZW9tTGliLmNyZWF0ZVRyYW5zbGF0aW9uTWF0cml4NChwb3NpdGlvbi54IC0gY29tcG9uZW50UG9zaXRpb25zWzBdLngsIHBvc2l0aW9uLnkgLSBjb21wb25lbnRQb3NpdGlvbnNbMF0ueSwgcG9zaXRpb24ueiAtIGNvbXBvbmVudFBvc2l0aW9uc1swXS56KSldXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NvbXBvbmVudHMgPT09IG51bGwgfHwgbmV3Q29tcG9uZW50cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmV3Q29tcG9uZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKC4uLm5ld0NvbXBvbmVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY29tcG9uZW50cy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblN1Y2Nlc3MgPSBvcGVyYXRpb25TdWNjZXNzICYmIGNvbXBvbmVudHNbaW5kZXhdLnNldEN1c3RvbVByb3BlcnR5KENvbXBvbmVudFByb3BlcnR5S2V5LCBgJHtpbmRleH1gKS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50R3JvdXBJbnN0YW5jZSA9IChfYyA9IGRlc2lnbi5tYWtlR3JvdXAoW10sIGNvbXBvbmVudHMsIHRoaXMucGF0aC5tYXAocGF0aE9iamVjdCA9PiBwYXRoT2JqZWN0LmN1cnZlKSkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5hZGRlZEluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRHcm91cERlZmluaXRpb24gPSBwYXJlbnRHcm91cEluc3RhbmNlID09PSBudWxsIHx8IHBhcmVudEdyb3VwSW5zdGFuY2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudEdyb3VwSW5zdGFuY2UuZ2V0R3JvdXBEZWZpbml0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRHcm91cERlZmluaXRpb24gJiYgcGFyZW50R3JvdXBJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aENvdW50ID0gdGhpcy5wYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblN1Y2Nlc3MgPSBvcGVyYXRpb25TdWNjZXNzICYmIHBhcmVudEdyb3VwRGVmaW5pdGlvbi5zZXRDdXN0b21Qcm9wZXJ0eShJbnRlcnZhbFByb3BlcnR5S2V5LCBgJHthdXRvbWF0aWNJbnRlcnZhbH1gKS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25TdWNjZXNzID0gb3BlcmF0aW9uU3VjY2VzcyAmJiBwYXJlbnRHcm91cERlZmluaXRpb24uc2V0Q3VzdG9tUHJvcGVydHkoQ291bnRQcm9wZXJ0eUtleSwgYCR7dGhpcy5wYXRoQXJyYXlQYXJhbXMuY291bnQudmFsdWV9YCkuaXNTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IG9wZXJhdGlvblN1Y2Nlc3MgJiYgcGFyZW50R3JvdXBEZWZpbml0aW9uLnNldEN1c3RvbVByb3BlcnR5KFBhdGhBeGlzUHJvcGVydHlLZXksIGAke3RoaXMucGF0aEFycmF5UGFyYW1zLnBhdGhBeGlzfWApLmlzU3VjY2VzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblN1Y2Nlc3MgPSBvcGVyYXRpb25TdWNjZXNzICYmIHBhcmVudEdyb3VwRGVmaW5pdGlvbi5zZXRDdXN0b21Qcm9wZXJ0eShOb3JtYWxBeGlzUHJvcGVydHlLZXksIGAke3RoaXMucGF0aEFycmF5UGFyYW1zLm5vcm1hbEF4aXN9YCkuaXNTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IG9wZXJhdGlvblN1Y2Nlc3MgJiYgcGFyZW50R3JvdXBEZWZpbml0aW9uLnNldEN1c3RvbVByb3BlcnR5KFNjYWxlUHJvcGVydHlLZXksIGAke3NjYWxlfWApLmlzU3VjY2VzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBmaW5kUGF0aEFmdGVyTWFrZUdyb3VwKHRoaXMucGF0aCwgcGFyZW50R3JvdXBJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25TdWNjZXNzID0gb3BlcmF0aW9uU3VjY2VzcyAmJiAobmV3UGF0aCA9PT0gbnVsbCB8fCBuZXdQYXRoID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXdQYXRoLmxlbmd0aCkgPT09IHRoaXMucGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uU3VjY2VzcyAmJiAobmV3UGF0aCA9PT0gbnVsbCB8fCBuZXdQYXRoID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXdQYXRoLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGggPSBuZXdQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IG9wZXJhdGlvblN1Y2Nlc3MgJiYgcGFyZW50R3JvdXBEZWZpbml0aW9uLnNldEN1c3RvbVByb3BlcnR5KFBhdGhMaXN0UHJvcGVydHlLZXksIHRoaXMucGF0aC5yZWR1Y2UoKGFjYywgcGF0aE9iamVjdCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2MgKz0gYCR7cGF0aE9iamVjdC5jdXJ2ZS5nZXRLZXkoKX0ke1BhdGhSZXZlcnNlZERlbGltaXRlcn0ke3BhdGhPYmplY3QucmV2ZXJzZWQgPyAxIDogMH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHBhdGhDb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjICs9IGAke1BhdGhEZWxpbWl0ZXJ9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sICcnKSkuaXNTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvblN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhBcnJheVBhcmFtcyA9IG5ld1BhdGhBcnJheVBhcmFtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNpZ24uY29tbWl0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gYXBwLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5hZGQoW3BhcmVudEdyb3VwSW5zdGFuY2VdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lnbi5hYm9ydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzaWduLmFib3J0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lnbi5hYm9ydE9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhcHAuZGVhY3RpdmF0ZUN1c3RvbVRvb2wodGhpcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVzaWduLmFib3J0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnBhdGggPSBbXTtcclxuICAgICAgICB0aGlzLnBhdGhQb2ludFBvc2VzID0gW107XHJcbiAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYXRoQXJyYXlQYXJhbXMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRQYXRoQXJyYXlQYXJhbXMpLCB7IGNvdW50OiB0aGlzLnBhdGhBcnJheVBhcmFtcy5jb3VudCB9KTtcclxuICAgICAgICAvLyB0aGlzLmludGVydmFsID0gRGVmYXVsdEludGVydmFsO1xyXG4gICAgfVxyXG4gICAgb25SQnV0dG9uVXAoZXZlbnQsIGluZmVyZW5jZVJlc3VsdCkge1xyXG4gICAgICAgIGFwcC5kZWFjdGl2YXRlQ3VzdG9tVG9vbCh0aGlzKTtcclxuICAgIH1cclxuICAgIG9uTEJ1dHRvbkRiQ2xpY2soZXZlbnQsIGluZmVyZW5jZVJlc3VsdCkge1xyXG4gICAgICAgIDtcclxuICAgIH1cclxuICAgIGFsbG93VXNpbmdJbmZlcmVuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG4gICAgb25LZXlVcChldmVudCkge1xyXG4gICAgICAgIDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY29uc3QgcGF0aEFycmF5VG9vbCA9IG5ldyBQYXRoQXJyYXlUb29sKCk7XHJcbiIsImV4cG9ydCBjb25zdCBDb21wb25lbnRQcm9wZXJ0eUtleSA9ICdQQUNvbXBvbmVudCc7XHJcbmV4cG9ydCBjb25zdCBJbnRlcnZhbFByb3BlcnR5S2V5ID0gJ1BBSW50ZXJ2YWwnO1xyXG5leHBvcnQgY29uc3QgQ291bnRQcm9wZXJ0eUtleSA9ICdQQUNvdW50JztcclxuZXhwb3J0IGNvbnN0IFBhdGhBeGlzUHJvcGVydHlLZXkgPSAnUEFQYXRoQXhpcyc7XHJcbmV4cG9ydCBjb25zdCBOb3JtYWxBeGlzUHJvcGVydHlLZXkgPSAnUEFOb3JtYWxBeGlzJztcclxuZXhwb3J0IGNvbnN0IFNjYWxlUHJvcGVydHlLZXkgPSAnUEFTY2FsZSc7XHJcbmV4cG9ydCBjb25zdCBQYXRoTGlzdFByb3BlcnR5S2V5ID0gJ1BBUGF0aExpc3QnO1xyXG5leHBvcnQgY29uc3QgUGF0aFJldmVyc2VkRGVsaW1pdGVyID0gJy0nO1xyXG5leHBvcnQgY29uc3QgUGF0aERlbGltaXRlciA9ICcmJztcclxuZXhwb3J0IGNvbnN0IE1hbnVhbFByZWZpeCA9ICdtJztcclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXhpc1ZhbGlkKGF4aXMpIHtcclxuICAgIHJldHVybiBheGlzID09PSBcIlhcIiAvKiBBeGlzLlggKi8gfHwgYXhpcyA9PT0gXCItWFwiIC8qIEF4aXMuWE1pbnVzICovIHx8IGF4aXMgPT09IFwiWVwiIC8qIEF4aXMuWSAqLyB8fCBheGlzID09PSBcIi1ZXCIgLyogQXhpcy5ZTWludXMgKi8gfHwgYXhpcyA9PT0gXCJaXCIgLyogQXhpcy5aICovIHx8IGF4aXMgPT09IFwiLVpcIiAvKiBBeGlzLlpNaW51cyAqLztcclxufVxyXG5leHBvcnQgY29uc3QgRGVmYXVsdFBhdGhBcnJheVBhcmFtcyA9IHtcclxuICAgIGludGVydmFsOiB7IHZhbHVlOiAxMDAwLCBtaW46IDEwLCBtYXg6IDk5OTk5OTkgfSxcclxuICAgIGNvdW50OiB7IHZhbHVlOiA1LCBtaW46IDEsIG1heDogMTAwIH0sXHJcbiAgICBwYXRoQXhpczogXCJYXCIgLyogQXhpcy5YICovLFxyXG4gICAgbm9ybWFsQXhpczogXCJaXCIgLyogQXhpcy5aICovLFxyXG4gICAgc2NhbGU6IHsgdmFsdWU6IDEsIG1pbjogMC4wMSwgbWF4OiAxMDAwIH0sXHJcbn07XHJcbmV4cG9ydCBjb25zdCBkdW1teU1hdHJpeDQgPSBHZW9tTGliLmNyZWF0ZUlkZW50aXR5TWF0cml4NCgpO1xyXG5leHBvcnQgY29uc3QgZHVtbXlWZWN0b3IzZCA9IEdlb21MaWIuY3JlYXRlVmVjdG9yM2QoMCwgMCwgMSk7XHJcbmV4cG9ydCBjb25zdCBkdW1teVBvaW50M2QgPSBHZW9tTGliLmNyZWF0ZVBvaW50M2QoMCwgMCwgMCk7XHJcbiIsImltcG9ydCB7IGR1bW15UG9pbnQzZCwgZHVtbXlWZWN0b3IzZCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tHcm91cEluc3RhbmNlKGVudGl0eSkge1xyXG4gICAgcmV0dXJuIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLkdyb3VwSW5zdGFuY2U7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS0ZhY2UoZW50aXR5KSB7XHJcbiAgICByZXR1cm4gZW50aXR5LmdldFR5cGUoKSA9PT0gS0VudGl0eVR5cGUuRmFjZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNLQXV4aWxpYXJ5Qm91bmRlZEN1cnZlKGVudGl0eSkge1xyXG4gICAgcmV0dXJuIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLkF1eGlsaWFyeUJvdW5kZWRDdXJ2ZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNLTGluZVNlZ21lbnQzZChlbnRpdHkpIHtcclxuICAgIHJldHVybiAhIWVudGl0eS5kaXJlY3Rpb247XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS0FyYzNkKGVudGl0eSkge1xyXG4gICAgcmV0dXJuICEhZW50aXR5LmNpcmNsZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gYm91bmRlZEN1cnZlQ29ubmVjdGlvbkRldGVjdChhdXhpbGlhcnlWZXJ0ZXgsIGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZSkge1xyXG4gICAgY29uc3Qgc3RhcnRWZXJ0ZXggPSBhdXhpbGlhcnlCb3VuZGVkQ3VydmUuZ2V0U3RhcnRWZXJ0ZXgoKTtcclxuICAgIGNvbnN0IGVuZFZlcnRleCA9IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZS5nZXRTdGFydFZlcnRleCgpO1xyXG4gICAgaWYgKHN0YXJ0VmVydGV4LmdldEtleSgpID09PSBhdXhpbGlhcnlWZXJ0ZXguZ2V0S2V5KCkpIHtcclxuICAgICAgICByZXR1cm4geyBjb25uZWN0ZWQ6IHRydWUsIHJldmVyc2VkOiBmYWxzZSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZW5kVmVydGV4LmdldEtleSgpID09PSBhdXhpbGlhcnlWZXJ0ZXguZ2V0S2V5KCkpIHtcclxuICAgICAgICByZXR1cm4geyBjb25uZWN0ZWQ6IHRydWUsIHJldmVyc2VkOiB0cnVlIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyBjb25uZWN0ZWQ6IGZhbHNlLCByZXZlcnNlZDogZmFsc2UgfTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZGlzY3JldGVBdXhpbGlhcnlCb3VuZGVkQ3VydmUoYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKSB7XHJcbiAgICBjb25zdCBib3VuZGVkQ3VydmUgPSBhdXhpbGlhcnlCb3VuZGVkQ3VydmUuZ2V0Qm91bmRlZEN1cnZlKCk7XHJcbiAgICBsZXQgZGlzY3JldGVQb2ludHMgPSBbXTtcclxuICAgIC8vIGNvbnN0IHJlc3VsdDogRGlzY3JldGVSZXN1bHQgPSB7IGRpc2NyZXRlUG9pbnRzLCBsZW5ndGg6IDAgfTtcclxuICAgIGlmIChib3VuZGVkQ3VydmUpIHtcclxuICAgICAgICBpZiAoaXNLTGluZVNlZ21lbnQzZChib3VuZGVkQ3VydmUpKSB7XHJcbiAgICAgICAgICAgIGRpc2NyZXRlUG9pbnRzID0gW2JvdW5kZWRDdXJ2ZS5zdGFydFBvaW50LCBib3VuZGVkQ3VydmUuZW5kUG9pbnRdO1xyXG4gICAgICAgICAgICAvLyByZXN1bHQuZGlzY3JldGVQb2ludHMgPSBkaXNjcmV0ZVBvaW50cztcclxuICAgICAgICAgICAgLy8gcmVzdWx0Lmxlbmd0aCA9IGRpc2NyZXRlUG9pbnRzWzBdLmRpc3RhbmNlVG8oZGlzY3JldGVQb2ludHNbMV0pO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4geyBkaXNjcmV0ZVBvaW50cywgbGVuZ3RoOiBkaXNjcmV0ZVBvaW50c1swXS5kaXN0YW5jZVRvKGRpc2NyZXRlUG9pbnRzWzFdKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc0tBcmMzZChib3VuZGVkQ3VydmUpKSB7XHJcbiAgICAgICAgICAgIGRpc2NyZXRlUG9pbnRzID0gYm91bmRlZEN1cnZlLmdldEFwcHJveGltYXRlUG9pbnRzQnlBbmdsZSgpO1xyXG4gICAgICAgICAgICAvLyByZXN1bHQuZGlzY3JldGVQb2ludHMgPSBkaXNjcmV0ZVBvaW50cztcclxuICAgICAgICAgICAgLy8gcmVzdWx0Lmxlbmd0aCA9IGRpc2NyZXRlUG9pbnRzLnJlZHVjZTxudW1iZXI+KChhY2MsIHBvaW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByZXZQb2ludCA9IGRpc2NyZXRlUG9pbnRzW2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYWNjICs9IHBvaW50LmRpc3RhbmNlVG8ocHJldlBvaW50KTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgICAgIC8vIH0sIDApO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4ge1xyXG4gICAgICAgICAgICAvLyAgICAgZGlzY3JldGVQb2ludHMsIGxlbmd0aDogZGlzY3JldGVQb2ludHMucmVkdWNlPG51bWJlcj4oKGFjYywgcG9pbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCBwcmV2UG9pbnQgPSBkaXNjcmV0ZVBvaW50c1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBhY2MgKz0gcG9pbnQuZGlzdGFuY2VUbyhwcmV2UG9pbnQpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgICAgICAvLyAgICAgfSwgMClcclxuICAgICAgICAgICAgLy8gfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlzY3JldGVQb2ludHM7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF1eGlsaWFyeUJvdW5kZWRDdXJ2ZU5vcm1hbChhdXhpbGlhcnlCb3VuZGVkQ3VydmUpIHtcclxuICAgIGNvbnN0IGJvdW5kZWRDdXJ2ZSA9IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZS5nZXRCb3VuZGVkQ3VydmUoKTtcclxuICAgIGlmIChib3VuZGVkQ3VydmUpIHtcclxuICAgICAgICBpZiAoaXNLQXJjM2QoYm91bmRlZEN1cnZlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRlZEN1cnZlLm5vcm1hbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROb3JtYWxCeVgoeEF4aXMpIHtcclxuICAgIGlmICh4QXhpcy5pc1BhcmFsbGVsKGR1bW15VmVjdG9yM2QpKSB7XHJcbiAgICAgICAgaWYgKHhBeGlzLnogPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBHZW9tTGliLmNyZWF0ZVZlY3RvcjNkKC0xLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBHZW9tTGliLmNyZWF0ZVZlY3RvcjNkKDEsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB4QXhpcy5jcm9zcyhkdW1teVZlY3RvcjNkLmNyb3NzKHhBeGlzKSkubm9ybWFsaXplZCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBhdGhQb3NlcyhwYXRoKSB7XHJcbiAgICAvLyBjb25zdCBhbGxEaXNjcmV0ZVBvaW50czogS1BvaW50M2RbXSA9IFtdO1xyXG4gICAgLy8gY29uc3QgY29tcG9uZW50UG9zaXRpb25zOiBLUG9pbnQzZFtdID0gW107XHJcbiAgICBjb25zdCBwYXRoUG9pbnRQb3NlcyA9IFtdO1xyXG4gICAgLy8gbGV0IHRvdGFsTGVuZ3RoOiBudW1iZXIgPSAwO1xyXG4gICAgbGV0IGFjY3VtdWxhdGVMZW5ndGggPSAwO1xyXG4gICAgLy8gbGV0IHByZXZOb3JtYWw6IEtWZWN0b3IzZCB8IHVuZGVmaW5lZDtcclxuICAgIC8vIGxldCBmaXJzdFZhbGlkTm9ybWFsOiBLVmVjdG9yM2QgPSBkdW1teVZlY3RvcjNkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aE9iamVjdCA9IHBhdGhbaV07XHJcbiAgICAgICAgLy8gY29uc3QgeyBkaXNjcmV0ZVBvaW50cywgbGVuZ3RoIH0gPSBwYXRoT2JqZWN0O1xyXG4gICAgICAgIGNvbnN0IGRpc2NyZXRlUG9pbnRzID0gZGlzY3JldGVBdXhpbGlhcnlCb3VuZGVkQ3VydmUocGF0aE9iamVjdC5jdXJ2ZSk7XHJcbiAgICAgICAgLy8gdG90YWxMZW5ndGggKz0gbGVuZ3RoO1xyXG4gICAgICAgIGlmIChkaXNjcmV0ZVBvaW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRlZEN1cnZlTm9ybWFsID0gZ2V0QXV4aWxpYXJ5Qm91bmRlZEN1cnZlTm9ybWFsKHBhdGhPYmplY3QuY3VydmUpO1xyXG4gICAgICAgICAgICAvLyBwcmV2Tm9ybWFsID0gbm9ybWFsO1xyXG4gICAgICAgICAgICAvLyBpZiAobm9ybWFsKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBmaXJzdFZhbGlkTm9ybWFsID0gbm9ybWFsO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGRpc2NyZXRlUG9pbnRzID0gcGF0aE9iamVjdC5yZXZlcnNlZCA/IGRpc2NyZXRlUG9pbnRzLnJldmVyc2UoKSA6IGRpc2NyZXRlUG9pbnRzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRpc2NyZXRlUG9pbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNjcmV0ZVBvaW50ID0gZGlzY3JldGVQb2ludHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudFBvc2l0aW9ucy5wdXNoKGRpc2NyZXRlUG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dERpc2NyZXRlUG9pbnQgPSBkaXNjcmV0ZVBvaW50c1tqICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhQb2ludFBvc2VzLnB1c2goeyBwb2ludDogZGlzY3JldGVQb2ludHNbMF0sIGRpcmVjdGlvbjogbmV4dERpc2NyZXRlUG9pbnQuc3VidHJhY3RlZChkaXNjcmV0ZVBvaW50KS5ub3JtYWxpemVkKCksIGFjY3VtdWxhdGVMZW5ndGggfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldkRpc2NyZXRlUG9pbnQgPSBkaXNjcmV0ZVBvaW50c1tqIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gZGlzY3JldGVQb2ludC5zdWJ0cmFjdGVkKHByZXZEaXNjcmV0ZVBvaW50KS5ub3JtYWxpemVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudExlbmd0aCA9IHByZXZEaXNjcmV0ZVBvaW50LmRpc3RhbmNlVG8oZGlzY3JldGVQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNjdW11bGF0ZUxlbmd0aCArPSBzZWdtZW50TGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhQb2ludFBvc2VzLnB1c2goeyBwb2ludDogZGlzY3JldGVQb2ludCwgZGlyZWN0aW9uLCBhY2N1bXVsYXRlTGVuZ3RoIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGF0aFBvaW50UG9zZXNbcGF0aFBvaW50UG9zZXMubGVuZ3RoIC0gMV0ubm9ybWFsID0gYm91bmRlZEN1cnZlTm9ybWFsID8gYm91bmRlZEN1cnZlTm9ybWFsIDogZ2V0Tm9ybWFsQnlYKHBhdGhQb2ludFBvc2VzW3BhdGhQb2ludFBvc2VzLmxlbmd0aCAtIDFdLmRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgKGkgIT09IDApIHtcclxuICAgICAgICAgICAgLy8gICAgIGRpc2NyZXRlUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gYWxsRGlzY3JldGVQb2ludHMucHVzaCguLi5kaXNjcmV0ZVBvaW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZm9yIChjb25zdCBwYXRoUG9pbnRQb3NlIG9mIHBhdGhQb2ludFBvc2VzKSB7XHJcbiAgICAvLyAgICAgaWYgKCFwYXRoUG9pbnRQb3NlLm5vcm1hbCkge1xyXG4gICAgLy8gICAgICAgICBwYXRoUG9pbnRQb3NlLm5vcm1hbCA9IGZpcnN0VmFsaWROb3JtYWw7XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgcmV0dXJuIHsgcGF0aFBvaW50UG9zZXMsIHRvdGFsTGVuZ3RoOiBhY2N1bXVsYXRlTGVuZ3RoIH07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zZm9ybUZyb21QYXRoUG9pbnRQb3NlcyhwYXRoUG9pbnRQb3NlcywgcGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGNvdW50LCBpbnRlcnZhbCwgc2NhbGUsIHBhdGhBeGlzLCBub3JtYWxBeGlzIH0gPSBwYXJhbXM7XHJcbiAgICAvLyBjb25zdCB7IGNvdW50LCBpbnRlcnZhbCwgcGF0aEF4aXMsIG5vcm1hbEF4aXMsIHNjYWxlIH0gPSBwYXJhbXM7XHJcbiAgICBjb25zdCBjb21wb25lbnRUcmFuc2Zvcm1zID0gW107XHJcbiAgICBjb25zdCBzY2FsZU1hdHJpeCA9IEdlb21MaWIuY3JlYXRlU2NhbGVNYXRyaXg0KHNjYWxlLnZhbHVlLCBzY2FsZS52YWx1ZSwgc2NhbGUudmFsdWUpO1xyXG4gICAgbGV0IGNvbXBvbmVudEluZGV4ID0gMDtcclxuICAgIGxldCBjb21wb25lbnRQb3NpdGlvbkxlbmd0aCA9IGNvbXBvbmVudEluZGV4ICogaW50ZXJ2YWwudmFsdWU7XHJcbiAgICAvLyBsZXQgYmFzZVRyYW5zZm9ybUludmVyc2U6IEtNYXRyaXg0ID0gZHVtbXlNYXRyaXg0O1xyXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBwYXRoUG9pbnRQb3Nlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgIGNvbnN0IHsgcG9pbnQsIG5vcm1hbCwgZGlyZWN0aW9uLCBhY2N1bXVsYXRlTGVuZ3RoIH0gPSBwYXRoUG9pbnRQb3Nlc1trXTtcclxuICAgICAgICBjb25zdCBwcmV2QWNjdW11bGF0ZUxlbmd0aCA9IGsgPT09IDAgPyAtMSA6IHBhdGhQb2ludFBvc2VzW2sgLSAxXS5hY2N1bXVsYXRlTGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb21wb25lbnRUcmFuc2Zvcm07XHJcbiAgICAgICAgY29uc3QgcGF0aE5vcm1hbCA9IG5vcm1hbCB8fCBkdW1teVZlY3RvcjNkO1xyXG4gICAgICAgIC8vIGlmIChrID09PSAwKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbXBvbmVudFRyYW5zZm9ybSA9IEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KHBvaW50LngsIHBvaW50LnksIHBvaW50LnopXHJcbiAgICAgICAgLy8gICAgICAgICAubXVsdGlwbGllZChHZW9tTGliLmNyZWF0ZUFsaWduQ0NTTWF0cml4NChkaXJlY3Rpb24sIHBhdGhOb3JtYWwuY3Jvc3MoZGlyZWN0aW9uKS5ub3JtYWxpemVkKCksIHBhdGhOb3JtYWwsIGR1bW15UG9pbnQzZCkpXHJcbiAgICAgICAgLy8gICAgICAgICAubXVsdGlwbGllZChzY2FsZU1hdHJpeCk7XHJcbiAgICAgICAgLy8gICAgIGJhc2VUcmFuc2Zvcm1JbnZlcnNlID0gY29tcG9uZW50VHJhbnNmb3JtLmludmVyc2VkKCk7XHJcbiAgICAgICAgLy8gICAgIGNvbXBvbmVudFRyYW5zZm9ybXMucHVzaChjb21wb25lbnRUcmFuc2Zvcm0ubXVsdGlwbGllZChyZXNldE1hdHJpeCkpO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gY29uc3QgcHJldkRpc2NyZXRlU2VnbWVudCA9IHBhdGhQb2ludFBvc2VzW2sgLSAxXTtcclxuICAgICAgICAvLyBjb25zdCBzZWdtZW50TGVuZ3RoID0gcHJldkRpc2NyZXRlU2VnbWVudC5wb2ludC5kaXN0YW5jZVRvKHBvaW50KTtcclxuICAgICAgICBsZXQgY2NzWDtcclxuICAgICAgICBsZXQgY2NzWTtcclxuICAgICAgICBsZXQgY2NzWjtcclxuICAgICAgICBzd2l0Y2ggKHBhdGhBeGlzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJYXCIgLyogQXhpcy5YICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWCA9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiLVhcIiAvKiBBeGlzLlhNaW51cyAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ggPSBkaXJlY3Rpb24ucmV2ZXJzZWQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVwiIC8qIEF4aXMuWSAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1kgPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIi1ZXCIgLyogQXhpcy5ZTWludXMgKi86XHJcbiAgICAgICAgICAgICAgICBjY3NZID0gZGlyZWN0aW9uLnJldmVyc2VkKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlpcIiAvKiBBeGlzLlogKi86XHJcbiAgICAgICAgICAgICAgICBjY3NaID0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCItWlwiIC8qIEF4aXMuWk1pbnVzICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWiA9IGRpcmVjdGlvbi5yZXZlcnNlZCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAobm9ybWFsQXhpcykge1xyXG4gICAgICAgICAgICBjYXNlIFwiWFwiIC8qIEF4aXMuWCAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ggPSBwYXRoTm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCItWFwiIC8qIEF4aXMuWE1pbnVzICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWCA9IHBhdGhOb3JtYWwucmV2ZXJzZWQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiWVwiIC8qIEF4aXMuWSAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1kgPSBwYXRoTm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCItWVwiIC8qIEF4aXMuWU1pbnVzICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWSA9IHBhdGhOb3JtYWwucmV2ZXJzZWQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiWlwiIC8qIEF4aXMuWiAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ogPSBwYXRoTm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCItWlwiIC8qIEF4aXMuWk1pbnVzICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWiA9IHBhdGhOb3JtYWwucmV2ZXJzZWQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNjc1gpIHtcclxuICAgICAgICAgICAgY2NzWCA9IGNjc1kuY3Jvc3MoY2NzWik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY2NzWSkge1xyXG4gICAgICAgICAgICBjY3NZID0gY2NzWi5jcm9zcyhjY3NYKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFjY3NaKSB7XHJcbiAgICAgICAgICAgIGNjc1ogPSBjY3NYLmNyb3NzKGNjc1kpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoY29tcG9uZW50SW5kZXggPCBjb3VudC52YWx1ZSAmJiBjb21wb25lbnRQb3NpdGlvbkxlbmd0aCA+IHByZXZBY2N1bXVsYXRlTGVuZ3RoICYmIGNvbXBvbmVudFBvc2l0aW9uTGVuZ3RoIDw9IGFjY3VtdWxhdGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gY29uc3Qgc2VnbWVudERpcmVjdGlvbiA9IHBvaW50LnN1YnRyYWN0ZWQocHJldkRpc2NyZXRlU2VnbWVudC5wb2ludCkubm9ybWFsaXplZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRQb3NpdGlvbiA9IHBvaW50LmFkZGVkKGRpcmVjdGlvbi5tdWx0aXBsaWVkKGNvbXBvbmVudFBvc2l0aW9uTGVuZ3RoIC0gYWNjdW11bGF0ZUxlbmd0aCkpO1xyXG4gICAgICAgICAgICBjb21wb25lbnRUcmFuc2Zvcm0gPSBHZW9tTGliLmNyZWF0ZVRyYW5zbGF0aW9uTWF0cml4NChjb21wb25lbnRQb3NpdGlvbi54LCBjb21wb25lbnRQb3NpdGlvbi55LCBjb21wb25lbnRQb3NpdGlvbi56KVxyXG4gICAgICAgICAgICAgICAgLm11bHRpcGxpZWQoR2VvbUxpYi5jcmVhdGVBbGlnbkNDU01hdHJpeDQoY2NzWCwgY2NzWSwgY2NzWiwgZHVtbXlQb2ludDNkKSlcclxuICAgICAgICAgICAgICAgIC5tdWx0aXBsaWVkKHNjYWxlTWF0cml4KTtcclxuICAgICAgICAgICAgLy8gY29tcG9uZW50UG9zaXRpb25zLnB1c2goKTtcclxuICAgICAgICAgICAgY29tcG9uZW50VHJhbnNmb3Jtcy5wdXNoKGNvbXBvbmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudEluZGV4Kys7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudFBvc2l0aW9uTGVuZ3RoID0gY29tcG9uZW50SW5kZXggKiBpbnRlcnZhbC52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3VycmVudExlbmd0aCArPSBzZWdtZW50TGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbXBvbmVudFRyYW5zZm9ybXM7XHJcbiAgICAvLyB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kaW5nQm94U2l6ZUluV29ybGQoZ3JvdXBJbnN0YW5jZSkge1xyXG4gICAgY29uc3QgbG9jYWxCb3VuZGluZ0JveCA9IGdyb3VwSW5zdGFuY2UuZ2V0TG9jYWxCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3QgdHJhbnNmb3JtID0gZ3JvdXBJbnN0YW5jZS5nZXRUcmFuc2Zvcm0oKTtcclxuICAgIGNvbnN0IG9sZFNpemUgPSBbR2VvbUxpYi5jcmVhdGVWZWN0b3IzZChsb2NhbEJvdW5kaW5nQm94LndpZHRoLCAwLCAwKSwgR2VvbUxpYi5jcmVhdGVWZWN0b3IzZCgwLCBsb2NhbEJvdW5kaW5nQm94LmhlaWdodCwgMCksIEdlb21MaWIuY3JlYXRlVmVjdG9yM2QoMCwgMCwgbG9jYWxCb3VuZGluZ0JveC5kZXB0aCldO1xyXG4gICAgcmV0dXJuIG9sZFNpemUubWFwKHZlYyA9PiB2ZWMuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKS5sZW5ndGgpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbmRlZFRyYW5zZm9ybSgpIHtcclxuICAgIGNvbnN0IGRlc2lnbiA9IGFwcC5nZXRBY3RpdmVEZXNpZ24oKTtcclxuICAgIGNvbnN0IGVkaXRQYXRoID0gZGVzaWduLmdldEVkaXRQYXRoKCk7XHJcbiAgICBjb25zdCBleHRlbmRlZFRyYW5zZm9ybSA9IEdlb21MaWIuY3JlYXRlSWRlbnRpdHlNYXRyaXg0KCk7XHJcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgZWRpdFBhdGgpIHtcclxuICAgICAgICBleHRlbmRlZFRyYW5zZm9ybS5tdWx0aXBseShwYXRoLmdldFRyYW5zZm9ybSgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBleHRlbmRlZFRyYW5zZm9ybTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZFBhdGhBZnRlck1ha2VHcm91cChwYXRoLCBuZXdHcm91cEluc3RhbmNlKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICAvLyBjb25zdCBhdXhpbGlhcnlCb3VuZGVkQ3VydmVNYXA6IE1hcDxzdHJpbmcsIEtBdXhpbGlhcnlCb3VuZGVkQ3VydmU+ID0gbmV3IE1hcCgpO1xyXG4gICAgY29uc3QgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlcyA9IFtdO1xyXG4gICAgKF9hID0gbmV3R3JvdXBJbnN0YW5jZS5nZXRHcm91cERlZmluaXRpb24oKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF1eGlsaWFyeUN1cnZlcygpLmZvckVhY2goY3VydmUgPT4ge1xyXG4gICAgICAgIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoY3VydmUpKSB7XHJcbiAgICAgICAgICAgIC8vIGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZU1hcC5zZXQoY3VydmUuZ2V0S2V5KCksIGN1cnZlKTtcclxuICAgICAgICAgICAgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlcy5wdXNoKGN1cnZlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IG5ld1BhdGggPSBbXTtcclxuICAgIGZvciAoY29uc3QgeyBjdXJ2ZSwgcmV2ZXJzZWQgfSBvZiBwYXRoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IGN1cnZlLmdldFN0YXJ0VmVydGV4KCkuZ2V0UG9pbnQoKTtcclxuICAgICAgICBjb25zdCBlbmRQb2ludCA9IGN1cnZlLmdldEVuZFZlcnRleCgpLmdldFBvaW50KCk7XHJcbiAgICAgICAgY29uc3QgbmV3Q3VydmVJbmRleCA9IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZXMuZmluZEluZGV4KG5ld0N1cnZlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U3RhcnRQb2ludCA9IG5ld0N1cnZlLmdldFN0YXJ0VmVydGV4KCkuZ2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgY29uc3QgbmV3RW5kUG9pbnQgPSBuZXdDdXJ2ZS5nZXRFbmRWZXJ0ZXgoKS5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICBpZiAobmV3U3RhcnRQb2ludC5pc0VxdWFsKHN0YXJ0UG9pbnQpICYmIG5ld0VuZFBvaW50LmlzRXF1YWwoZW5kUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKG5ld0N1cnZlSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBuZXdQYXRoLnB1c2goeyBjdXJ2ZTogYXV4aWxpYXJ5Qm91bmRlZEN1cnZlc1tuZXdDdXJ2ZUluZGV4XSwgcmV2ZXJzZWQgfSk7XHJcbiAgICAgICAgICAgIGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZXMuc3BsaWNlKG5ld0N1cnZlSW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3UGF0aDtcclxufVxyXG4vLyBsZXQgY3VycmVudExlbmd0aDogbnVtYmVyID0gMDtcclxuLy8gbGV0IGNvbXBvbmVudEluZGV4OiBudW1iZXIgPSAxO1xyXG4vLyBsZXQgY29tcG9uZW50UG9zaXRpb25MZW5ndGggPSBjb21wb25lbnRJbmRleCAqIGF1dG9tYXRpY0ludGVydmFsO1xyXG4vLyBsZXQgYmFzZVRyYW5zZm9ybUludmVyc2U6IEtNYXRyaXg0ID0gZHVtbXlNYXRyaXg0O1xyXG4vLyBmb3IgKGxldCBrID0gMDsgayA8IHBhdGhQb2ludFBvc2VzLmxlbmd0aDsgaysrKSB7XHJcbi8vICAgICBjb25zdCBwYXRoUG9pbnRQb3NlID0gcGF0aFBvaW50UG9zZXNba107XHJcbi8vICAgICBsZXQgY29tcG9uZW50VHJhbnNmb3JtOiBLTWF0cml4NCB8IHVuZGVmaW5lZDtcclxuLy8gICAgIGNvbnN0IHBhdGhOb3JtYWw6IEtWZWN0b3IzZCA9IHBhdGhQb2ludFBvc2Uubm9ybWFsIHx8IGR1bW15VmVjdG9yM2Q7XHJcbi8vICAgICBpZiAoayA9PT0gMCkge1xyXG4vLyAgICAgICAgIGNvbXBvbmVudFRyYW5zZm9ybSA9IEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KHBhdGhQb2ludFBvc2UucG9pbnQueCwgcGF0aFBvaW50UG9zZS5wb2ludC55LCBwYXRoUG9pbnRQb3NlLnBvaW50LnopXHJcbi8vICAgICAgICAgICAgIC5tdWx0aXBsaWVkKEdlb21MaWIuY3JlYXRlQWxpZ25DQ1NNYXRyaXg0KHBhdGhQb2ludFBvc2UuZGlyZWN0aW9uLCBwYXRoTm9ybWFsLmNyb3NzKHBhdGhQb2ludFBvc2UuZGlyZWN0aW9uKS5ub3JtYWxpemVkKCksIHBhdGhOb3JtYWwsIGR1bW15UG9pbnQzZCkpXHJcbi8vICAgICAgICAgICAgIC5tdWx0aXBsaWVkKHNjYWxlTWF0cml4KTtcclxuLy8gICAgICAgICBiYXNlVHJhbnNmb3JtSW52ZXJzZSA9IGNvbXBvbmVudFRyYW5zZm9ybS5pbnZlcnNlZCgpO1xyXG4vLyAgICAgICAgIGNvbXBvbmVudFRyYW5zZm9ybXMucHVzaChjb21wb25lbnRUcmFuc2Zvcm0ubXVsdGlwbGllZChyZXNldE1hdHJpeCkpO1xyXG4vLyAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICBjb25zdCBwcmV2RGlzY3JldGVTZWdtZW50ID0gcGF0aFBvaW50UG9zZXNbayAtIDFdO1xyXG4vLyAgICAgICAgIGNvbnN0IHNlZ21lbnRMZW5ndGggPSBwcmV2RGlzY3JldGVTZWdtZW50LnBvaW50LmRpc3RhbmNlVG8ocGF0aFBvaW50UG9zZS5wb2ludCk7XHJcbi8vICAgICAgICAgd2hpbGUgKGNvbXBvbmVudEluZGV4IDwgdGhpcy5wYXRoQXJyYXlQYXJhbXMuY291bnQgJiYgY29tcG9uZW50UG9zaXRpb25MZW5ndGggPiBjdXJyZW50TGVuZ3RoICYmIGNvbXBvbmVudFBvc2l0aW9uTGVuZ3RoIDw9IChjdXJyZW50TGVuZ3RoICsgc2VnbWVudExlbmd0aCkpIHtcclxuLy8gICAgICAgICAgICAgY29uc3Qgc2VnbWVudERpcmVjdGlvbiA9IHBhdGhQb2ludFBvc2UucG9pbnQuc3VidHJhY3RlZChwcmV2RGlzY3JldGVTZWdtZW50LnBvaW50KS5ub3JtYWxpemVkKCk7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFBvc2l0aW9uID0gcHJldkRpc2NyZXRlU2VnbWVudC5wb2ludC5hZGRlZChzZWdtZW50RGlyZWN0aW9uLm11bHRpcGxpZWQoY29tcG9uZW50UG9zaXRpb25MZW5ndGggLSBjdXJyZW50TGVuZ3RoKSk7XHJcbi8vICAgICAgICAgICAgIGNvbXBvbmVudFRyYW5zZm9ybSA9IEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KGNvbXBvbmVudFBvc2l0aW9uLngsIGNvbXBvbmVudFBvc2l0aW9uLnksIGNvbXBvbmVudFBvc2l0aW9uLnopXHJcbi8vICAgICAgICAgICAgICAgICAubXVsdGlwbGllZChHZW9tTGliLmNyZWF0ZUFsaWduQ0NTTWF0cml4NChwYXRoUG9pbnRQb3NlLmRpcmVjdGlvbiwgcGF0aE5vcm1hbC5jcm9zcyhwYXRoUG9pbnRQb3NlLmRpcmVjdGlvbikubm9ybWFsaXplZCgpLCBwYXRoTm9ybWFsLCBkdW1teVBvaW50M2QpKVxyXG4vLyAgICAgICAgICAgICAgICAgLm11bHRpcGxpZWQoc2NhbGVNYXRyaXgpO1xyXG4vLyAgICAgICAgICAgICAvLyBjb21wb25lbnRQb3NpdGlvbnMucHVzaCgpO1xyXG4vLyAgICAgICAgICAgICBjb21wb25lbnRUcmFuc2Zvcm1zLnB1c2goY29tcG9uZW50VHJhbnNmb3JtLm11bHRpcGxpZWQoYmFzZVRyYW5zZm9ybUludmVyc2UpKTtcclxuLy8gICAgICAgICAgICAgY29tcG9uZW50SW5kZXgrKztcclxuLy8gICAgICAgICAgICAgY29tcG9uZW50UG9zaXRpb25MZW5ndGggPSBjb21wb25lbnRJbmRleCAqIGF1dG9tYXRpY0ludGVydmFsO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBjdXJyZW50TGVuZ3RoICs9IHNlZ21lbnRMZW5ndGg7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuLy8gaWYgKGNvbXBvbmVudEluZGV4IDwgdGhpcy5jb3VudCkge1xyXG4vLyAgICAgY29uc3QgY29tcG9uZW50SW5kZXhJblBhdGggPSBjb21wb25lbnRJbmRleCAtIDE7XHJcbi8vICAgICBjb25zdCB0YWlsTGVuZ3RoOiBudW1iZXIgPSB0b3RhbExlbmd0aCAtIChjb21wb25lbnRJbmRleCAtIDEpICogdGhpcy5pbnRlcnZhbDtcclxuLy8gICAgIGNvbnN0IHRhaWxEaXJlY3Rpb24gPSBhbGxEaXNjcmV0ZVBvaW50c1thbGxEaXNjcmV0ZVBvaW50cy5sZW5ndGggLSAxXS5zdWJ0cmFjdGVkKGFsbERpc2NyZXRlUG9pbnRzW2FsbERpc2NyZXRlUG9pbnRzLmxlbmd0aCAtIDJdKS5ub3JtYWxpemVkKCk7XHJcbi8vICAgICBjb21wb25lbnRQb3NpdGlvbkxlbmd0aCA9IChjb21wb25lbnRJbmRleCAtIGNvbXBvbmVudEluZGV4SW5QYXRoKSAqIHRoaXMuaW50ZXJ2YWw7XHJcbi8vICAgICBjb21wb25lbnRQb3NpdGlvbnMucHVzaChhbGxEaXNjcmV0ZVBvaW50c1thbGxEaXNjcmV0ZVBvaW50cy5sZW5ndGggLSAxXS5hZGRlZCh0YWlsRGlyZWN0aW9uLm11bHRpcGxpZWQoY29tcG9uZW50UG9zaXRpb25MZW5ndGggLSB0YWlsTGVuZ3RoKSkpO1xyXG4vLyAgICAgY29tcG9uZW50SW5kZXgrKztcclxuLy8gICAgIGNvbXBvbmVudFBvc2l0aW9uTGVuZ3RoID0gKGNvbXBvbmVudEluZGV4IC0gY29tcG9uZW50SW5kZXhJblBhdGgpICogdGhpcy5pbnRlcnZhbDtcclxuLy8gICAgIHdoaWxlIChjb21wb25lbnRJbmRleCA8IHRoaXMuY291bnQpIHtcclxuLy8gICAgICAgICBjb21wb25lbnRQb3NpdGlvbnMucHVzaChjb21wb25lbnRQb3NpdGlvbnNbY29tcG9uZW50UG9zaXRpb25zLmxlbmd0aCAtIDFdLmFkZGVkKHRhaWxEaXJlY3Rpb24ubXVsdGlwbGllZChjb21wb25lbnRQb3NpdGlvbkxlbmd0aCkpKTtcclxuLy8gICAgICAgICBjb21wb25lbnRJbmRleCsrO1xyXG4vLyAgICAgICAgIGNvbXBvbmVudFBvc2l0aW9uTGVuZ3RoID0gKGNvbXBvbmVudEluZGV4IC0gY29tcG9uZW50SW5kZXhJblBhdGgpICogdGhpcy5pbnRlcnZhbDtcclxuLy8gICAgIH1cclxuLy8gfVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgcGF0aEFycmF5UGFyYW1zRWRpdFRvb2wgfSBmcm9tIFwiLi9QYXRoQXJyYXlQYXJhbXNFZGl0VG9vbFwiO1xyXG5pbXBvcnQgeyBwYXRoQXJyYXlUb29sIH0gZnJvbSBcIi4vUGF0aEFycmF5VG9vbFwiO1xyXG5pbXBvcnQgeyBpc0tHcm91cEluc3RhbmNlIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuY29uc3QgcGx1Z2luVUkgPSBhcHAuZ2V0UGx1Z2luVUkoKTtcclxucGx1Z2luVUkucmVzaXplKDI0MCwgNzAwKTtcclxucGx1Z2luVUkubW91bnQoKTtcclxubGV0IGFjdGl2YXRlZEN1c3RvbVRvb2w7XHJcbmZ1bmN0aW9uIG9uVUlNZXNzYWdlKGRhdGEpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gJ2FjdGl2YXRlUGF0aEFycmF5Jykge1xyXG4gICAgICAgICAgICAgICAgYXBwLmFjdGl2YXRlQ3VzdG9tVG9vbChwYXRoQXJyYXlUb29sLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZWRDdXN0b21Ub29sID0gcGF0aEFycmF5VG9vbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09ICdkZUFjdGl2YXRlUGF0aEFycmF5Jykge1xyXG4gICAgICAgICAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKHBhdGhBcnJheVRvb2wpO1xyXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkQ3VzdG9tVG9vbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09ICdwYXRoQXJyYXlQYXJhbXNDaGFuZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZhdGVkQ3VzdG9tVG9vbCAhPT0gcGF0aEFycmF5UGFyYW1zRWRpdFRvb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAuYWN0aXZhdGVDdXN0b21Ub29sKHBhdGhBcnJheVBhcmFtc0VkaXRUb29sLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkQ3VzdG9tVG9vbCA9IHBhdGhBcnJheVBhcmFtc0VkaXRUb29sO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNDaGFuZ2VSZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3ViVHlwZSA9PT0gJ2ludGVydmFsQ2hhbmdlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNDaGFuZ2VSZXN1bHQgPSB5aWVsZCBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC51cGRhdGVJbnRlcnZhbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3ViVHlwZSA9PT0gJ2NvdW50Q2hhbmdlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNDaGFuZ2VSZXN1bHQgPSB5aWVsZCBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC51cGRhdGVDb3VudCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3ViVHlwZSA9PT0gJ3NjYWxlQ2hhbmdlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNDaGFuZ2VSZXN1bHQgPSB5aWVsZCBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC51cGRhdGVTY2FsZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3ViVHlwZSA9PT0gJ3BhdGhBeGlzQ2hhbmdlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNDaGFuZ2VSZXN1bHQgPSB5aWVsZCBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC51cGRhdGVQYXRoQXhpcyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3ViVHlwZSA9PT0gJ25vcm1hbEF4aXNDaGFuZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc0NoYW5nZVJlc3VsdCA9IHlpZWxkIHBhdGhBcnJheVBhcmFtc0VkaXRUb29sLnVwZGF0ZU5vcm1hbEF4aXModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zQ2hhbmdlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpblVJLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhdGhBcnJheVBhcmFtc0NoYW5nZWQnLCBwYXRoQXJyYXlQYXJhbXM6IHBhdGhBcnJheVBhcmFtc0VkaXRUb29sLmdldFBhdGhBcnJheVBhcmFtcygpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhcHAuZGVhY3RpdmF0ZUN1c3RvbVRvb2wocGF0aEFycmF5UGFyYW1zRWRpdFRvb2wsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZWRDdXN0b21Ub29sID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfSksIDE1MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICBjbG9zZVBsdWdpbigpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbnBsdWdpblVJLm9uTWVzc2FnZShvblVJTWVzc2FnZSk7XHJcbmNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuc2VsZWN0aW9uLmFkZE9ic2VydmVyKHtcclxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGFjdGl2YXRlZEN1c3RvbVRvb2wgIT09IHBhdGhBcnJheVBhcmFtc0VkaXRUb29sKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFsbEVudGl0aWVzID0gc2VsZWN0aW9uLmdldEFsbEVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgIGlmIChhbGxFbnRpdGllcy5sZW5ndGggPT09IDEgJiYgaXNLR3JvdXBJbnN0YW5jZShhbGxFbnRpdGllc1swXSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUGF0aEFycmF5TW9kZWwgPSBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC5zZXRNb2RlbChhbGxFbnRpdGllc1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNQYXRoQXJyYXlNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpblVJLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhdGhBcnJheVBhcmFtc0NoYW5nZWQnLCBwYXRoQXJyYXlQYXJhbXM6IHBhdGhBcnJheVBhcmFtc0VkaXRUb29sLmdldFBhdGhBcnJheVBhcmFtcygpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC5jbGVhck1vZGVsKCk7XHJcbiAgICAgICAgICAgIHBsdWdpblVJLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhdGhBcnJheVBhcmFtc0NoYW5nZWQnLCBwYXRoQXJyYXlQYXJhbXM6IHVuZGVmaW5lZCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiBvblBsdWdpblN0YXJ0VXAoKSB7XHJcbiAgICBjb25zdCBhbGxFbnRpdGllcyA9IHNlbGVjdGlvbi5nZXRBbGxFbnRpdGllcygpO1xyXG4gICAgaWYgKGFsbEVudGl0aWVzLmxlbmd0aCA9PT0gMSAmJiBpc0tHcm91cEluc3RhbmNlKGFsbEVudGl0aWVzWzBdKSkge1xyXG4gICAgICAgIGNvbnN0IGlzUGF0aEFycmF5TW9kZWwgPSBwYXRoQXJyYXlQYXJhbXNFZGl0VG9vbC5zZXRNb2RlbChhbGxFbnRpdGllc1swXSk7XHJcbiAgICAgICAgaWYgKGlzUGF0aEFycmF5TW9kZWwpIHtcclxuICAgICAgICAgICAgcGx1Z2luVUkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncGF0aEFycmF5UGFyYW1zQ2hhbmdlZCcsIHBhdGhBcnJheVBhcmFtczogcGF0aEFycmF5UGFyYW1zRWRpdFRvb2wuZ2V0UGF0aEFycmF5UGFyYW1zKCkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm9uUGx1Z2luU3RhcnRVcCgpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=