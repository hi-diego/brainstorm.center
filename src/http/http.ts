import axios from 'axios';
import Notebook from 'brainstorm/Notebook';

axios.defaults.baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/' 
  : 'https://seal-app-fjzi4.ondigitalocean.app/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export function setBasicAuth (password: string, user: string|null = null) {
  // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
}

/*
* 
*/
export function getBasicAuth () {
  return {
    password: window.localStorage.getItem(Notebook.getUri() + '.password') || '12345678',
    username: Notebook.getUri()
  }
}

const http = axios;

type SetterBool = React.Dispatch<React.SetStateAction<boolean>>;

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
export async function lockNotebook(locked: boolean|null) {
  try {
    var response = await http.put(Notebook.getUri(), {
      password: "12345678",
      access: locked,
      uri: Notebook.getUri(),
      content: Notebook.stringContent()
    }, { auth: getBasicAuth() });
    return response.data.access;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function updateNotebook() {
  return await http.put(Notebook.getUri(), {
    password: "12345678",
    access: null,
    uri: Notebook.getUri(),
    content: Notebook.stringContent()
  });
}
  
/*
* 
*/
export async function fetchNotebook() {
  var notebook = null;
  try {
    var response = await http.get(Notebook.getUri());
    notebook = response.data;
    const notes = JSON.parse(response.data.content);
    Notebook.loadFrom(notes);
  } catch (error: any) {
    if (error.response.status === 404) notebook = await createNotebook();
  } finally {
    console.log('fetchNotebook', notebook);
    return notebook;
  }
}

export default http;
