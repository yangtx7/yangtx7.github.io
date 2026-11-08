# Locally hosted browser dependencies

These pinned assets ship with the site so normal page loads do not depend on
jsDelivr or Google Fonts. Keep the upstream license files with each package.

- jQuery 3.6.0: `https://cdn.jsdelivr.net/npm/jquery@3.6.0/`
- MDBootstrap 4.20.0: `https://cdn.jsdelivr.net/npm/mdbootstrap@4.20.0/`
- medium-zoom 1.1.0: `https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/`
- Roboto: Google Fonts' Latin WOFF2 file, served by `assets/css/fonts.css`
  with `font-display: swap`. The theme uses weights 300, 400, 500, and 700.
  Source: `https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap`

The jQuery, MDBootstrap, and medium-zoom files retain the integrity hashes in
`_config.yml`. Updating their versions requires updating those hashes too.
