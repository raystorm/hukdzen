Local-Utilities
===============

Local CLI Utilities for testing things.

Current Functionality

  1. Test if Files will be indexible, and what the keywords text should look like.  
     **_NOTE:_** Requires, `npm install` for **ingestTrigger**
     1. usage `node localUtil.js testFile <path to File>` 
  2. Translate between AK and BC orthographies
     **_NOTE:_** for best results "" (double-quote) the input text
     1. usage (AK to BC) `node localUtil.js translate -ak <text to translate>` 
     2. usage (BC to AK) `node localUtil.js translate -bc <text to translate>`