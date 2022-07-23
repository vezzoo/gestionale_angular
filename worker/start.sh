#!/bin/sh

cd ~/gestionale_angular/worker
OPENSSL_CONF=/etc/ssl/ node lib/index.js > worker.log 2> worker.err
