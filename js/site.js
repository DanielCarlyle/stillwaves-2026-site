
const getJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
};

const listJSON = async (directory) => {
  const manifest = await getJSON(`${directory}/index.json`);
  return Promise.all(manifest.files.map(getJSON));
};

const node = (tag, attrs = {}, text = "") => {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "className") {
      el.className = value;
    } else if (key === "text") {
      el.textContent = value;
    } else if (value !== undefined && value !== null) {
      el.setAttribute(key, value);
    }
  });

  if (text) el.textContent = text;
  return el;
};

async function render() {
  const site = await getJSON("/content/site.json");

  document.title = `${site.band_name} | Darkwave / Post-punk`;

  document.getElementById("hero-title").textContent =
    site.band_name.toUpperCase();

  document.getElementById("hero-tagline").textContent =
    site.hero_tagline || "";

  document.getElementById("about-heading").textContent =
    site.about_heading || "About";

  const about = document.getElementById("about-text");

  (site.about_paragraphs || []).forEach((paragraph) => {
    about.append(node("p", {}, paragraph));
  });

  // Contact email
  const email = document.getElementById("contact-email");
  email.href = `mailto:${site.contact_email}`;
  email.textContent = site.contact_email;

  // Formspree: standard HTML form submission
  const contactForm = document.getElementById("contact-form");
  contactForm.action = site.contact_form_action;
  contactForm.method = "POST";

  // Mailchimp newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.action = site.newsletter_action;

  // Footer year
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // Videos
  const videos = await listJSON("/content/videos");
  const videoList = document.getElementById("video-list");

  videos.forEach((video) => {
    const card = node("article", {
      className: "video-card"
    });

    card.append(node("h3", {}, video.title));

    if (video.description) {
      card.append(node("p", {}, video.description));
    }

    const frame = node("div", {
      className: "video-frame"
    });

    const iframe = node("iframe", {
      src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtube_id)}`,
      title: `${video.title} — StillWaves video`,
      loading: "lazy",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      referrerpolicy: "strict-origin-when-cross-origin",
      allowfullscreen: ""
    });

    frame.append(iframe);
    card.append(frame);
    videoList.append(card);
  });

  // Albums
  const albums = await listJSON("/content/albums");
  const albumList = document.getElementById("album-list");

  albums.forEach((album) => {
    const card = node("article", {
      className: "album-card"
    });

    const img = node("img", {
      src: album.artwork,
      alt: `${album.title} album artwork`,
      loading: "lazy"
    });

    card.append(
      img,
      node("h3", {}, album.title),
      node("p", { className: "year" }, `Released ${album.year}`)
    );

    const ol = node("ol");

    (album.tracks || []).forEach((track) => {
      ol.append(node("li", {}, track));
    });

    card.append(ol);

    if (album.note) {
      card.append(
        node("p", { className: "year" }, album.note)
      );
    }

    const link = node(
      "a",
      {
        className: "button-link",
        href: album.url,
        target: "_blank",
        rel: "noopener noreferrer"
      },
      "Listen / buy"
    );

    card.append(link);
    albumList.append(card);
  });

  // Gig posters
  const posters = await listJSON("/content/posters");
  const posterList = document.getElementById("poster-list");

  posters.forEach((poster) => {
    const figure = node("figure", {
      className: "poster-card"
    });

    figure.append(
      node("img", {
        src: poster.image,
        alt: poster.alt || poster.title,
        loading: "lazy"
      })
    );

    figure.append(
      node("figcaption", {}, poster.title)
    );

    posterList.append(figure);
  });
}

// Accessible mobile navigation
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");

toggle.addEventListener("click", () => {
  const expanded =
    toggle.getAttribute("aria-expanded") === "true";

  toggle.setAttribute(
    "aria-expanded",
    String(!expanded)
  );

  nav.classList.toggle("is-open", !expanded);
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Load website content
render().catch((error) => {
  console.error(error);

  document.getElementById("about-text").textContent =
    "Some site content could not be loaded. Please refresh the page.";
});
