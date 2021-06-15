# yorick
### infinite test

yorick runs all of your test files in parallel in the cloud. Yes, all of them -- if you have 1000 test files, yorick will run them across 1000 processesors.

yorick will give you 40 minutes of test-running time across as many as 100 processesors per week, for free. Subscription tiers for more time and higher parallelization are on the way.

## directions

1. create a `yorick.Dockerfile`

```
FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npx yorick --match '**/*.test.js' --command 'npm run test'
```

This configuration sets yorick to run `npm run jest <filepath>` on every file that matches `**/*.test.js`. yorick will print all of the concatenated successes and/or failures to the console, depending on process exit codes.

2. run `npx yorick`

If this fails due to permissions, run `sudo npx yorick`. (yorick uses `docker`, which may require `sudo` depending on your setup.)

## depends on

node, docker

## to note

yorick runs your tests on a read-only file system.
yorick will not run test images over 10Gb
yorick will not run tests that take over 10 minutes.
yorick will allocate approximately 1 processor per 2Gb of memory allocated, and allows up to 10Gb of memory

