import { WorkTimeCalculatorPage } from './app.po';

describe('chronery-web App', () => {
  let page: WorkTimeCalculatorPage;

  beforeEach(() => {
    page = new WorkTimeCalculatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
