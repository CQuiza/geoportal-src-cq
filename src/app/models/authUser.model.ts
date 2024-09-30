export class AuthUserModel {

  constructor(
    public username: string,
    public token : string,
    public email: string,
    public isLoggedIn: boolean,
    public apiUrl: string
  ){};

  getToken (): string {
    if (this.token = ''){
      return 'Token ' + this.token;
      } else {
      return ''
    }
  }
}
