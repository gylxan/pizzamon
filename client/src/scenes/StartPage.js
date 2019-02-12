import React from 'react';
import PizzaImage from '../images/pizza.svg';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';


export default class StartPage extends React.Component {
	constructor(props) {
		super(props);

		const date = new Date();
		const stringDate = (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1) <= 9 ? ('0' + (date.getMonth() + 1))
			: (date.getMonth() + 1)) + '.' + date.getFullYear();
		this.state = {
			currentOrder: null,
			newOrderName: stringDate,
			error       : null
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
		this.props.history.push('/order/ordernumber');
	};

	handleOrderEditClick = (event) => {
		event.preventDefault();
		this.props.history.push('/order/' + this.state.currentOrder);
	};


	render() {
		return <div className='App'>
			<header className='App-header'>
				<h1>Willkommen zu Pizzamon!</h1>
				<img src={PizzaImage} className='App-logo' alt='logo' />
			</header>

			<Form className={'App-form'}>
				<FormGroup>
					<Label for={'newOrderNameSelect'}>Neue Bestellung</Label>
					<Input name={'newOrderName'} id={'newOrderNameSelect'} placeholder={'Bestellungsname'} value={this.state.newOrderName}
						onChange={this.handleNewOrderNameChange}
						invalid={this.state.error !== null} />
					<FormFeedback>{this.state.error}</FormFeedback>
				</FormGroup>
				<Button color={'primary'} onClick={this.handleOrderCreateClick}>Erstellen</Button>
				<hr style={{ width: '30rem' }} />
				<FormGroup>
					<Label for={'existingOrdersSelect'}>Existierende Bestellungen</Label>
					<Input type='select' name='existingOrders' id='existingOrdersSelect' onChange={this.handleOrderChange}>
						<option>Bestellung 1</option>
						<option>Bestellung 2</option>
						<option>Bestellung 3</option>
						<option>Bestellung 4</option>
						<option>Bestellung 5</option>
					</Input>
				</FormGroup>
				<Button color={'primary'} onClick={this.handleOrderEditClick}>Bestellung anzeigen / bearbeiten</Button>
			</Form>
		</div>;
	}
}