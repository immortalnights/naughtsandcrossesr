import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class Cell extends React.Component {
	static propTypes = {
		onClick: PropTypes.func.isRequired
	}

	constructor(props)
	{
		super(props);


		this.state = {
			active: this.props.active,
			token: null
		};
	}

	handleMouseOver()
	{
		if (this.props.onOver)
		{
			this.props.onOver(this);
		}

		this.setState({
			active: true
		});
	}

	handleMouseLeave()
	{
		if (this.props.onLeave)
		{
			this.props.onLeave(this);
		}

		this.setState({
			active: false
		});
	}

	render()
	{
		console.debug("render cell", this.props);

		const value = this.props.value || '';

		let className = ['cell', this.props.style];
		if (this.state.active)
		{
			className.push('active');

			if (this.props.available)
			{
				className.push('ok');
			}
			else
			{
				className.push('invalid');
			}
		}

		const onClick = this.props.onClick.bind(null, this)

		return (<td className={className.join(' ')} onClick={onClick} onMouseOver={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>{value}</td>);
	}
}
