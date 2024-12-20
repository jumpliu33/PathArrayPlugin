import * as React from 'react';
import "./index.css";

interface State {
    active: boolean;
}

export default class ToolView extends React.Component<{}, State> {
    state: Readonly<State> = { active: false };

    componentDidMount(): void {
        window.addEventListener("message", this.onMessage);
    }

    componentWillUnmount(): void {
        window.removeEventListener("message", this.onMessage);
    }

    private onMessage = (event: any) => {
        const messageData = event.data;
        if (messageData.type === 'leavePathArrayTool') {
            this.setState({ active: false });
        }
        console.log(messageData.type);
    }

    private onClick = () => {
        const { active } = this.state;
        if (active) {
            window.parent.postMessage({ type: 'deActivatePathArray' }, '*');
        } else {
            window.parent.postMessage({ type: 'activatePathArray' }, '*');
        }
        console.log('active: ' + !active)
        this.setState({ active: !active });
    }

    render() {
        const { active } = this.state;
        const className = active ? 'button-path-array-active' : 'button button-path-array-normal';
        return <div className="button-wrapper">
            <button className={`button ${className}`} id="path-array" onClick={this.onClick}>路径阵列</button>
        </div>
    }
}

