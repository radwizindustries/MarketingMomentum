import React, { useRef, useEffect, useCallback, useState } from 'react';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  PLAYER_WIDTH,
  PLAYER_HEIGHT, 
  ITEM_WIDTH,
  ITEM_HEIGHT,
  POSITIVE_ITEMS, 
  NEGATIVE_ITEMS, 
  GAME_DURATION,
  DIFFICULTY_TIERS,
  GRAVITY,
  JUMP_STRENGTH,
  GROUND_HEIGHT,
  PATIENT_VALUE,
  BACKGROUND_URL
} from '../constants';
import { GameEntity, GameState, Particle } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onScoreUpdate: (revenue: number, customers: number) => void;
  onTimeUpdate: (time: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  setGameState, 
  onScoreUpdate,
  onTimeUpdate 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  
  const playerRef = useRef({ 
    x: 150, 
    y: CANVAS_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT,
    velocity: 0,
    isGrounded: true
  });

  const itemsRef = useRef<GameEntity[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef({ revenue: 0, customers: 0 });
  const timeRef = useRef(GAME_DURATION);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const bgOffsetRef = useRef(0);

  // Callback refs
  const onScoreUpdateRef = useRef(onScoreUpdate);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const setGameStateRef = useRef(setGameState);

  useEffect(() => {
    onScoreUpdateRef.current = onScoreUpdate;
    onTimeUpdateRef.current = onTimeUpdate;
    setGameStateRef.current = setGameState;
  }, [onScoreUpdate, onTimeUpdate, setGameState]);

  // Load Background Image
  useEffect(() => {
    const img = new Image();
    img.src = BACKGROUND_URL;
    img.onload = () => {
        bgImageRef.current = img;
        setIsBgLoaded(true);
        // Trigger a redraw if in start state
        if (gameState === 'START' && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) draw(ctx);
        }
    };
  }, []);

  const jump = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    
    if (playerRef.current.isGrounded) {
        playerRef.current.velocity = JUMP_STRENGTH;
        playerRef.current.isGrounded = false;
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const spawnParticles = (x: number, y: number, count: number, isGood: boolean) => {
    for (let i = 0; i < count; i++) {
        particlesRef.current.push({
            id: Math.random(),
            x: x + Math.random() * ITEM_WIDTH,
            y: y + ITEM_HEIGHT / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 4,
            life: 1.0,
            color: isGood ? '#B4E076' : '#ef4444', // Brand Lime or Red
            type: isGood && i % 2 === 0 ? 'DOLLAR' : 'TEXT'
        });
    }
  };

  const spawnItem = (elapsedTime: number) => {
    const passedTime = GAME_DURATION - elapsedTime;
    const tier = [...DIFFICULTY_TIERS].reverse().find(t => passedTime >= t.time) || DIFFICULTY_TIERS[0];
    
    if (frameCountRef.current % tier.spawnRate === 0) {
      // INCREASED NEGATIVE CHANCE TO ~45%
      const isNegative = Math.random() > 0.55; 
      const pool = isNegative ? NEGATIVE_ITEMS : POSITIVE_ITEMS;
      const config = pool[Math.floor(Math.random() * pool.length)];

      const groundY = CANVAS_HEIGHT - GROUND_HEIGHT - ITEM_HEIGHT - 10;
      const airY = groundY - 200; // Higher jump for square items

      // Obstacles mostly on ground, Good items mixed
      let spawnY = groundY;
      if (!isNegative) {
          spawnY = Math.random() > 0.5 ? airY : groundY;
      }

      itemsRef.current.push({
        id: Date.now() + Math.random(),
        x: CANVAS_WIDTH,
        y: spawnY,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        speed: tier.speedMult,
        config: config
      });
    }
  };

  const drawScrollingBackground = (ctx: CanvasRenderingContext2D) => {
    if (!bgImageRef.current) {
        // Fallback
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        return;
    }

    const img = bgImageRef.current;
    // Calculate scale to fit height
    const scale = CANVAS_HEIGHT / img.height;
    const scaledWidth = img.width * scale;
    const speed = 2; // Matches bgOffset increment
    
    // Calculate position
    const xPos = -(bgOffsetRef.current * speed) % scaledWidth;
    
    // Draw first image
    ctx.drawImage(img, xPos, 0, scaledWidth, CANVAS_HEIGHT);
    
    // Draw second image to fill gap
    if (xPos + scaledWidth < CANVAS_WIDTH) {
        ctx.drawImage(img, xPos + scaledWidth, 0, scaledWidth, CANVAS_HEIGHT);
    }
    // Draw third if screen is very wide relative to image
    if (xPos + scaledWidth * 2 < CANVAS_WIDTH) {
        ctx.drawImage(img, xPos + scaledWidth * 2, 0, scaledWidth, CANVAS_HEIGHT);
    }
  };

  const drawDoctor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const isJumping = !playerRef.current.isGrounded;

    // Shadow
    if (!isJumping) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(x + PLAYER_WIDTH/2, y + PLAYER_HEIGHT, 20, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Legs
    ctx.fillStyle = '#1e3a8a'; // Navy pants
    if (!isJumping) {
        ctx.fillRect(x + 10, y + 45, 12, 35);
        ctx.fillRect(x + 28, y + 45, 12, 35);
    } else {
        // Jump pose legs
        ctx.fillRect(x + 8, y + 40, 12, 30); 
        ctx.fillRect(x + 30, y + 45, 12, 35); 
    }

    // Body
    ctx.fillStyle = '#3b82f6'; // Blue scrubs
    ctx.fillRect(x, y + 20, PLAYER_WIDTH, 40);
    
    // Arms
    ctx.fillStyle = '#60a5fa'; 
    if (isJumping) {
        // VICTORY ARM (Right arm up)
        ctx.save();
        ctx.translate(x + PLAYER_WIDTH - 5, y + 22);
        ctx.rotate(-Math.PI / 1.5); // Upward angle
        ctx.fillRect(0, 0, 10, 30);
        // Hand
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(5, 32, 6, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Left arm down
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(x - 5, y + 22, 10, 25);
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(x, y + 50, 5, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Running arms
        ctx.fillRect(x - 5, y + 22, 10, 25); 
        ctx.fillRect(x + PLAYER_WIDTH - 5, y + 22, 10, 25);
        // Hands
        ctx.fillStyle = '#fca5a5'; 
        ctx.beginPath();
        ctx.arc(x, y + 50, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + PLAYER_WIDTH, y + 50, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 9px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("DOCTOR", x + PLAYER_WIDTH/2, y + 35);
    ctx.textAlign = 'start';

    // Head
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(x + PLAYER_WIDTH/2, y + 10, 16, 0, Math.PI * 2);
    ctx.fill();

    // Surgical Mask
    ctx.fillStyle = 'white';
    ctx.fillRect(x + PLAYER_WIDTH/2 - 12, y + 12, 24, 12);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + PLAYER_WIDTH/2 - 12, y + 12, 24, 12);

    // Stethoscope
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + PLAYER_WIDTH/2 - 10, y + 20);
    ctx.quadraticCurveTo(x + PLAYER_WIDTH/2, y + 40, x + PLAYER_WIDTH/2 + 10, y + 20);
    ctx.stroke();

    // Scrub Cap
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(x + PLAYER_WIDTH/2, y + 5, 17, Math.PI, 0); 
    ctx.fill();
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        
        if (p.type === 'DOLLAR') {
            ctx.font = 'bold 14px monospace';
            ctx.fillText('$', p.x, p.y);
        } else {
            ctx.fillRect(p.x, p.y, 6, 4);
        }
        ctx.globalAlpha = 1.0;
    });
  };

  const update = (deltaTime: number) => {
    if (timeRef.current <= 0) {
      setGameStateRef.current('GAME_OVER');
      return;
    }

    // Timers
    timeRef.current -= deltaTime / 1000;
    onTimeUpdateRef.current(Math.max(0, Math.ceil(timeRef.current)));
    bgOffsetRef.current += 1; // Used for scroll offset

    // Physics
    playerRef.current.velocity += GRAVITY;
    playerRef.current.y += playerRef.current.velocity;
    const floorY = CANVAS_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;
    
    if (playerRef.current.y >= floorY) {
        playerRef.current.y = floorY;
        playerRef.current.velocity = 0;
        playerRef.current.isGrounded = true;
    }

    // Spawning
    spawnItem(timeRef.current);
    frameCountRef.current++;

    // Items
    itemsRef.current.forEach(item => item.x -= item.speed);
    itemsRef.current = itemsRef.current.filter(item => item.x + item.width > 0);

    // Particles
    particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.life -= 0.02;
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    // Collision
    const playerBox = {
      x: playerRef.current.x + 15,
      y: playerRef.current.y + 5,
      w: PLAYER_WIDTH - 30,
      h: PLAYER_HEIGHT - 10
    };

    itemsRef.current = itemsRef.current.filter(item => {
      const itemPaddingX = 20;
      const itemPaddingY = 10;
      
      const itemBox = { 
        x: item.x + itemPaddingX, 
        y: item.y + itemPaddingY, 
        w: item.width - (itemPaddingX * 2), 
        h: item.height - itemPaddingY 
      };

      const isColliding = 
        playerBox.x < itemBox.x + itemBox.w &&
        playerBox.x + playerBox.w > itemBox.x &&
        playerBox.y < itemBox.y + itemBox.h &&
        playerBox.y + playerBox.h > itemBox.y;

      if (isColliding) {
        if (item.config.customers !== 0) {
            scoreRef.current.customers = Math.max(0, scoreRef.current.customers + item.config.customers);
            scoreRef.current.revenue = scoreRef.current.customers * PATIENT_VALUE;
        }

        onScoreUpdateRef.current(scoreRef.current.revenue, scoreRef.current.customers);

        if (item.config.isPositive) {
            spawnParticles(item.x, item.y, 12, true);
        } else {
            spawnParticles(item.x, item.y, 5, false);
        }
        return false; 
      }
      return true;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawScrollingBackground(ctx);
    drawDoctor(ctx, playerRef.current.x, playerRef.current.y);

    // Draw Items (Square Boxes)
    itemsRef.current.forEach(item => {
      // Box
      ctx.fillStyle = item.config.color;
      ctx.beginPath();
      ctx.roundRect(item.x, item.y, item.width, item.height, 12);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text & Icon Stack
      ctx.textAlign = 'center';
      
      // 1. Icon (Top)
      ctx.font = '32px serif'; // Emoji font size
      ctx.fillText(item.config.icon, item.x + item.width/2, item.y + 35);
      
      // 2. Label (Middle)
      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px "Inter", sans-serif';
      
      // Basic word wrap for label
      const words = item.config.label.split(' ');
      if (words.length > 1 && item.config.label.length > 10) {
          ctx.fillText(words[0], item.x + item.width/2, item.y + 55);
          ctx.fillText(words.slice(1).join(' '), item.x + item.width/2, item.y + 68);
      } else {
          ctx.fillText(item.config.label, item.x + item.width/2, item.y + 60);
      }

      // 3. Result Badge (Bottom)
      if (item.config.customers !== 0) {
          const sign = item.config.customers > 0 ? '+' : '';
          const badgeText = `${sign}${item.config.customers} Patients`;
          const isGood = item.config.customers > 0;
          
          // Small pill bg
          ctx.fillStyle = isGood ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.3)';
          ctx.beginPath();
          ctx.roundRect(item.x + 10, item.y + item.height - 24, item.width - 20, 18, 9);
          ctx.fill();

          ctx.fillStyle = isGood ? '#003D51' : '#ffffff'; // Dark text on white pill, or white on dark
          ctx.font = 'bold 10px "Inter", sans-serif';
          ctx.fillText(badgeText, item.x + item.width/2, item.y + item.height - 11);
      }
    });

    drawParticles(ctx);
  };

  const loop = useCallback((time: number) => {
    if (gameState !== 'PLAYING') return;
    const deltaTime = time - lastFrameTimeRef.current;
    lastFrameTimeRef.current = time;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      update(deltaTime);
      draw(ctx);
    }
    requestRef.current = requestAnimationFrame(loop);
  }, [gameState, isBgLoaded]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      itemsRef.current = [];
      particlesRef.current = [];
      scoreRef.current = { revenue: 0, customers: 0 };
      timeRef.current = GAME_DURATION;
      playerRef.current = {
          x: 150,
          y: CANVAS_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT,
          velocity: 0,
          isGrounded: true
      };
      
      onScoreUpdateRef.current(0, 0);
      lastFrameTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(loop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState, loop]);

  useEffect(() => {
    if (gameState === 'START' && canvasRef.current && isBgLoaded) {
       const ctx = canvasRef.current.getContext('2d');
       if(ctx) {
           draw(ctx);
       }
    }
  }, [gameState, isBgLoaded]);

  return (
    <div 
        className="relative w-full shadow-2xl rounded-xl overflow-hidden border-4 border-brand-dark bg-slate-50 aspect-[21/9]"
        onClick={jump}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full touch-none cursor-pointer"
      />
      <div className="absolute bottom-4 left-0 w-full text-center text-brand-dark font-bold font-sans text-sm pointer-events-none opacity-80 bg-white/50 py-2">
        Press SPACE or TAP to Jump
      </div>
    </div>
  );
};

export default GameCanvas;