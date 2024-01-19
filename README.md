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

Move your pages to the `src/pages` directory and name homepage file `index.js`(jsx,ts or tsx) and function `Index()`.

_Start function names with capital letters so that they aren't confused as html elements_

## Getting Started

After you make sure that your pages are inside `src/pages`, you can start generating routes:

```
rdr init
rdr route --watch
```

use `rdr init` only for initialization

## Configuration

`rdr init` to generate default configuration file:

```js
const rdr = {
  pages_dir: "", // /src/pages
  route_file: "", // src/route.js
};
export default rdr;
```

### Fields

```js
const rdr = {
  pages_dir: "/src/pages", // location of the pages
  route_file: "src/routes.js", // location of the generated routes
  typescript: false, // enable typescript
};
export default rdr;
```

## CLI

- `rdr init` - generate configuration file
- `rdr route` - generate routes

## Watch Mode

With the `--watch` flag, the `rdr route` command will keep running and regenerate routes whenever a file in the watched directory changes.

```
rdr route --watch
```

This is useful during development when you want to see your changes reflected in the routes without having to manually run the `rdr route` command each time.

## Dynamic Routing

Dynamic routing is supported through the use of placeholders in route definitions. These placeholders, enclosed in square brackets (`[]`), represent variable parts of the URL.

For instance, a route like `/users/[id]` would match URLs like `/users/123`, with `123` being passed as a parameter to the corresponding component. To access params, you can use `useRouteParams` hooks:

```jsx
import { useRouteParams } from "react-dir-router";

export default function User() {
  const params = useRouteParams();
  const id = params.id; // 123 in this example

  // rest of the code
}
```
