interface ItemJson {
    id: number;
    name: string;
    price: number;
  }
  export class Item {
    private _id: number;
    constructor(
      private _name: string,
      private _price: number
    ) {}
  
    static fromJSON(json: ItemJson): Item {
      const item = new Item(
        json.name,
        json.price
      );
      item._id = json.id;
      return item;
    }
  
    toJSON(): ItemJson {
      return <ItemJson>{
        name: this.name,
        price: this.price
      };
    }
    get id(): number {
      return this._id;
    }
  
    get name(): string {
      return this._name;
    }
  
    get price(): number {
      return this._price;
    }
  }
  
