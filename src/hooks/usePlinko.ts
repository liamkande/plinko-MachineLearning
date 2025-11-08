import { useEffect, useRef, useCallback } from 'react';
import Matter, {Render} from 'matter-js';
import { BallData, PlinkoConfig } from '../types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BUCKET_COUNT = 10;
const PEG_COUNT = 14;

export const usePlinko = (
    canvasRef: React.RefObject<HTMLDivElement | null>,
    config: PlinkoConfig,
    onBallLanded: (data: BallData) => void
) => {
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const ballsRef = useRef<Map<number, { pos: number; bounce: number; size: number }>>(new Map());

    const initializeWorld = useCallback(() => {
        if (!canvasRef.current) return;

        const { Engine, Render, World, Bodies, Events } = Matter;

        const engine = Engine.create({
            gravity: { x: 0, y: 1 }
        });

        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                wireframes: false,
                background: 'transparent',
            },
        });

        // Create boundaries
        const boundaries = [
            Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH, 40, {
                isStatic: true,
                render: { fillStyle: 'rgba(255, 255, 255, 0.1)' },
            }),
            Bodies.rectangle(0, CANVAS_HEIGHT / 2, 40, CANVAS_HEIGHT, {
                isStatic: true,
                render: { fillStyle: 'rgba(255, 255, 255, 0.1)' },
            }),
            Bodies.rectangle(CANVAS_WIDTH, CANVAS_HEIGHT / 2, 40, CANVAS_HEIGHT, {
                isStatic: true,
                render: { fillStyle: 'rgba(255, 255, 255, 0.1)' },
            }),
        ];

        // Create pegs in triangular pattern
        const pegs: Matter.Body[] = [];
        const pegRadius = 5;
        const startY = 100;
        const spacingY = 35;
        const spacingX = 40;

        for (let row = 0; row < PEG_COUNT; row++) {
            const pegCountInRow = row + 3;
            const rowWidth = pegCountInRow * spacingX;
            const startX = (CANVAS_WIDTH - rowWidth) / 2 + spacingX / 2;

            for (let col = 0; col < pegCountInRow; col++) {
                const peg = Bodies.circle(
                    startX + col * spacingX,
                    startY + row * spacingY,
                    pegRadius,
                    {
                        isStatic: true,
                        render: {
                            fillStyle: '#ffffff',
                        },
                    }
                );
                pegs.push(peg);
            }
        }

        // Create bucket sensors
        const bucketWidth = CANVAS_WIDTH / BUCKET_COUNT;
        const buckets: Matter.Body[] = [];

        for (let i = 0; i < BUCKET_COUNT; i++) {
            const bucket = Bodies.rectangle(
                bucketWidth * i + bucketWidth / 2,
                CANVAS_HEIGHT - 20,
                bucketWidth - 2,
                40,
                {
                    isStatic: true,
                    isSensor: true,
                    label: `bucket-${i}`,
                    render: {
                        fillStyle: 'rgba(255, 255, 255, 0.2)',
                    },
                }
            );
            buckets.push(bucket);
        }

        World.add(engine.world, [...boundaries, ...pegs, ...buckets]);

        // Handle collisions with buckets
        Events.on(engine, 'collisionStart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                const bucket = bodyA.label?.startsWith('bucket-') ? bodyA : bodyB;
                const ball = bodyA.label?.startsWith('bucket-') ? bodyB : bodyA;

                if (bucket.label?.startsWith('bucket-') && ball.label === 'ball') {
                    const bucketIndex = parseInt(bucket.label.split('-')[1]);
                    const ballData = ballsRef.current.get(ball.id);

                    if (ballData) {
                        onBallLanded({
                            dropPosition: ballData.pos,
                            bounciness: ballData.bounce,
                            size: ballData.size,
                            bucketLabel: bucketIndex,
                        });

                        ballsRef.current.delete(ball.id);
                        setTimeout(() => {
                            World.remove(engine.world, ball);
                        }, 1000);
                    }
                }
            });
        });

        Engine.run(engine);
        Render.run(render);

        engineRef.current = engine;
        renderRef.current = render;
    }, [canvasRef, onBallLanded]);

    const dropBall = useCallback((x: number) => {
        if (!engineRef.current) return;

        const { World, Bodies } = Matter;
        const bounciness = config.coefStart + Math.random() * (config.coefEnd - config.coefStart);
        const size = config.sizeStart + Math.random() * (config.sizeEnd - config.sizeStart);

        const ball = Bodies.circle(x, 50, size, {
            restitution: bounciness,
            friction: 0.1,
            label: 'ball',
            render: {
                fillStyle: `hsl(${Math.random() * 360}, 70%, 60%)`,
            },
        });

        ballsRef.current.set(ball.id, { pos: x, bounce: bounciness, size });
        World.add(engineRef.current.world, ball);
    }, [config]);

    const reset = useCallback(() => {
        if (engineRef.current && renderRef.current) {
            Matter.World.clear(engineRef.current.world, false);
            Matter.Engine.clear(engineRef.current);
            Render.stop(renderRef.current);
            renderRef.current.canvas.remove();
            ballsRef.current.clear();
            initializeWorld();
        }
    }, [initializeWorld]);

    useEffect(() => {
        initializeWorld();

        return () => {
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
            }
            if (renderRef.current) {
                Render.stop(renderRef.current);
                renderRef.current.canvas.remove();
            }
        };
    }, [initializeWorld]);

    return { dropBall, reset };
};