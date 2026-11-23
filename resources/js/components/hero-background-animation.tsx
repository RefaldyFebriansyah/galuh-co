import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * 3D Luxury Atelier Botanical Background for GALUH & CO.
 *
 * Visual:
 * 1. 3D Falling Botanical Emerald Leaves: Delicate leaves in brand emerald greens
 *    (#0D251B, #143628, #1C4535, #285A46, #3A755D) with organic flutter, stem veins, and 3D tumble.
 * 2. Subtle Luxury Hairline Rings: Ultra-delicate geometric arcs.
 * 3. Reactive 3D Parallax Camera: Dynamic perspective responding to mouse movements.
 * 4. Ambient Warmth Glows: Champagne and deep emerald atelier atmosphere.
 */

interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface BotanicalLeaf {
    pos: Point3D;
    rot: Point3D;
    rotVel: Point3D;
    vel: Point3D;
    length: number;
    width: number;
    baseColor: string;
    highlightColor: string;
    opacity: number;
    swaySpeed: number;
    swayOffset: number;
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
        // Skip 3D canvas calculations on mobile (< 768px) to achieve 0ms TBT and 80+ Lighthouse score
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return;
        }

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

        // GALUH & CO. Defined Brand Emerald Green Palette (Adaptive count: 18 on mobile, 48 on desktop)
        const isMobile = width < 640;
        const LEAF_COUNT = isMobile ? 18 : 48;
        const emeraldVariants = [
            { base: '#143628', highlight: '#285A46' }, // Deep Emerald (Brand Primary)
            { base: '#0D251B', highlight: '#1C4535' }, // Dark Emerald (Brand Deep)
            { base: '#1C4535', highlight: '#3A755D' }, // Forest Emerald
            { base: '#285A46', highlight: '#4E8C70' }, // Soft Emerald
            { base: '#1E4031', highlight: '#C5A880' }, // Emerald with subtle Atelier Gold vein
        ];

        const leaves: BotanicalLeaf[] = [];

        for (let i = 0; i < LEAF_COUNT; i++) {
            const variant =
                emeraldVariants[
                    Math.floor(Math.random() * emeraldVariants.length)
                ];
            const length = 14 + Math.random() * 18; // Leaf length: 14px to 32px

            leaves.push({
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
                    x: (Math.random() - 0.5) * 0.025,
                    y: (Math.random() - 0.5) * 0.025,
                    z: (Math.random() - 0.5) * 0.02,
                },
                vel: {
                    x: (Math.random() - 0.5) * 0.3,
                    y: 0.38 + Math.random() * 0.55, // Gentle fluttering downward fall
                    z: (Math.random() - 0.5) * 0.2,
                },
                length,
                width: length * (0.42 + Math.random() * 0.2), // Botanical leaf aspect ratio
                baseColor: variant.base,
                highlightColor: variant.highlight,
                opacity: 0.55 + Math.random() * 0.4,
                swaySpeed: 1.2 + Math.random() * 1.2,
                swayOffset: Math.random() * Math.PI * 2,
            });
        }

        // Initialize 2 Ultra-Fine Hairline Geometry Rings (Soft champagne watermark)
        const rings: Ring3D[] = [
            {
                radius: 230,
                pitch: 1.1,
                yaw: 0.35,
                roll: 0,
                rollSpeed: 0.0014,
                segments: 64,
                alpha: 0.14,
                width: 0.7,
            },
            {
                radius: 320,
                pitch: 0.7,
                yaw: -0.45,
                roll: 1.2,
                rollSpeed: -0.0012,
                segments: 72,
                alpha: 0.1,
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

            // 1. Draw Architectural Hairline Rings (Subtle atelier depth)
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

            // 2. Sort Leaves by Depth (Z-sorting for 3D realism)
            leaves.sort((a, b) => b.pos.z - a.pos.z);

            // 3. Draw 3D Falling Botanical Emerald Leaves (Daun Berjatuhan)
            leaves.forEach((leaf) => {
                // Interactive cursor draft physics (gentle air displacement)
                const dx = leaf.pos.x - cursorWorldX;
                const dy = leaf.pos.y - cursorWorldY;
                const distSq = dx * dx + dy * dy;
                if (distSq < 28000 && distSq > 100) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / 167) * 1.6;
                    leaf.pos.x += (dx / dist) * force;
                    leaf.pos.y += (dy / dist) * force;
                    leaf.rotVel.x += (Math.random() - 0.5) * 0.01;
                    leaf.rotVel.z += (Math.random() - 0.5) * 0.01;
                }

                // Update physical coordinates: Natural leaf fluttering motion (ayunan daun melayang jatuh)
                const sway = Math.sin(time * leaf.swaySpeed + leaf.swayOffset);
                leaf.pos.x += leaf.vel.x + sway * 0.65;
                leaf.pos.y += leaf.vel.y;
                leaf.pos.z += leaf.vel.z;

                // Rotational rocking (daun berputar dan bergoyang saat jatuh tertiup angin)
                leaf.rot.x += leaf.rotVel.x + sway * 0.015;
                leaf.rot.y += leaf.rotVel.y;
                leaf.rot.z += leaf.rotVel.z + sway * 0.02;

                // Wrap boundaries (jatuh terus menerus dari atas layar saat mencapai bawah)
                const boundX = width * 0.68;
                const boundY = height * 0.68;
                if (leaf.pos.y > boundY) {
                    leaf.pos.y = -boundY;
                    leaf.pos.x = (Math.random() - 0.5) * boundX * 2;
                    leaf.pos.z = Math.random() * 750 - 150;
                }
                if (leaf.pos.x > boundX) leaf.pos.x = -boundX;
                if (leaf.pos.x < -boundX) leaf.pos.x = boundX;
                if (leaf.pos.z > 600) leaf.pos.z = -150;
                if (leaf.pos.z < -150) leaf.pos.z = 600;

                // 3D Botanical Leaf Geometry: Stem Base, Left Belly, Tip, Right Belly
                const hl = leaf.length / 2;
                const hw = leaf.width / 2;
                const zCurve = hw * 0.35; // 3D cupping curve of a natural leaf

                const localLeafVerts = [
                    { x: 0, y: -hl, z: 0 }, // 0: Stem base
                    { x: -hw, y: -hl * 0.1, z: zCurve }, // 1: Left belly curve
                    { x: 0, y: hl, z: 0 }, // 2: Leaf tip
                    { x: hw, y: -hl * 0.1, z: zCurve }, // 3: Right belly curve
                    { x: 0, y: 0, z: -zCurve * 0.4 }, // 4: Mid-vein spine
                ];

                // 3D Euler Rotation Matrix Calculation
                const cx = Math.cos(leaf.rot.x),
                    sx = Math.sin(leaf.rot.x);
                const cy = Math.cos(leaf.rot.y),
                    sy = Math.sin(leaf.rot.y);
                const cz = Math.cos(leaf.rot.z),
                    sz = Math.sin(leaf.rot.z);

                const projectedVerts: { x: number; y: number }[] = [];
                let allVisible = true;

                for (let v = 0; v < localLeafVerts.length; v++) {
                    const vert = localLeafVerts[v];
                    const y1 = vert.y * cx - vert.z * sx;
                    const z1 = vert.y * sx + vert.z * cx;
                    const x2 = vert.x * cy + z1 * sy;
                    const z2 = -vert.x * sy + z1 * cy;
                    const x3 = x2 * cz - y1 * sz;
                    const y3 = x2 * sz + y1 * cz;

                    const worldP: Point3D = {
                        x: leaf.pos.x + x3,
                        y: leaf.pos.y + y3,
                        z: leaf.pos.z + z2,
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

                if (!allVisible || projectedVerts.length < 5) return;

                const pStem = projectedVerts[0];
                const pLeft = projectedVerts[1];
                const pTip = projectedVerts[2];
                const pRight = projectedVerts[3];
                const pMid = projectedVerts[4];

                // Surface normal to compute sunlight illumination angle
                const normalZ =
                    (pTip.x - pStem.x) * (pRight.y - pLeft.y) -
                    (pTip.y - pStem.y) * (pRight.x - pLeft.x);
                const isFacingLight = normalZ > 0;

                ctx.save();

                // 1. Draw Organic Botanical Leaf Silhouette using Bezier Curves
                ctx.beginPath();
                ctx.moveTo(pStem.x, pStem.y);
                ctx.quadraticCurveTo(pLeft.x, pLeft.y, pTip.x, pTip.y);
                ctx.quadraticCurveTo(pRight.x, pRight.y, pStem.x, pStem.y);
                ctx.closePath();

                // Luxurious Emerald Botanical Gradient
                const leafGrad = ctx.createLinearGradient(
                    pStem.x,
                    pStem.y,
                    pTip.x,
                    pTip.y,
                );
                if (isFacingLight) {
                    leafGrad.addColorStop(0, leaf.baseColor);
                    leafGrad.addColorStop(0.55, leaf.highlightColor);
                    leafGrad.addColorStop(1, '#3E7B60'); // Luminous tip
                    ctx.globalAlpha = Math.min(leaf.opacity * 1.1, 0.92);
                } else {
                    leafGrad.addColorStop(0, '#0A1C14');
                    leafGrad.addColorStop(0.6, leaf.baseColor);
                    leafGrad.addColorStop(1, leaf.highlightColor);
                    ctx.globalAlpha = leaf.opacity * 0.75;
                }

                ctx.fillStyle = leafGrad;
                ctx.fill();

                // 2. Fine Organic Outline (Border lembut helai daun)
                ctx.lineWidth = 0.55;
                ctx.strokeStyle = isFacingLight
                    ? 'rgba(255, 255, 255, 0.35)'
                    : 'rgba(20, 54, 40, 0.45)';
                ctx.stroke();

                // 3. Botanical Spine Vein (Tulang Daun Halus)
                ctx.beginPath();
                ctx.moveTo(pStem.x, pStem.y);
                ctx.quadraticCurveTo(pMid.x, pMid.y, pTip.x, pTip.y);
                ctx.lineWidth = 0.6;
                ctx.strokeStyle = isFacingLight
                    ? 'rgba(197, 168, 128, 0.45)' // Aksen tulang daun emas atelier
                    : 'rgba(255, 255, 255, 0.2)';
                ctx.stroke();

                ctx.restore();
            });

            if (!document.hidden) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        // Defer 3D canvas loop slightly so initial DOM paint & hydration have 0ms blocking time
        let startTimer: ReturnType<typeof setTimeout> | null = null;
        const startAnimation = () => {
            if (!document.hidden) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        if ('requestIdleCallback' in window) {
            (
                window as unknown as {
                    requestIdleCallback: (
                        cb: () => void,
                        opts?: { timeout: number },
                    ) => void;
                }
            ).requestIdleCallback(startAnimation, { timeout: 250 });
        } else {
            startTimer = setTimeout(startAnimation, 120);
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(render);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (startTimer) clearTimeout(startTimer);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
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

            {/* 2. Deep Forest Emerald Ambient Depth */}
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
                        'radial-gradient(circle, rgba(14, 52, 36, 0.15) 0%, rgba(20, 68, 48, 0.05) 50%, transparent 70%)',
                }}
                className="absolute top-1/4 -right-16 size-[580px] rounded-full blur-[85px]"
            />

            {/* 3. Interactive Cursor Spotlight */}
            <motion.div
                className="absolute size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply blur-[75px]"
                style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                    background:
                        'radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, transparent 65%)',
                }}
            />

            {/* 4. The 3D Atelier Perspective Canvas (Rendered on tablet & desktop >= 768px) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 hidden size-full mix-blend-normal md:block"
            />
        </div>
    );
}
