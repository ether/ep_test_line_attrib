describe('Etherpad line attribute tests', function() {
  var padId;

  before(function(done) {
    padId = helper.newPad(function() {
      cleanPad(function() {
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
  context('when more than one author edits a line with line attribute', function() {
    before(function(done) {
      // clean this user info on cookie, so when we refresh it will look like we're someone else
      removeUserInfo();

      // Reload pad, to make changes as a second user.
      helper.newPad(done, padId);

      this.timeout(60000);
    });

    xit('marks only the new content as changes of the second user', function(done) {
      var textChange = 'x';
      var lineNumber = LINE_WITH_BIG_FONT_AFTER_MOVE;

      // get original author class
      var classes = getLine(lineNumber).find('span').first().attr('class').split(' ');
      var originalAuthor = getAuthorFromClassList(classes);

      // make change on target line
      var $regularLine = getLine(lineNumber);
      helper.selectLines($regularLine, $regularLine, 2, 2); // place caret after 2nd char of line
      $regularLine.sendkeys(textChange);

      // wait for change to be processed by Etherpad
      var otherAuthorsOfLine;
      helper.waitFor(function() {
        var authorsOfLine = getLine(lineNumber).find('span').map(function() {
          return getAuthorFromClassList($(this).attr('class').split(' '));
        }).get();
        otherAuthorsOfLine = authorsOfLine.filter(function(author) {
          return author !== originalAuthor;
        });
        var lineHasChangeOfThisAuthor = otherAuthorsOfLine.length > 0;
        return lineHasChangeOfThisAuthor;
      }).done(function() {
        var thisAuthor = otherAuthorsOfLine[0];
        var $changeOfThisAuthor = getLine(lineNumber).find('span.' + thisAuthor);
        expect($changeOfThisAuthor.text()).to.be(textChange);
        done();
      });
    });
  });

  /* ********************** Helper functions ************************ */
  var BIG_FONT  = 'big_font';
  var TINY_FONT = 'tiny_font';

  var LINE_WITH_BIG_FONT_BEFORE_MOVE  = 1;
  var LINE_WITH_TINY_FONT_BEFORE_MOVE = LINE_WITH_BIG_FONT_BEFORE_MOVE + 1;

  // line with tiny font will be moved to the position of line with big font
  var LINE_WITH_TINY_FONT_AFTER_MOVE = LINE_WITH_BIG_FONT_BEFORE_MOVE;
  var LINE_WITH_BIG_FONT_AFTER_MOVE  = LINE_WITH_TINY_FONT_AFTER_MOVE + 1;

  var padContent = function() {
    var pad = '<br>'
            + '<' + BIG_FONT + '>Big line</' + BIG_FONT + '><br>'
            + '<' + TINY_FONT + '>Tiny line</' + TINY_FONT + '><br>'
            + '<br>';
    return pad;
  }

  var cleanPad = function(done) {
    var inner$ = helper.padInner$;
    var $padContent = inner$('#innerdocbody');
    $padContent.html('.');

    // wait for Etherpad to re-create first line
    helper.waitFor(function(){
      var numberOfLinesOnPad = inner$('div').length;
      return numberOfLinesOnPad === 1;
    }, 2000).done(done);
  }

  var createPad = function(done) {
    var inner$ = helper.padInner$;

    // set pad content
    var $firstLine = inner$('div').first();
    $firstLine.html(padContent());

    // wait for Etherpad to finish processing the lines
    helper.waitFor(function() {
      var numberOfLinesOnPad = inner$('div').length;
      return numberOfLinesOnPad > 1;
    }, 2000).done(done);
  }

  var getLine = function(lineNumber) {
    return helper.padInner$('div').eq(lineNumber);
  }

  var getAuthorFromClassList = function(classes) {
    return classes.find(function(cls) {
      return cls.startsWith('author');
    });
  }

  // Expire cookie, to make sure it is removed by the browser.
  // See https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Example_4_Reset_the_previous_cookie
  var removeUserInfo = function() {
    helper.padChrome$.document.cookie = 'token=foo;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/p';
    helper.padChrome$.document.cookie = 'token=foo;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
});
