
const $ = id => document.getElementById(id);

const el = (tag, txt, cls) => {
  const x = document.createElement(tag);
  if (txt !== undefined) x.textContent = txt;
  if (cls) x.className = cls;
  return x;
};

async function load() {
  const data = await Promise.all(
    ['site', 'albums', 'videos', 'posters'].map(async n => {
      const r = await fetch('/content/' + n + '.json');
      if (!r.ok) throw Error('Failed to load ' + n);
      return r.json();
    })
  );

  const [s, albumData, videoData, posterData] = data;
  const albums = albumData.items;
  const videos = videoData.items;
  const posters = posterData.items;

  $('tagline').textContent = s.tagline;
  $('announcement').textContent = s.announcement;

  s.about.forEach(t => $('about-copy').append(el('p', t)));

  $('contact-email').textContent = s.contact_email;
  $('contact-email').href = 'mailto:' + s.contact_email;

  // Contact form submits directly to Formspree
  $('contact-form').action = s.contact_action;

  $('newsletter-form').action = s.newsletter_action;

  for (const k of ['songkick', 'bandcamp', 'spotify', 'instagram', 'facebook']) {
    $(k).href = s[k];
  }

  // Videos
  videos.forEach(v => {
    const card = el('article', undefined, 'card');
    card.append(el('h3', v.title));

    const frame = el('div', undefined, 'frame');
    const iframe = el('iframe');

    iframe.src =
      'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(v.youtube_id);

    iframe.title = v.title;
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;

    frame.append(iframe);
    card.append(frame);

    $('video-list').append(card);
  });

  // Albums
  albums.forEach(a => {
    const card = el('article', undefined, 'card');

    if (a.image) {
      const img = el('img');
      img.src = a.image;
      img.alt = a.title + ' cover artwork';
      img.loading = 'lazy';
      card.append(img);
    }

    card.append(
      el('h3', a.title),
      el('p', 'Released ' + a.year)
    );

    if (a.tracks.length) {
      const ol = el('ol');

      a.tracks.forEach(t => ol.append(el('li', t)));

      card.append(ol);
    }

    const link = el('a', 'Listen / buy', 'cta');
    link.href = a.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    card.append(link);
    $('album-list').append(card);
  });

  // Posters
  posters.forEach(p => {
    const figure = el('figure', undefined, 'poster');
    const img = el('img');

    img.src = p.image;
    img.alt = p.alt;
    img.loading = 'lazy';

    figure.append(img);
    figure.append(el('figcaption', p.alt));

    $('poster-list').append(figure);
  });
}

// Mobile navigation
const menu = document.querySelector('.menu');
const nav = $('navigation');

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';

  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.addEventListener('click', e => {
  if (e.target.closest('a')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});

// Footer year
$('year').textContent = new Date().getFullYear();

// Load Decap CMS content
load().catch(e => {
  console.error(e);
  $('about-copy').textContent =
    'Site content could not be loaded. Please try again later.';
});
