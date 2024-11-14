export interface Parcel {
  code: number;
  municipality: string;
  geom: string;
  party_owner: string;
  area: string;
  land_use: string;
  date_create: any;
  update_at:any
}

/* así es como debe quedar
export interface Parcel {
  id: number,
  type: string,
  geometry: string,
  properties: {
    municipality: number,
    area: string,
    party_owner: number,
    land_use: string,
    date_create: string,
    update_at: string
  }
}
*/

