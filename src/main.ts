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
    data !== null &&
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

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);

    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!(data instanceof Array)) {
      throw new Error('Formato dei dati non valido');
    }

    const actresses: Actress[] = data.filter(isActress);

    return actresses;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    } else {
      console.error('Errore sconosciuto');
    }
    return [];
  }
}

async function getActresses(actressesIds: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = actressesIds.map(id => getActress(id));
    const response = await Promise.all(promises);
    return response
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    } else {
      console.error('Errore sconosciuto');
    }
    return [];
  }
}

function createActress(actressObj: Omit<Actress, "id">): Actress {
  return {
    ...actressObj,
    id: Math.floor(Math.random() * 10000)
  }
}

function updateActress(actress: Actress, updates: Partial<Omit<Actress, "id" | "name">>): Actress {
  return {
    ...actress,
    ...updates
  }
}


getActress(1).then(actress => {
  if (!actress) return;

  const updated = updateActress(actress, {
    biography: 'Michele Bozzuto'
  });

  console.log(updated);
});

getAllActresses().then(res => console.log(res));

getActresses([1, 2, 3]).then(res => console.log(res));

console.log(createActress({
  name: 'Anne Hathaway',
  birth_year: 1982,
  biography: 'Anne Jacqueline Hathaway is an American actress. Her accolades include an Academy Award, a British Academy Film Award, a Golden Globe Award, and a Primetime Emmy Award.',
  image: 'www.image.com',
  most_famous_movies: ['Interstellar', 'The Devil Wears Prada', 'Batman'],
  awards: 'Academy Awards',
  nationality: 'American'
}));