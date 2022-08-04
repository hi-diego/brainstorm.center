import Gun from 'gun';
import 'gun/sea';

// get the username from the host: example: http://menuguru.brainstorm.center -> menuguru will be the username
const username = ((window as any).location.host || '').split(':').shift().split('.').shift();
const gun = Gun(['http://localhost:8765/gun']);
const auth = gun.user();

function Auth () {
  gun.get('~@' + username).once((data, uid) => {
    var storedPassword = window.localStorage.getItem('brainstorm.center.password') || askUserForPassword();
    if (!data) return createUserFromSubdomain(storedPassword);
    authUser(storedPassword);
  });
  return { gun, user: auth }
}

function createUserFromSubdomain (pass: string) : boolean {
  auth.create(username, pass || '', (ack: any) => {
    if (!!ack.err) return window.localStorage.setItem('brainstorm.center.password', pass);
    if (ack.err === 'User already created!') authUser(pass);
    else createUserFromSubdomain(askUserForPassword());
  });
  return false;
}

function askUserForPassword () : string {
  const password = window.prompt('Provide a password', '123456789') || '';
  if (password.length < 9) return askUserForPassword();
  window.localStorage.setItem('brainstorm.center.password', password);
  return password;
}

function authUser (password: string) {
  auth.auth(username, password, (res: any) => {
    auth.get('notes').on((data, uid) => {
      console.log(data);
    });
    if (!!res.err) return window.localStorage.setItem('brainstorm.center.user', res);
    askUserForPassword();
  });
}

export default Auth