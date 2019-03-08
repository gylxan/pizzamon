import React from 'react';
import { Table } from 'reactstrap';



export default class OrderSummaryTable extends React.Component {
	render() {
		return <Table className={'table-dark'}>
			<thead className={'thead-dark'}>
			<tr>
				<th>Anzahl</th>
				<th>Artikel</th>
			</tr>
			</thead>
			<tbody>

			{this.props.articles.map((article) => {
				return <tr key={article.name}>
					<td className={'fitted'}>{article.count}</td>
					<td>{article.name}</td>
				</tr>;
			})}
			</tbody>
		</Table>;
	}
}