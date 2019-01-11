# Jamquery

> Record dominates memory.

## `package.json` scripts

- `start`

  Starts the server in development mode.

  It runs both webpack(for client) and nodemon(for server) **in parallel** using `npm-run-all`

- `build`

  Initiates the entire build process.

  run webpack(for client) and babel(for server) **sequentially**!

- `serve`

  Starts the server (production)

  Must called after `build`.

## Structure Overview

- `src/, dist/`

  Server side codes reside here. `babel` generates files in `dist/` directory using `.js` files in `src` directory.

- `src-public, public/, public/dist/`

  Client side codes reside here.

  `src-public`: Javascript codes for browser are here. webpack uses these to create a bundle

  `public`: `index.html` file and static resources are here.

## Tasks

### Tag system

- [x] Add `tag` column
- [x] Process existing data
- [x] Show tag with title
- [x] Process input with tags
- [ ] Handle long tags

### Redesign

- [ ] Make sketch file
- [ ] Clean up / Align results
- [ ] Dark style
- [ ] integrate CSS files using babel

### Functions

- [x] Do not show link in the result directly
- [x] Sort the results by date in descending order
- [x] Highlight words
- [ ] Fuzzy search - approximate string matching
- [ ] Search methods - name, tag, date
- [ ] Pagination (Infinite scrolling)

### Refactoring

- [ ] Project structure
- [x] Add .npmrc
- [x] Use ESLint with Airbnb standards
- [ ] Add tests

## Future Plan

### Extend concept of jamquery

Currently It only stores `link`. Managing simple notes or code snippets would be helpful.

### User management

Anyone can access it now. Maybe some authentication is needed.

### Introducing Vue.js

If the project gets bigger, concrete structure will be more important. Also Vue.js is promising framework currently. (in 2019)

### Analyzing the developing pattern

Look at the jamqueries, and you will see the patterns in those links. It is quite helpful when we want to take a retrospect to figure out what I've done, and so on.
