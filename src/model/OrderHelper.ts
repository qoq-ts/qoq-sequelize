export class OrderHelper {
  constructor(public orderItem: any[] = []) {}

  asc(column: string) {
    return this.orderItem.concat(column, 'ASC');
  }

  desc(column: string) {
    return this.orderItem.concat(column, 'DESC');
  }
}
