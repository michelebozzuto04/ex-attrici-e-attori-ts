type Person = {
  readonly id: number
  readonly name: string
  birth_year: number
  death_year?: number
  biography: string
  image: string
}

type actressNationality =
  | 'American'
  | 'British'
  | 'Australian'
  | 'Israeli - American'
  | 'South African'
  | 'French'
  | 'Indian'
  | 'Israeli'
  | 'Spanish'
  | 'South Korean'
  | 'Chinese'

type actorNationality =
  | 'Scottish'
  | 'New Zealand'
  | 'Hong Kong'
  | 'German'
  | 'Canadian'
  | 'Irish'

type Actress = Person & {
  most_famous_movies: [string, string, string]
  awards: string
  nationality: actressNationality
}

type Actor = Person & {
  known_for: [string, string, string]
  awards: [string] | [string, string]
  nationality: actressNationality | actorNationality
}

// Actresses functions
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

// Actors functions
function isActor(data: unknown): data is Actor {
  if (
    data &&
    typeof data === 'object' &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "birth_year" in data &&
    "biography" in data &&
    "image" in data &&
    "known_for" in data &&
    "awards" in data &&
    "nationality" in data
  ) {
    return true
  }
  return false
}

async function getActor(id: number): Promise<Actor | null> {
  const res = await fetch(`http://localhost:3333/actors/${id}`).then(res => res.json());
  if (isActor(res)) {
    return res as Actor
  }
  return null
}

async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch(`http://localhost:3333/actors`);

    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!(data instanceof Array)) {
      throw new Error('Formato dei dati non valido');
    }

    const actresses: Actor[] = data.filter(isActor);

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

async function getActors(actorsIds: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = actorsIds.map(id => getActor(id));
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

function createActor(actorObj: Omit<Actor, "id">): Actor {
  return {
    ...actorObj,
    id: Math.floor(Math.random() * 10000)
  }
}

function updateActor(actor: Actor, updates: Partial<Omit<Actor, "id" | "name">>): Actor {
  return {
    ...actor,
    ...updates
  }
}

// Random Couple function

async function createRandomCouple(): Promise<[Actress, Actor] | null> {
  const randomActressId = Math.floor(Math.random() * 40);
  const randomActorId = Math.floor(Math.random() * 40);

  const actresses = await getAllActresses();
  const actors = await getAllActors();

  const actress = actresses.find(a => a.id === randomActressId);
  const actor = actors.find(a => a.id === randomActorId);

  if (!actress || !actor) {
    return null;
  }

  return [actress, actor];
}


// Actresses test

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

// Actors test

getActor(1).then(actor => {
  if (!actor) return;

  const updated = updateActor(actor, {
    biography: 'Michele Bozzuto'
  });

  console.log(updated);
});

getAllActors().then(res => console.log(res));

getActors([1, 2, 3]).then(res => console.log(res));

console.log(createActor({
  name: 'Christoph Waltz',
  birth_year: 1956,
  biography: "Christoph Waltz è un attore e regista austriaco con cittadinanza tedesca. È vincitore di vari riconoscimenti, compresi due premi Oscar, due premi Golden Globe, due premi BAFTA, due Critics' Choice Awards, due Screen Actors Guild Awards ed un Prix d'interprétation masculine al Festival di Cannes.",
  image: 'www.image.com',
  known_for: ['Inglorious Basterds', 'Django Unchained', 'Frankestein'],
  awards: ['Academy Award', 'Golden Globe'],
  nationality: 'American'
}));

createRandomCouple().then(res => console.log('Random couple:', res));