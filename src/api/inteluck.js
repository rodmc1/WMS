import axios from 'axios';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export default axios.create({
  baseURL: process.env.REACT_APP_INTELUCK_API_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${cookie.get('user-token')}`
  }
});