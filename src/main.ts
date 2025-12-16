type Person = {
  readonly id: number
  readonly name: string
  birth_year: number
  death_year?: number
  biography: string
  image: string
}

type Actress = Person & {
  most_famous_movies: [string, string, string]
  awards: string
  nationality:
  'American' |
  'British' |
  'Australian' |
  'Israeli - American' |
  'South African' |
  'French' |
  'Indian' |
  'Israeli' |
  'Spanish' |
  'South Korean' |
  'Chinese'
}

function isActress(data: unknown): data is Actress {
  if (
    data &&
    typeof data === 'object' &&
    "id" in data &&
    "name" in data &&
    "birth_year" in data &&
    "biography" in data &&
    "image" in data &&
    "most_famous_movies" in data &&
    "awards" in data &&
    "nationality" in data
  ) {
    return true
  }
  return false
}

async function getActress(id: number): Promise<Actress | null> {
  const res = await fetch(`http://localhost:3333/actresses/${id}`).then(res => res.json());
  if (isActress(res)) {
    return res as Actress
  }
  return null
}

async function getAllActresses(): Promise<Actress[] | null> {
  const res = await fetch(`http://localhost:3333/actresses`)
    .then(res => res.json());

  if (!Array.isArray(res)) return null;

  const actresses = res.filter(isActress);

  return actresses;
}

async function getActresses(actressesIds: number[]): Promise<Actress[] | null> {
  const promises = actressesIds.map(id => getActress(id));
  const res = await Promise.all(promises);

  const actresses = res.filter((act) => isActress(act));

  return actresses.length ? actresses : null;
}

console.log(getActress(1))
console.log(getAllActresses())
console.log(getActresses([1, 2, 3]))