/*
* The entire three.js graph view and the html form controls.
*/
export interface RemoteNotebook {
  id: number,
  title: string,
  content: string,
  password: string,
  uri: string,
  access: boolean|null
}

interface Notebook {
  uri: string
}

interface Note {
  id: number,
  uuid: string,
  title: string,
  content: string,
}

export type { Notebook, Note }