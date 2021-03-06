import React from 'react';
import axios from 'axios';
import { Alert, Button, Col, Container, FormFeedback, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Input from 'reactstrap/es/Input';
import './OrderPage.css';
import Overlay from '../components/Overlay';
import OrderSiteControl from './OrderSiteControl';

import { onEnterKeyPressTriggerCallback } from '../services/utils/EventHandlerUtils';
import OrderSummaryTable from './components/OrderSummaryTable';
import Checkbox from '../components/Checkbox';
import Select from '../components/Select';
import DarkModal from '../components/DarkModal';
import Entscheidomat from '../components/Entscheidomat';
import { PURCHASER_DETERMINATION } from '../services/constants/OrderConstants';


const ORDER_TYPES = {
	PHONE   : 'phone',
	INTERNET: 'internet'
};

/**
 * The Order Page
 */
export default class OrderPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			order                 : null,
			generalError          : null,
			showFinishOrderWarning: false,
			loading               : true,
			restaurant            : null,
			articles              : [],
			articleToEdit         : null,
			edit                  : {
				article : null,
				customer: null,
				error   : null
			},
			create                : {
				article : null,
				customer: null,
				error   : null
			},
			orderType             : ORDER_TYPES.INTERNET,
			costs                 : 0
		};
		this.createCustomerInputRef = React.createRef();
		this.editCustomerInputRef = React.createRef();
	}

	componentDidMount() {
		// When the current order is null and not loaded yet, but is set in the query params -> load it
		if (this.state.order === null && this.props.match.params.name) {
			this.setState({
				loading: true
			});
			Promise.all([
				// Load the order
				this.loadOrder(),
				// Load the restaurant data
				this.loadRestaurant()
			]).then(() => {
				this.setState({
					loading: false
				}, () => {
					this.calculateCosts();
					if (!this.state.order.finished && this.createCustomerInputRef.current) {
						this.createCustomerInputRef.current.focus();
					}
				});
			});
		}
	}

	/**
	 * Load restaurant data
	 * @return {Promise<AxiosResponse<any> | never>}
	 */
	loadRestaurant() {
		return axios.get('/api/restaurants/World of Pizza')
			.then((response) => {
				this.setState({
					restaurant: response.data,
					create    : {
						...this.state.create,
						article: OrderPage.mapArticleToSelectOption(response.data.articles[0])
					}
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.message
				});
			});
	}

	/**
	 * Load the specified order
	 * @return {Promise<AxiosResponse<any> | never>}
	 */
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

	/**
	 * Add new article to order
	 */
	addArticleToOrder() {
		axios.post('/api/orders/' + this.props.match.params.name + '/articles',
			{ customer: this.state.create.customer, article: this.state.create.article.value })
			.then((response) => {
				this.loadOrder().then(() => {
					this.setState({
						create: {
							customer: null,
							article : OrderPage.mapArticleToSelectOption(this.state.restaurant.articles[0]),
							error   : null
						}
					}, () => {
						this.calculateCosts();
						this.createCustomerInputRef.current.focus();
					});
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.response.data.error
				});
			});
	}

	editArticleInOrder () {
		return axios.put('/api/orders/' + this.state.order.name + '/articles/' + this.state.articleToEdit.customer,
			{ customer: this.state.edit.customer, article: this.state.edit.article.value })
			.then((response) => {
				const order = this.state.order;
				// Run through articles, find the updated one and replaces old values with the new one
				order.articles = order.articles.map(article => {
					return article.customer.toLowerCase() === this.state.articleToEdit.customer.toLowerCase()
						? { customer: this.state.edit.customer, article: this.state.edit.article.value }
						: article;
				});
				this.setState({
					articleToEdit: null,
					edit         : {
						...this.state.edit,
						customer: null,
						article : null,
						error   : null
					},
					order        : order
				}, () => {
					this.calculateCosts();
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.response.data.error
				});
			});
	}

	/**
	 * Returns the article price from the restaurant for the specified article
	 * @param {string} articleName Name of the article
	 * @return {number} Article price or when not found zero
	 */
	getArticlePrice(articleName) {
		if (this.state.restaurant !== null) {
			const restaurantArticle = this.state.restaurant.articles.filter(article => articleName.toLowerCase() === article.name.toLowerCase()).shift();
			if (restaurantArticle) {
				return restaurantArticle.price;
			}
		}
		return 0;
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

	/**
	 * Handle random end when purchaser determination type is random
	 * @param {string} purchaser Name of the purchaser
	 */
	handleOnRandomEnd = (purchaser) => {
		const order = { ...this.state.order };
		order.purchaser = purchaser;
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
			create: {
				...this.state.create,
				customer: event.currentTarget.value
			}
		});
	};
	handleNewArticleChange = (selectOption) => {
		this.setState({
			create: {
				...this.state.create,
				article: selectOption
			}
		});
	};

	handleEditNameChange = (event) => {
		event.preventDefault();
		this.setState({
			edit: {
				...this.state.edit,
				customer: event.currentTarget.value
			}
		});
	};
	handleEditArticleChange = (selectOption) => {
		this.setState({
			edit: {
				...this.state.edit,
				article: selectOption
			}
		});
	};

	/**
	 * Handle add article button click
	 */
	handleAddArticleClick = () => {
		// CHeck whether a customer has been entered
		if (this.state.create.customer === null || this.state.create.customer.trim() === '') {
			this.setState({
				create: {
					...this.state.create,
					error: 'Der Name ist leer'
				}
			});
			return;
		}
		// Check a customer with the same name doesn't exist
		if (this.state.order.articles.filter(article => article.customer.toLowerCase() === this.state.create.customer.toLowerCase()).length !== 0) {
			this.setState({
				create: {
					...this.state.create,
					error: 'Der Name existiert bereits in der Bestellung'
				}
			});
			return;
		}
		this.addArticleToOrder();
	};

	/**
	 * Handle delete article of a customer
	 * @param {string} customer Customer to delete article of
	 * @return {Promise<AxiosResponse<any> | never>}
	 */
	handleDeleteArticleOfCustomerClick = (customer) => {
		return axios.delete('/api/orders/' + this.state.order.name + '/articles/' + customer)
			.then((response) => {
				const order = this.state.order;
				order.articles = order.articles.filter((article) => article.customer !== customer);
				this.setState({
					order: order
				}, () => {
					this.calculateCosts();
				});
			})
			.catch((error) => {
				this.setState({
					generalError: error.response.data.error
				});
			});
	};
	/**
	 * Handle click on edit button of an article
	 * @param article Articleto edit
	 */
	handleEditArticleOfCustomerClick = (article) => {
		this.setState({
			articleToEdit: article,
			edit         : {
				...this.state.edit,
				customer: article.customer,
				article : OrderPage.mapArticleToSelectOption({ name: article.article })
			}
		}, () => {
			this.editCustomerInputRef.current.focus();
		});
	};

	/**
	 * Handle submit click of editing article
	 * @return {Promise<AxiosResponse<any>>|void}
	 */
	handleEditArticleSubmitClick = () => {
		if (this.state.edit.customer === null || this.state.edit.customer.trim() === '') {
			this.setState({
				edit: {
					...this.state.edit,
					error: 'Der Name ist leer'
				}
			});
			return;
		}
		// Check a customer with the same new name doesn't exist
		if (this.state.order.articles.filter(article => article.customer.toLowerCase() === this.state.edit.customer.toLowerCase()).length !== 0) {
			// Check name has changed
			if (this.state.edit.customer.toLowerCase() !== this.state.articleToEdit.customer.toLowerCase()) {
				this.setState({
					edit: {
						...this.state.edit,
						error: 'Der Name existiert bereits in der Bestellung'
					}
				});
				return;
			}
		}
		return this.editArticleInOrder();
	};

	/**
	 * Handle cancel of editing an article
	 */
	handleEditArticleCancelClick = () => {
		this.setState({
			articleToEdit: null,
			edit         : {
				...this.state.edit,
				customer: null,
				article : null,
				error   : null
			}
		});
	};

	/**
	 * Handle print order
	 */
	handlePrintClick = () => {
		window.print();
	};

	/**
	 * Calculate costs
	 */
	calculateCosts() {
		// When order or restaurant hasn't been loaded yet, don't do anything
		if (!this.state.order || !this.state.restaurant) {
			return;
		}
		// Get count of all orders
		let ordersCount = this.state.order.articles.length;
		let costs = 0;
		let orderType = ORDER_TYPES.INTERNET;
		let rest = ordersCount % 5;
		costs += Math.floor(ordersCount / 5) * 30;

		costs += Math.floor(rest / 4) * 26;
		rest = rest % 4;

		costs += Math.floor(rest / 3) * 21;
		rest = rest % 3;

		const costsWithoutMenus = this.state.order.articles.reduce((prev, current) => prev + this.getArticlePrice(current.article), 0);

		// When we have a rest (1-2 orders left) or the costs without the menu are smaller, than the costs would be higher than ordering per phone
		if (rest > 0 || costs > costsWithoutMenus) {
			costs = costsWithoutMenus;
			orderType = ORDER_TYPES.PHONE;
		}
		this.setState({
			costs    : costs,
			orderType: orderType
		});
	}

	/**
	 * Map the specified article to a select option for react-select
	 * @param {{name: string}} article Article name
	 * @return {{label: string, value: string}}
	 */
	static mapArticleToSelectOption = (article) => {
		return { 'value': article.name, 'label': article.name };
	};

	renderOrderSummaryTable() {
		const articleSummary = {};
		this.state.order.articles.forEach((article) => {
			articleSummary[article.article] = (articleSummary[article.article] || 0) + 1;
		});
		return <OrderSummaryTable articles={Object.keys(articleSummary).map((articleName) => {
			return { name: articleName, count: articleSummary[articleName] };
		})} />;
	}

	/**
	 * Render order article row
	 * @param {{customer : string, article: string}} article Article
	 * @param {Number} position Position of article in the list
	 * @param {Number} cost Costs for the article
	 * @return {*}
	 */
	renderOrderArticleRow(article, position, cost) {
		const isCurrentlyEdited = this.state.articleToEdit && this.state.articleToEdit.customer === article.customer;
		return <tr key={article.customer}>
			<td className={'fitted'}>
				{!this.state.order.finished &&
				 (
					 isCurrentlyEdited
						 ? <>
							 <Button size={'sm'} color={'primary'}
								 onClick={() => this.handleEditArticleSubmitClick()}>
								 <i className={'fa fa-check'} title={'Bearbeiten'} />
							 </Button>{' '}
							 <Button size={'sm'} color={'secondary'}
								 onClick={() => this.handleEditArticleCancelClick()}>
								 <i className={'fa fa-times'} title={'Abbrechen'} />
							 </Button>
						 </>
						 : <>
							 <Button size={'sm'} color={'primary'}
								 onClick={() => this.handleEditArticleOfCustomerClick(article)}>
								 <i className={'fa fa-pencil'} />
							 </Button>{' '}
							 <Button size={'sm'} color={'secondary'} onClick={() => this.handleDeleteArticleOfCustomerClick(article.customer)}>
								 <i className={'fa fa-trash'} /></Button>
						 </>
				 )
				}
			</td>
			<th scope={'row'} className={'fitted'}>{position}</th>
			<td>
				{isCurrentlyEdited
					? <>
						<Input placeholder='Max Pizzamann' onChange={this.handleEditNameChange} value={this.state.edit.customer}
							name='name-edit' invalid={this.state.edit.error !== null} innerRef={this.editCustomerInputRef}
							onKeyPress={(event) => onEnterKeyPressTriggerCallback(event, this.handleEditArticleSubmitClick)}
							autoComplete={'given-name'} />
						<FormFeedback>{this.state.edit.error}</FormFeedback>
					</>
					: article.customer}
			</td>
			<td>
				{isCurrentlyEdited
					?
					<Select options={this.state.restaurant ? this.state.restaurant.articles.map(article => article.name) : []} isClearable={false} isRTL={false}
						name='article-edit'
						onChange={this.handleEditArticleChange}
						noOptionsMessage={() => `Kein Artikel gefunden`}
						value={this.state.edit.article} />
					: article.article}
			</td>
			<td>{parseFloat((cost * 100) / 100).toFixed(2) + '€'}</td>
			{this.state.order.finished && <td className={'fitted'}>
				<Checkbox />
			</td>}
		</tr>;
	}

	/**
	 * Render the order type message
	 * @return {*}
	 */
	renderOrderTypeMessage() {
		const customers = this.state.order.articles.map(article => article.customer);
		const orderFinishedAndRandomDetermination = this.state.order.finished === true && this.state.order.purchaserDetermination === PURCHASER_DETERMINATION.RANDOM;

		let orderType = null, informationTitle = null, informationText= null;
		switch (this.state.orderType) {
			case ORDER_TYPES.INTERNET:
				orderType = <><i className={'fa fa-cloud fa-lg'} /> Im Internet bestellen</>;
				informationTitle = 'Webseite:';
				informationText = <a href={this.state.restaurant.website}
					target={'_blank'}>{this.state.restaurant.website}</a>;
				break;
			case ORDER_TYPES.PHONE:
			default:
				orderType = <><i className={'fa fa-phone fa-lg'} /> Per Telefon bestellen</>;
				informationTitle = 'Telefonnummer:';
				informationText = this.state.restaurant.phone;
				break;
		}
		return <>
			<div className={'row w-100percent'}>
				<div className={'col-12'}>
					{orderType}
				</div>
			</div>
			<div className={'row w-100percent'}>
				<div className={'col-6 text-right'}>
					{informationTitle}
				</div>
				<div className={'col-6 text-left'}>
					{informationText}
				</div>
			</div>
			<div className={'row w-100percent'}>
				<div className={'col-6 text-right'}>
					Besteller:
				</div>
				<div className={'col-6 text-left'}>
					<Entscheidomat
						startOption={orderFinishedAndRandomDetermination && this.state.order.purchaser !== null ? this.state.order.purchaser : '?'}
						options={customers}
						start={orderFinishedAndRandomDetermination && this.state.order.purchaser === null} onEnd={this.handleOnRandomEnd} />
				</div>
			</div>
		</>;
	}

	render() {

		let counter = 1;
		return <Container className='OrderPage'>
			{this.state.generalError && <Alert color={'danger'}>{this.state.generalError}</Alert>}
			<Overlay show={this.state.loading} />
			{!this.state.loading
				? (<>
					<Table className={'table-dark'}>
						<thead>
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
							// When we order per phone, get the original price, otherwise use the costs and split through all articles in the order
							const cost = this.state.orderType === ORDER_TYPES.PHONE
								? this.getArticlePrice(article.article)
								: this.state.costs / this.state.order.articles.length;
							return this.renderOrderArticleRow(article, counter++, cost);
						})}
						<tr>
							<th scope={'row'} colSpan={'4'} className={'text-right'}>Gesamt</th>
							<td colSpan={'1'} className={'text-right'}>
								{parseFloat((this.state.costs * 100) / 100).toFixed(2) + '€'}
							</td>
							<td className={'fitted'} />
						</tr>
						{!this.state.order.finished &&
						 <tr>
							 <td colSpan={5}>
								 <Row>
									 <Col sm={'5'}>
										 <Input placeholder='Max Pizzamann' onChange={this.handleNewNameChange} value={this.state.create.customer || ''}
											 name='name' invalid={this.state.create.error !== null} innerRef={this.createCustomerInputRef}
											 onKeyPress={(event) => onEnterKeyPressTriggerCallback(event, this.handleAddArticleClick)}
											 autoComplete={'given-name'} />
										 <FormFeedback>{this.state.create.error}</FormFeedback>
									 </Col>
									 <Col sm={'5'}>
										 <Select options={this.state.restaurant ? this.state.restaurant.articles.map(article => article.name) : []}
											 isClearable={false} isRTL={false} name='article'
											 onChange={this.handleNewArticleChange}
											 noOptionsMessage={() => `Kein Artikel gefunden`}
											 value={this.state.create.article} />
									 </Col>
									 <Col sm={'2'} className={'text-right'}>
										 <Button color={'primary'} onClick={this.handleAddArticleClick}><i className={'fa fa-plus'} /></Button>
									 </Col>
								 </Row>
							 </td>
						 </tr>

						}
						</tbody>
					</Table>
					<Row style={{ marginBottom: '1rem' }}>
						<Col sm={6}>
							{this.state.order.finished && this.renderOrderSummaryTable()}
						</Col>
						<Col sm={6} className={'OrdertypeInfo'}>
							{this.state.restaurant && this.renderOrderTypeMessage()}
						</Col>
					</Row>
					<OrderSiteControl isOrderfinished={this.state.order.finished} onBackClick={this.handleBackClick}
						onPrintClick={this.handlePrintClick} onOrderClick={this.handleOrderClick} />

					<DarkModal isOpen={this.state.showFinishOrderWarning}>
						<ModalHeader>
							Bestellung abschließen
						</ModalHeader>
						<ModalBody>
							Soll die Bestellung wirklich abgeschlossen werden?
						</ModalBody>
						<ModalFooter>
							<Button color='secondary' onClick={() => {
								this.setState({
									showFinishOrderWarning: false
								});
							}}>Abbrechen</Button>
							<Button color='primary' onClick={this.handleOrderClick}>Bestellen</Button>{' '}
						</ModalFooter>
					</DarkModal>
				</>)
				: null}
		</Container>;
	}
};