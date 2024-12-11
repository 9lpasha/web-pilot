/* If the script "test" does not find .(test|spec).ts files, husky will crash with an error: */
/* No tests found, exiting with code 1 */

describe('Base test', () => {
  test('Base test', () => {
    expect(null).toBe(null);
  });
});
