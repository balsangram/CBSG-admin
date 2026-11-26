import { City, State } from 'country-state-city';

const stateNames = Object.fromEntries(
  State.getStatesOfCountry('IN').map((state) => [state.isoCode, state.name])
);

const seen = new Set();

export const INDIAN_CITIES = City.getCitiesOfCountry('IN')
  .reduce((cities, city) => {
    const state = stateNames[city.stateCode] || '';
    const key = `${city.name}|${state}`;

    if (!seen.has(key)) {
      seen.add(key);
      cities.push({ name: city.name, state });
    }

    return cities;
  }, [])
  .sort(
    (left, right) =>
      left.name.localeCompare(right.name, 'en') ||
      left.state.localeCompare(right.state, 'en')
  );
