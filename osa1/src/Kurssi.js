import React from 'react'

const Kurssi = (props) => {
	return (
		<div>
			<Otsikko kurssi={props.kurssi} />
			<Sisalto osat={props.osat} />
			<Yhteensa osat={props.osat} />
		</div>
	)
}

const Otsikko = (props) => {
	return (
		<h1>{props.kurssi}</h1>
	)
}
const Sisalto = (props) => {
	var osat = props.osat.map(renderoitava_osa => {
		return (
			<Osa key={renderoitava_osa.id} osa={renderoitava_osa.nimi} tehtavia={renderoitava_osa.tehtavia}/>
		)
	})
	return (
		<div>
			{osat}
		</div>
	)
}
const Osa = (props) => {
	return (
		<p>{props.osa} {props.tehtavia}</p>
	)
}
const Yhteensa = (props) => {
	const reducer = (summa, arvo) => {
		if(typeof summa === 'object') {
			summa = summa.tehtavia
		}
		return summa + arvo.tehtavia
	}
	return (
		<p>yhteensä {props.osat.reduce(reducer)} tehtävää</p>
	)
}

export default Kurssi