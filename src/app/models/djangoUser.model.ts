export class DjangoUserModel {
  constructor(
    public userId: number,
    public username: string,
    public email: string,
    public first_name: string,
    public last_name: string,
    public is_staff: boolean,
    public is_superuser: boolean,
    public is_active: boolean,
    public date_joined: Date,
    public last_login: Date,
    public groups: string[],
    public user_permissions: string[],
  ){}
}
