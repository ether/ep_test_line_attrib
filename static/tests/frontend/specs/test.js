'use strict';

describe('Etherpad line attribute tests', function () {
  let padId;

  before(function (done) {
    padId = helper.newPad(() => {
      cleanPad(() => {
        createPad(done);
      });
    });

    this.timeout(60000);
  });
  /*
  context('when user moves one line into the first position of another', function() {
    before(function(done) {
      var $lineWithBigFont = getLine(LINE_WITH_BIG_FONT_BEFORE_MOVE);
      var $lineWithTinyFont = getLine(LINE_WITH_TINY_FONT_BEFORE_MOVE);

      // insert one line into the beginning of the other
      $lineWithBigFont.prepend($lineWithTinyFont);
      // wait for Etherpad to finish processing the lines
      helper.waitFor(function() {
        var oneDivInsideAnother = helper.padInner$('div div').length === 0;
        return oneDivInsideAnother;
      }, 2000).done(done);
    });

    it('processes each line without changing any of their types', function(done) {
      var $lineThatShouldBeBig = getLine(LINE_WITH_BIG_FONT_AFTER_MOVE);
      var $lineThatShouldBeTiny = getLine(LINE_WITH_TINY_FONT_AFTER_MOVE);

      expect($lineThatShouldBeBig.find(BIG_FONT).length).to.be(1);
      expect($lineThatShouldBeTiny.find(TINY_FONT).length).to.be(1);
      done();
    });
  });
*/

  // test the same scenario of authorship_of_editions.js (@ Etherpad tests)
  context('when more than one author edits a line with line attribute', function () {
    before(function (done) {
      // clean this user info on cookie, so when we refresh it will look like we're someone else
      removeUserInfo();

      // Reload pad, to make changes as a second user.
      helper.newPad(done, padId);

      this.timeout(60000);
    });

    xit('marks only the new content as changes of the second user', function (done) {
      const textChange = 'x';
      const lineNumber = LINE_WITH_BIG_FONT_AFTER_MOVE;

      // get original author class
      const classes = getLine(lineNumber).find('span').first().attr('class').split(' ');
      const originalAuthor = getAuthorFromClassList(classes);

      // make change on target line
      const $regularLine = getLine(lineNumber);
      helper.selectLines($regularLine, $regularLine, 2, 2); // place caret after 2nd char of line
      $regularLine.sendkeys(textChange);

      // wait for change to be processed by Etherpad
      let otherAuthorsOfLine;
      helper.waitFor(() => {
        const authorsOfLine = getLine(lineNumber).find('span').map(function () {
          return getAuthorFromClassList($(this).attr('class').split(' '));
        }).get();
        otherAuthorsOfLine = authorsOfLine.filter((author) => author !== originalAuthor);
        const lineHasChangeOfThisAuthor = otherAuthorsOfLine.length > 0;
        return lineHasChangeOfThisAuthor;
      }).done(() => {
        const thisAuthor = otherAuthorsOfLine[0];
        const $changeOfThisAuthor = getLine(lineNumber).find(`span.${thisAuthor}`);
        expect($changeOfThisAuthor.text()).to.be(textChange);
        done();
      });
    });
  });

  /* ********************** Helper functions ************************ */
  const BIG_FONT = 'big_font';
  const TINY_FONT = 'tiny_font';

  const LINE_WITH_BIG_FONT_BEFORE_MOVE = 1;

  // line with tiny font will be moved to the position of line with big font
  const LINE_WITH_TINY_FONT_AFTER_MOVE = LINE_WITH_BIG_FONT_BEFORE_MOVE;
  const LINE_WITH_BIG_FONT_AFTER_MOVE = LINE_WITH_TINY_FONT_AFTER_MOVE + 1;

  const padContent = function () {
    const pad = `${'<br>' +
            '<'}${BIG_FONT}>Big line</${BIG_FONT}><br>` +
            `<${TINY_FONT}>Tiny line</${TINY_FONT}><br>` +
            '<br>';
    return pad;
  };

  const cleanPad = function (done) {
    const inner$ = helper.padInner$;
    const $padContent = inner$('#innerdocbody');
    $padContent.html('.');

    // wait for Etherpad to re-create first line
    helper.waitFor(() => {
      const numberOfLinesOnPad = inner$('div').length;
      return numberOfLinesOnPad === 1;
    }, 2000).done(done);
  };

  const createPad = function (done) {
    const inner$ = helper.padInner$;

    // set pad content
    const $firstLine = inner$('div').first();
    $firstLine.html(padContent());

    // wait for Etherpad to finish processing the lines
    helper.waitFor(() => {
      const numberOfLinesOnPad = inner$('div').length;
      return numberOfLinesOnPad > 1;
    }, 2000).done(done);
  };

  const getLine = function (lineNumber) {
    return helper.padInner$('div').eq(lineNumber);
  };

  const getAuthorFromClassList = function (classes) {
    return classes.find((cls) => cls.startsWith('author'));
  };

  // Expire cookie, to make sure it is removed by the browser.
  // See https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_4_Reset_the_previous_cookie
  const removeUserInfo = function () {
    helper.padChrome$.document.cookie = 'token=foo;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/p';
    helper.padChrome$.document.cookie = 'token=foo;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  };
});
