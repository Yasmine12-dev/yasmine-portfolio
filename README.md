# Portfolio, Yasmine Baba

Six static pages in plain HTML, SCSS and JavaScript. No framework. The only build step compiles the stylesheet, and even that is optional day to day, because the compiled CSS is committed.

## Structure

    index.html          home, English
    fr/                 the same six pages in French
    about.html          background and timeline
    projects.html       project write-ups
    experience.html     internships
    learning.html       education, skills, languages
    contact.html        contact details and form
    404.html            custom not-found page for static hosting
    sitemap.xml         all twelve pages with EN/FR alternates (npm run sitemap)
    robots.txt          points crawlers at the sitemap
    favicon.svg         tab icon
    css/main.css        compiled stylesheet, generated. Edit the SCSS instead
    scss/               source styles: abstracts, base, components, layouts
    api/contact.js      Vercel function: contact form to Gmail
    vercel.json         headers and caching
    js/                 light/dark switch, profile card tilt, mobile menu, project dialogs, contact form
    assets/images/      project illustrations, portrait, social preview

## Running it locally

Open `index.html` in a browser. That is the whole setup.

To reload on save, use the VS Code "Live Server" extension. Right-click `index.html`, then Open with Live Server.

## Languages

The site is bilingual. English lives at the root, French in `fr/`, and the two use the same filenames so the switcher in the header can map one to the other with a plain link. No script is involved.

Both versions carry `hreflang` alternates pointing at each other and at `x-default`, which is how Google serves the right language without treating the two as duplicates. The sitemap lists all twelve pages.

Adding a page means adding it in both places, or the switcher will send visitors to a 404. The error messages in `js/contact.js` and the theme button labels in `js/theme.js` read `document.documentElement.lang` and switch with it.

## The portrait and social preview

The home page uses `assets/images/Lavender Framed Professional Portrait.png` in a 4:5 frame. The social preview image is `assets/images/og.png` (1200x630), and the Apple touch icon is `assets/images/apple-touch-icon.png`.

## Editing the styles

```
npm install
npm run watch    # recompiles scss/main.scss while you edit
npm run build    # one-off compressed build
```

Never edit `css/main.css` by hand. The next build overwrites it.

## Colour

The interface uses a purple and lavender palette. The light theme uses deep purple `#6b45a5` for links and controls with pale lavender surfaces; dark mode uses a soft lavender accent `#c4a6f0` against deep plum surfaces. The shared values live in `scss/abstracts/_variables.scss` and are consumed by every page.

## Theme

The light/dark switch sets `data-theme` on `<html>`, and every colour is a CSS custom property declared in `scss/abstracts/_variables.scss`. To change a colour, change it in one place there.

A short inline script in each page's `<head>` reads the saved choice before the stylesheet loads, which is what stops a white flash on a dark-mode refresh. It has to stay inline and it has to stay in `<head>`.

## Search engines and sharing

Every page carries its own title and description, a canonical URL, Open Graph and Twitter card tags, and a link to `favicon.svg`. The home page also carries a `Person` block in JSON-LD, which is what tells Google the name, the job title, the schools and the LinkedIn and GitHub accounts belong to one person.

Shared links preview with `assets/images/og.png`, 1200x630. Regenerate it if the name or the role line ever changes.

All of that hardcodes one address:

    https://yasminebaba.vercel.app

Those URLs currently point to the GitHub Pages address. If the site is deployed on Vercel or moved to a custom domain, replace the base URL in the canonical, Open Graph, structured-data, `robots.txt` and `sitemap.xml` references before submitting the sitemap to Google Search Console:

```
grep -rl "yasmine12-dev.github.io/Yasmine-Portfolio" . \
  | xargs sed -i "s|https://yasminebaba.vercel.app|https://your-domain.com|g"
```

A wrong canonical URL is worse than none, so do this before submitting the sitemap to Google Search Console.

## Contact form

The form posts to `api/contact.js`, a Vercel serverless function that emails the message to your Gmail through Nodemailer. "Reply" in Gmail answers the visitor directly. A hidden honeypot field and a small rate limit keep spam out. If the function fails, `js/contact.js` falls back to opening the visitor's mail app.

Two environment variables are required (Vercel, Project, Settings, Environment Variables, then redeploy):

    GMAIL_USER=yasmiiineeeeb@gmail.com
    GMAIL_APP_PASSWORD=<16-character Google App password>

Create the App password at https://myaccount.google.com/apppasswords (2-Step Verification must be on). Use that, never your real Gmail password. To test locally use `npx vercel dev` with a `.env` file (see `.env.example`).

## Project cards

The English and French project pages use responsive cards. Each "View project" button opens a native HTML dialog with the project's overview, contribution, features and technologies. The dialog can be closed with its close control, by clicking the backdrop, or with Escape.

## Deployment (Vercel)

1. Push the repo to GitHub, then import it at vercel.com/new. Framework preset: Other. No build command, output directory is the root.
2. Add the two Gmail environment variables above, then redeploy.
3. Set your real domain in the SEO files: `npm run set-domain -- https://your-domain.com` (updates canonicals, Open Graph, JSON-LD, robots.txt and rebuilds sitemap.xml).
4. In Google Search Console add the property, verify it, and submit `https://your-domain.com/sitemap.xml`.

After SCSS changes run `npm run build` and commit `css/main.css`.
