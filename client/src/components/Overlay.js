import React from 'react';
import './Overlay.css';
import PizzaLoadingCanvas from './PizzaLoadingCanvas';

export default class Overlay extends React.Component {

	render() {
		return <div className={'Overlay ' + (this.props.show ? 'visible' : 'hidden')}>
			<PizzaLoadingCanvas />
		</div>;
	}
}