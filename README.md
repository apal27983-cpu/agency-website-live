# Nexora Digital

A responsive, single-page digital agency site built with semantic HTML, Tailwind CSS, and vanilla JavaScript. Portfolio artwork and testimonial content are marked as samples/placeholders.

## Requirements

- Node.js 18 or later and npm
- Python 3 for a simple local static server (or use another static server)

## Install and build

```sh
npm install
npm run build
python -m http.server 8000
```

Open `http://localhost:8000`. The production CSS is generated at `dist/output.css` and can be deployed with the HTML, JS, and assets as a static site.

For stylesheet development, run `npm run dev` in a second terminal while the static server is running. Tailwind watches `index.html` and `js/` for utility classes.

## Contact form setup

The form validates required inputs, email format, and consent. It sends a JSON `POST` request to the URL in `window.NEXORA_CONFIG.contactApiUrl`, configured in `js/config.js`. Leave it empty for demo mode: the page will clearly say that no inquiry was sent. Configure a secure backend or form service endpoint before launch. The endpoint should accept JSON with `name`, `email`, `company`, `service`, `budget`, `details`, and `consent`, and return a JSON response. A successful 2xx JSON response can include a user-facing `message` property.

Do not put API keys, SMTP credentials, or other secrets in frontend files. Configure any needed secrets on the backend. Replace `hello@example.com`, the demo portfolio content, testimonial placeholders, and social metadata before publishing.
