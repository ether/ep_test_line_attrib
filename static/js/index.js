exports.aceEditorCSS = function() {
  return ['ep_test_line_attrib/static/css/editor.css'];
};

exports.aceRegisterBlockElements = function() {
  return ['big_font', 'tiny_font'];
}

// Our attribute will result in a 'test_line_attrib:(...)' class
exports.aceAttribsToClasses = function(hook, context) {
  if(context.key == 'test_line_attrib') {
    return ['test_line_attrib:' + context.value ];
  }
}

// Here we convert the class 'test_line_attrib:(...)' into a tag
exports.aceDomLineProcessLineAttributes = function(name, context) {
  var cls = context.cls;
  var lineType = /(?:^| )test_line_attrib:([a-z_]*)/.exec(cls);

  if (lineType && lineType[1]) {
    var tag = lineType[1];
    var modifier = {
      preHtml: '<' + tag + '>',
      postHtml: '</' + tag + '>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};
