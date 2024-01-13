#!/bin/bash

sudo find /var/www/Mern/back-end -mindepth 1 -not -name 'node_modules' -not -path '/var/www/html/node_modules*' -exec rm -rf {} +