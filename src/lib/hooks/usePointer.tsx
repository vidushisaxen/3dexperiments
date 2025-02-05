import { useEffect, useRef } from 'react';
import { Vector2 } from 'three';
import { useThree } from '@react-three/fiber';

type SplatStack = {
    mouseX?: number;
    mouseY?: number;
    velocityX?: number;
    velocityY?: number;
};

export const usePointer = ({ force }: { force: number }) => {
    const size = useThree((three) => three.size);
    const splatStack: SplatStack[] = useRef([]).current;

    const lastMouse = useRef<Vector2>(new Vector2());
    const hasMoved = useRef<boolean>(false);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            const { clientX, clientY } = event;
            const deltaX = clientX - lastMouse.current.x;
            const deltaY = clientY - lastMouse.current.y;

            if (!hasMoved.current) {
                hasMoved.current = true;
                lastMouse.current.set(clientX, clientY);
            }

            lastMouse.current.set(clientX, clientY);

            if (!hasMoved.current) return;

            splatStack.push({
                mouseX: clientX / size.width,
                mouseY: 1.0 - clientY / size.height,
                velocityX: deltaX * force,
                velocityY: -deltaY * force,
            });
        };
        window.addEventListener('pointermove', handlePointerMove);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, [force, size.width, size.height, splatStack]);

    return { splatStack };
};
