import React from 'react'
import Client from './Client.js'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.client = new Client('http://localhost:3001/persons')
		this.state = {
			persons: [],
			newName: '',
			newNumber: '',
			filter: '',
			notification: null,
			notificationColor: 'red'
		}
	}
	
	componentWillMount() {
		const promise = this.client.haeKaikki()
		promise.then(res => {
			this.setState({
				persons: res.data
			})
		})
	}
	
	inputKasittelija(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	
	poistoKasittelija(id) {
		return () => {
			this.poistaHenkilo(id)
		}
	}
	
	lisaaHenkilo(event) {
		event.preventDefault()
		const loytynyt = this.state.persons.find(henkilo => {
			return henkilo.name === this.state.newName
		})
		if(loytynyt !== undefined) {
			this.muutaNumero(loytynyt.id)
			return
		}
		const henkilo = {
			id: this.state.persons.length+1,
			name: this.state.newName,
			number: this.state.newNumber
		}
		this.client.lisaa(henkilo).catch(error => {
			this.viesti("Virhe lisättäessä numeroa. Lataa sivu uudelleen.", "red")
		})
		const uusiPersons = this.state.persons.concat(henkilo)
		this.setState({
			persons: uusiPersons,
			newName: '',
			newNumber: ''
		})
		this.viesti("Lisättiin "+henkilo.name, "green")
	}
	
	muutaNumero(id) {
		const henkilo = {
			id: id,
			name: this.state.newName,
			number: this.state.newNumber
		}
		const uusiPersons = this.state.persons
		if(window.confirm(henkilo.name + " on jo luettelossa, korvataanko vanha numero uudella?")) {
			this.client.muuta(id, henkilo).catch(error => {
				this.client.lisaa(henkilo).catch(error => {
					this.viesti("Virhe numeron muuttamisessa. Lataa sivu uudelleen.", "red")
				})
			})
			const index = uusiPersons.findIndex(henkilo => {
				return henkilo.id === id
			})
			uusiPersons[index] = henkilo
			this.viesti("Numero vaihdettiin: "+henkilo.name+" "+henkilo.number, "green")
		}
		this.setState({
			persons: uusiPersons,
			newName: '',
			newNumber: ''
		})
	}
	
	poistaHenkilo(id) {
		const index = this.state.persons.findIndex(henkilo => {
			return henkilo.id === id
		})
		const nimi = this.state.persons[index].name
		if(window.confirm("Poistetaanko "+nimi)) {
			this.client.poista(id)
			const uusiPersons = this.state.persons
			delete uusiPersons.splice(index, 1)
			this.setState({
				persons: uusiPersons
			})
			this.viesti("Poistettiin "+nimi, "green")
		}
	}
	
	viesti(viesti, vari) {
		this.setState({
			notification: viesti,
			notificationColor: vari
		})
		setTimeout(() => {
			if(this.state.notification === viesti) {
				this.setState({
					notification: null
				})
			}
		}, 5000)
	}

	render() {
		const naytettavat_henkilot = this.state.persons.filter(henkilo => {
			return henkilo.name.toLowerCase().includes(this.state.filter.toLowerCase())
		})
		return (
			<div>
				<h1>Puhelinluettelo</h1>
				<Notification viesti={this.state.notification} color={this.state.notificationColor} />
				<TextInput otsikko="rajaa näytettäviä" kasittelija={this.inputKasittelija.bind(this)} avain="filter" muuttuja={this.state.filter} />
				<h2>Lisää uusi</h2>
				<form onSubmit={this.lisaaHenkilo.bind(this)}>
					<TextInput otsikko="nimi:" kasittelija={this.inputKasittelija.bind(this)} avain="newName" muuttuja={this.state.newName} />
					<TextInput otsikko="numero:" kasittelija={this.inputKasittelija.bind(this)} avain="newNumber" muuttuja={this.state.newNumber} />
					<div>
						<button type="submit">lisää</button>
					</div>
				</form>
				<h2>Numerot</h2>
				<HenkiloTable henkilot={naytettavat_henkilot} poistoKasittelija={this.poistoKasittelija.bind(this)}/>
			</div>
		)
	}
}

const TextInput = (props) => {
	return (
		<div>
			<span>{props.otsikko} </span><input id={props.avain} onChange={props.kasittelija} value={props.muuttuja}/>
		</div>
	)
}

const HenkiloTable = (props) => {
	return (
		<table>
			<tbody>
				{props.henkilot.map(henkilo => {
					return (
						<Henkilo key={henkilo.id} id={henkilo.id} nimi={henkilo.name} numero={henkilo.number} poistoKasittelija={props.poistoKasittelija} />
					)
				})}
			</tbody>
		</table>
	)
}

const Henkilo = (props) => {
	return (
		<tr>
			<td>{props.nimi}</td>
			<td>{props.numero}</td>
			<td><button onClick={props.poistoKasittelija(props.id)}>poista</button></td>
		</tr>
	)
}

const Notification = (props) => {
	if(props.viesti === null) {
		return null
	}
	 const style = {
		color: props.color,
		background: 'lightgrey',
		fontSize: '20px',
		borderStyle: 'solid',
		borderRadius: '5px',
		padding: '10px',
		marginBottom: '10px'
	}
	return (
		<div style={style}>
			<p>{props.viesti}</p>
		</div>
	)
}

export default App;
