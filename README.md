Portfolio Template

This repository contains a minimal responsive portfolio template.

How to use

- Open `index.html` in a browser (double-click or use a local server).
- Edit the content in `index.html` to add your name, project links, and email.
- Update styles in `styles.css` and behaviors in `script.js`.

Quick local server (Python 3):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Customization ideas

- Replace placeholder projects with real screenshots and links.
- Add a build step or deploy to GitHub Pages / Netlify.

- The site no longer publishes a full resume; the homepage contains selected experience highlights only.

How to collect messages (Formspree)

1. Go to https://formspree.io and create a new form to get a form endpoint.
2. Replace the contact `<form>` action with the Formspree URL and set `method="POST"`:

```html
<form id="contactForm" action="https://formspree.io/f/xdaaoldj" method="POST">
	
 <label>
    Your email:
    <input type="email" name="email">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <!-- your other form fields go here -->
  <button type="submit">Send</button>
</form>
```

Deploying quickly (Netlify)

```bash
# install the CLI
npm install -g netlify-cli
# from repo root
netlify deploy --prod
```

Adding project images

- Drop image files into the `assets/` folder (e.g., `assets/project1.png`, `assets/project2.png`).
- Recommended size: ~1200x700 (use `srcset` or multiple sizes for responsive images).
- The project cards are set to use `assets/project1.svg` etc. by default — replace those files with your screenshots (preserve names) or update `index.html` to point to different filenames.

Using your attached photo as the capstone image

- Save your photo to `assets/capstone-source.jpg` (or `.png`).
- From the repo root, run the conversion script to create responsive JPEG + WebP sizes:

```bash
chmod +x scripts/convert_images.sh
./scripts/convert_images.sh assets/capstone-source.jpg
```

- The script generates `assets/capstone-1600.jpg`, `assets/capstone-1200.jpg`, `assets/capstone-800.jpg` and the same names with `.webp` if `cwebp` is installed.
- `index.html` is already configured to use these generated files.

Image optimization tips

- Use WebP for best compression when supported, keep a fallback PNG/JPEG.
- Compress images before adding (e.g., `pngquant`, `cwebp`, or an online tool).

