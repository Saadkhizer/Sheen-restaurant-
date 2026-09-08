import {defineConfig} from "@playwright/test";
export default defineConfig({
 testDir:"./tests/browser",fullyParallel:false,workers:1,timeout:60000,
 expect:{timeout:10000},reporter:[["list"],["json",{outputFile:"test-results/results.json"}]],
 use:{baseURL:"http://127.0.0.1:3000",channel:"chrome",headless:true,viewport:{width:1440,height:1000},screenshot:"only-on-failure",trace:"retain-on-failure"},
});
