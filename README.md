# StillWaves rebuild for Netlify + Decap CMS

The ZIP contains a semantic, responsive, static website using the supplied image assets and the biography, music, videos, gig posters and integrations extracted from the supplied `src/index.html`. The original `epk.html` is included as-is; it has **not** been accessibility-remediated.

## Deployment

1. Back up your live Netlify site and Git repository.
2. Commit this package's contents to a GitHub repository linked to Netlify. Set Netlify publish directory to `.` and leave the build command empty.
3. Edit `admin/config.yml` and replace `OWNER/REPO` with the actual GitHub repository and confirm its branch.
4. Configure Decap GitHub OAuth using the current GitHub backend guide: https://decapcms.org/docs/github-backend/ . The editor is **not usable** until authentication is configured; never commit OAuth secrets.
5. Visit `/admin/` to edit site details, releases, videos and posters. Publishing commits JSON changes to Git, which Netlify deploys.

## Before going live

- Confirm the Mailchimp signup action and Formspree endpoint still work; they were retained from the original source.
- Confirm album release dates and artwork. The original ZIP does not contain a clearly named Vacant Eyes cover, so the rebuild deliberately does not assign an incorrect image.
- Verify videos and gig poster captions. The source contains older promotional text.
- Test mobile, keyboard, screen reader, form success/error, contrast and zoom. This is an accessibility-oriented rebuild, not a certified WCAG audit.
- The existing EPK page was preserved without changes; review it separately.
