## Seen API Wrapper

node-seen is a wrapper around the [Seen](http://seenmoment.com) API. Currently, the Access to the API is rescricted to white-listed IPs.


## Installation
Run the following command in your apps directory:
    $ npm install node-seen --save

## Usage
Require the seen api module in your app

    var seen = require('node-seen');
    
Once the module is included, Api endpoints can be called in the following fashion:

    var campaign = new seen.Campaign('1234');
    campaign.on('campaign', function (campaign) {
      console.log(campaign);
    });

The data returned from the endpoints event emitter will be a parsed JSON Object, ready to be consumed;

## Endpoints included
Currently, the wrapper includes a wrapper around the following endpoints and will return a parsed JSON object:
- Campaign, will retrieve a campaign and it's associated data;
- Entries, will retrieve a campaigns entries, including instagram and twitter posting data
- Entry, will retrieve a single entry

This module is a heavy a WIP, more endpoint wrappers will be added frequently. Please stay tuned.



