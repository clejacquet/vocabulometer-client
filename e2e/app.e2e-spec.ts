import { VocabnalyzePage } from './app.po';

describe('vocabnalyze App', () => {
  let page: VocabnalyzePage;

  beforeEach(() => {
    page = new VocabnalyzePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
