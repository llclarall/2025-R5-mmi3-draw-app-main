import { useCallback, useEffect, useMemo, useRef } from "react";
import { getCoordinatesRelativeToElement } from "../../utils/getCanvasCoordinates";
import { useMyUserStore } from "../../../user/store/useMyUserStore";
import styles from './DrawArea.module.css';
import { SocketManager } from "../../../../shared/services/SocketManager";
import type { DrawStroke, Point } from "../../../../shared/types/drawing.type";
import { useDrawSettingsStore } from "../../../../store/useDrawSettingsStore";


export function DrawArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const parentRef = useRef<HTMLDivElement>(null); 
  const otherUserStrokes = useRef<Map<string, Point[]>>(new Map());
  
  const lastPointRef = useRef<{ x: number, y: number } | null>(null);

  const { myUser } = useMyUserStore();
  const canUserDraw = useMemo(() => myUser !== null, [myUser]); 
  
  const { color, strokeWidth, isEraser, clearCanvasSignal } = useDrawSettingsStore();

  const getCanvasCoordinates = useCallback((e: { clientX: number, clientY: number }) => {
    return getCoordinatesRelativeToElement(e.clientX, e.clientY, canvasRef.current);
  }, []);


  // tout effacer
  useEffect(() => {
    if (clearCanvasSignal > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        SocketManager.emit('draw:clear');
        otherUserStrokes.current.clear();
      }
    }
  }, [clearCanvasSignal]);


  
  const drawLine = useCallback((
    from: { x: number, y: number } | null,
    to: { x: number, y: number },
    lineColor?: string, 
    lineWidth?: number,
    isEraser?: boolean
  ) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const activeEraser = isEraser !== undefined ? isEraser : false;

    ctx.save();

    if (activeEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    } 


    ctx.strokeStyle = lineColor || color;
    ctx.lineWidth = lineWidth || strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
    } else {
      ctx.moveTo(to.x, to.y);
    }
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();
  }, [color, strokeWidth]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current || !lastPointRef.current) return;

    const coordinates = getCanvasCoordinates(e);
    
    drawLine(lastPointRef.current, coordinates, undefined, undefined, isEraser);

    lastPointRef.current = coordinates;

    SocketManager.emit('draw:move', {
      x: coordinates.x,
      y: coordinates.y
    });

  }, [drawLine, getCanvasCoordinates, isEraser]);

  const onMouseUp = useCallback(() => {
    if (!canvasRef.current) return;

    SocketManager.emit('draw:end');
    lastPointRef.current = null; 

    canvasRef.current.removeEventListener('mousemove', onMouseMove);
    canvasRef.current.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
    if (!canUserDraw) return;

    const coordinates = getCanvasCoordinates(e);
    lastPointRef.current = coordinates; 
    
    drawLine(null, coordinates, undefined, undefined, isEraser);

    SocketManager.emit('draw:start', {
      x: coordinates.x,
      y: coordinates.y,
      strokeWidth: strokeWidth,
      color: color,
      isEraser: isEraser
    });

    canvasRef.current?.addEventListener('mousemove', onMouseMove);
    canvasRef.current?.addEventListener('mouseup', onMouseUp);
  }, [canUserDraw, onMouseMove, onMouseUp, drawLine, getCanvasCoordinates, color, strokeWidth, isEraser]);

  // --- DPR, Resize, Sockets ---
  const setCanvasDimensions = useCallback(() => {
    if (!canvasRef.current || !parentRef.current) return;
    const dpr = window.devicePixelRatio || 1;
    const parentWidth = parentRef.current?.clientWidth;
    const canvasWidth = parentWidth; 
    const canvasHeight = Math.round(parentWidth * 9 / 16); 
    canvasRef.current.width = dpr * canvasWidth;
    canvasRef.current.height = dpr * canvasHeight; 
    parentRef.current.style.setProperty('--canvas-width', `${canvasWidth}px`);
    parentRef.current.style.setProperty('--canvas-height', `${canvasHeight}px`);
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr); 
  }, []);

  const drawOtherUserPoints = useCallback((socketId: string, points: Point[], sWidth?: number, sColor?: string, sIsEraser?: boolean) => {
    const previousPoints = otherUserStrokes.current.get(socketId) || [];
    points.forEach((point, index) => {
      if (previousPoints[index]) return;
      const from = index === 0 ? null : points[index - 1];
      drawLine(from, point, sColor, sWidth, sIsEraser);
    });
  }, [drawLine]);

  const onOtherUserDrawMove = useCallback((payload: DrawStroke) => {
    drawOtherUserPoints(payload.socketId, payload.points, payload.strokeWidth, payload.color, payload.isEraser);
  }, [drawOtherUserPoints]);

  const onOtherUserDrawEnd = useCallback((payload: DrawStroke) => {
    otherUserStrokes.current.delete(payload.socketId);
  }, []);

  const onOtherUserDrawClear = useCallback(() => {
    otherUserStrokes.current.clear();
  }, []);

  const getAllStrokes = useCallback(() => {
    SocketManager.get('strokes').then((data) => {
      if (!data || !data.strokes) return;
      (data.strokes as DrawStroke[]).forEach((stroke: DrawStroke) => {
        drawOtherUserPoints(stroke.socketId, stroke.points, stroke.strokeWidth, stroke.color, stroke.isEraser);
      });
    });
  }, [drawOtherUserPoints]);
  
  const onOtherUserDrawStart = useCallback((payload: DrawStroke) => {
    drawOtherUserPoints(payload.socketId, payload.points, payload.strokeWidth, payload.color, payload.isEraser);
    otherUserStrokes.current.set(payload.socketId, payload.points);
  }, [drawOtherUserPoints]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setCanvasDimensions();
      getAllStrokes();
    });
    if (parentRef.current) resizeObserver.observe(parentRef.current);
    return () => resizeObserver.disconnect();
  }, [setCanvasDimensions, getAllStrokes]);

  useEffect(() => {
    SocketManager.listen('draw:start', onOtherUserDrawStart);
    SocketManager.listen('draw:move', onOtherUserDrawMove);
    SocketManager.listen('draw:end', onOtherUserDrawEnd);
    SocketManager.listen('draw:clear', onOtherUserDrawClear);
    return () => {
      SocketManager.off('draw:start');
      SocketManager.off('draw:move');
      SocketManager.off('draw:end');
      SocketManager.off('draw:clear');
    };
  }, [onOtherUserDrawStart, onOtherUserDrawMove, onOtherUserDrawEnd, onOtherUserDrawClear]);

  useEffect(() => {
    getAllStrokes();
  }, [getAllStrokes]);

  return (
    <div className={[styles.drawArea, 'w-full', 'h-full', 'overflow-hidden', 'flex', 'items-center'].join(' ')} ref={parentRef}>
      <canvas className={[styles.drawArea__canvas, 'border-1'].join(' ')} onMouseDown={onMouseDown} ref={canvasRef} />
    </div>
  );
}