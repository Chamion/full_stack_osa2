import React from 'react';
import axios from 'axios';

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			maat: [],
			valittuMaa: {}
		}
	}
	
	haeMaat(event) {
		const hakuehto = event.target.value
		const maat = this.kaikkiMaat.filter(maa => {
			return maa.name.toLowerCase().includes(hakuehto.toLowerCase())
		})
		var valittu
		if(maat.length === 1) {
			valittu = maat[0]
		} else {
			valittu = {}
		}
		this.setState({
			maat: maat,
			valittuMaa: valittu
		})
	}
	
	valitseMaa(maa) {
		return () => {
			this.setState({
				valittuMaa: maa
			})
		}
	}
	
	componentWillMount() {
		const promise = axios.get('https://restcountries.eu/rest/v2/all')
		promise.then(res => {
			this.kaikkiMaat = res.data
		})
	}
	
	render() {
		return (
			<div>
				<TextInput otsikko="find countries:" kasittelija={this.haeMaat.bind(this)} />
				<MaaLista maat={this.state.maat} click={this.valitseMaa.bind(this)} />
				<Maa maa={this.state.valittuMaa} />
			</div>
		)
	}
}

const TextInput = (props) => {
	return (
		<div>
			<span>{props.otsikko} </span><input onChange={props.kasittelija} />
		</div>
	)
}

const Maa = (props) => {
	if(props.maa.name === undefined) {
		return null
	}
	return (
		<div>
			<h2>{props.maa.name}</h2>
			<p>capital: {props.maa.capital}</p>
			<p>population: {props.maa.population}</p>
			<img alt={"flag of "+props.maa.name} src={props.maa.flag} width="400px" />
		</div>
	)
}

const MaaLista = (props) => {
	if(props.maat.length > 10) {
		return (
			<p>too many matches, specify another filter</p>
		)
	}
	return (
		<ul>
			{props.maat.map(maa => {
				return (
					<li key={maa.name} onClick={props.click(maa)}>{maa.name}</li>
				)
			})}
		</ul>
	)
}

export default App;