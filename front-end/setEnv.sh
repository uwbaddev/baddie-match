#!/bin/sh

# Substitute container environment into production packaged react app
# CRA does have some support for managing .env files, but not as an `npm build` output

# To test:
# docker run --rm -e API_URI=http://localhost:5000/api -e CONFLUENCE_URI=https://confluence.evilcorp.org -e INTRANET_URI=https://intranet.evilcorp.org -it -p 3000:80/tcp dam-frontend:latest

cp -f /usr/share/nginx/html/API /tmp

if [ -n "$API_URI" ]; then
sed -i -e "s|REPLACE_API_URI|$API_URI|g" /tmp/index.html
fi

if [ -n "$CONFLUENCE_URI" ]; then
sed -i -e "s|REPLACE_CONFLUENCE_URI|$CONFLUENCE_URI|g" /tmp/index.html
fi

if [ -n "$INTRANET_URI" ]; then
sed -i -e "s|REPLACE_INTRANET_URI|$INTRANET_URI|g" /tmp/index.html
fi

cat /tmp/index.html > /usr/share/nginx/html/index.html