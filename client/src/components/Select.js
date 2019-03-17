import React from 'react';
import ReactSelect from 'react-select';

const reactSelectStyles = {
	control : (base, state) => ({
		...base,
		boxShadow  : state.isFocused
			? '0 0 0 0.2rem rgba(0,123,255,.25)'
			: base.boxShadow,
		borderColor: state.isFocused
			? '#80bdff'
			: base.borderColor,
		color      : '#495057'
	}),
	menuList: (base, state) => ({
		...base,
		color: '#495057'
	})
};
/**
 * React select with dark theme
 */
export default class Select extends React.Component {

	static mapStringToSelectOption = (string) => {
		return { 'value': string, 'label': string };
	};


	render() {
		const { options, ...otherProps } = this.props;
		let optionsToMap = options;
		if (optionsToMap && optionsToMap.length !== 0) {
			if (optionsToMap[0].value === void 0 || optionsToMap[0].label === void 0) {
				optionsToMap = optionsToMap.map((element) => Select.mapStringToSelectOption(element));
			}
		}
		return <ReactSelect {...otherProps} options={optionsToMap} styles={reactSelectStyles} />;
	}
}