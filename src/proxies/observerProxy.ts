type Callback = (key: string | symbol, value: unknown) => void;
type Subscribe = (callback: Callback) => void;
type Observer = <T extends object>(
  target: T,
) => { observer: T; subscribe: Subscribe };

const observerProxy: Observer = (target) => {
  const subscribers = new Set<Callback>();

  const subscribe: Subscribe = (callback: Callback) => {
    subscribers.add(callback);
  };

  const observer = new Proxy(target, {
    set(target, prop, value, receiver) {
      const isSuccess = Reflect.set(target, prop, value, receiver);

      if (isSuccess) {
        subscribers.forEach((callback) => callback(prop, value));
      }

      return isSuccess;
    },
  });

  return { observer, subscribe };
};

interface User {
  [key: string]: unknown;
  age: number;
  hair: 'short' | 'long';
  eyes: 'blue' | 'green' | 'brown';
}

const initUser: User = { age: 45, hair: 'short', eyes: 'blue' };
const { observer: user, subscribe } = observerProxy(initUser);
const observerElement = document.querySelector(
  '[data-proxy="observer"]',
) as HTMLElement;

subscribe(() => {
  const lis = Object.entries(user).reduce(
    (lis, [key, value]) =>
      (lis += `<li><strong>${key}:</strong> ${value}</li>`),
    '',
  );

  observerElement.innerHTML = `<ul>${lis}</ul>`;
});

subscribe((key, value) => {
  console.warn(`SET ${String(key)}=${value}`);
});

user.name = 'John';

setInterval(() => {
  user.age = Math.floor(Math.random() * 60) + 16;
}, 2000);
