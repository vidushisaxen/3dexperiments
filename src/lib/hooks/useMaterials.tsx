import { ShaderMaterial, Texture, Vector2, Vector3 } from 'three';
import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { OPTS } from '../constant';

import baseVertex from '../glsl/basevert.js';
import clearFrag from '../glsl/clearfrag.js';
import curlFrag from '../glsl/curlfrag.js';
import divergenceFrag from '../glsl/divergencefrag.js';
import gradientSubstractFrag from '../glsl/gradientSubstractfrag.js';
import pressureFrag from '../glsl/pressurefrag.js';
import splatFrag from '../glsl/splatfrag.js';
import advectionFrag from '../glsl/advectionfrag.js';
import vorticityFrag from '../glsl/vorticityfrag.js';

export const useMaterials = (): { [key: string]: ShaderMaterial } => {
    const size = useThree((s) => s.size);

    const shaderMaterials = useMemo(() => {
        const advection = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                uSource: {
                    value: new Texture(),
                },
                dt: {
                    value: 0.016,
                },
                uDissipation: {
                    value: 1.0,
                },
                texelSize: { value: new Vector2() },
            },
            fragmentShader: advectionFrag,
        });

        const clear = new ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: new Texture(),
                },
                uClearValue: {
                    value: OPTS.pressure,
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: clearFrag,
        });

        const curl = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: curlFrag,
        });

        const divergence = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: divergenceFrag,
        });

        const gradientSubstract = new ShaderMaterial({
            uniforms: {
                uPressure: {
                    value: new Texture(),
                },
                uVelocity: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: gradientSubstractFrag,
        });

        const pressure = new ShaderMaterial({
            uniforms: {
                uPressure: {
                    value: new Texture(),
                },
                uDivergence: {
                    value: new Texture(),
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: pressureFrag,
        });

        const splat = new ShaderMaterial({
            uniforms: {
                uTarget: {
                    value: new Texture(),
                },
                aspectRatio: {
                    value: size.width / size.height,
                },
                uColor: {
                    value: new Vector3(),
                },
                uPointer: {
                    value: new Vector2(),
                },
                uRadius: {
                    value: OPTS.radius / 100.0,
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: splatFrag,
        });

        const vorticity = new ShaderMaterial({
            uniforms: {
                uVelocity: {
                    value: new Texture(),
                },
                uCurl: {
                    value: new Texture(),
                },
                uCurlValue: {
                    value: OPTS.curl,
                },
                dt: {
                    value: 0.016,
                },
                texelSize: {
                    value: new Vector2(),
                },
            },
            fragmentShader: vorticityFrag,
        });

        return {
            splat,
            curl,
            clear,
            divergence,
            pressure,
            gradientSubstract,
            advection,
            vorticity,
        };
    }, [size]);

    useEffect(() => {
        for (const material of Object.values(shaderMaterials)) {
            const aspectRatio = size.width / (size.height + 400);

            material.uniforms.texelSize.value.set(1 / (OPTS.simRes * aspectRatio), 1 / OPTS.simRes);
            material.vertexShader = baseVertex;
            material.depthTest = false;
            material.depthWrite = false;
        }

        return () => {
            for (const material of Object.values(shaderMaterials)) {
                material.dispose();
            }
        };
    }, [shaderMaterials, size]);

    return shaderMaterials;
};
