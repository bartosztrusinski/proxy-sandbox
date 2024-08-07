const negativeIndexArrayProxy = <Arr extends unknown[]>(array: Arr): Arr =>
  new Proxy(array, {
    get(target, prop, receiver) {
      const index = Number(prop);

      return Reflect.get(
        target,
        index < 0 ? String(target.length + index) : prop,
        receiver,
      );
    },
  });

let cars = ['Nissan', 'Toyota', 'Mitsubishi', 'Subaru', 'Mazda'];
console.info(`Negative index: ${cars[-2]}`); // undefined

cars = negativeIndexArrayProxy(cars);
console.info(`Negative index with proxy: ${cars[-2]}`); // Subaru
