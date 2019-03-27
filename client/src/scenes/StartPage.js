import React from 'react';
import PizzaImage from '../images/pizza.svg';
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import axios from 'axios';
import './StartPage.css';
import { onEnterKeyPressTriggerCallback } from '../services/utils/EventHandlerUtils';
import DarkModal from '../components/DarkModal';
import Select from '../components/Select';
import { PURCHASER_DETERMINATION } from '../services/constants/OrderConstants';
import Entscheidomat from '../components/Entscheidomat';

export default class StartPage extends React.Component {
	constructor(props) {
		super(props);


		this.state = {
			currentOrder          : null,
			existingOrders        : [{ value: -1, label: 'Lade Bestellungen' }],
			error                 : null,
			newOrderName          : 'Bestellung ' + StartPage.getDateString(),
			purchaserDetermination: { value: 'random', label: 'Zufällig' },
			orderToDelete         : null,
			showDeleteModal       : false,
			showCreateModal       : false,
			loading               : true
		};
	}

	/**
	 * Get a date string as "08.03.2019"
	 * @return {string}
	 */
	static getDateString() {
		const date = new Date();
		return (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1) <= 9 ? ('0' + (date.getMonth() + 1))
			: (date.getMonth() + 1)) + '.' + date.getFullYear();
	}

	/**
	 * Handle change of the new order name
	 * @param event
	 */
	handleNewOrderNameChange = (event) => {
		this.setState({
			newOrderName: event.currentTarget.value
		});
	};

	/**
	 * Handle change of the purchaser determination
	 * @param {value: string, label: string} value Value
	 */
	handlePurchaserDeterminationChange = (value) => {
		this.setState({
			purchaserDetermination: value
		});
	};

	/**
	 * Handle change event of the order select
	 * @param {"value": *, "label": *} value
	 */
	handleOrderChange = (value) => {
		this.setState({
			currentOrder: value
		});
	};

	loadOrders() {
		return axios.get('/api/orders').then((response) => {
			let newCurrentOrder = this.state.currentOrder;
			// When current order is empty and we got orders from server, use the first one. Otherwise it stays null
			if (this.state.currentOrder === null && response.data[0]) {
				newCurrentOrder = { value: response.data[0].name, label: response.data[0].name };
			}

			this.setState({
				existingOrders: response.data.map(element => {
					return { value: element.name, label: element.name };
				}),
				currentOrder  : newCurrentOrder
			});
		});
	}

	componentDidMount() {
		this.setState({
			loading: true
		});
		this.loadOrders().then(() => {
			this.setState({
				loading: false
			});
		});
	}

	/**
	 * Handle click on the order create button
	 * @param event
	 */
	handleOrderCreateClick = (event) => {
		event.preventDefault();
		// Check whether the new order name is empty
		if (this.state.newOrderName.trim() === '') {
			this.setState({
				error: 'Es muss ein Name für die Bestellung eingegeben werden'
			});
			return;
		}
		this.setState({
			error: null
		});
		axios.post('/api/orders',
			{ name: this.state.newOrderName, articles: [], finished: false, purchaserDetermination: this.state.purchaserDetermination.value }).then(
			(response) => {
				this.props.history.push('/order/' + this.state.newOrderName);
			}).catch(error => {
			this.setState({
				error: error.response.data.error
			});
		});
	};

	/**
	 * Handle click on the order edit button
	 * @param event
	 */
	handleOrderEditClick = (event) => {
		event.preventDefault();
		// Jump to order
		if (this.state.currentOrder !== null && this.state.currentOrder.value !== '-1') {
			this.props.history.push('/order/' + this.state.currentOrder.value);
		}
	};
	/**
	 * Handle click on the order delete button
	 * @param event
	 */
	handleOrderDeleteClick = (event) => {
		event.preventDefault();
		// Show delete confirm modal and set the new order to delete
		this.setState({
			showDeleteModal: true,
			orderToDelete  : this.state.currentOrder
		});
	};

	/**
	 * Handle order delete
	 * @param event
	 */
	handleOrderDelete = (event) => {
		event.preventDefault();
		axios.delete('/api/orders/' + this.state.orderToDelete).then(() => {
			// Filter out the deleted order
			const ordersWithoutDeleted = this.state.existingOrders.filter(element => element.value !== this.state.orderToDelete);
			// Hide delete modal and set
			this.setState({
				showDeleteModal: false,
				existingOrders : ordersWithoutDeleted,
				currentOrder   : ordersWithoutDeleted.length > 0 ? ordersWithoutDeleted[0].name : null
			});
		});
	};


	render() {
		// When loading, don't show anything
		if (this.state.loading) {
			return null;
		}
		return <div className='StartPage'>
			<header className='StartPage-header'>
				<img src={PizzaImage} className='StartPage-logo' alt='logo' />
			</header>
			<Form className={'StartPage-form'}>
				<Label for={'newOrderNameInput'}>Neue Bestellung</Label>
				<div className={'w-100percent flex-center'}>
					<Col xs={8} md={6} lg={3}>
						<FormGroup>
							<Input name={'newOrderName'} id={'newOrderNameInput'} placeholder={'Bestellungsname'} value={this.state.newOrderName}
								onChange={this.handleNewOrderNameChange}
								onKeyPress={(event) => onEnterKeyPressTriggerCallback(event, this.handleOrderCreateClick)}
								invalid={this.state.error !== null} />
							<FormFeedback>{this.state.error}</FormFeedback>
						</FormGroup>
					</Col>
					<Col xs={4} md={2} lg={1}>
						<FormGroup className={'pull-left'}>
							<Button color={'primary'} onClick={() => this.setState({ showCreateModal: true })}><i className={'fa fa-plus'} /> </Button>
						</FormGroup>
					</Col>
				</div>
				<hr style={{ width: '60%' }} />
				<Label for={'existingOrdersSelect'}>Existierende Bestellungen</Label>
				<div className={'w-100percent flex-center'}>
					<Col xs={8} md={6} lg={3}>
						<FormGroup>
							<Select name='existingOrders' id='existingOrdersSelect' value={this.state.currentOrder || ''}
								onChange={this.handleOrderChange} options={this.state.existingOrders} />
						</FormGroup>
					</Col>
					<Col xs={4} md={2} lg={1}>
						<FormGroup className={'pull-left'}>
							<Button color={'primary'} onClick={this.handleOrderEditClick}><i className={'fa fa-pencil'} /> </Button>{' '}
							<Button color={'secondary'} onClick={this.handleOrderDeleteClick}><i className={'fa fa-trash'} /> </Button>
						</FormGroup>
					</Col>
				</div>
			</Form>
			<DarkModal isOpen={this.state.showDeleteModal} onClosed={() => this.setState({ orderToDelete: null })}>
				<ModalHeader>
					Bestellung {this.state.orderToDelete} löschen
				</ModalHeader>
				<ModalBody>
					Soll die Bestellung {this.state.orderToDelete} wirklich gelöscht werden?
				</ModalBody>
				<ModalFooter>
					<Button onClick={() => this.setState({ showDeleteModal: false })}>Nein</Button>{' '}
					<Button color={'primary'} onClick={this.handleOrderDelete}>Ja</Button>
				</ModalFooter>
			</DarkModal>
			<DarkModal isOpen={this.state.showCreateModal} onClosed={() => this.setState({ orderToDelete: null })}>
				<ModalHeader>
					Einstellungen für neue Bestellung
				</ModalHeader>
				<ModalBody>
					<Form className={'StartPage-NewOrder-form'}>
						<FormGroup className={'row'}>
							<Label sm={5} className={'col-form-label'} for={'purchaserDetermination'}>Ermittlung des Bestellers</Label>
							<Col sm={7}>
								<Select name={'purchaserDetermination'} id={'purchaserDetermination'} class={'w-100percent'}
									options={[
										{ value: PURCHASER_DETERMINATION.RANDOM, label: 'Zufällig' },
										{ value: PURCHASER_DETERMINATION.MANUAL, label: 'Manuell' }]}
									noOptionsMessage={() => `Keine Bestellung gefunden`}
									onChange={this.handlePurchaserDeterminationChange} value={this.state.purchaserDetermination}
								/>
							</Col>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button onClick={() => this.setState({ showCreateModal: false })}>Abbrechen</Button>{' '}
					<Button color={'primary'} onClick={this.handleOrderCreateClick}>Erstellen</Button>
				</ModalFooter>
			</DarkModal>
		</div>;
	}
}