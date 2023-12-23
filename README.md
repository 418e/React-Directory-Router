# React Directory Router

Directory based routing for React.js

## Installation

```
npm i -g react-dir-router@latest
```

or

```
sudo npm i -g react-dir-router@latest
```

Move your pages into the `src/pages` directory and name homepage file `index.js`(jsx,ts or tsx) and function `index()`.

## Running

```
rdr init
rdr route
```

`rdr init` - generates configuration file (soon)
`rdr route` - generates routes

## Configuration

`rdr init` to generate default configuration file:

```js
module.exports.rdr = {};
```

### Fields

```js
module.exports.rdr = {
  pages_dir: "/src/pages", // location of the pages
  route_file: "src/routes.js", // location of the generated routes
};
```

## Note

Library is still in the early stage of development and lots of features are still on the way
