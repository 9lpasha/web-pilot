export const operators = [
  {
    name: 'if',
    description: 'Условный оператор',
  },
  {
    name: 'for',
    description: 'Цикл с параметрами',
  },
  {
    name: 'while',
    description: 'Цикл с предусловием',
  },
  {
    name: '==',
    description: 'Проверка равенства',
  },
  {
    name: '!=',
    description: 'Проверка неравенства',
  },
  {
    name: '=',
    description: 'Присваивание значения переменной',
  },
  {
    name: '+',
    description: 'Плюс',
  },
  {
    name: '-',
    description: 'Минус',
  },
  {
    name: '>',
    description: 'Плюс',
  },
  {
    name: '>=',
    description: 'Плюс',
  },
  {
    name: '<',
    description: 'Плюс',
  },
  {
    name: '<=',
    description: 'Плюс',
  },
  {
    name: 'return',
    description: 'Возвращает значение из функции',
  },
  {
    name: 'and',
    description: 'Логическое И (&&)',
  },
  {
    name: 'or',
    description: 'Логическое ИЛИ (||)',
  },
  {
    name: 'not',
    description: 'Логическое НЕ (!)',
  },
];

export const apiFunctions = [
  {
    name: 'console.log',
    description: 'Вывод в консоль',
    args: 1,
  },
  {
    name: 'console.error',
    description: 'Вывод ошибки в консоль',
    args: 1,
  },
  {
    name: 'console.warning',
    description: 'Вывод предупреждения в консоль',
    args: 1,
  },
  {
    name: 'setTimeout',
    description: 'Создать таймаут',
    args: 2,
  },
  {
    name: 'setInterval',
    description: 'Создать интервал',
    args: 2,
  },
  {
    name: 'window.alert',
    description: 'Выводит модальное окно с текстом',
    args: 1,
  },
];

export const apiObjects = [
  {
    name: 'localStorage',
    description: 'Браузерное хранилище',
  },
  {
    name: 'sessionStorage',
    description: 'Браузерное хранилище, удаляется при закрытии вкладки',
  },
  {
    name: 'cookies',
    description: 'Cookies хранилище',
  },
  {
    name: 'location.href',
    description: 'Ссылка в поисковой строке',
  },
  {
    name: 'screen',
    description: 'Объект со свойствами экрана',
  },
  {
    name: 'timeZone',
    description: 'Данные вашего часового пояса',
  },
  {
    name: 'navigator.language',
    description: 'Язык',
  },
  {
    name: 'navigator.userAgent',
    description: 'Код вашего устройства',
  },
  {
    name: 'getCurrentPosition',
    description: 'Текущая геопозиция',
    className: 'break-all',
  },
];
