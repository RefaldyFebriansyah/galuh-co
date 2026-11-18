import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * 3D Luxury Atelier Canvas Background for GALUH & CO.
 *
 * Implements a bespoke, hardware-accelerated 3D coordinate space on HTML5 Canvas:
 * 1. 3D Floating Gold Leaf Foils: True 3D planar polygons (tumble, yaw, pitch, roll)
 *    with specular metallic lighting reflections based on face normals.
 * 2. 3D Architectural Armillary Rings: Ultra-fine rotating luxury geometry wireframes.
 * 3. 3D Parallax Camera: Interactive cursor tracking with spring physics.
 * 4. Ambient Warmth Blobs: Soft champagne and deep emerald background light.
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
}

export function HeroBackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Spring physics for smooth pointer tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 75 });
    const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 75 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
            return;
        }

        let animationFrameId: number;
        let width = (canvas.width =
            canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height =
            canvas.parentElement?.clientHeight || window.innerHeight);

        // Retain high-DPI crispness
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

        // Interactive mouse handling
        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            mouseX.set(relX);
            mouseY.set(relY);

            // Normalized camera parallax offset (-1 to 1)
            camTargetX = ((relX / width) * 2 - 1) * 70;
            camTargetY = ((relY / height) * 2 - 1) * 50;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Initialize 3D Gold Leaf Foils
        const FOIL_COUNT = 34;
        const goldColors = [
            '#D4AF37',
            '#E5BA73',
            '#C5A880',
            '#D6A658',
            '#EED9A4',
        ];
        const foils: GoldFoil[] = [];

        for (let i = 0; i < FOIL_COUNT; i++) {
            foils.push({
                pos: {
                    x: (Math.random() - 0.5) * (width * 1.2),
                    y: (Math.random() - 0.5) * (height * 1.2),
                    z: Math.random() * 800 - 200, // Z depth from -200 to 600
                },
                rot: {
                    x: Math.random() * Math.PI * 2,
                    y: Math.random() * Math.PI * 2,
                    z: Math.random() * Math.PI * 2,
                },
                rotVel: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.015,
                },
                vel: {
                    x: (Math.random() - 0.5) * 0.25,
                    y: 0.15 + Math.random() * 0.35, // Gentle downward floating drift
                    z: (Math.random() - 0.5) * 0.2,
                },
                size: 7 + Math.random() * 11,
                aspectRatio: 0.5 + Math.random() * 0.9,
                baseColor:
                    goldColors[Math.floor(Math.random() * goldColors.length)],
                opacity: 0.35 + Math.random() * 0.45,
            });
        }

        // Initialize 3D Luxury Architectural Rings (Center-right behind hero hamper showcase)
        const rings: Ring3D[] = [
            {
                radius: 260,
                pitch: 1.05,
                yaw: 0.35,
                roll: 0,
                rollSpeed: 0.0016,
                segments: 72,
                alpha: 0.18,
            },
            {
                radius: 340,
                pitch: 0.85,
                yaw: -0.4,
                roll: 1.2,
                rollSpeed: -0.0012,
                segments: 90,
                alpha: 0.14,
            },
            {
                radius: 420,
                pitch: 1.2,
                yaw: 0.15,
                roll: 2.4,
                rollSpeed: 0.0008,
                segments: 100,
                alpha: 0.1,
            },
        ];

        // 3D Point Rotation & Projection Helper
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

        // Main Animation Loop
        const render = () => {
            time += 0.016;

            // Camera lerp
            camCurX += (camTargetX - camCurX) * 0.05;
            camCurY += (camTargetY - camCurY) * 0.05;

            ctx.clearRect(0, 0, width, height);

            const centerX = width * 0.5;
            const centerY = height * 0.5;
            const ringCenter: Point3D = {
                x: width * 0.22, // slightly shifted towards right/hamper area
                y: -height * 0.04,
                z: 220,
            };

            // 1. Draw 3D Architectural Armillary Rings
            ctx.save();
            ctx.lineWidth = 1;
            rings.forEach((ring) => {
                ring.roll += ring.rollSpeed;

                ctx.beginPath();
                let started = false;

                for (let i = 0; i <= ring.segments; i++) {
                    const theta = (i / ring.segments) * Math.PI * 2;
                    // Circle in local XY plane
                    const lx = Math.cos(theta) * ring.radius;
                    const ly = Math.sin(theta) * ring.radius;
                    const lz = 0;

                    // Rotate by roll (Z)
                    const rz_x =
                        lx * Math.cos(ring.roll) - ly * Math.sin(ring.roll);
                    const rz_y =
                        lx * Math.sin(ring.roll) + ly * Math.cos(ring.roll);

                    // Rotate by pitch (X)
                    const rx_y =
                        rz_y * Math.cos(ring.pitch) - lz * Math.sin(ring.pitch);
                    const rx_z =
                        rz_y * Math.sin(ring.pitch) + lz * Math.cos(ring.pitch);

                    // Rotate by yaw (Y)
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
                        camCurX * 0.4,
                        camCurY * 0.4,
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

            // 2. Sort Foils by Depth (Z-sorting for clean layering)
            foils.sort((a, b) => b.pos.z - a.pos.z);

            // 3. Draw 3D Floating Gold Leaf Foils
            foils.forEach((foil) => {
                // Update position
                foil.pos.x +=
                    foil.vel.x + Math.sin(time + foil.pos.y * 0.005) * 0.2;
                foil.pos.y += foil.vel.y;
                foil.pos.z += foil.vel.z;

                // Update 3D rotation
                foil.rot.x += foil.rotVel.x;
                foil.rot.y += foil.rotVel.y;
                foil.rot.z += foil.rotVel.z;

                // Wrap boundaries in 3D volume
                const boundX = width * 0.65;
                const boundY = height * 0.65;
                if (foil.pos.y > boundY) {
                    foil.pos.y = -boundY;
                    foil.pos.x = (Math.random() - 0.5) * boundX * 2;
                }
                if (foil.pos.x > boundX) foil.pos.x = -boundX;
                if (foil.pos.x < -boundX) foil.pos.x = boundX;
                if (foil.pos.z > 600) foil.pos.z = -150;
                if (foil.pos.z < -150) foil.pos.z = 600;

                // 3D Quad local vertices
                const hw = (foil.size * foil.aspectRatio) / 2;
                const hh = foil.size / 2;

                const localVerts = [
                    { x: -hw, y: -hh, z: 0 },
                    { x: hw, y: -hh * 0.85, z: 0 },
                    { x: hw * 0.9, y: hh, z: 0 },
                    { x: -hw * 0.95, y: hh * 0.9, z: 0 },
                ];

                // Rotate local vertices by foil Euler angles (rx, ry, rz)
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
                    // Rotate X
                    const y1 = vert.y * cx - vert.z * sx;
                    const z1 = vert.y * sx + vert.z * cx;
                    // Rotate Y
                    const x2 = vert.x * cy + z1 * sy;
                    const z2 = -vert.x * sy + z1 * cy;
                    // Rotate Z
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

                // Normal Z to compute specular shine (light facing vs angled)
                const v0 = projectedVerts[0];
                const v1 = projectedVerts[1];
                const v2 = projectedVerts[2];
                const normalZ =
                    (v1.x - v0.x) * (v2.y - v0.y) -
                    (v1.y - v0.y) * (v2.x - v0.x);
                const isFacing = Math.abs(normalZ) > 8;

                // Draw 3D polygon
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(v0.x, v0.y);
                ctx.lineTo(v1.x, v1.y);
                ctx.lineTo(v2.x, v2.y);
                ctx.lineTo(projectedVerts[3].x, projectedVerts[3].y);
                ctx.closePath();

                // Specular gradient simulating physical gold metallic foil reflection
                const grad = ctx.createLinearGradient(v0.x, v0.y, v2.x, v2.y);
                if (isFacing) {
                    grad.addColorStop(0, '#FFFFFF');
                    grad.addColorStop(0.35, foil.baseColor);
                    grad.addColorStop(1, '#9E7E45');
                    ctx.globalAlpha = foil.opacity * 0.9;
                } else {
                    grad.addColorStop(0, foil.baseColor);
                    grad.addColorStop(1, '#7A5E2E');
                    ctx.globalAlpha = foil.opacity * 0.55;
                }

                ctx.fillStyle = grad;
                ctx.fill();

                // Crisp micro-border for physical foil feel
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = `rgba(255, 255, 255, ${isFacing ? 0.4 : 0.15})`;
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
            {/* 1. Ambient Warm Gallery Bloom (Soft Champagne Foundation) */}
            <motion.div
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -25, 20, 0],
                    scale: [1, 1.06, 0.95, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(197, 168, 128, 0.05) 50%, transparent 75%)',
                }}
                className="absolute -top-24 -left-20 size-[620px] rounded-full blur-[110px]"
            />

            {/* 2. Forest Emerald Depth (Atmosphere behind the Hamper showcase) */}
            <motion.div
                animate={{
                    x: [0, -20, 15, 0],
                    y: [0, 20, -15, 0],
                    scale: [1, 1.08, 0.95, 1],
                }}
                transition={{
                    duration: 26,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(14, 42, 30, 0.08) 0%, rgba(22, 66, 47, 0.03) 50%, transparent 75%)',
                }}
                className="absolute top-1/4 -right-24 size-[650px] rounded-full blur-[120px]"
            />

            {/* 3. Subtle Interactive Cursor Spotlight */}
            <motion.div
                className="absolute size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply blur-[100px]"
                style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                    background:
                        'radial-gradient(circle, rgba(197, 168, 128, 0.16) 0%, rgba(229, 186, 115, 0.06) 45%, transparent 70%)',
                }}
            />

            {/* 4. The 3D Atelier Perspective Canvas (60fps hardware accelerated 3D foils & armillary geometry) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 size-full mix-blend-normal"
            />
        </div>
    );
}
