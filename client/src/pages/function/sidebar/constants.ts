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
    name: 'do-while',
    description: 'Цикл с постусловием',
  },
  {
    name: 'switch',
    description: 'Оператор множественного выбора',
  },
  {
    name: '==',
    description: 'Проверка равенства',
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
    name: 'return',
    description: 'Возвращает значение из функции',
  },
  {
    name: 'break',
    description: 'Прерывает выполнение цикла или switch',
  },
  {
    name: 'continue',
    description: 'Пропускает текущую итерацию цикла',
  },
  {
    name: 'function',
    description: 'Объявление функции',
  },
  {
    name: 'call',
    description: 'Вызов функции',
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
  },
  {
    name: 'console.error',
    description: 'Вывод ошибки в консоль',
  },
  {
    name: 'console.warning',
    description: 'Вывод предупреждения в консоль',
  },
  {
    name: 'setTimeout',
    description: 'Создать таймаут',
  },
  {
    name: 'setInterval',
    description: 'Создать интервал',
  },
  {
    name: 'window.alert',
    description: 'Выводит модальное окно с текстом',
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
