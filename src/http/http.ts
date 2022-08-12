import axios from 'axios';

axios.defaults.baseURL = 'https://seal-app-fjzi4.ondigitalocean.app/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export function setBasicAuth (password: string, user: string|null = null) {
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
}

export default axios;
