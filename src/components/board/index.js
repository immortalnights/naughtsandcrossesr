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

	onCellOver(cell, event)
	{
		const col = cell.props.id % this.props.cols;
		// highlight coloumn
	}

	onCellLeave(cell, event)
	{
		const col = cell.props.id % this.props.cols;
		// unhighlight coloumn
	}

	render()
	{
		console.log("render board", this.props);

		const minHeight = (100 / this.props.rows).toFixed(0) + '%';
		const minWidth = (100 / this.props.cols).toFixed(0) + '%';

		let key = 0;
		const rows = [];
		for (let r = 0; r < this.props.rows; r++)
		{
			const row = [];
			for (let c = 0; c < this.props.cols; c++)
			{
				const cellProps = {
					key,
					id: key,
					onClick: this.onCellClicked.bind(this),
					onOver: this.onCellOver.bind(this),
					onLeave: this.onCellLeave.bind(this)
				};

				const cellValue = this.props.cells[key];

				switch (this.props.game)
				{
					case 'noughtsandcrosses':
					{
						cellProps.available = !cellValue;
						cellProps.value = cellValue;
						cellProps.style = 'taken';
						break;
					}
					case 'connectfour':
					{
						cellProps.available = !cellValue;
						cellProps.value = '';
						cellProps.style = cellValue;
						break;
					}
				}

				row.push(<Cell {...cellProps} />);

				++key;
			}

			rows.push(<tr style={{minHeight}} key={r}>{row}</tr>);
		}

		const className = ['board', this.props.game];
		return (<table className={className.join(' ')}><tbody>{rows}</tbody></table>);
	}
};
