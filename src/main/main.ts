import { pathArrayParamsEditTool } from "./PathArrayParamsEditTool";
import { pathArrayTool } from "./PathArrayTool";
import { isKGroupInstance } from "./utils";

const pluginUI = app.getPluginUI();
pluginUI.resize(240, 700);
pluginUI.mount();

let activatedCustomTool: KTool | undefined;

async function onUIMessage(data: any) {
    try {
        if (data.type === 'activatePathArray') {
            app.activateCustomTool(pathArrayTool, false);
            activatedCustomTool = pathArrayTool;
        } else if (data.type === 'deActivatePathArray') {
            app.deactivateCustomTool(pathArrayTool);
            activatedCustomTool = undefined;
        } else if (data.type === 'pathArrayParamsChange') {
            if (activatedCustomTool !== pathArrayParamsEditTool) {
                app.activateCustomTool(pathArrayParamsEditTool, false);
                activatedCustomTool = pathArrayParamsEditTool;
            }

            setTimeout(async () => {
                const value = data.value;
                let paramsChangeResult: boolean | undefined;
                if (data.subType === 'intervalChange') {
                    paramsChangeResult = await pathArrayParamsEditTool.updateInterval(value);
                } else if (data.subType === 'countChange') {
                    paramsChangeResult = await pathArrayParamsEditTool.updateCount(value);
                } else if (data.subType === 'scaleChange') {
                    paramsChangeResult = await pathArrayParamsEditTool.updateScale(value);
                } else if (data.subType === 'pathAxisChange') {
                    paramsChangeResult = await pathArrayParamsEditTool.updatePathAxis(value);
                } else if (data.subType === 'normalAxisChange') {
                    paramsChangeResult = await pathArrayParamsEditTool.updateNormalAxis(value);
                }
                if (paramsChangeResult) {
                    pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: pathArrayParamsEditTool.getPathArrayParams() });
                }
                app.deactivateCustomTool(pathArrayParamsEditTool, false);
                activatedCustomTool = undefined;
            }, 150)

        }
    } catch (error) {
        console.error(error);
        closePlugin();
    }
}

pluginUI.onMessage(onUIMessage);

const selection = app.getSelection();
selection.addObserver({
    onSelectionChange: () => {
        if (activatedCustomTool !== pathArrayParamsEditTool) {
            const allEntities = selection.getAllEntities();
            if (allEntities.length === 1 && isKGroupInstance(allEntities[0])) {
                const isPathArrayModel = pathArrayParamsEditTool.setModel(allEntities[0]);
                if (isPathArrayModel) {
                    pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: pathArrayParamsEditTool.getPathArrayParams() });
                    return;
                }
            }
            pathArrayParamsEditTool.clearModel();
            pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: undefined });
        }
    }
});

function onPluginStartUp() {
    const allEntities = selection.getAllEntities();
    if (allEntities.length === 1 && isKGroupInstance(allEntities[0])) {
        const isPathArrayModel = pathArrayParamsEditTool.setModel(allEntities[0]);
        if (isPathArrayModel) {
            pluginUI.postMessage({ type: 'pathArrayParamsChanged', pathArrayParams: pathArrayParamsEditTool.getPathArrayParams() });
        }
    }
}
onPluginStartUp();