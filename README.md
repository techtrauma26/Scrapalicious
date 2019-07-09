# Scrapalicious

> A web scraping application that scrapes news articles from the Science section of the New York Times.

## Table of contents

* [General info](#general-info)
* [Setup](#setup)
* [Examples](#examples)
* [Technologies](#technologies)

## General info

Scrapalicious is a scraper app which captures the title, summary and link of articles in the Science section of The New York Times. Using the app, users can save their favorite articles and add comments to their saved articles. 

## Setup

To Install Locally:

1. Clone the git repository 

```sh
$ git clone https://github.com/techtrauma26/Scrapalicious
```
2. Install packages & dependencies 

```sh
$ npm install
```
    * The app utilizes the following dependencies:

  ```sh
    "axios": "^0.19.0",
    "cheerio": "^1.0.0-rc.3",
    "express": "^4.17.1",
    "express-handlebars": "^3.1.0",
    "mongoose": "^5.6.3"
 ```
 3. MongoDB 
    ```sh
    $ node server
    ```


## Technologies

* [Node.js](https://nodejs.org/)
* [Express-Handlebars]
* [Cheerio]
* [Mongoose]
* [Express]
* [MongoDB]