exports.collectContentPre = function(hook, context) {
  var tagName        = context.tname;
  var lineAttributes = context.state.lineAttributes;

  if(tagName === 'div' || tagName === 'p'){
    delete lineAttributes['test_line_attrib'];
  } else if(tagName === 'line_attrib1' || tagName === 'line_attrib2') {
    lineAttributes['test_line_attrib'] = tagName;
  }
};
