# yangtx7.github.io

Personal academic homepage and blog, initialized from the `al-folio` template.

## What To Edit First

1. `_config.yml`
   Set your site title, description, `url`, and language.
2. `_pages/about.md`
   Replace the placeholder bio on the homepage.
3. `_data/socials.yml`
   Fill in your email, GitHub, Scholar, ORCID, LinkedIn, and CV link.
4. `_bibliography/papers.bib`
   Add your publications in BibTeX format.
5. `_data/cv.yml`
   Fill in education, experience, awards, and other CV sections.
6. `_posts/`
   Add blog posts in Markdown with filenames like `YYYY-MM-DD-title.md`.

## GitHub Pages Deployment

This repository is set up to deploy with GitHub Actions.

1. In GitHub, open `Settings -> Actions -> General`.
2. Set Workflow permissions to `Read and write permissions`.
3. In `Settings -> Pages`, set Source to `Deploy from a branch`, then choose the `gh-pages` branch after the first workflow run creates it.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` will build and publish the site.

## Local Preview

This repo now includes a local preview workflow for macOS with Homebrew Ruby:

```bash
./bin/preview
```

The first run will:

1. use Homebrew `ruby@3.3`
2. install Bundler `4.0.4` into `.bundle/gems`
3. install project gems into `vendor/bundle`
4. start Jekyll at `http://127.0.0.1:4000`

If you want livereload, run:

```bash
JEKYLL_LIVERELOAD=1 ./bin/preview
```

If you only want to install dependencies without starting the server, run:

```bash
./bin/setup-local-preview
```

If `ruby@3.3` or `imagemagick` are missing, install them with:

```bash
brew install ruby@3.3 imagemagick
```
