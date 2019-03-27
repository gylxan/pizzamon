import React from 'react';

const INTERVAL = 100;
const DEFAULT_WAIT_INTERVAL = 6000;

/**
 * Entscheidomat
 */
export default class Entscheidomat extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentOption: this.props.startOption || this.props.options[0],
			finished     : false
		};
		this.timerId = null;
		this.interval = 0;

	}

	componentDidMount() {
		// When autostart is active, start randomize now!
		if (this.props.autoStart) {
			this.randomize();
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// When entscheidomat hasn't been started, and start flag changes, start it now
		if (!prevProps.start && this.props.start) {
			this.randomize();
		}
	}

	/**
	 * Get a random option
	 * @return {*}
	 */
	getRandomOption() {
		const randomOption = this.props.options[Math.floor(Math.random() * this.props.options.length)];
		if (this.state.currentOption === randomOption && this.props.options.length !== 1) {
			return this.getRandomOption();
		}
		return randomOption;
	}

	randomize() {
		// Don't start timer again, when it has already been started
		if (this.timerId) {
			return;
		}
		this.setState({
			finished: false
		});
		this.timerId = window.setInterval(() => {
			// Get a new randm option
			const newCurrentOption = this.getRandomOption();
			this.setState({ currentOption: newCurrentOption });
			// Calculate new interval to complete interval and check time is over
			this.interval += INTERVAL;
			if (this.interval >= this.props.interval) {
				// Call onEnd with current Option
				this.props.onEnd(newCurrentOption);
				window.clearInterval(this.timerId);
				this.interval = 0;
				// Set finished
				this.setState({
					finished: true
				});

			}
		}, INTERVAL);
	}

	render() {
		return <span className={'Entscheidomat' + (this.state.finished && ' finished')}>{this.state.currentOption}</span>;
	}
}

Entscheidomat.defaultProps = {
	interval : DEFAULT_WAIT_INTERVAL,
	start    : false,
	autoStart: false
};