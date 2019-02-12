import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import StartPage from './scenes/StartPage';
import OrderPage from './scenes/OrderPage';


class App extends Component {

	render() {
		return (
			<div className='App'>
				<BrowserRouter>
					<Switch>
						<Route path={"/order/print"} component={OrderPage}/>
						<Route path={"/order"} component={OrderPage}/>
						<Route path={"/"} component={StartPage}/>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
