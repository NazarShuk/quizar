# Quizar

Official website: https://quizar.nshis.com/

Quizar is an app designed to help study for your test easier and simpler. You can create your own study sets or clone from Quizlet.

## Features

- Create your own study sets
- Clone from Quizlet
- Test
- Flashcards
- Live mode - kahoot ahh

## Setup
After cloning the repo and installing dependencies, you need to make a .env file in the root directory with the following content:

```
# must be a neon database url https://neon.tech/
DATABASE_URL=postgres://... 

# clerk auth https://clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# to clone from quizlet https://scrapingbee.com/
SCRAPINGBEE_API_KEY=...
```

## Contributing

You can make pull requests. Make sure to run `npm run lint`.