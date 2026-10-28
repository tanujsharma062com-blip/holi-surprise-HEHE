(() => {
  'use strict';

  const defaultMessage = 'Wishing you a Holi full of bright colours, big laughs, and beautiful moments.';
  const form = document.querySelector('#wish-form');
  const sender = document.querySelector('#sender');
  const recipient = document.querySelector('#recipient');
  const message = document.querySelector('#message');
  const previewSender = document.querySelector('#preview-sender');
  const previewRecipient = document.querySelector('#preview-recipient');
  const previewMessage = document.querySelector('#preview-message');
  const shareResult = document.querySelector('#share-result');
  const generatedLink = document.querySelector('#generated-link');
  const whatsappLink = document.querySelector('#whatsapp-link');
  const copyButton = document.querySelector('#copy-link');
  const toast = document.querySelector('#toast');
  const confettiLayer = document.querySelector('#confetti-layer');
  let toastTimer;
  let confettiTimer;
  let copyTimer;

  const cleanName = (value) => value.replace(/\s+/g, ' ').trim().slice(0, 40);
  const cleanMessage = (value) => value.trim().slice(0, 180);

  function showToast(text) {
    window.clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }

  function throwColour() {
    showToast('A little colour, just for you. Happy Holi!');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colours = ['#e15a79', '#f4bd55', '#df885f', '#a293c4', '#7eafa5', '#ed91a4'];
    const pieces = document.createDocumentFragment();
    confettiLayer.replaceChildren();
    window.clearTimeout(confettiTimer);

    for (let i = 0; i < 45; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.setProperty('--x', `${Math.random() * 100}%`);
      piece.style.setProperty('--size', `${6 + Math.random() * 8}px`);
      piece.style.setProperty('--colour', colours[i % colours.length]);
      piece.style.setProperty('--duration', `${2.5 + Math.random() * 1.5}s`);
      piece.style.setProperty('--delay', `${Math.random() * 0.45}s`);
      piece.style.setProperty('--drift', `${-100 + Math.random() * 200}px`);
      piece.style.setProperty('--rotation', `${360 + Math.random() * 900}deg`);
      piece.style.setProperty('--radius', i % 3 === 0 ? '50%' : '2px');
      pieces.appendChild(piece);
    }
    confettiLayer.appendChild(pieces);
    confettiTimer = window.setTimeout(() => confettiLayer.replaceChildren(), 5000);
  }

  function updatePreview() {
    previewSender.textContent = cleanName(sender.value) || 'someone who cares';
    previewRecipient.textContent = cleanName(recipient.value) || 'you';
    previewMessage.textContent = cleanMessage(message.value) || defaultMessage;
    document.querySelector('#character-count').textContent = message.value.length;
  }

  function makeLink() {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('to', cleanName(recipient.value));
    url.searchParams.set('from', cleanName(sender.value));
    const personalMessage = cleanMessage(message.value);
    if (personalMessage) url.searchParams.set('message', personalMessage);

    generatedLink.value = url.toString();
    const whatsappText = `A little Holi wish for you! 🌈 ${url.toString()}`;
    whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
  }

  [sender, recipient, message].forEach((field) => {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
      updatePreview();
      if (!shareResult.hidden) {
        if (cleanName(sender.value) && cleanName(recipient.value)) {
          makeLink();
          copyButton.textContent = 'Copy link';
        } else {
          shareResult.hidden = true;
        }
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sender.setCustomValidity(cleanName(sender.value) ? '' : 'Please add your name.');
    recipient.setCustomValidity(cleanName(recipient.value) ? '' : 'Please add their name.');
    if (!form.reportValidity()) return;

    makeLink();
    shareResult.hidden = false;
    copyButton.textContent = 'Copy link';
    shareResult.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });

  copyButton.addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedLink.value);
        copied = true;
      }
    } catch (_) {
      // Fall back to selecting the link in browsers that deny clipboard access.
    }

    if (!copied) {
      generatedLink.focus();
      generatedLink.select();
      try {
        copied = document.execCommand('copy');
      } catch (_) {
        copied = false;
      }
    }

    window.clearTimeout(copyTimer);
    if (copied) {
      copyButton.textContent = 'Copied!';
      showToast('Link copied! Time to spread the Holi love.');
      copyTimer = window.setTimeout(() => { copyButton.textContent = 'Copy link'; }, 2500);
    } else {
      showToast('Your link is selected. Copy it to share!');
    }
  });

  document.querySelector('#throw-colour').addEventListener('click', throwColour);

  // Names and notes live in the URL, so the site works as a static page with no server.
  const params = new URLSearchParams(window.location.search);
  const incomingRecipient = cleanName(params.get('to') || '');
  const incomingSender = cleanName(params.get('from') || '');
  const incomingMessage = cleanMessage(params.get('message') || '');
  if (incomingRecipient) {
    document.querySelector('#hero-kicker').textContent = 'A LITTLE HOLI NOTE FOR YOU';
    document.querySelector('#hero-first-line').textContent = `Hey ${incomingRecipient},`;
    document.querySelector('#hero-second-line').textContent = 'Holi hai!';
    document.querySelector('#hero-description').textContent = incomingMessage || defaultMessage;
    document.title = `Happy Holi, ${incomingRecipient}! — Holi, with love`;
    if (incomingSender) {
      document.querySelector('#hero-from').textContent = incomingSender;
      document.querySelector('#hero-signature').hidden = false;
    }
  }

  updatePreview();
})();
