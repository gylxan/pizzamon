import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';


export default class OrderSiteControl extends React.Component {
	render() {
		return 	<Container>
			<Row>
				<Col sm={'9'} />
				<Col sm={'3'} className={'text-right'}>
					<Button color={'secondary'} onClick={this.props.onBackClick}>Zurück</Button>{' '}
					<Button color={'primary'} onClick={() => {
						if(this.props.isOrderfinished) {
							this.props.onPrintClick();
						} else {
							this.props.onOrderClick();
						}
					}}>
						{this.props.isOrderfinished ? 'Drucken' : 'Bestellen'}
					</Button>
				</Col>
			</Row>
		</Container>
	}
}