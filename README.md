# Travel Foodies – Happy Diwali Greeting

React + Vite + Tailwind + Framer Motion + Canvas fireworks.

## Run
    npm install
    npm run dev        # local dev
    npm run build      # production build in dist/ (deploy anywhere static: Netlify, Vercel, GitHub Pages)

## Host on GitHub Pages
1. Push this project to a GitHub repository on the `main` or `master` branch.
2. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
3. Each push to `main` or `master` will build and deploy the site. The live URL appears in the workflow run or under **Settings → Pages**.

## Personalise
Open the link with names: `https://your-site/?from=YourName&to=FriendName`
Without them a general greeting is shown. Edit copy, brand name and wishes in `src/config.js`.

## Sound
All music and effects are generated in the browser (no audio files). Nothing plays until the visitor taps; Music ON/OFF and Mute buttons are always visible.
