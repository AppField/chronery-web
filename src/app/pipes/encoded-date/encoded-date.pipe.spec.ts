import { EncodedDatePipe } from './encoded-date.pipe';

describe('EncodedDatePipe', () => {
  it('create an instance', () => {
    const pipe = new EncodedDatePipe();
    expect(pipe).toBeTruthy();
  });
});
