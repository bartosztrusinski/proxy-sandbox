const noUndefinedProxy = <T extends object>(target: T): T =>
  new Proxy(target, {
    get(target, prop) {
      if (!(prop in target)) {
        throw new Error(`Property ${String(prop)} does not exist`);
      }

      return Reflect.get(target, prop);
    },
  });

type Car = {
  brand: string;
  model: string;
  engine: string;
  horsepower: number;
};

let car: Car = {
  brand: 'Nissan',
  model: 'Skyline',
  engine: 'RB26',
  horsepower: 276,
};

car = noUndefinedProxy(car);

try {
  console.log(`Car's brand: ${car.brand}`);
  // @ts-expect-error: year is undefined - proxy throws an error
  console.log(`Car's year: ${car.year}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'An error occurred');
}
