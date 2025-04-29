import {CanvasNodeStore, VariableStore} from '../types';
import {buildDirectionalLinks} from './buildDirectionalLinks';

type ConnectedSides = {
  node: CanvasNodeStore;
  top: ConnectedSides[];
  bottom: ConnectedSides[];
  left: ConnectedSides[];
  right: ConnectedSides[];
};

export function generateJs2(variables: VariableStore[], nodes: CanvasNodeStore[]): string {
  let i = 0;
  let indent = 0;
  const INDENT = '  ';
  let result = '';

  const links = buildDirectionalLinks(nodes);
  const first = Object.values(links).find((l) => !l.left.length && !l.top.length)!;
  let current: ConnectedSides | null = first;
  let baseCurrent: ConnectedSides | null = first;
  const tokens = [] as string[];

  variables.forEach((v) => {
    tokens.push(v.variableType);
    tokens.push(v.name);
    tokens.push('=');
    tokens.push(v.value?.toString() || '');
  });

  while (current) {
    tokens.push((current.node.value || current.node.name).toString());

    if (current.right.length) current = current.right[0];
    else if (baseCurrent.bottom.length) {
      current = baseCurrent.bottom[0];
      baseCurrent = baseCurrent.bottom[0];
    } else current = null;
  }

  const next = () => tokens[i++];
  const peek = () => tokens[i];
  const hasMore = () => i < tokens.length;

  const appendLine = (line: string) => {
    result += INDENT.repeat(indent) + line + '\n';
  };

  const isDeclarationKeyword = (token: string) => ['const', 'let', 'var'].includes(token);
  const isControlKeyword = (token: string) =>
    ['if', 'else', 'for', 'while', 'function', 'return', 'break', 'continue', 'call'].includes(token);

  const isTopLevelKeyword = (token: string) => isDeclarationKeyword(token) || isControlKeyword(token);

  const parseDeclaration = () => {
    while (hasMore() && isDeclarationKeyword(peek())) {
      const declType = next(); // const/let/var
      const name = next();
      let declaration = `${declType} ${name}`;

      if (peek() === '=') {
        next(); // consume '='
        const expr: string[] = [];
        while (hasMore() && !isTopLevelKeyword(peek()) && peek() !== 'const' && peek() !== 'let' && peek() !== 'var') {
          expr.push(next());
        }
        declaration += ' = ' + expr.join(' ');
      }

      appendLine(declaration + ';');
    }
  };

  const parseExpression = (): string[] => {
    const expr: string[] = [];
    while (hasMore() && !isTopLevelKeyword(peek())) {
      expr.push(next());
    }
    return expr;
  };

  const parseConditionExpression = (): string[] => {
    const condition: string[] = [];

    while (hasMore()) {
      const t = peek();

      // Тело — не условие
      if (
        t === 'return' ||
        t === 'call' ||
        t === 'function' ||
        t === 'break' ||
        t === 'continue' ||
        (/^[a-zA-Zа-яА-Я0-9_]+$/.test(t) && tokens[i + 1] === '=')
      ) {
        break;
      }

      // Простое ограничение по длине — fallback
      if (condition.length > 6) break;

      condition.push(next());
    }

    return condition;
  };

  const parseBlockStatements = () => {
    while (hasMore() && !isTopLevelKeyword(peek())) {
      parseStatement();
    }
  };

  const parseStatement = () => {
    if (!hasMore()) return;
    const token = next();

    if (token === 'if' || token === 'while' || token === 'for') {
      const conditionTokens = parseConditionExpression();
      appendLine(`${token} (${conditionTokens.join(' ')}) {`);
      indent++;
      while (hasMore() && !isTopLevelKeyword(peek())) {
        parseStatement();
      }
      indent--;
      appendLine('}');
      return;
    }

    if (token === 'function') {
      const name = next();
      const params: string[] = [];
      while (hasMore() && peek() !== '{' && !isTopLevelKeyword(peek())) {
        params.push(next());
      }
      appendLine(`function ${name}(${params.join(', ')}) {`);
      indent++;
      parseBlockStatements();
      indent--;
      appendLine('}');
      return;
    }

    if (token === 'return' || token === 'break' || token === 'continue') {
      const expr = parseExpression();
      appendLine(`${token}${expr.length ? ' ' + expr.join(' ') : ''};`);
      return;
    }

    if (token === 'call') {
      const fnName = next();
      const args = parseExpression();
      appendLine(`${fnName}(${args.join(', ')});`);
      return;
    }

    if (isDeclarationKeyword(token)) {
      i--; // вернуть назад
      parseDeclaration();
      return;
    }

    // Обработка выражения, возможно присваивания
    const expr = [token];
    while (hasMore() && !isTopLevelKeyword(peek())) {
      expr.push(next());
    }

    // Если это просто строка (на русском, без знаков), то делаем console.log
    if (expr.length === 1 && /^[а-яА-Яa-zA-Z0-9\s.,!?()]+$/.test(expr[0]) && !/^\d+$/.test(expr[0]) && expr[0] !== '=') {
      appendLine(`console.log("${expr[0]}");`);
    } else {
      appendLine(expr.join(' ') + ';');
    }
  };

  // Начало: объявления переменных
  parseDeclaration();

  // Остальной код
  while (hasMore()) {
    parseStatement();
  }

  return result;
}
