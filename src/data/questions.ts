import { Question } from '../types';

export const TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    title: '¿Qué abrazo necesita tu corazón hoy?',
    subtitle: 'Escucha lo que tu alma siente en este instante',
    options: [
      { id: 'calma', label: 'Paz para respirar hondo', emoji: '🕊️' },
      { id: 'alegria', label: 'Alegría para celebrar la vida', emoji: '✨' },
      { id: 'amor', label: 'Ternura que me haga sentir amado', emoji: '💖' },
      { id: 'fuerza', label: 'Un premio tras tanto esfuerzo', emoji: '☕' },
    ],
  },
  {
    id: 2,
    title: '¿En quién piensas al probar algo dulce?',
    subtitle: 'Esos lazos invisibles que iluminan tu camino',
    options: [
      { id: 'mi_mismo', label: 'En mí, hoy merezco cuidarme', emoji: '🌸' },
      { id: 'familia', label: 'En mi familia, mi gran hogar', emoji: '🏡' },
      { id: 'amigos', label: 'En quienes ríen conmigo', emoji: '🎉' },
      { id: 'gratitud', label: 'En alguien que extraño con amor', emoji: '🌷' },
    ],
  },
  {
    id: 3,
    title: '¿Qué sabor despierta tus recuerdos más bonitos?',
    subtitle: 'Cada aroma guarda una historia especial en tu memoria',
    options: [
      { id: 'cremoso', label: 'Dulce crema suave de hogar', emoji: '🥛' },
      { id: 'citrico', label: 'Chispa cítrica que renueva', emoji: '🍋' },
      { id: 'frutos', label: 'Frutos rojos llenos de pasión', emoji: '🍓' },
      { id: 'cafe', label: 'Café cálido que reconforta', emoji: '🍫' },
    ],
  },
  {
    id: 4,
    title: '¿Qué promesa quieres regalarte hoy?',
    subtitle: 'Guarda este pensamiento dentro de tu corazón',
    options: [
      { id: 'valgo', label: 'Mi esfuerzo vale oro cada día', emoji: '⭐' },
      { id: 'merecer', label: 'Merezco disfrutar sin culpas', emoji: '🎀' },
      { id: 'luz', label: 'Mi sonrisa puede sanar e iluminar', emoji: '🌻' },
      { id: 'futuro', label: 'Vienen días hermosos para mí', emoji: '🌈' },
    ],
  },
];
