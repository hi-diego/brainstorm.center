import axios from 'axios';
import Notebook from '../brainstorm/Notebook';

axios.defaults.baseURL = 'https://seal-app-fjzi4.ondigitalocean.app/';
axios.defaults.headers.post['Content-Type'] = 'application/json';


export function getPassword(): string {
  return window.localStorage.getItem(Notebook.getUri() + '.password') || '';
}

/*
* 
*/
export function setBasicAuth (password: string = '') {
  window.localStorage.setItem(Notebook.getUri() + '.password', password);
  return getBasicAuth();
}

/*
* 
*/
export function getBasicAuth () {
  return {
    password: getPassword(),
    username: Notebook.getUri()
  }
}

const http = axios;

type SetterBool = React.Dispatch<React.SetStateAction<boolean|null>>;

/*
* 
*/
export async function createNotebook() {
  try {
    var response = http.post('', {
      password: getPassword(),
      access: getPassword() !== '',
      uri: Notebook.getUri(),
      content: "{}"
    }, { auth: getBasicAuth() });
  } catch (err) {
    console.log(err);
  }
}
  
export async function lockCurrentNotebook (locked: boolean|null, setLock: SetterBool) {
  setLock((await lockNotebook(locked)));
}
  
/*
* 
*/
export async function lockNotebook(locked: boolean|null, pass: string = '') {
  console.log(pass, getBasicAuth());
  try {
    var response = await http.put(Notebook.getUri(), {
      password: pass,
      access: locked,
      uri: Notebook.getUri(),
      content: Notebook.stringContent()
    }, { auth: getBasicAuth() });
    return response.data.access;
  } catch (err) {
   // console.log(err);
    return false;
  }
}

export async function updateNotebook() {
  return await http.put(Notebook.getUri(), {
    uri: Notebook.getUri(),
    content: Notebook.stringContent()
  }, { auth: getBasicAuth() });
}
  
/*
* 
*/
export async function fetchNotebook() {
  var notebook = null;
  try {
    var response = await http.get(Notebook.getUri(), { auth: getBasicAuth() });
    notebook = response.data;
  } catch (error: any) {
    if (error.response.status === 404) notebook = await createNotebook();
  } finally {
    return notebook;
  }
}

export function wrapPromise(promise: any) {
  let status = 'pending';
  let response: any = null;
  const suspender = promise.then(
    (res: any) => {
      status = 'success';
      response = res;
    },
    (err: any) => {
      status = 'error'
      response = err;
    },
  );
  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  }
  return { read };
}

export default http;
