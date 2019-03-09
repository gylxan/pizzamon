import React from 'react';


const COOLDOWN = 10;
const SLIZES_COUNT = 8;
const SLIZE_SIZE = 100;
export default class PizzaLoadingCanvas extends React.Component {

	ctx = null;
	interval = null;

	constructor(props) {
		super(props);
		this.element = React.createRef();
	}

	toRadians = (deg) => {
		return deg * Math.PI / 180;
	};

	map = (val, a1, a2, b1, b2) => {
		return b1 + (val - a1) * (b2 - b1) / (a2 - a1);
	};

	componentDidMount() {
		this.interval = window.setInterval(() => {
			this.updateCanvas();
		}, COOLDOWN);
	}

	componentWillUnmount() {
		if(this.interval) {
			window.clearInterval(this.interval)
		}
	}

	updateCanvas() {
		if (this.ctx === null) {
			this.canvas = this.element.current;
			this.ctx = this.canvas.getContext('2d');


			this.width = this.height = this.canvas.height = this.canvas.width = SLIZE_SIZE * 2 + 50;
			this.center = this.height / 2 | 0;

			this.sliceDegree = 360 / SLIZES_COUNT;
			this.sliceRadians = this.toRadians(this.sliceDegree);
			this.progress = 0;
			this.cooldown = 10;
		} else {

			let ctx = this.ctx;
			ctx.clearRect(0, 0, this.width, this.height);

			if (--this.cooldown < 0) this.progress += this.sliceRadians * 0.01 + this.progress * 0.07;

			ctx.save();
			ctx.translate(this.center, this.center);

			for (let i = SLIZES_COUNT - 1; i > 0; i--) {

				let rad;
				if (i === SLIZES_COUNT - 1) {
					let ii = SLIZES_COUNT - 1;


					rad = this.sliceRadians * i + this.progress;

					ctx.strokeStyle = '#FBC02D';
					this.createCheese(ctx, rad, .9, ii, SLIZE_SIZE, this.sliceDegree);
					this.createCheese(ctx, rad, .6, ii, SLIZE_SIZE, this.sliceDegree);
					this.createCheese(ctx, rad, .5, ii, SLIZE_SIZE, this.sliceDegree);
					this.createCheese(ctx, rad, .3, ii, SLIZE_SIZE, this.sliceDegree);

				} else rad = this.sliceRadians * i;

				// border
				ctx.beginPath();
				ctx.lineCap = 'butt';
				ctx.lineWidth = 11;
				ctx.arc(0, 0, SLIZE_SIZE, rad, rad + this.sliceRadians);
				ctx.strokeStyle = '#F57F17';
				ctx.stroke();

				// slice
				let startX = SLIZE_SIZE * Math.cos(rad);
				let startY = SLIZE_SIZE * Math.sin(rad);
				ctx.fillStyle = '#FBC02D';
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(startX, startY);
				ctx.arc(0, 0, SLIZE_SIZE, rad, rad + this.sliceRadians);
				ctx.lineTo(0, 0);
				ctx.closePath();
				ctx.fill();
				ctx.lineWidth = .3;
				ctx.stroke();

				// meat
				let x = SLIZE_SIZE * .65 * Math.cos(rad + this.sliceRadians / 2);
				let y = SLIZE_SIZE * .65 * Math.sin(rad + this.sliceRadians / 2);
				ctx.beginPath();
				ctx.arc(x, y, this.sliceDegree / 6, 0, 2 * Math.PI);
				ctx.fillStyle = '#D84315';
				ctx.fill();

			}

			ctx.restore();

			if (this.progress > this.sliceRadians) {
				ctx.translate(this.center, this.center);
				ctx.rotate(-this.sliceDegree * Math.PI / 180);
				ctx.translate(-this.center, -this.center);

				this.progress = 0;
				this.cooldown = 20;
			}

		}
	}

	createCheese = (ctx, rad, multi, ii, sliceSize, sliceDegree) => {
		let x1 = sliceSize * multi * Math.cos(this.toRadians(ii * sliceDegree) - .2);
		let y1 = sliceSize * multi * Math.sin(this.toRadians(ii * sliceDegree) - .2);
		let x2 = sliceSize * multi * Math.cos(rad + .2);
		let y2 = sliceSize * multi * Math.sin(rad + .2);

		let csx = sliceSize * Math.cos(rad);
		let csy = sliceSize * Math.sin(rad);

		var d = Math.sqrt((x1 - csx) * (x1 - csx) + (y1 - csy) * (y1 - csy));
		ctx.beginPath();
		ctx.lineCap = 'round';

		let percentage = this.map(d, 15, 70, 1.2, 0.2);

		let tx = x1 + (x2 - x1) * percentage;
		let ty = y1 + (y2 - y1) * percentage;
		ctx.moveTo(x1, y1);
		ctx.lineTo(tx, ty);

		tx = x2 + (x1 - x2) * percentage;
		ty = y2 + (y1 - y2) * percentage;
		ctx.moveTo(x2, y2);
		ctx.lineTo(tx, ty);

		ctx.lineWidth = this.map(d, 0, 100, 20, 2);
		ctx.stroke();
	};

	render() {
		return <canvas ref={this.element} className={'PizzaLoadingCanvas'} />;
	}
}