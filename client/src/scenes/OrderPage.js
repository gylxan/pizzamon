import React from 'react';
import axios from 'axios';
import { Alert, Button, Col, Container, FormFeedback, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Input from 'reactstrap/es/Input';
import './OrderPage.css';
import Overlay from '../components/Overlay';
import OrderSiteControl from './OrderSiteControl';

import Select from 'react-select';


export const MAXIMUM_MENU = 5;
export const MINIMUM_MENU = 3;
export const MINIMUM_MENU_PRICE = 21;

const reactSelectStyles = {
	control: (base, state) => ({
		...base,
		boxShadow  : state.isFocused
			? '0 0 0 0.2rem rgba(0,123,255,.25)'
			: base.boxShadow,
		borderColor: state.isFocused
			? '#80bdff'
			: base.borderColor,
		color      : '#495057'
	})
};

export default class OrderPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			order                 : null,
			newName               : '',
			newArticle            : null,
			generalError          : null,
			newNameError          : null,
			showFinishOrderWarning: false,
			loading               : true,
			articles              : []
		};
		this.newNameInputRef = React.createRef();
	}

	componentDidMount() {
		if (this.state.order === null && this.props.match.params.name) {
			this.setState({
				loading: true
			});
			Promise.all([
				this.loadOrder(),
				this.loadRestaurantArticles()
			]).then(() => {
				this.setState({
					loading: false
				});
			});
		}
	}

	loadRestaurantArticles() {
		return axios.get('/api/restaurants/World of Pizza')
			.then((response) => {
				const naturalSortCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
				this.setState({
					articles  : response.data.articles,
					newArticle: this.mapArticleToSelectOption(response.data.articles[0])
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.message
				});
			});
	}

	loadOrder() {
		return axios.get('/api/orders/' + this.props.match.params.name)
			.then((response) => {
				this.setState({
					order: response.data
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.message
				});
			});
	}

	addArticleToOrder() {
		axios.post('/api/orders/' + this.props.match.params.name + '/articles', { customer: this.state.newName, article: this.state.newArticle.value })
			.then((response) => {
				this.loadOrder().then(() => {
					this.setState({
						newName     : '',
						newArticle  : this.mapArticleToSelectOption(this.state.articles[0]),
						newNameError: null
					}, () => {
						this.newNameInputRef.current.focus();
					});
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.response.data.error
				});
			});
	}

	handleBackClick = () => {
		this.props.history.push('/');
	};

	handleOrderClick = () => {
		if (!this.state.showFinishOrderWarning) {
			this.setState({
				showFinishOrderWarning: true
			});
			return;
		}
		this.setState({
			showFinishOrderWarning: false
		});
		const order = { ...this.state.order };
		order.finished = true;
		axios.put('/api/orders/' + this.state.order.name, order)
			.then((response) => {
				this.setState({
					order: order
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.response.data.error
				});
			});
	};

	handleNewNameChange = (event) => {
		event.preventDefault();
		this.setState({
			newName: event.currentTarget.value
		});
	};
	handleNewArticleChange = (selectOption) => {
		this.setState({
			newArticle: selectOption
		});
	};

	handleAddArticleClick = () => {
		if (this.state.newName.trim() === '') {
			this.setState({
				newNameError: 'Der Name ist leer'
			});
			return;
		}
		// Check a customer with the same name doesn't exist
		if (this.state.order.articles.filter(article => article.customer.toLowerCase() === this.state.newName.toLowerCase()).length !== 0) {
			this.setState({
				newNameError: 'Der Name existiert bereits in der Bestellung'
			});
			return;
		}
		this.addArticleToOrder();
	};

	handleDeleteArticleOfCustomerClick = (customer) => {
		return axios.delete('/api/orders/' + this.state.order.name + '/articles/' + customer)
			.then((response) => {
				const order = this.state.order;
				order.articles = order.articles.filter((article) => article.customer !== customer);
				this.setState({
					order: order
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.response.data.error
				});
			});
	};

	handleEditArticleOfCustomerClick = (article) => {
		this.handleDeleteArticleOfCustomerClick(article.customer).then(() => {
			this.setState({
				newName   : article.customer,
				newArticle: this.mapArticleToSelectOption(article)
			}, () => {
				this.newNameInputRef.current.focus();
			});
		});
	};

	handlePrintClick = () => {
		window.print();
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

	mapArticleToSelectOption = (article) => {
		return { 'value': article.name, 'label': article.name };
	};

	renderOrderSummaryTable() {
		const costsSummary = {};
		this.state.order.articles.map((article) => {
			// Add article to costs summary
			if (costsSummary[article.article] === void 0) {
				costsSummary[article.article] = 0;
			}
			costsSummary[article.article] += 1;
		});
		return <Table style={{ width: '50%' }}>
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
		</Table>;
	}

	render() {

		const costsAndRest = this.state.order !== null ? this.getCostsAndRest() : { rest: 0, costs: 0 };
		const rest = MINIMUM_MENU - costsAndRest.rest;
		const selectArticleOptions = this.state.articles.map(this.mapArticleToSelectOption);

		let counter = 1;
		return <Container className='OrderPage'>
			{this.state.generalError && <Alert color={'danger'}>{this.state.generalError}</Alert>}
			<Overlay show={this.state.loading} />
			{!this.state.loading
				? (<>
					<Table>
						<thead className={'thead-light'}>
						<tr>
							<th className={'fitted'} />
							<th className={'fitted'}>#</th>
							<th>Name</th>
							<th>Artikel</th>
							<th className={'fitted'}>Preis</th>
							{this.state.order.finished && <th>Bezahlt</th>}
						</tr>
						</thead>
						<tbody>
						{this.state.order.articles.map((article) => {
							const cost = costsAndRest.costs / this.state.order.articles.length;
							return <tr key={article.customer}>
								<td className={'fitted  '}>
									{!this.state.order.finished &&
									 <>
										 <Button size={'sm'} color={'primary'}
											 onClick={() => this.handleEditArticleOfCustomerClick(article)}>
											 <i className={'fa fa-pencil'} />
										 </Button>{' '}
										 <Button size={'sm'} color={'danger'} onClick={() => this.handleDeleteArticleOfCustomerClick(article.customer)}>
											 <i className={'fa fa-trash'} /></Button>
									 </>
									}
								</td>
								<th scope={'row'} className={'fitted'}>{counter++}</th>
								<td>{article.customer}</td>
								<td>{article.article}</td>
								<td>{parseFloat((cost * 100) / 100).toFixed(2) + '€'}</td>
								{this.state.order.finished && <td className={'fitted'}>
									<div className={'Box'} />
								</td>}
							</tr>;
						})}
						{!this.state.order.finished
							? <tr>
								<td colSpan={5}>
									<Row>
										<Col sm={'5'}>
											<Input placeholder='Max Pizzamann' onChange={this.handleNewNameChange} value={this.state.newName}
												name='name' invalid={this.state.newNameError !== null} innerRef={this.newNameInputRef}
												autoComplete={'given-name'} />
											<FormFeedback>{this.state.newNameError}</FormFeedback>
										</Col>
										<Col sm={'5'}>
											<Select options={selectArticleOptions} isClearable={false} isRTL={false} name='article'
												onChange={this.handleNewArticleChange}
												noOptionsMessage={() => `Kein Artikel gefunden`}
												value={this.state.newArticle} styles={reactSelectStyles} />
										</Col>
										<Col sm={'2'} className={'text-right'}>
											<Button color={'primary'} onClick={this.handleAddArticleClick}><i className={'fa fa-plus'} /></Button>
										</Col>
									</Row>
								</td>
							</tr>
							:
							<tr>
								<th scope={'row'} colSpan={'4'} className={'text-right'}>Gesamt</th>
								<td colSpan={'1'} className={'text-right'}>
									{parseFloat((costsAndRest.costs * 100) / 100).toFixed(2) + '€'}
								</td>
								<td className={'fitted'} />
							</tr>
						}
						</tbody>
					</Table>
					{this.state.order.finished && this.renderOrderSummaryTable()}
					<OrderSiteControl isOrderfinished={this.state.order.finished} onBackClick={this.handleBackClick}
						onPrintClick={this.handlePrintClick} onOrderClick={this.handleOrderClick} />

					<Modal isOpen={this.state.showFinishOrderWarning}>
						<ModalHeader>
							Bestellung abschließen
						</ModalHeader>
						<ModalBody>
							Soll die Bestellung wirklich abgeschlossen werden?
						</ModalBody>
						<ModalFooter>
							<Button color='primary' onClick={this.handleOrderClick}>Bestellen</Button>{' '}
							<Button color='secondary' onClick={() => {
								this.setState({
									showFinishOrderWarning: false
								});
							}}>Abbrechen</Button>
						</ModalFooter>
					</Modal>
				</>)
				: null}
		</Container>;

	}
};