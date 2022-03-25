# GoogleThis

A Discord bot meant to integrate features from [LuanRT/google-this](https://github.com/LuanRT/google-this).

## Features

### Google Search

#### Search for any query:

![Search Chat Input](https://github.com/Tokipudi/GoogleThis/blob/main/src/media/readme/searchchatinput.gif)

#### Search for a query based on a user's message:

![Search Context Menu](https://github.com/Tokipudi/GoogleThis/blob/main/src/media/readme/searchcontextmenu.gif)

#### Search for a word definition

![Search Dictionary](https://github.com/Tokipudi/GoogleThis/blob/main/src/media/readme/dictionary.gif)

#### Search for a word translation

![Search Translate](https://github.com/Tokipudi/GoogleThis/blob/main/src/media/readme/translate.gif)

### Reverse Image Search

![Reverse Image Search](https://github.com/Tokipudi/GoogleThis/blob/main/src/media/readme/reverseimagesearch.gif)

### How to run

If you want to clone this project and run it on your end, here are the first steps you want to take.

**WARNING: This bot was not meant to be ran by anyone else than me. It is extremely likely that you will encounter errors when trying to make it run for the first time.**

## Pre-requisites

* Node >= 16
* A Postgresql Database
* Hirez developer API credentials (you can request them [here](https://fs12.formsite.com/HiRez/form48/secure_index.html))

## Installation

* Rename `.env.example` to `.env` and configure it properly
* Install the node application: `npm install`
* Compile typescript files: `npm run build`
* Start the bot: `npm start`
