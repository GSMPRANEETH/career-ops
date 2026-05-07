import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://boards.greenhouse.io/conga/jobs/4321004', { waitUntil: 'networkidle' });
    
    // Scroll to bottom to ensure everything is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const data = await page.evaluate(() => {
      const form = document.querySelector('#application_form') || document.body;
      const questions = [];
      
      // Look for common greenhouse structures
      const fields = form.querySelectorAll('.field, div[label]');
      fields.forEach(f => {
        const label = f.querySelector('label');
        if (label) {
          questions.push({
            label: label.innerText.trim(),
            required: !!f.querySelector('.asterisk, .required')
          });
        }
      });

      // Fallback: search for all labels if none found with .field
      if (questions.length === 0) {
        document.querySelectorAll('label').forEach(l => {
          questions.push({
            label: l.innerText.trim(),
            required: false // Hard to tell without container
          });
        });
      }

      return questions;
    });

    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
