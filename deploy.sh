#!/bin/bash

cd front-end
npm run build
cd ..
git add .
git commit -m "Creating deployment build"
git push heroku main