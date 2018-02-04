import axios from 'axios'

class Client {
	constructor(baseUrl) {
		this.baseUrl = baseUrl
	}
	
	haeKaikki() {
		return axios.get(this.baseUrl)
	}
	
	lisaa(henkilo) {
		return axios.post(this.baseUrl, henkilo)
	}
	
	poista(id) {
		return axios.delete(this.baseUrl+"/"+id)
	}
	
	muuta(id, henkilo) {
		return axios.put(this.baseUrl+"/"+id, henkilo)
	}
}

export default Client