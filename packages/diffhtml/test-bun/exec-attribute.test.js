import { expect, test } from 'bun:test';
import { execFileSync } from 'child_process';
import { execAttribute, attribute } from '../lib/util/parse.js';

// Verify small attribute parsing matches regular expression
// behavior under normal conditions.
test('execAttribute returns same match as attribute.exec', () => {
  const input = 'attr="value">';
  attribute.lastIndex = 0;
  const direct = attribute.exec(input);
  const result = execAttribute(input, 0);
  expect(result).not.toBeNull();
  expect(result[0]).toBe(direct[0]);
  expect(result.index).toBe(0);
});

// Ensure that huge attributes which would normally throw
// a RangeError are handled gracefully by execAttribute.
test('execAttribute handles extremely large attributes', () => {
  const len = 5_000_000;
  const huge = 'data="' + 'a'.repeat(len) + '">';
  const script = `import { attribute, execAttribute } from './packages/diffhtml/lib/util/parse.js';\n` +
    `const len = ${len};\n` +
    `const str = 'data="' + 'a'.repeat(len) + '\">';\n` +
    `attribute.lastIndex = 0;\n` +
    `let threw = false;\n` +
    `try { attribute.exec(str); } catch (e) { if (e instanceof RangeError) threw = true; }\n` +
    `const res = execAttribute(str, 0);\n` +
    `console.log(JSON.stringify({ threw, len: res ? res[0].length : null }));`;
  const out = execFileSync('node', ['--experimental-loader=./loader.mjs', '-e', script]).toString();
  const { threw, len: nodeLen } = JSON.parse(out);
  expect(threw).toBe(true);
  expect(nodeLen).toBe(len + 7);
});
