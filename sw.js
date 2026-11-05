self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});

self.addEventListener('push', event => {
  let data = {
    title: 'یادآور بی‌صدا',
    body: 'یک یادآوری جدید داری.'
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'یادآور بی‌صدا',
      {
        body: data.body || '',
        silent: true,
        tag: data.tag || 'server-push-reminder'
      }
    )
  );
});
