export class Customer {

  constructor(
    public firstName = '',
    public lastName = '',
    public email = '',
    public phone? : '',
    public notification? : string,
    public sendCatalog = false,
    public addressType = 'home',
    public street1?: string,
    public street2?: string,
    public city?: string,
    public state = '',
    public zip?: string) { }
}
