import React from 'react';
	import './Checkbox.css';
export default class Checkbox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			checked: false
		};
	}

	handleClick = (event) => {
		const newCheckedState = !this.state.checked;
		this.setState({
			checked: newCheckedState
		});
		if(this.props.onClick) {
			this.props.onClick(event, newCheckedState);
		}
	};

	render() {
		const { className, ...otherProps } = this.props;
		let classes = 'Checkbox fa fa-lg ' + (this.state.checked ? 'fa-check-square-o checked' : 'fa-square-o unchecked')
		              + (className ? (' ' + className) : '');

		return <i {...otherProps} className={classes} onClick={this.handleClick}/>;
	}
}