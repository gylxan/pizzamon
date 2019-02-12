import React from 'react';
import Order from '../data/Testorder';
import Table from 'reactstrap/es/Table';
import Button from 'reactstrap/es/Button';
import Row from 'reactstrap/es/Row';
import Col from 'reactstrap/es/Col';
import Container from 'reactstrap/es/Container';
import Alert from 'reactstrap/es/Alert';
import articles from '../data/articles';
import Input from 'reactstrap/es/Input';
import { FormFeedback } from 'reactstrap';
import Modal from 'reactstrap/es/Modal';
import ModalHeader from 'reactstrap/es/ModalHeader';
import ModalBody from 'reactstrap/es/ModalBody';
import ModalFooter from 'reactstrap/es/ModalFooter';


const MAXIMUM_MENU = 5;
const MINIMUM_MENU = 3;
const MINIMUM_MENU_PRICE = 21;
export default class OrderPage extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			order                  : Order,
			newName                : '',
			newArticle             : articles[0],
			newNameError           : null,
			showArticleCountWarning: false
		};
	}

	handleBackClick = () => {
		this.props.history.push('/');
	};

	handleOrderClick = () => {
		if (!this.state.order.finished) {
			const costsAndRest = this.getCostsAndRest();
			if (costsAndRest.rest > 0 && !this.state.showArticleCountWarning) {
				this.setState({
					showArticleCountWarning: true
				});
				return;
			}
			if (!this.state.order.finished) {
				const order = this.state.order;
				order.finished = true;
				this.setState({
					order: order
				});
			}
		} else {

		}
	};

	handleNewNameChange = (event) => {
		event.preventDefault();
		this.setState({
			newName: event.currentTarget.value
		});
	};
	handleNewArticleChange = (event) => {
		event.preventDefault();
		this.setState({
			newArticle: event.currentTarget.value
		});
	};

	handleAddArticleClick = () => {
		if (this.state.newName.trim() === '') {
			this.setState({
				newNameError: 'Der Name ist leer'
			});
			return;
		}
		console.log(this.state.newArticle, this.state.newName);
		const order = this.state.order;
		order.articles.push({
			customer: this.state.newName,
			article : this.state.newArticle
		});

		this.setState({
			order       : order,
			newName     : '',
			newArticle  : articles[0],
			newNameError: null
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

		const costs = this.getCostsAndRest();
		const rest = MINIMUM_MENU - costs.rest;

		let counter = 1;
		return <Container className='OrderPage'>
			{this.state.order.finished && <Alert color={'primary'}>Die Bestellung ist bereits abgeschlossen!</Alert>}
			<Table>
				<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Artikel</th>
					<th>Preis</th>
				</tr>
				</thead>
				<tbody>
				{this.state.order.articles.map((article) => {
					const cost = costs.costs / this.state.order.articles.length;
					return <tr key={article.customer}>
						<th scope={'row'}>{counter++}</th>
						<td>{article.customer}</td>
						<td>{article.article}</td>
						<td>{parseFloat((cost * 100) / 100).toFixed(2) + '€'}</td>
					</tr>;
				})}
				{!this.state.order.finished &&
				 <tr>
					 <td colSpan={4}>
						 <Row>
							 <Col sm={'5'}>
								 <Input placeholder='Name' onChange={this.handleNewNameChange} value={this.state.newName}
									 invalid={this.state.newNameError !== null} />
								 <FormFeedback>{this.state.newNameError}</FormFeedback>
							 </Col>
							 <Col sm={'5'}>
								 <Input type='select' onChange={this.handleNewArticleChange} value={this.state.newArticle}>
									 {articles.map(article => <option value={article}>{article}</option>)}
								 </Input>
							 </Col>
							 <Col sm={'2'}>
								 <Button color={'primary'} onClick={this.handleAddArticleClick}>Hinzufügen</Button>
							 </Col>
						 </Row>
					 </td>
				 </tr>
				}
				</tbody>
			</Table>
			<Container>
				<Row>
					<Col sm={'9'} />
					<Col sm={'3'}>
						<Button color={'secondary'} onClick={this.handleBackClick}>Zurück</Button>{' '}
						<Button color={'primary'} onClick={this.handleOrderClick}>{this.state.order.finished ? 'Drucken!' : 'Bestellen!'}</Button>
					</Col>
				</Row>
			</Container>

			<Modal isOpen={this.state.showArticleCountWarning}>
				<ModalHeader>
					Zu wenig Bestellungen
				</ModalHeader>
				<ModalBody>
					Es wurden zu wenig Bestellungen gemacht um alle in Menüs zu packen.
					Es {rest !== 1 ? 'bleiben' : 'bleibt'} {rest} Artikel offen.
					Trotzdem bestellen?
				</ModalBody>
				<ModalFooter>
					<Button color='primary' onClick={this.handleOrderClick}>Bestellen</Button>{' '}
					<Button color='secondary' onClick={() => {
						this.setState({
							showArticleCountWarning: false
						});
					}}>Abbrechen</Button>
				</ModalFooter>
			</Modal>
		</Container>;

	}
}