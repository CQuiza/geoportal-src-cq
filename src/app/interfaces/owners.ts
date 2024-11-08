export interface OwnersGet{
  id:number,
  name: string,
  lastName: string,
  email: string,
  phone: string,
  description: string,
  task: string,
  done: boolean
}
export interface OwnersPost{
  name: string,
  lastName: string,
  email: string,
  phone: string,
  description: string,
  task: string,
  done: boolean
}
