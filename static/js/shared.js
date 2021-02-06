'use strict';

exports.collectContentPre = (hook, context) => {
  const tagName = context.tname;
  const lineAttributes = context.state.lineAttributes;

  if (tagName === 'div' || tagName === 'p') {
    delete lineAttributes.test_line_attrib;
  } else if (tagName === 'big_font' || tagName === 'tiny_font') {
    lineAttributes.test_line_attrib = tagName;
  }
};
