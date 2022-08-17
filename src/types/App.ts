/*
* The entire three.js graph view and the html form controls.
*/
export interface FormState {
  title: string,
  content: string,
  password: string
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