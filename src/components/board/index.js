import React from 'react';
import Cell from '../cell/';

export default class Board extends React.Component {
	static defaultProps = {
		rows: 3,
		cols: 3
	}

	constructor(props)
	{
		super(props);

		console.log("Board", props);
	}

	onCellClicked(cell, event)
	{
		console.log('cell clicked', this, cell, event);
		this.props.emit('place_token', {
			id: cell.props.id
		});
	}

	render()
	{
		console.log("render board", this.props);

		let rows = [];
		for (let r = 0; r < this.props.rows; r++)
		{
			let row = [];
			for (let c = 0; c < this.props.cols; c++)
			{
				let key = 1 + (r * 3) + c;
				// row.push(<Cell key={key} id={key} token={this.props.cells[key-1]} onClick={this.onCellClicked} />);
				row.push(<Cell key={key} id={key} {...this.props.cells[key-1]} onClick={this.onCellClicked.bind(this)} />);
			}
			rows.push(<tr key={r}>{row}</tr>);
		}

		return (<table className="board"><tbody>{rows}</tbody></table>);
	}
};
