'use strict'

const WIT_TOKEN = '' //wit token
if (!WIT_TOKEN) {
    throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || '' //facebook token

if (!FB_PAGE_TOKEN) {
    throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || '' //facebook password

module.exports = {
    WIT_TOKEN: WIT_TOKEN,
    FB_PAGE_TOKEN: FB_PAGE_TOKEN,
    FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}