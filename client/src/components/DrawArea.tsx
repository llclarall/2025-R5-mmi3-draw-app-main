import { useCallback, useEffect, useRef } from "react";

export function DrawArea() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = useCallback((event) => {
      const canvas = event.currentTarget;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();

      console.log(rect);

      if (ctx) {
        const onMouseMove = (moveEvent: MouseEvent) => {
          const x = moveEvent.clientX - rect.left;
          const y = moveEvent.clientY - rect.top;
          ctx.fillRect(x, y, 3, 3);
        };

        canvas.addEventListener("mousemove", onMouseMove);

        const onMouseUp = () => {
          canvas.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mouseup", onMouseUp);
      }
  }, []);

    const setCanvasDimensions = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setCanvasDimensions();
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }
  }, [setCanvasDimensions]);

  return (
    <div className="w-full h-full" ref={parentRef}>
      <canvas
        className="border-1 w-full"
        onMouseDown={onMouseDown}
        ref={canvasRef}
      />
    </div>
  );
}