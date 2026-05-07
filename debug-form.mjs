import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://boards.greenhouse.io/conga/jobs/4321004', { waitUntil: 'networkidle' });
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    // Check for "Apply Now" button and click it
    const applyButton = await page.$('a:has-text("Apply Now"), button:has-text("Apply Now")');
    if (applyButton) {
        console.log('Clicking Apply Now...');
        await applyButton.click();
        await page.waitForTimeout(2000);
    }

    const labels = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim());
    });
    console.log('Labels found:', JSON.stringify(labels, null, 2));

    const formText = await page.evaluate(() => {
        const form = document.querySelector('#application_form');
        return form ? form.innerText : 'Form #application_form not found';
    });
    console.log('Form text snippet:', formText.substring(0, 1000));

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
