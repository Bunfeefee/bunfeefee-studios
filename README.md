# Bunfeefee Studios LLC

A small, responsive portfolio for **https://bunfeefee-studios.dev**.
Plain HTML and CSS: no framework, JavaScript, tracking, external fonts,
build step, or runtime dependencies. Only the `public` directory is deployed.

## Production

- Website: **https://bunfeefee-studios.dev**
- Pages hostname: **https://bunfeefee-studios.pages.dev**
- Repository: [Bunfeefee/bunfeefee-studios](https://github.com/Bunfeefee/bunfeefee-studios)
- Cloudflare Pages project: `bunfeefee-studios`
- Automatic deployments: pushes to `main`
- Build command: `exit 0`; output directory: `public`; framework: None
- Custom domain: apex CNAME to `bunfeefee-studios.pages.dev`, managed by Pages

The initial deployment was verified over HTTPS on both hostnames, including
matching HTML/CSS/assets, security headers, and the custom HTTP 404 response.

## Preview locally

Open `public/index.html` in a browser for a quick preview, or use the included
local server (Node.js 18 or newer):

```powershell
Set-Location C:\Code\bunfeefee-studios
node preview.mjs
```

Visit **http://127.0.0.1:4173**. Stop the server with Ctrl+C.
The preview server applies the same headers as Pages and serves the custom
404 page for missing files.

## Deploy with Cloudflare Pages

Cloudflare Pages' Free plan is sufficient for this small static site;
domain registration/renewal is separate. No paid Workers, database, or
email service is required. Choose **Pages**, not a Workers deployment.

### Recommended: GitHub-connected deployment

The production project is already connected. To update it, edit the files,
commit your changes, and push to `main`:

```powershell
Set-Location C:\Code\bunfeefee-studios
git add public README.md
git commit -m "Update studio website"
git push
```

For a new setup or another copy of this site:

1. Create an empty GitHub repository with your chosen name.
   Public or private is fine. Don't initialize it with a README.
2. From this directory, initialize and push:

   ```powershell
   git init -b main
   git add .
   git commit -m "Create Bunfeefee Studios portfolio" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
   git remote add origin git@github.com:Bunfeefee/bunfeefee-studios.git
   git push -u origin main
   ```

   Substitute your repository URL if creating another copy. Skip steps
   already performed; do not reinitialize the existing production repository.

3. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open
   **Workers & Pages > Create application > Pages** and select the option
   to import/connect an existing Git repository.
4. Authorize GitHub access to only the studio repository, select it, and use:

   | Setting | Value |
   | --- | --- |
   | Project name | `bunfeefee-studios` (or another available name) |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `exit 0` |
   | Build output directory | `public` |
   | Root directory | Leave at repository root |

5. Select **Save and Deploy** and check the generated `*.pages.dev` URL.
   Future pushes to `main` publish automatically.

### Alternative: upload without GitHub

In **Workers & Pages > Create application > Pages**, choose the Direct Upload
/ drag-and-drop option. Upload the **contents of `public`** so that
`index.html` is at the deployed root, not inside another `public` folder.
Check the generated `*.pages.dev` URL.

Important: a Direct Upload project cannot later switch to Git integration;
create a new Pages project if you want automatic GitHub deployments.
Git integration is recommended for ongoing updates.

### Connect bunfeefee-studios.dev

1. Ensure the domain is active in the **same Cloudflare account** as the Pages
   project. A domain purchased through Cloudflare should already use its DNS.
2. Open the Pages project > **Custom domains > Set up a domain**.
3. Enter `bunfeefee-studios.dev` and confirm Cloudflare's proposed DNS record.
   Don't create just a CNAME manually without first adding the domain to Pages.
4. If Cloudflare reports an existing conflicting record, inspect it before
   replacing it. Preserve unrelated records, especially email MX/TXT records.
5. Wait for domain activation and certificate provisioning, then verify
   **https://bunfeefee-studios.dev**. `.dev` domains require HTTPS in browsers.
6. Optional: add `www.bunfeefee-studios.dev` as another Pages custom domain.
   If desired, configure a Cloudflare redirect rule from `www` to the apex
   domain, preserving the path and query string.

The generated Pages URL remains usable. The HTML canonical URL and sitemap
point to the custom domain; they are not redirects.

## Verify before and after deployment

- Check desktop and mobile layouts and keyboard navigation.
- Confirm each navigation link reaches its section.
- Confirm the GitHub links point to `https://github.com/Bunfeefee`.
- Check an unknown path returns HTTP 404 and displays the custom error page.
- Check `/robots.txt`, `/sitemap.xml`, and `/favicon.svg`.
- On the live site, check HTTPS and the response headers from `public/_headers`.

Cloudflare can inject its own Web Analytics beacon independently of the source
files. The site's Content Security Policy intentionally blocks external scripts.
If the browser reports a blocked `static.cloudflareinsights.com` beacon, disable
Web Analytics/automatic beacon injection for this project or domain in Cloudflare
rather than weakening the policy. The portfolio works without analytics.

For example, on Windows:

```powershell
curl.exe -I https://bunfeefee-studios.dev
curl.exe -I https://bunfeefee-studios.dev/not-a-page
```

## Editing

- Copy and links: `public/index.html`.
- Colors, typography, layout, and decorative artwork: `public/styles.css`.
- Browser icon: `public/favicon.svg`.
- Response headers: `public/_headers`.

The page describes the studio's business areas rather than reproducing LLC
formation language. It does not claim shipped games, clients, or completed
artwork. Add real project cards and screenshots when you're ready to feature
specific work.

Contact currently links to GitHub only; it isn't a contact form and does not
send messages. Replace or supplement this with a `mailto:` link once a public
email address is configured. Buying a domain does not itself create a mailbox.

## Official deployment references

- [Static HTML on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
