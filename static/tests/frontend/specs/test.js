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
      var inner$ = helper.padInner$;

      var $lineWithOneType = inner$('div').slice(1,2);
      var $lineWithAnotherType = $lineWithOneType.next();

      // insert one line into the beginning of the other
      $lineWithOneType.prepend($lineWithAnotherType);

      // wait for Etherpad to finish processing the lines
      helper.waitFor(function() {
        var oneDivInsideAnother = inner$('div div').length === 0;
        return oneDivInsideAnother;
      }, 2000).done(done);
    });

    it('processes each line without changing any of their types', function(done) {
      var inner$ = helper.padInner$;

      var $lineThatShouldHaveAnotherType = inner$('div').slice(1,2);
      var $lineThatShouldHaveOneType = $lineThatShouldHaveAnotherType.next();

      expect($lineThatShouldHaveOneType.find(BIG_FONT).length).to.be(1);
      expect($lineThatShouldHaveAnotherType.find(TINY_FONT).length).to.be(1);

      done();
    });
  });

  /* ********************** Helper functions ************************ */
  var BIG_FONT = 'big_font';
  var TINY_FONT = 'tiny_font';

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

  var padContent = function() {
    var pad = '<br>'
            + '<' + BIG_FONT + '>Line with one type</' + BIG_FONT + '><br>'
            + '<' + TINY_FONT + '>Line with another type</' + TINY_FONT + '><br>'
            + '<br>';
    return pad;
  }

});

