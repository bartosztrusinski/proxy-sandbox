const handler: ProxyHandler<Storage> = {
  get(storage, key: string) {
    return storage[key] ?? storage.getItem(key) ?? undefined;
  },

  set(storage, key: string, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  has(storage, key: string) {
    return key in storage || storage.getItem(key) !== null;
  },

  deleteProperty(storage, key: string) {
    if (key in storage) {
      storage.removeItem(key);
      return true;
    }

    return false;
  },

  ownKeys(storage) {
    return Object.keys(storage);
  },

  defineProperty(storage, key: string, descriptor) {
    if (descriptor && 'value' in descriptor) {
      storage.setItem(key, descriptor.value);
      return true;
    }

    return false;
  },

  getOwnPropertyDescriptor(storage, key: string) {
    const value = storage.getItem(key);

    if (!value) {
      return undefined;
    }

    return {
      value,
      configurable: true,
      enumerable: true,
      writable: true,
    };
  },
};

const storageProxy = new Proxy(localStorage, handler);

const storageElement = document.querySelector(
  '[data-proxy="storage"]',
) as HTMLElement;

try {
  storageProxy.user = { name: 'John', email: 'jonh@doe.com' };
  storageProxy.theme = 'system';
  storageProxy.data = [1, 345, 6767];

  console.table(Object.entries(storageProxy));
  console.log(JSON.parse(storageProxy.theme));
  console.log(JSON.parse(storageProxy.user));

  delete storageProxy.theme;

  const lis = Object.entries(storageProxy).reduce(
    (lis, [key, value]) =>
      (lis += `<li><strong>${key}:</strong> ${value}</li>`),
    '',
  );

  storageElement.innerHTML = `<ul>${lis}</ul>`;

  delete storageProxy.user;
  delete storageProxy.data;
} catch (error) {
  console.error(error instanceof Error ? error.message : 'An error occurred');
}
