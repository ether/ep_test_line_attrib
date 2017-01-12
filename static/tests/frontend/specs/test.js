describe('Etherpad line attribute tests', function() {
  before(function(done) {
    helper.newPad(function() {
      cleanPad(function() {
        createPad(done);
      });
    });

    this.timeout(60000);
  });

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
    $padContent.html('');

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
    return helper.padInner$('div').slice(lineNumber, lineNumber + 1);
  }

});

