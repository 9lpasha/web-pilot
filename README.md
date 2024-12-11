# Web Blueprints

<image src="./client/public/logo.svg" width="400px" alt="project logo">

## Движок для визуального программирования.

### Запуск проекта

1. Установить все зависимости для клиента и сервера, запустив команду:

```bash
 npm i
```

- (Опционально) Если не сработал скрипт `postinstall`, установить зависимости для клиента и сервера самостоятельно:

```bash
 npm run postinstall
```

Или

```bash
 npm run client:install && npm run server:install
```

2. Запустить в режиме DEV:

Клиент + север:

```bash
 npm run start:dev
```

Только клиент:

```bash
 npm run start:dev:client
```

Только сервер:

```bash
 npm run start:dev:server
```

### Скрипты

- `prepare` - Инициализация Husky хуков.
- `build:dev` - Сборка клиента и сервера в dev режиме.
- `build:dev:client` - Сборка клиента в dev режиме.
- `build:dev:server` - Сборка сервера в dev режиме.
- `build:prod` - Сборка клиента и сервера в prod режиме.
- `build:prod:client` - Сборка клиента в prod режиме.
- `build:prod:server` - Сборка сервера в prod режиме.
- `start:dev` - Запуск dev серверов для клиента и сервера одновременно.
- `start:dev:client` - Запуск dev сервера только для клиента.
- `start:dev:server` - Запуск dev сервера только для сервера.
- `lint:ts` - Проверка TypeScript кода с помощью ESLint.
- `lint:ts:fix` - Проверка и автоматическое исправление ошибок в TypeScript коде с помощью ESLint.
- `lint:css` - Проверка CSS файлов с помощью Stylelint.
- `lint:css:fix` - Проверка и автоматическое исправление ошибок в CSS файлах с помощью Stylelint.
- `test` - Запуск тестов как для клиента, так и для сервера.
- `test:client` - Запуск тестов для клиента.
- `test:server` - Запуск тестов для сервера.
- `client:install` - Установка зависимостей в директории клиента.
- `server:install` - Установка зависимостей в директории сервера.
- `postinstall` - Установка зависимостей как для клиента, так и для сервера после выполнения основного `npm install`.
- `clear:cache` - Очистка кэша с помощью скрипта `clearCache.js`.
