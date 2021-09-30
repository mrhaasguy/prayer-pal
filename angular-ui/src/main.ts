import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Example ebay search:
// https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=AARONHAA-bargainp-PRD-cd482b6ae-2d2177ea&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=kobalt&paginationInput.entriesPerPage=6&GLOBAL-ID=EBAY-US&siteid=0

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
