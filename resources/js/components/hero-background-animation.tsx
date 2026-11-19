import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * 3D Luxury Atelier Canvas Background for GALUH & CO.
 *
 * Visual:
 * 1. 3D Floating & Falling Gold Leaf Foils (55 vibrant 24K gold leaves tumbling and falling downward).
 * 2. Delicate Luxury Architectural Hairline Rings (Subtle, non-intrusive geometric arcs).
 * 3. Reactive 3D Parallax Camera (Interactive depth response to mouse movements).
 * 4. Ambient Warmth Glows (Champagne & emerald atmosphere).
 */

interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface GoldFoil {
    pos: Point3D;
    rot: Point3D;
    rotVel: Point3D;
    vel: Point3D;
    size: number;
    aspectRatio: number;
    baseColor: string;
    opacity: number;
}

interface Ring3D {
    radius: number;
    pitch: number;
    yaw: number;
    rollSpeed: number;
    roll: number;
    segments: number;
    alpha: number;
    width: number;
}

export function HeroBackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Spring physics for smooth pointer tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { damping: 25, stiffness: 60 });
    const smoothMouseY = useSpring(mouseY, { damping: 25, stiffness: 60 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width =
            canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height =
            canvas.parentElement?.clientHeight || window.innerHeight);

        // High-DPI Retina Crispness
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', handleResize);

        // 3D Camera parameters
        const focalLength = 520;
        let camTargetX = 0;
        let camTargetY = 0;
        let camCurX = 0;
        let camCurY = 0;
        let cursorWorldX = 0;
        let cursorWorldY = 0;

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            mouseX.set(relX);
            mouseY.set(relY);

            camTargetX = ((relX / width) * 2 - 1) * 75;
            camTargetY = ((relY / height) * 2 - 1) * 50;

            cursorWorldX = relX - width * 0.5;
            cursorWorldY = relY - height * 0.5;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Initialize 3D Gold Leaf Foils (55 vibrant, falling gold leaf foils)
        const FOIL_COUNT = 55;
        const goldColors = [
            '#D4AF37', // 24K Champagne Gold
            '#F5D061', // Bright Luminous Gold
            '#E5BA73', // Pale Honey Gold
            '#C5A880', // Warm Atelier Brass
            '#D9A036', // Royal Amber Gold
        ];
        const foils: GoldFoil[] = [];

        for (let i = 0; i < FOIL_COUNT; i++) {
            foils.push({
                pos: {
                    x: (Math.random() - 0.5) * (width * 1.3),
                    y: (Math.random() - 0.5) * (height * 1.3),
                    z: Math.random() * 750 - 150,
                },
                rot: {
                    x: Math.random() * Math.PI * 2,
                    y: Math.random() * Math.PI * 2,
                    z: Math.random() * Math.PI * 2,
                },
                rotVel: {
                    x: (Math.random() - 0.5) * 0.03,
                    y: (Math.random() - 0.5) * 0.03,
                    z: (Math.random() - 0.5) * 0.02,
                },
                vel: {
                    x: (Math.random() - 0.5) * 0.35,
                    y: 0.42 + Math.random() * 0.6, // Downward falling motion (Emas Berjatuhan)
                    z: (Math.random() - 0.5) * 0.25,
                },
                size: 11 + Math.random() * 15, // Clearly visible foils (11px - 26px)
                aspectRatio: 0.55 + Math.random() * 0.75,
                baseColor:
                    goldColors[Math.floor(Math.random() * goldColors.length)],
                opacity: 0.5 + Math.random() * 0.4,
            });
        }

        // Initialize 2 Ultra-Fine Architectural Rings (Delicate, soft watermark)
        const rings: Ring3D[] = [
            {
                radius: 230,
                pitch: 1.1,
                yaw: 0.35,
                roll: 0,
                rollSpeed: 0.0014,
                segments: 64,
                alpha: 0.16,
                width: 0.75,
            },
            {
                radius: 320,
                pitch: 0.7,
                yaw: -0.45,
                roll: 1.2,
                rollSpeed: -0.0012,
                segments: 72,
                alpha: 0.12,
                width: 0.6,
            },
        ];

        // 3D Point Projection Helper
        function project(
            p: Point3D,
            camX: number,
            camY: number,
            cx: number,
            cy: number,
        ): { x: number; y: number; scale: number; visible: boolean } {
            const relX = p.x - camX;
            const relY = p.y - camY;
            const relZ = p.z + focalLength;

            if (relZ <= 10) {
                return { x: 0, y: 0, scale: 0, visible: false };
            }

            const scale = focalLength / relZ;
            return {
                x: cx + relX * scale,
                y: cy + relY * scale,
                scale,
                visible: true,
            };
        }

        let time = 0;

        // Main 60fps Animation Loop
        const render = () => {
            time += 0.016;

            // Camera lerp
            camCurX += (camTargetX - camCurX) * 0.05;
            camCurY += (camTargetY - camCurY) * 0.05;

            ctx.clearRect(0, 0, width, height);

            const centerX = width * 0.5;
            const centerY = height * 0.48;
            const ringCenter: Point3D = {
                x: 0,
                y: 0,
                z: 140,
            };

            // 1. Draw Architectural Hairline Rings (Subtle background luxury depth)
            ctx.save();
            rings.forEach((ring) => {
                ring.roll += ring.rollSpeed;

                ctx.lineWidth = ring.width;
                ctx.beginPath();
                let started = false;

                for (let i = 0; i <= ring.segments; i++) {
                    const theta = (i / ring.segments) * Math.PI * 2;
                    const lx = Math.cos(theta) * ring.radius;
                    const ly = Math.sin(theta) * ring.radius;
                    const lz = 0;

                    const rz_x =
                        lx * Math.cos(ring.roll) - ly * Math.sin(ring.roll);
                    const rz_y =
                        lx * Math.sin(ring.roll) + ly * Math.cos(ring.roll);

                    const rx_y =
                        rz_y * Math.cos(ring.pitch) - lz * Math.sin(ring.pitch);
                    const rx_z =
                        rz_y * Math.sin(ring.pitch) + lz * Math.cos(ring.pitch);

                    const ry_x =
                        rz_x * Math.cos(ring.yaw) + rx_z * Math.sin(ring.yaw);
                    const ry_z =
                        -rz_x * Math.sin(ring.yaw) + rx_z * Math.cos(ring.yaw);

                    const p3d: Point3D = {
                        x: ringCenter.x + ry_x,
                        y: ringCenter.y + rx_y,
                        z: ringCenter.z + ry_z,
                    };

                    const proj = project(
                        p3d,
                        camCurX * 0.45,
                        camCurY * 0.45,
                        centerX,
                        centerY,
                    );
                    if (proj.visible) {
                        if (!started) {
                            ctx.moveTo(proj.x, proj.y);
                            started = true;
                        } else {
                            ctx.lineTo(proj.x, proj.y);
                        }
                    }
                }

                ctx.strokeStyle = `rgba(197, 168, 128, ${ring.alpha})`;
                ctx.stroke();
            });
            ctx.restore();

            // 2. Sort Foils by Depth (Z-Sorting for 3D realism)
            foils.sort((a, b) => b.pos.z - a.pos.z);

            // 3. Draw 3D Falling Gold Leaf Foils with Specular Highlights & Physics
            foils.forEach((foil) => {
                // Interactive cursor draft physics (gentle repulsion)
                const dx = foil.pos.x - cursorWorldX;
                const dy = foil.pos.y - cursorWorldY;
                const distSq = dx * dx + dy * dy;
                if (distSq < 28000 && distSq > 100) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / 167) * 1.5;
                    foil.pos.x += (dx / dist) * force;
                    foil.pos.y += (dy / dist) * force;
                }

                // Update physical coordinates (Emas Berjatuhan)
                foil.pos.x +=
                    foil.vel.x +
                    Math.sin(time * 1.2 + foil.pos.y * 0.007) * 0.4;
                foil.pos.y += foil.vel.y;
                foil.pos.z += foil.vel.z;

                // Update 3D Euler angles
                foil.rot.x += foil.rotVel.x;
                foil.rot.y += foil.rotVel.y;
                foil.rot.z += foil.rotVel.z;

                // Wrap boundaries (falling continuously from top when reaching bottom)
                const boundX = width * 0.65;
                const boundY = height * 0.65;
                if (foil.pos.y > boundY) {
                    foil.pos.y = -boundY;
                    foil.pos.x = (Math.random() - 0.5) * boundX * 2;
                    foil.pos.z = Math.random() * 750 - 150;
                }
                if (foil.pos.x > boundX) foil.pos.x = -boundX;
                if (foil.pos.x < -boundX) foil.pos.x = boundX;
                if (foil.pos.z > 600) foil.pos.z = -150;
                if (foil.pos.z < -150) foil.pos.z = 600;

                // 3D Quad local polygon vertices
                const hw = (foil.size * foil.aspectRatio) / 2;
                const hh = foil.size / 2;

                const localVerts = [
                    { x: -hw, y: -hh, z: 0 },
                    { x: hw * 1.05, y: -hh * 0.85, z: 0 },
                    { x: hw * 0.95, y: hh, z: 0 },
                    { x: -hw * 0.9, y: hh * 0.85, z: 0 },
                ];

                const cx = Math.cos(foil.rot.x),
                    sx = Math.sin(foil.rot.x);
                const cy = Math.cos(foil.rot.y),
                    sy = Math.sin(foil.rot.y);
                const cz = Math.cos(foil.rot.z),
                    sz = Math.sin(foil.rot.z);

                const projectedVerts: { x: number; y: number }[] = [];
                let allVisible = true;

                for (let v = 0; v < 4; v++) {
                    const vert = localVerts[v];
                    const y1 = vert.y * cx - vert.z * sx;
                    const z1 = vert.y * sx + vert.z * cx;
                    const x2 = vert.x * cy + z1 * sy;
                    const z2 = -vert.x * sy + z1 * cy;
                    const x3 = x2 * cz - y1 * sz;
                    const y3 = x2 * sz + y1 * cz;

                    const worldP: Point3D = {
                        x: foil.pos.x + x3,
                        y: foil.pos.y + y3,
                        z: foil.pos.z + z2,
                    };

                    const proj = project(
                        worldP,
                        camCurX,
                        camCurY,
                        centerX,
                        centerY,
                    );
                    if (!proj.visible) {
                        allVisible = false;
                        break;
                    }
                    projectedVerts.push({ x: proj.x, y: proj.y });
                }

                if (!allVisible || projectedVerts.length < 4) return;

                // Normal Z to compute specular shine
                const v0 = projectedVerts[0];
                const v1 = projectedVerts[1];
                const v2 = projectedVerts[2];
                const normalZ =
                    (v1.x - v0.x) * (v2.y - v0.y) -
                    (v1.y - v0.y) * (v2.x - v0.x);
                const isFacing = Math.abs(normalZ) > 10;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(v0.x, v0.y);
                ctx.lineTo(v1.x, v1.y);
                ctx.lineTo(v2.x, v2.y);
                ctx.lineTo(projectedVerts[3].x, projectedVerts[3].y);
                ctx.closePath();

                const grad = ctx.createLinearGradient(v0.x, v0.y, v2.x, v2.y);
                if (isFacing) {
                    grad.addColorStop(0, '#FFFFFF');
                    grad.addColorStop(0.35, foil.baseColor);
                    grad.addColorStop(1, '#9E7E45');
                    ctx.globalAlpha = Math.min(foil.opacity * 1.15, 0.9);
                } else {
                    grad.addColorStop(0, foil.baseColor);
                    grad.addColorStop(0.7, '#B88B38');
                    grad.addColorStop(1, '#6F5324');
                    ctx.globalAlpha = foil.opacity * 0.65;
                }

                ctx.fillStyle = grad;
                ctx.fill();

                // Crisp highlight micro-border for realistic foil texture
                ctx.lineWidth = 0.6;
                ctx.strokeStyle = `rgba(255, 255, 255, ${isFacing ? 0.5 : 0.2})`;
                ctx.stroke();

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
        >
            {/* 1. Luminous Warm Gallery Bloom */}
            <motion.div
                animate={{
                    x: [0, 25, -20, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(224, 185, 115, 0.16) 0%, rgba(212, 175, 55, 0.06) 50%, transparent 75%)',
                }}
                className="absolute -top-16 -left-12 size-[580px] rounded-full blur-[80px]"
            />

            {/* 2. Soft Emerald Depth */}
            <motion.div
                animate={{
                    x: [0, -20, 20, 0],
                    y: [0, 20, -20, 0],
                }}
                transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(14, 52, 36, 0.10) 0%, transparent 70%)',
                }}
                className="absolute top-1/4 -right-16 size-[560px] rounded-full blur-[85px]"
            />

            {/* 3. Interactive Cursor Golden Spotlight */}
            <motion.div
                className="absolute size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply blur-[75px]"
                style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                    background:
                        'radial-gradient(circle, rgba(218, 165, 32, 0.14) 0%, transparent 65%)',
                }}
            />

            {/* 4. The 3D Atelier Perspective Canvas (55 falling gold leaves & fine geometry) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 size-full mix-blend-normal"
            />
        </div>
    );
}
