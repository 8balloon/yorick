# yorick
### infinite test

yorick runs all of your tests in parallel. Yes, all of them -- if you have 10,000 tests, he will run them across 10,000 processes.

yorick does this with almost no configuration.

he will give you 2 hours of test-running time per month, for free. Subscription tiers for more time are on their way.

## directions

1. create a `Dockerfile.yorick`

```
FROM node
WORKDIR /usr/src/app
COPY . ./
RUN npm install
RUN npx yorick --match '**/*.test.js' -- npm run jest
```

This configuration sets yorick to run `npm run jest <filepath>` on every file that matches `**/*.test.js`. he will print all of the concatenated successes and/or failures to the console, depending on process exit codes.

2. run `npx yorick`

he this fails due to permissions, run `sudo npx yorick`. (Yes, yorick runs `docker` commands for you.)

## depends on

node, docker
