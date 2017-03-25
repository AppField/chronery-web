import { WorkTimeCalculatorPage } from './app.po';

describe('work-time-calculator App', () => {
  let page: WorkTimeCalculatorPage;

  beforeEach(() => {
    page = new WorkTimeCalculatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
