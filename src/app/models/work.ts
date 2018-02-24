export class Work {
  _id: string;
  _rev: string;
  date: string;
  projectId: string;
  projectNumber: string;
  projectName: string;
  from: string;
  to: string;
  pause: string;
  spent: string;
  comment: string;

  constructor(date: string) {
    this.date = date;
    this.from = '00:00';
    this.to = '00:00';
    this.pause = '00:00';
    this.spent = '00:00';
  }
}
