import React from 'react';
import axios from 'axios';
import { Alert, Button, Col, Container, Row, Table } from 'reactstrap';
import './OrderPrintPage.css';


export const MAXIMUM_MENU = 5;
export const MINIMUM_MENU = 3;
export const MINIMUM_MENU_PRICE = 21;

export default class OrderPrintPage extends React.Component {


	constructor(props) {

		console.log('Order print!');
		super(props);
		this.state = {
			order       : null,
			generalError: null,
			loading     : true,
			inPrintView : false
		};
	}

	componentDidMount() {
		if (this.state.order === null && this.props.match.params.name) {
			this.loadOrder(true);
		}
	}

	loadOrder(setLoadingState) {
		if (setLoadingState) {
			this.setState({
				loading: true
			});
		}
		axios.get('/api/orders/' + this.props.match.params.name)
			.then((response) => {
				this.setState({
					order  : response.data,
					loading: false
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.message
				});
			});
	}

	handleBackClick = () => {
		this.props.history.push(`/order/${this.state.order.name}`);
	};

	handlePrintClick = () => {
		this.setState({
			inPrintView: true
		}, () => {
			window.print();
			// Set back to normal view to let the button appear again
			this.setState({
				inPrintView: false
			});
		});
	};

	getCostsAndRest() {
		let ordersCount = this.state.order.articles.length;
		let costs = 0;
		let rest = ordersCount;
		// Modulo 5


		rest = ordersCount % MAXIMUM_MENU;
		costs += Math.floor(ordersCount / MAXIMUM_MENU) * 30;

		costs += Math.floor(rest / 4) * 26;
		rest = rest % 4;

		costs += Math.floor(rest / MINIMUM_MENU) * MINIMUM_MENU_PRICE;
		rest = rest % MINIMUM_MENU;

		// When we have a rest (1-2 orders left) take the smallest menu!
		if (rest > 0) {
			costs += MINIMUM_MENU_PRICE;
		}
		return { costs: costs, rest: rest };
	}

	render() {

		const costsAndRest = this.state.order !== null ? this.getCostsAndRest() : { rest: 0, costs: 0 };
		let costsSummary = {};

		let counter = 1;
		return <Container className='OrderPrintPage'>
			{this.state.generalError && <Alert color={'danger'}>{this.state.generalError}</Alert>}
			{this.state.loading
				? <Alert color={'primary'}>Lade Bestellung</Alert>
				: (
					<>
						<Table style={{ marginTop: '1rem' }}>
							<thead className={'thead-light'}>
							<tr>
								<th className={'fitted'}>#</th>
								<th>Name</th>
								<th>Artikel</th>
								<th className={'fitted'}>Preis</th>
								<th>Bezahlt</th>
							</tr>
							</thead>
							<tbody>

							{this.state.order.articles.map((article) => {
								const cost = costsAndRest.costs / this.state.order.articles.length;
								// Add article to costs summary
								if (costsSummary[article.article] === void 0) {
									costsSummary[article.article] = 0;
								}
								costsSummary[article.article] += 1;

								return <tr key={article.customer}>
									<th scope={'row'} className={'fitted'}>{counter++}</th>
									<td>{article.customer}</td>
									<td>{article.article}</td>
									<td className={'text-right'}>{parseFloat((cost * 100) / 100).toFixed(2) + '€'}</td>
									<td className={'fitted'} />
								</tr>;
							})}
							<tr>
								<th scope={'row'} colSpan={'3'} className={'text-right'}>Gesamt</th>
								<td colSpan={'1'} className={'text-right'}>
									{parseFloat((costsAndRest.costs * 100) / 100).toFixed(2) + '€'}
								</td>
								<td className={'fitted'} />
							</tr>
							</tbody>
						</Table>

						<Table style={{ width: '50%' }}>
							<thead className={'thead-light'}>
							<tr>
								<th>Anzahl</th>
								<th>Artikel</th>
							</tr>
							</thead>
							<tbody>

							{Object.keys(costsSummary).map((articleName) => {
								return <tr key={articleName}>
									<td>{costsSummary[articleName]}</td>
									<td>{articleName}</td>
								</tr>;
							})}
							</tbody>
						</Table>
						{!this.state.inPrintView &&
						 <Container>
							 <Row>
								 <Col sm={'9'} />
								 <Col sm={'3'}>
									 <Button color={'secondary'} onClick={this.handleBackClick}>Zurück</Button>{' '}
									 <Button color={'primary'} onClick={this.handlePrintClick}>{'Drucken'}</Button>
								 </Col>
							 </Row>
						 </Container>}
					</>)}
		</Container>;

	}
};