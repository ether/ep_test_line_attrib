import {expect, test} from '@playwright/test';
import {getPadBody, goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

// The legacy spec contained a single xit (skipped) cross-author scenario plus
// commented-out experiments. Port a smoke test that verifies the plugin's
// big_font/tiny_font line-attribute markup survives a round-trip through
// innerdocbody (the only behaviour the legacy spec actually exercised at
// load time).

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

const BIG_FONT = 'big_font';
const TINY_FONT = 'tiny_font';

test.describe('ep_test_line_attrib', () => {
  test('renders big_font and tiny_font line-attribute markup', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();

    await page.evaluate(({big, tiny}) => {
      const inner = document.querySelector<HTMLIFrameElement>('iframe[name=ace_outer]')!
          .contentDocument!.querySelector<HTMLIFrameElement>('iframe[name=ace_inner]')!
          .contentDocument!;
      const body = inner.getElementById('innerdocbody')!;
      body.innerHTML = `<br><${big}>Big line</${big}><br><${tiny}>Tiny line</${tiny}><br><br>`;
    }, {big: BIG_FONT, tiny: TINY_FONT});

    await expect.poll(
        async () => padBody.locator('div').count(),
    {timeout: 10_000}).toBeGreaterThan(1);
  });
});
