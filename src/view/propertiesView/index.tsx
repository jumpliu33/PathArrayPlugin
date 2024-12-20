import * as React from 'react'
import "./index.css";
import InputNumberProperty from './components/inputNumberProperty';
import SelectProperty from './components/selectProperty';
import { DefaultOptionType } from 'antd/es/select';
import { Axis, DefaultPathArrayParams, PathArrayParams, PropertyType } from './types';


const AxisOptions: DefaultOptionType[] = [
    { value: Axis.X, label: 'X' },
    { value: Axis.XMinus, label: '-X' },
    { value: Axis.Y, label: 'Y' },
    { value: Axis.YMinus, label: '-Y' },
    { value: Axis.Z, label: 'Z' },
    { value: Axis.ZMinus, label: '-Z' },
]

interface State {
    pathArrayParams?: PathArrayParams;
}

export default class PropertiesView extends React.Component<{}, State> {
    state: Readonly<State> = {};

    componentDidMount(): void {
        window.addEventListener("message", this.onMessage);
    }

    componentWillUnmount(): void {
        window.removeEventListener("message", this.onMessage);
    }

    private onMessage = (event: any) => {
        const messageData = event.data;
        if (messageData.type === 'pathArrayParamsChanged') {
            this.setState({ pathArrayParams: messageData.pathArrayParams });
        }
    }

    private getOnChange = (propertyType: PropertyType) => {
        return (value: number | null | Axis) => {
            if (value !== null) {
                window.parent.postMessage({ type: 'pathArrayParamsChange', subType: `${propertyType}Change`, value }, '*');
            }
        }
    }

    render() {
        const { pathArrayParams = DefaultPathArrayParams } = this.state;
        const { interval, count, scale, pathAxis, normalAxis } = pathArrayParams;
        const disabled = !this.state.pathArrayParams;
        const pathAxisOptions = AxisOptions.filter(option => (option.label as string).indexOf(normalAxis[normalAxis.length - 1]) < 0);
        const normalAxisOptions = AxisOptions.filter(option => (option.label as string).indexOf(pathAxis[pathAxis.length - 1]) < 0);
        return (
            <div className='properties-wrapper'>
                <InputNumberProperty title='间隔' unit='' value={interval.value} precision={2} min={interval.min} max={interval.max} disabled={disabled} onChange={this.getOnChange(PropertyType.Interval)} />
                <InputNumberProperty title='数量' unit='' value={count.value} precision={0} min={count.min} max={count.max} disabled={disabled} onChange={this.getOnChange(PropertyType.Count)} />
                <InputNumberProperty title='缩放' unit='' value={scale.value} precision={0} min={scale.min} max={scale.max} disabled={disabled} onChange={this.getOnChange(PropertyType.Scale)} />
                <SelectProperty title='主轴' value={pathAxis} disabled={disabled} options={pathAxisOptions} onChange={this.getOnChange(PropertyType.PathAxis)} />
                <SelectProperty title='副轴' value={normalAxis} disabled={disabled} options={normalAxisOptions} onChange={this.getOnChange(PropertyType.NormalAxis)} />
            </div>
        )
    }
}