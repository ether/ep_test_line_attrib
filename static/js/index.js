'use strict';

exports.aceEditorCSS = () => ['ep_test_line_attrib/static/css/editor.css'];

exports.aceRegisterBlockElements = () => ['big_font', 'tiny_font'];

// Our attribute will result in a 'test_line_attrib:(...)' class
exports.aceAttribsToClasses = (hook, context) => {
  if (context.key === 'test_line_attrib') {
    return [`test_line_attrib:${context.value}`];
  }
};

// Here we convert the class 'test_line_attrib:(...)' into a tag
exports.aceDomLineProcessLineAttributes = (name, context) => {
  const cls = context.cls;
  const lineType = /(?:^| )test_line_attrib:([a-z_]*)/.exec(cls);

  if (lineType && lineType[1]) {
    const tag = lineType[1];
    const modifier = {
      preHtml: `<${tag}>`,
      postHtml: `</${tag}>`,
      processedMarker: true,
    };
    return [modifier];
  }
  return [];
};
