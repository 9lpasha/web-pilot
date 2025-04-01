import React, {useRef, useState, useEffect} from 'react';

interface TodoItem {
  id: number;
  text: string;
}

const todos: TodoItem[] = [
  {id: 1, text: '✔ Покормить кота'},
  {id: 2, text: '✔ Сделать кофе'},
  {id: 3, text: '✔ Написать код'},
];

export const CanvasPlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const rect = {x: 200, y: 150, width: 300, height: 200};
  const iconSize = 24;
  const iconX = rect.x + rect.width - 40;
  const iconY = rect.y + rect.height - 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    if (!isZoomed) {
      // Прямоугольник
      ctx.fillStyle = '#3498db';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Круглая кнопка входа
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Стрелка вниз
      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.moveTo(iconX - 6, iconY - 4);
      ctx.lineTo(iconX + 6, iconY - 4);
      ctx.lineTo(iconX, iconY + 6);
      ctx.fill();
    } else {
      // Фон списка дел
      ctx.fillStyle = '#f4f4f4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Заголовок
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.fillText('Ваш список дел:', 50, 100);

      // Элементы списка
      todos.forEach((todo, index) => {
        ctx.fillText(todo.text, 50, 140 + index * 40);
      });
    }

    ctx.restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, isZoomed]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isZoomed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const dist = Math.sqrt((clickX - iconX) ** 2 + (clickY - iconY) ** 2);
    if (dist <= iconSize / 2) {
      let zoomLevel = 1;
      const zoomInterval = setInterval(() => {
        zoomLevel += 0.1; // Увеличил скорость зума
        setZoom(zoomLevel);
        if (zoomLevel >= 3) {
          clearInterval(zoomInterval);
          setIsZoomed(true);
        }
      }, 9);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <canvas ref={canvasRef} width={800} height={500} onClick={handleClick} className='border border-gray-300' />
    </div>
  );
};
