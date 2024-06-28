import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { grammars } from '../packages/tm-grammars/index'
import { themes } from '../packages/tm-themes/index'

const gNames = grammars.map(g => g.name)
const tNames = themes.map(t => t.name)

for (const t of tNames) {
  test.describe(`[${t}] — a11y color contrast`, () => {
    for (const g of gNames) {
      test(`[${g}]`, async ({ page }, testInfo) => {
        await page.goto('http://localhost:3333/')

        // We hide the textarea since it blocks the element we want to test
        await page.locator('#input').evaluate(element => element.style.display = 'none')

        await page.getByTestId(g).click()

        await page.getByTestId(t).click()

        await page.locator('#code-output').waitFor()

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('#code-output')
          .withTags(['cat.color'])
          .analyze()

        await testInfo.attach('accessibility-scan-results', {
          body: JSON.stringify(accessibilityScanResults, null, 2),
          contentType: 'application/json',
        })

        expect(accessibilityScanResults.violations).toEqual([])
      })
    }
  })
}
