import React from 'react';
import PropTypes from 'prop-types';
import { placeToken } from '../../socketio/emits';
import './styles.css';

export default class Cell extends React.Component {
	static propTypes = {
		onClick: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);

		console.log("CELL", props);

		this.state = {
			active: false,
			token: null
		};
	}

	handleMouseOver()
	{
		this.setState({
			active: true
		});
		// console.log(`over cell ${this.props.id}`);
	}

	handleMouseLeave()
	{
		this.setState({
			active: false
		});
		// console.log(`left cell ${this.props.id}`);
	}

	render()
	{
		let className = ['cell'];
		if (this.state.active)
		{
			if (this.props.token)
			{
				className.push('invalid');
			}
			else
			{
				className.push('ok');
			}
		}

		const onClick = this.props.onClick.bind(null, this)
		const value = this.props.token || '&nbsp;';

		return (<td className={className.join(' ')} onClick={onClick} onMouseOver={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>{this.props.t}</td>);
	}
}
