self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// دریافت Push از سرور
self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'یادآور بی‌صدا',
      body: event.data ? event.data.text() : ''
    };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'یادآور بی‌صدا',
      {
        body: data.body || 'زمان یادآوری رسیده است.',
        icon: data.icon || undefined,
        badge: data.badge || undefined,
        tag: data.tag || 'reminder-push',
        silent: true,
        renotify: false,
        data: {
          url: data.url || './'
        }
      }
    )
  );
});

// باز کردن سایت با لمس اعلان
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || './',
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clients => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin)) {
          return client.focus();
        }
      }

      return self.clients.openWindow(target);
    })
  );
});
