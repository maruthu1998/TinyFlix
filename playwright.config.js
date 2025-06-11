// @ts-check
import { defineConfig, devices } from '@playwright/test';
/** 
*  @see https://playwright.dev/docs/test-configuration
*/
const config =({
testDir : './tests',
 timeout : 20*1000 ,
 expect: {
  timeout : 45*1000
 },
 reporter : 'html',
use : {
  browserName : 'chromium',
  headless : true,
  trace : 'on'
}
});
module.exports =config