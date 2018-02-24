export class Project {
  userId: string;
  id: string;
  number: string;
  name: string;
  inactive: boolean;

  constructor(userId?: string, id?: string, number?: string, name?: string) {
    if (userId) {
      this.userId = userId;
    }
    this.id = id || '';
    this.number = number || '';
    this.name = name || '';
    this.inactive = false;
  }
}
