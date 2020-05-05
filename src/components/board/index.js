import React from 'react';
import Cell from '../cell/';
import './styles.css';

export default class Board extends React.Component {
	static defaultProps = {
		rows: 3,
		cols: 3
	}

	onCellClicked(cell, event)
	{
		console.debug('cell clicked', this, cell, event);
		this.props.emit('place_token', {
			id: cell.props.id
		});
	}

	render()
	{
		console.log("render board", this.props);

		const height = (100 / this.props.rows).toFixed(0) + '%';
		const width = (100 / this.props.cols).toFixed(0) + '%';

		const rows = [];
		for (let r = 0; r < this.props.rows; r++)
		{
			const row = [];
			for (let c = 0; c < this.props.cols; c++)
			{
				const key = 1 + (r * 3) + c;
				row.push(<Cell key={key} id={key-1} token={this.props.cells[key-1]} width={width} onClick={this.onCellClicked.bind(this)} />);
			}
			rows.push(<tr style={{height}} key={r}>{row}</tr>);
		}

		return (<table className="board"><tbody>{rows}</tbody></table>);
	}
};
