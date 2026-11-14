import { test, expect } from '../fixtures';
import { storyUrl } from '../storybook-url';

const url = storyUrl('foundations-usability-review--compositions', { reducedMotion: true });
test.beforeEach(async ({ page }) => {
  await page.goto(url);
});

test('FAB menu fits the viewport and supports keyboard selection and return', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const trigger = page.getByRole('button', { name: 'Create', exact: true });
  await trigger.focus();
  await page.keyboard.press('ArrowUp');
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const box = (await menu.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await expect(page.getByRole('menuitem', { name: 'New document' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status', { name: 'Last action' })).toHaveText('Created');
});

test('surface primary and secondary actions work independently by keyboard', async ({ page }) => {
  const output = page.getByRole('status', { name: 'Last action' });
  const card = page.getByRole('button', { name: 'Open card Secondary action', exact: true });
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(output).toHaveText('Card');
  await page.getByRole('button', { name: 'Secondary action', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(output).toHaveText('Secondary');
  await page.getByRole('button', { name: 'Open item Item details', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(output).toHaveText('List');
  await page.getByRole('button', { name: 'Item details', exact: true }).click();
  await expect(output).toHaveText('Details');
});

test('chips expose separate named primary and remove actions', async ({ page }) => {
  await page.getByRole('button', { name: 'Alex', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status', { name: 'Last action' })).toHaveText('Alex');
  await page.getByRole('button', { name: 'Remove Alex', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('status', { name: 'Last action' })).toHaveText('Removed Alex');
  await expect(page.getByRole('button', { name: 'Compose', exact: true })).toBeVisible();
});

for (const name of ['Framework', 'Library']) {
  test(`${name} filters, highlights keyboard choices, and reports empty results`, async ({
    page,
  }) => {
    const input = page.getByRole('combobox', { name, exact: true });
    await input.fill('vue');
    await expect(page.getByRole('option', { name: 'Vue', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'React', exact: true })).toHaveCount(0);
    await page.keyboard.press('ArrowDown');
    const option = page.getByRole('option', { name: 'Vue', exact: true });
    await expect(option).toHaveAttribute('data-highlighted');
    await expect
      .poll(() => option.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe('rgba(0, 0, 0, 0)');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('Vue');
    await input.fill('zzzz');
    await expect(page.getByText('No results found', { exact: true })).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(0);
  });
}

test('icon and FAB triggers retain injected menu and tooltip behavior', async ({ page }) => {
  for (const name of ['Icon actions', 'Fab actions']) {
    const trigger = page.getByRole('button', { name, exact: true });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
  await page.getByRole('button', { name: 'Help', exact: true }).hover();
  await expect(page.getByRole('tooltip')).toHaveText('Icon help');
});

test('invalid controls expose their error descriptions', async ({ page }) => {
  await expect(page.getByRole('combobox', { name: 'Invalid choice', exact: true })).toContainText(
    'React',
  );
  for (const [role, name, error] of [
    ['combobox', 'Invalid choice', 'Choose a valid framework'],
    ['textbox', 'Notes', 'Notes are required'],
  ] as const) {
    const input = page.getByRole(role, { name, exact: true });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(error);
  }
});

test('nested modal popups paint above their parent and remain actionable', async ({ page }) => {
  await page.getByRole('button', { name: 'Nested controls', exact: true }).click();
  for (const name of ['Nested select', 'Nested autocomplete', 'Nested menu']) {
    await page
      .getByRole(name === 'Nested menu' ? 'button' : 'combobox', { name, exact: true })
      .click();
    const item = page.getByRole(name === 'Nested menu' ? 'menuitem' : 'option').first();
    await expect(item).toBeVisible();
    await expect
      .poll(() =>
        item.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }),
      )
      .toBe(true);
    await item.click();
  }
  await page.getByRole('button', { name: 'Nested dialog', exact: true }).click();
  const inner = page.getByRole('dialog', { name: 'Second dialog' });
  await expect(inner).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(inner).toBeHidden();
  await expect(page.getByRole('dialog', { name: 'Nested controls' })).toBeVisible();
});

test('long search keeps the active keyboard result visible', async ({ page }) => {
  await page.getByRole('button', { name: 'Long search', exact: true }).click();
  const input = page.getByRole('combobox', { name: 'Search', exact: true });
  await input.focus();
  for (let i = 0; i < 35; i++) await page.keyboard.press('ArrowDown');
  const selected = page.getByRole('option', { name: 'Result 35', exact: true });
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  await expect
    .poll(() =>
      selected.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const box = el.closest('[role="listbox"]')!.getBoundingClientRect();
        return r.top >= box.top - 1 && r.bottom <= box.bottom + 1;
      }),
    )
    .toBe(true);
});

for (const direction of ['ltr', 'rtl']) {
  test(`outlined notches and split corners align in ${direction}`, async ({ page }) => {
    await page.goto(
      storyUrl('foundations-usability-review--outlined-fields', { direction, reducedMotion: true }),
    );
    for (const label of [
      'Text entry',
      'Date entry',
      'Autocomplete entry',
      'Combobox entry',
      'Select entry',
    ]) {
      const control = page.getByRole(
        label === 'Text entry' || label === 'Date entry' ? 'textbox' : 'combobox',
        { name: label, exact: true },
      );
      await expect(control).toBeVisible();
      await expect
        .poll(() =>
          control.evaluate((el) => {
            const field =
              el.querySelector('fieldset') ?? el.parentElement!.querySelector('fieldset')!;
            const legend = field.querySelector('legend')!.getBoundingClientRect();
            const labelId = el.getAttribute('aria-labelledby');
            const text = (
              labelId
                ? document.getElementById(labelId)
                : document.querySelector(`label[for="${el.id}"]`)
            )!.getBoundingClientRect();
            return legend.left <= text.left + 1 && legend.right >= text.right - 1;
          }),
        )
        .toBe(true);
    }
    const radii = await page.getByRole('button', { name: 'Send', exact: true }).evaluate((el) => {
      const s = getComputedStyle(el);
      return { left: parseFloat(s.borderTopLeftRadius), right: parseFloat(s.borderTopRightRadius) };
    });
    expect(direction === 'rtl' ? radii.right : radii.left).toBeGreaterThan(
      direction === 'rtl' ? radii.left : radii.right,
    );
  });
}
test('all app bar titles and subtitles fit at rest and after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(storyUrl('foundations-usability-review--app-bars', { reducedMotion: true }));
  for (const size of ['small', 'medium', 'large', 'medium-flexible', 'large-flexible']) {
    const frame = page.getByTestId(`bar-frame-${size}`);
    const bar = frame.getByRole('toolbar');
    const fits = () =>
      bar.evaluate((el) => {
        const b = el.getBoundingClientRect();
        return [...el.querySelectorAll('[data-app-bar-title],[data-app-bar-subtitle]')]
          .filter((e) => getComputedStyle(e).visibility !== 'hidden')
          .every((e) => {
            const r = e.getBoundingClientRect();
            return r.top >= b.top - 1 && r.bottom <= b.bottom + 1;
          });
      });
    await expect.poll(fits).toBe(true);
    await frame.evaluate((el) => {
      el.scrollTop = 180;
    });
    await expect.poll(fits).toBe(true);
    await expect(frame.locator('[data-app-bar-title]')).toBeVisible();
    if (size.includes('flexible'))
      await expect.poll(() => bar.evaluate((el) => el.getBoundingClientRect().height)).toBe(64);
  }
});

for (const direction of ['ltr', 'rtl']) {
  test(`connected corners and side sheets follow ${direction}`, async ({ page }) => {
    await page.goto(
      storyUrl('foundations-usability-review--shipping-compositions', {
        direction,
        reducedMotion: true,
      }),
    );
    for (const [name, first] of [
      ['First action', true],
      ['Last action', false],
    ] as const) {
      const corners = await page.getByRole('button', { name }).evaluate((el) => {
        const s = getComputedStyle(el);
        return [parseFloat(s.borderTopLeftRadius), parseFloat(s.borderTopRightRadius)];
      });
      const outsideLeft = first === (direction === 'ltr');
      expect(corners[outsideLeft ? 0 : 1]).toBeGreaterThan(corners[outsideLeft ? 1 : 0]);
    }
    for (const side of ['start', 'end']) {
      await page.getByRole('button', { name: `Sheet ${side}` }).click();
      const sheet = page.getByRole('dialog');
      await expect(sheet).toBeVisible();
      const right = (side === 'end') === (direction === 'ltr');
      await expect(sheet).toHaveAttribute('data-swipe-direction', right ? 'right' : 'left');
      await expect
        .poll(async () => {
          const rect = (await sheet.boundingBox())!;
          return Math.abs(right ? rect.x + rect.width - page.viewportSize()!.width : rect.x);
        })
        .toBeLessThan(1);
      await sheet.getByRole('button', { name: 'Close' }).click();
      await expect(sheet).toBeHidden();
    }
  });
}
test('search suggestions remain clickable above their parent dialog', async ({ page }) => {
  await page.goto(
    storyUrl('foundations-usability-review--shipping-compositions', { reducedMotion: true }),
  );
  await page.getByRole('button', { name: 'Search dialog' }).click();
  await page.getByPlaceholder('Nested search').fill('rep');
  const option = page.getByRole('option', { name: 'Reports' });
  await expect(option).toBeVisible();
  await option.click();
});

for (const [story, selector] of [
  ['containment-divider--compliance', '[role="separator"]'],
  ['selection-slider--compliance', '[data-slider-track]'],
  ['feedback-progress--compliance', '[role="progressbar"]'],
] as const) {
  test(`centered compliance preview preserves track width: ${story}`, async ({ page }) => {
    await page.goto(storyUrl(story, { reducedMotion: true }));
    const tracks = page.locator(selector);
    await expect(tracks.first()).toBeVisible();
    for (const track of (await tracks.all()).slice(0, 2)) {
      expect((await track.boundingBox())!.width).toBeGreaterThan(200);
    }
  });
}
