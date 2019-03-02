import axios from 'axios'
import Store from '../store/index'

const url = process.env.VUE_APP_GAMES_URL

class GameService {
  static getAll () {
    Store.dispatch('checkIsAuthenticated')
    let config = {
      headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` }
    }
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + '/getAll', config)
        const data = res.data
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  static getGames () {
    Store.dispatch('checkIsAuthenticated')
    let config = {
      headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` }
    }
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}/getGames`, config)
        const data = res.data
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  static async createGame (data) {
    Store.dispatch('checkIsAuthenticated')
    let config = {
      headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` }
    };
    let res = null
    try {
      res = await axios.post(url, data, config)
    } catch (err) {
      res = err.response.data
    }
    return res
  }

  static deleteGame (name) {
    Store.dispatch('checkIsAuthenticated')
    let config = {
      headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` }
    }
    return axios.delete(`${url}/${name}`, config)
  }

  static deleteGameById (id) {
    Store.dispatch('checkIsAuthenticated')
    let config = {
      headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` }
    }
    return axios.post(`${url}/deleteById`, { id } ,config)
  }
}
export default GameService
