"use client";

import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

// Basic viewport setup centering on the US
const INITIAL_VIEW_STATE = {
    longitude: -100,
    latitude: 40,
    zoom: 3,
    pitch: 45,
    bearing: 0,
};

// Map Style - using a free CartoDB style
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// Generate dense global flight paths
const generateDemoData = () => {
    const data = [];
    // Major global cities coordinates [lng, lat]
    const cities = [
        { name: "New York", coordinates: [-74.006, 40.7128] },
        { name: "London", coordinates: [-0.1276, 51.5074] },
        { name: "Tokyo", coordinates: [139.6917, 35.6895] },
        { name: "Singapore", coordinates: [103.8198, 1.3521] },
        { name: "Dubai", coordinates: [55.2708, 25.2048] },
        { name: "Frankfurt", coordinates: [8.6821, 50.1109] },
        { name: "Hong Kong", coordinates: [114.1694, 22.3193] },
        { name: "Sydney", coordinates: [151.2093, -33.8688] },
        { name: "Paris", coordinates: [2.3522, 48.8566] },
        { name: "Sao Paulo", coordinates: [-46.6333, -23.5505] },
        { name: "Mumbai", coordinates: [72.8777, 19.0760] },
        { name: "Cape Town", coordinates: [18.4232, -33.9249] },
        { name: "Cairo", coordinates: [31.2357, 30.0444] },
        { name: "Jakarta", coordinates: [106.8272, -6.1751] },
        { name: "Moscow", coordinates: [37.6173, 55.7558] },
    ];

    // Create 300 random connections for a dense, hacker-style map
    for (let i = 0; i < 300; i++) {
        const source = cities[Math.floor(Math.random() * cities.length)];
        let target = cities[Math.floor(Math.random() * cities.length)];

        while (source.name === target.name) {
            target = cities[Math.floor(Math.random() * cities.length)];
        }

        data.push({
            sourcePosition: source.coordinates,
            targetPosition: target.coordinates,
            // Cyan-ish color for source [R, G, B]
            sourceColor: [0, 255, 200, 200],
            // Deep Green for target
            targetColor: [0, 150, 100, 150],
        });
    }
    return data;
};

const FLIGHTS_DATA = generateDemoData();

export default function MapComponent() {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const layers = [
        new ScatterplotLayer({
            id: "cities-layer",
            data: Object.values(
                FLIGHTS_DATA.reduce((acc: any, curr) => {
                    acc[curr.sourcePosition.join(',')] = { position: curr.sourcePosition, color: curr.sourceColor };
                    acc[curr.targetPosition.join(',')] = { position: curr.targetPosition, color: curr.targetColor };
                    return acc;
                }, {})
            ),
            getPosition: (d: any) => d.position,
            getFillColor: (d: any) => d.color,
            getRadius: 30000,
            radiusMinPixels: 20,
            radiusMaxPixels: 100,
        }),
        new ArcLayer({
            id: "flights-layer",
            data: FLIGHTS_DATA,
            getSourcePosition: (d: any) => d.sourcePosition,
            getTargetPosition: (d: any) => d.targetPosition,
            getSourceColor: (d: any) => d.sourceColor,
            getTargetColor: (d: any) => d.targetColor,
            getWidth: 2, // Thinner lines for density
            opacity: 0.6,
        }),
    ];

    return (
        <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-[#00ffcc]/30 shadow-2xl font-mono">
            <DeckGL
                initialViewState={viewState}
                controller={true}
                layers={layers}
                onViewStateChange={(e: any) => setViewState(e.viewState)}
            >
                <Map
                    mapStyle={MAP_STYLE}
                    attributionControl={false}
                />
            </DeckGL>

            {/* Top Right UI Panel */}
            <div className="absolute top-6 right-6 z-10 w-64 bg-black/80 backdrop-blur-sm border border-[#00ffcc]/50 uppercase text-[#00ffcc] text-xs">
                <div className="flex justify-between items-center p-3 border-b border-[#00ffcc]/30 hover:bg-[#00ffcc]/10 cursor-pointer transition-colors">
                    <span>Source Country</span>
                    <span>→</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b border-[#00ffcc]/30 hover:bg-[#00ffcc]/10 cursor-pointer transition-colors">
                    <span>Destination City</span>
                    <span>→</span>
                </div>
            </div>

            {/* Bottom Overlay UI Panel */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-6">
                <div className="bg-black/80 backdrop-blur-sm border border-[#00ffcc]/50 p-4 rounded-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[#00ffcc] text-sm uppercase">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#00ffcc]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                        </span>
                        <div className="flex flex-col items-center">
                            <span className="font-bold tracking-widest">17:15 GMT</span>
                        </div>
                        <span className="text-[10px] tracking-widest opacity-70">TIME</span>
                    </div>

                    <div className="relative w-full h-2 bg-[#002222] rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-[#00ffcc] w-[60%] shadow-[0_0_10px_#00ffcc]" />
                    </div>

                    <div className="flex justify-between items-center text-[#00ffcc]/50 text-[10px] uppercase font-mono tracking-widest">
                        <span>Slower</span>
                        <span>Faster</span>
                    </div>
                </div>
            </div>

            {/* Top Left Logo Mock */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 select-none pointer-events-none">
                <div className="font-extrabold text-2xl tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">FAIR</div>
                <div className="flex flex-col text-[8px] uppercase leading-[9px] text-white/80 font-mono tracking-wider">
                    <span>Internet</span>
                    <span>Report</span>
                </div>
            </div>
        </div>
    );
}
