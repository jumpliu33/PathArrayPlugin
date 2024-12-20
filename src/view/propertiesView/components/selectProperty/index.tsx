import * as React from 'react'
import "./index.css";
import { Select, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { Axis } from '../../types';

interface Props {
    title: string;
    value: string;
    disabled?: boolean;
    options: DefaultOptionType[];
    onChange?: (value: Axis) => void;
}

interface State {
}

export default class SelectProperty extends React.Component<Props, State> {
    state: Readonly<State> = {};

    private onChange = (value: Axis) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
            this.setState({ inputtingValue: undefined });
        }
    }

    render() {
        const { title, value, disabled, options } = this.props;
        return (
            <div className='select-property-wrapper'>
                <div className='select-property-title'>{title}</div>
                <Space>
                    <Select<string>
                        defaultValue={Axis.X}
                        value={value}
                        style={{ width: 90 }}
                        disabled={disabled}
                        onChange={this.onChange}
                        options={options}
                    />
                </Space>
            </div>
        )
    }
}