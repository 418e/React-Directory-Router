- configuration - rdr.config.js file for configuring directories, routes and etc
- dynamic routing - if page name is `[slug]` and is placed inside `src/page/blogs` directory, component should be attach to the `/blogs/*` route and slug should be accessible using props
- automatic generation - `route.js` file generation should be automated `npm route` should regenerate routes when new files are added or removed from the directory, names of files or components are changed, configuration has been updated