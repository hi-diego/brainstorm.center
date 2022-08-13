import axios from 'axios';
import type { Notebook, Note } from '../types/Brainstorm';

axios.defaults.baseURL = 'https://seal-app-fjzi4.ondigitalocean.app/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

/*
* 
*/
export function setBasicAuth (password: string|null) {
  window.localStorage.setItem(Notebook.getUri() + '.password', password || '12345678');
  return getBasicAuth();
}

/*
* 
*/
export function getBasicAuth (password: string|null = null) {
  return {
    password: password || (window.localStorage.getItem(Notebook.getUri() + '.password') || '12345678'),
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
      password: "12345678",
      access: null,
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
export async function lockNotebook(locked: boolean|null, pass: string|null = '12345678') {
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
    password: "12345678",
    access: null,
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
    // const notes = JSON.parse(response.data.content);
    // Notebook.loadFrom(notes);
  } catch (error: any) {
    if (error.response.status === 404) notebook = await createNotebook();
  } finally {
    // console.log('fetchNotebook', notebook);
    return notebook;
  }
}

export default http;
