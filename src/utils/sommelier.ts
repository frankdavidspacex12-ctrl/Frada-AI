import { Dessert, RecommendationResult, UserAnswer } from '../types';

export const COOLDOWN_TESTS = 2;

/**
 * Selects eligible desserts enforcing that any dessert recommended in a test
 * cannot be recommended again for at least the next 2 tests (COOLDOWN_TESTS),
 * while also rotating cleanly across all in-stock desserts.
 */
export function getEligibleDesserts(
  inStockDesserts: Dessert[],
  recentDessertIds: string[]
): Dessert[] {
  if (inStockDesserts.length <= 1) {
    return inStockDesserts;
  }

  // Keep chronological order (oldest -> newest) for desserts currently in stock
  const inStockIds = new Set(inStockDesserts.map((d) => d.id));
  const validHistory = recentDessertIds.filter((id) => inStockIds.has(id));

  // Strict cooldown: block the last 2 recommended desserts (or N - 1 if fewer than 3 in stock)
  // so a dessert shown in Test T cannot repeat in Test T+1 or Test T+2.
  const strictCooldown = Math.min(COOLDOWN_TESTS, inStockDesserts.length - 1);
  const cooldownBlockedIds = new Set(validHistory.slice(-strictCooldown));
  const afterCooldown = inStockDesserts.filter((d) => !cooldownBlockedIds.has(d.id));

  // Priority 1: desserts that have not yet been shown in the tracked history
  const unseen = afterCooldown.filter((d) => !validHistory.includes(d.id));
  if (unseen.length > 0) {
    return unseen;
  }

  // Priority 2: once all in-stock desserts have appeared, keep an extended rest window
  // (at least strictCooldown = 2 tests, and up to N - 2 tests when N >= 5)
  const restWindow = Math.min(
    inStockDesserts.length - 1,
    Math.max(strictCooldown, inStockDesserts.length - 2)
  );
  const windowBlockedIds = new Set(validHistory.slice(-restWindow));
  const rested = inStockDesserts.filter((d) => !windowBlockedIds.has(d.id));

  if (rested.length > 0) {
    return rested;
  }

  return afterCooldown.length > 0 ? afterCooldown : inStockDesserts;
}

