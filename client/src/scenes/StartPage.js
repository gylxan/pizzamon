import React from 'react';
import PizzaImage from '../images/pizza.svg';
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import './StartPage.css';

export default class StartPage extends React.Component {
	constructor(props) {
		super(props);

		const date = new Date();
		const stringDate = (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1) <= 9 ? ('0' + (date.getMonth() + 1))
			: (date.getMonth() + 1)) + '.' + date.getFullYear();
		this.state = {
			currentOrder   : null,
			existingOrders : null,
			error          : null,
			newOrderName   : 'Bestellung ' + stringDate,
			orderToDelete  : null,
			showDeleteModal: false
		};
	}

	handleNewOrderNameChange = (event) => {
		this.setState({
			newOrderName: event.currentTarget.value
		});
	};
	handleOrderChange = (event) => {
		this.setState({
			currentOrder: event.currentTarget.value
		});
	};

	loadOrders() {
		axios.get('/api/orders').then((response) => {
			this.setState({
				existingOrders: response.data,
				currentOrder  : this.state.currentOrder === null ?(response.data[0].name || null) : this.state.currentOrder
			});
		});
	}

	componentDidMount() {
		if (this.state.existingOrders === null) {
			this.loadOrders();
		}
	}

	handleOrderCreateClick = (event) => {
		event.preventDefault();
		if (this.state.newOrderName.trim() === '') {
			this.setState({
				error: 'Es muss ein Name für die Bestellung eingegeben werden'
			});
			return;
		}
		this.setState({
			error: null
		});
		axios.post('/api/orders', { name: this.state.newOrderName, articles: [], finished: false }).then((response) => {
			this.props.history.push('/order/' + this.state.newOrderName);
		}).catch(error => {
			this.setState({
				error: error.response.data.error
			});
		});
	};

	handleOrderEditClick = (event) => {
		event.preventDefault();
		if (this.state.currentOrder !== null && this.state.currentOrder !== '-1') {
			this.props.history.push('/order/' + this.state.currentOrder);
		}
	};
	handleOrderDeleteClick = (event) => {
		this.setState({
			showDeleteModal : true,
			orderToDelete: this.state.currentOrder
		});
	};
	handleOrderDelete = (event) => {
		axios.delete('/api/orders/' + this.state.orderToDelete).then(() => {
			const ordersWithoutDeleted = this.state.existingOrders.filter(element => element.name !== this.state.orderToDelete);
			this.setState({
				showDeleteModal: false,
				existingOrders : ordersWithoutDeleted,
				currentOrder   : ordersWithoutDeleted.length > 0 ? ordersWithoutDeleted[0].name : null
			});
		});
	};


	render() {
		return <div className='App'>
			<header className='App-header'>
				<img src={PizzaImage} className='App-logo' alt='logo' />
			</header>
			<Form className={'App-form'}>
				<Label for={'newOrderNameInput'}>Neue Bestellung</Label>
				<Row form>
					<Col>
						<FormGroup>
							<Input name={'newOrderName'} id={'newOrderNameInput'} placeholder={'Bestellungsname'} value={this.state.newOrderName}
								onChange={this.handleNewOrderNameChange}
								invalid={this.state.error !== null} />
							<FormFeedback>{this.state.error}</FormFeedback>
						</FormGroup>
					</Col>
					<Col>
						<FormGroup>
							<Button color={'primary'} onClick={this.handleOrderCreateClick}><i className={'fa fa-plus'} /> </Button>
						</FormGroup>
					</Col>
				</Row>
				<hr style={{ width: '60%' }} />
				<Label for={'existingOrdersSelect'}>Existierende Bestellungen</Label>
				<Row form>
					<Col>
						<FormGroup>
							<Input type='select' name='existingOrders' id='existingOrdersSelect' onChange={this.handleOrderChange}>
								{this.state.existingOrders !== null ? this.state.existingOrders.map((element) => {
									return <option key={element.name} value={element.name}>{element.name}</option>;
								}) : <option value={-1}>Lade Bestellungen</option>}
							</Input>
						</FormGroup>
					</Col>
					<Col>
						<FormGroup>
							<Button color={'primary'} onClick={this.handleOrderEditClick}><i className={'fa fa-pencil'} /> </Button>{' '}
							<Button color={'danger'} onClick={this.handleOrderDeleteClick}><i className={'fa fa-trash'} /> </Button>
						</FormGroup>
					</Col>
				</Row>
			</Form>
			<Modal isOpen={this.state.showDeleteModal} onClosed={() => this.setState({ orderToDelete: null })}>
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
			</Modal>
		</div>;
	}
}