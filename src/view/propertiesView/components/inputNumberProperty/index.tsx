import * as React from 'react'
import "./index.css";
import { InputNumber, Space } from 'antd';

interface Props {
    title: string;
    unit: string;
    value: number;
    precision: number;
    min: number;
    max: number;
    disabled?: boolean;
    onChange?: (value: number | null) => void;
}

interface State {
    inputtingValue?: number | null;
}

export default class InputNumberProperty extends React.Component<Props, State> {
    state: Readonly<State> = {};

    private onChange = (value: number | null) => {
        this.setState({ inputtingValue: value });
    }

    private onBlur = () => {
        const { onChange } = this.props;
        const { inputtingValue } = this.state;
        if (onChange && inputtingValue !== undefined) {
            onChange(inputtingValue);
            this.setState({ inputtingValue: undefined });
        }
    }

    private onStep = (value: number, info: { offset: string | number; type: 'up' | 'down'; }) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    }

    render() {
        const { title, value, precision, min, max, disabled } = this.props;
        return (
            <div className='inputNumber-property-wrapper'>
                <div className='inputNumber-property-title'>{title}</div>
                <Space>
                    <InputNumber<number>
                        value={value}
                        defaultValue={1000}
                        precision={precision}
                        min={min}
                        max={max}
                        disabled={disabled}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        onPressEnter={this.onBlur}
                        onStep={this.onStep}
                    />
                </Space>
            </div>
        )
    }
}