export function recommendDessertSmart(
  answers: UserAnswer[],
  availableDesserts: Dessert[],
  recentDessertIds: string[] = []
): RecommendationResult {
  if (availableDesserts.length === 0) {
    throw new Error('No hay postres con stock disponible.');
  }

  const candidateDesserts = getEligibleDesserts(availableDesserts, recentDessertIds);

  // Normalize answer map for the 4 heartfelt questions
  const answerMap: Record<number, string> = {};
  for (const a of answers) {
    answerMap[Number(a.questionId)] = String(a.selectedOption || '').toLowerCase();
  }

  const dessertScores: Record<string, { score: number; reasons: string[] }> = {};
  for (const d of candidateDesserts) {
    dessertScores[d.id] = { score: 0, reasons: [] };
  }

  const addScore = (keywords: string[], points: number, reason?: string) => {
    for (const d of candidateDesserts) {
      const searchable = `${d.id} ${d.name} ${d.description || ''} ${d.flavorProfile || ''} ${d.category || ''}`.toLowerCase();
      if (keywords.some((kw) => searchable.includes(kw))) {
        dessertScores[d.id].score += points;
        if (reason && !dessertScores[d.id].reasons.includes(reason)) {
          dessertScores[d.id].reasons.push(reason);
        }
      }
    }
  };

  // --- QUESTION 1: ¿Qué abrazo necesita tu corazón hoy? ---
  const q1 = answerMap[1] || '';
  if (q1.includes('paz') || q1.includes('respirar') || q1.includes('calma')) {
    addScore(['jardin-floral', 'floral', 'lichi', '3d', 'delicado', 'vainilla'], 35, 'su armonía serena y delicada');
  } else if (q1.includes('alegría') || q1.includes('alegria') || q1.includes('celebrar')) {
    addScore(['arcoiris', 'arcoíris', 'multicolor', 'tropical', 'maracuyá', 'maracuya'], 35, 'su energía vibrante llena de color y celebración');
  } else if (q1.includes('ternura') || q1.includes('amado') || q1.includes('amor')) {
    addScore(['frutos-rojos', 'mousse', 'frambuesa', 'fresa', 'crema suave'], 35, 'su dulzura aterciopelada que abraza el corazón');
  } else if (q1.includes('premio') || q1.includes('esfuerzo')) {
    addScore(['cafe', 'café', 'chocolate', 'cacao', 'mosaico', 'tres leches'], 35, 'su sabor reconfortante hecho para premiar tu dedicación');
  }

  // --- QUESTION 2: ¿En quién piensas al probar algo dulce? ---
  const q2 = answerMap[2] || '';
  if (q2.includes('en mí') || q2.includes('cuidarme')) {
    addScore(['jardin-floral', '3d', 'frutos-rojos', 'mousse'], 25, 'ser una joya artesanal pensada para consentirte');
  } else if (q2.includes('familia') || q2.includes('hogar')) {
    addScore(['mosaico', 'tres leches', 'cafe', 'café'], 25, 'su calidez tradicional que recuerda al hogar');
  } else if (q2.includes('ríen') || q2.includes('rien') || q2.includes('amigos')) {
    addScore(['arcoiris', 'arcoíris', 'maracuyá', 'maracuya', 'cítric'], 25, 'su frescura alegre ideal para compartir sonrisas');
  } else if (q2.includes('extraño') || q2.includes('cariño')) {
    addScore(['cafe', 'café', 'jardin-floral', 'lichi', 'fresa'], 25, 'su aroma nostálgico lleno de recuerdos bonitos');
  }

  // --- QUESTION 3: ¿Qué sabor despierta tus recuerdos más bonitos? ---
  const q3 = answerMap[3] || '';
  if (q3.includes('crema') || q3.includes('hogar')) {
    addScore(['mosaico', 'tres leches', 'cremosa', 'queso crema'], 50, 'su suave nube cremosa que acaricia el paladar');
  } else if (q3.includes('cítrica') || q3.includes('citrica') || q3.includes('renueva')) {
    addScore(['maracuyá', 'maracuya', 'cítric', 'citric', 'refrescante'], 50, 'su chispa cítrica refrescante de maracuyá colombiano');
  } else if (q3.includes('frutos rojos') || q3.includes('pasión')) {
    addScore(['frutos rojos', 'frambuesa', 'fresa', 'mora', 'arándanos', 'mousse'], 50, 'la intensidad apasionada de los frutos del bosque');
  } else if (q3.includes('café') || q3.includes('cafe') || q3.includes('reconforta')) {
    addScore(['café', 'cafe', 'cacao', 'chocolate', 'tostado'], 50, 'sus notas profundas de café de origen y cacao blanco');
  }

  // --- QUESTION 4: ¿Qué promesa quieres regalarte hoy? ---
  const q4 = answerMap[4] || '';
  if (q4.includes('esfuerzo') || q4.includes('oro')) {
    addScore(['cafe', 'café', 'origen', 'mosaico'], 20);
  } else if (q4.includes('sin culpas') || q4.includes('disfrutar')) {
    addScore(['frutos-rojos', 'mousse', 'jardin-floral'], 20);
  } else if (q4.includes('sonrisa') || q4.includes('iluminar')) {
    addScore(['maracuyá', 'maracuya', 'arcoiris', 'arcoíris'], 20);
  } else if (q4.includes('hermosos') || q4.includes('comienza')) {
    addScore(['arcoiris', 'arcoíris', 'jardin-floral', '3d'], 20);
  }

  // Compute an answer hash for deterministic yet varied tie-breaking
  const rawString = answers.map((a) => `${a.questionId}:${a.selectedOption}`).join('|');
  let tieSeed = 0;
  for (let i = 0; i < rawString.length; i++) {
    tieSeed = (tieSeed * 31 + rawString.charCodeAt(i)) >>> 0;
  }

  const ranked = candidateDesserts.map((d, idx) => ({
    dessert: d,
    score: dessertScores[d.id]?.score || 0,
    reasons: dessertScores[d.id]?.reasons || [],
    tieOrder: (tieSeed + idx * 7) % candidateDesserts.length,
  }));

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.tieOrder - a.tieOrder;
  });

  const winner = ranked[0].dessert;
  const winnerReasons = ranked[0].reasons;

  // Build deeply heartfelt motivational messages based on Q1 & Q4
  let archetype = 'Alma Amorosa y Trabajadora';
  let motivational =
    'Eres una persona valiosa, llena de luz y con un corazón gigante. Cada paso que das deja huella en quienes te rodean; hoy mereces consentirte y recordar lo mucho que vales.';

  if (q1.includes('paz') || q1.includes('calma')) {
    archetype = 'Espíritu Sereno y Luminoso';
    motivational =
      'Tu alma guarda una paz hermosa que refugia y sana a quienes te quieren. Hoy regálate un instante de silencio dulce y gratitud por todo lo que has superado con tanta nobleza.';
  } else if (q1.includes('alegría') || q1.includes('alegria')) {
    archetype = 'Corazón Radiante y Valiente';
    motivational =
      'Tienes la magia de transformar los días grises con tu entusiasmo y tus ganas de seguir adelante. Celebra tu vida hoy: cada sonrisa tuya es un regalo para el mundo.';
  } else if (q1.includes('ternura') || q1.includes('amado')) {
    archetype = 'Alma Noble y Llena de Amor';
    motivational =
      'Entregas tanto cariño a los demás que a veces olvidas cuánto mereces recibirlo tú. Que este bocado artesanal sea un abrazo cálido directo a tu corazón.';
  } else if (q1.includes('premio') || q1.includes('esfuerzo')) {
    archetype = 'Fuerza Incansable y Resiliente';
    motivational =
      'Has dado lo mejor de ti incluso en los días difíciles, y eso habla de tu grandeza. Detente un momento, respira y disfruta este detalle porque te lo has ganado con creces.';
  }

  if (q4.includes('esfuerzo') || q4.includes('oro')) {
    motivational += ' Nunca dudes de ti: todo lo que siembras con amor florecerá.';
  } else if (q4.includes('sin culpas')) {
    motivational += ' Hoy te das permiso de disfrutar sin culpas y abrazar tu felicidad.';
  } else if (q4.includes('sonrisa')) {
    motivational += ' Tu sonrisa tiene el poder de iluminar cualquier lugar al que llegas.';
  } else if (q4.includes('hermosos')) {
    motivational += ' Confía con el corazón abierto: vienen capítulos hermosos para tu vida.';
  }

  const primaryReason =
    winnerReasons.length > 0
      ? `Elegido especialmente por ${winnerReasons.join(' y ')}, en sintonía con lo que siente tu corazón.`
      : `Elegido porque la esencia artesanal de ${winner.name} armoniza con tus sentimientos de hoy.`;

  return {
    dessertId: winner.id,
    dessertName: winner.name,
    personalityArchetype: archetype,
    motivationalMessage: motivational,
    matchReason: primaryReason,
    fromAI: false,
  };
}
