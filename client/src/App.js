import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import StartPage from './scenes/StartPage';
import OrderPage from './scenes/OrderPage';
import OrderPrintPage from './scenes/OrderPrintPage';


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isPageLoading : false
		}
	}


	render() {
		return (
			<div className='App'>
				<BrowserRouter>
					<Switch>
						<Route path={"/order/:name/print"} component={OrderPrintPage}/>
						<Route path={"/order/:name"} component={OrderPage}/>
						<Route path={"/"} component={StartPage}/>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
