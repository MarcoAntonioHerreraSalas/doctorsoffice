export  interface Permission {
    label: string,
    value: string
}


export interface UserInterface{
    _id?:string,
    avatar?: string,
    name?: string,
    email?: string,
    password?: string,
    role?: string,
    date?:string,
    __v?:number,
    permissions?: String[]
}