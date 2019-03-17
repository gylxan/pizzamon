import React from 'react';
import './DarkModal.css';
import { Modal } from 'reactstrap';

/**
 * Modal in dark theme
 */
export default class DarkModal extends React.Component {
	render() {
		return <Modal {...this.props}>
			{this.props.children}
		</Modal>;
	}
}