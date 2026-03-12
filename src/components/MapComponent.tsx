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

// Generate some random flight paths
const generateDemoData = () => {
    const data = [];
    const cities = [
        { name: "New York", coordinates: [-74.006, 40.7128] },
        { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
        { name: "Chicago", coordinates: [-87.6298, 41.8781] },
        { name: "Houston", coordinates: [-95.3698, 29.7604] },
        { name: "Miami", coordinates: [-80.1918, 25.7617] },
        { name: "Seattle", coordinates: [-122.3321, 47.6062] },
        { name: "Denver", coordinates: [-104.9903, 39.7392] },
        { name: "Atlanta", coordinates: [-84.388, 33.749] },
    ];

    for (let i = 0; i < 50; i++) {
        const source = cities[Math.floor(Math.random() * cities.length)];
        let target = cities[Math.floor(Math.random() * cities.length)];

        // Ensure source and target are not the same
        while (source.name === target.name) {
            target = cities[Math.floor(Math.random() * cities.length)];
        }

        data.push({
            sourcePosition: source.coordinates,
            targetPosition: target.coordinates,
            sourceColor: [255, 140, 0], // Orange
            targetColor: [0, 191, 255], // Deep Sky Blue
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
            getWidth: 20,
        }),
    ];

    return (
        <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
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

            {/* Overlay UI */}
            <div className="absolute bottom-6 left-6 z-10 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 max-w-sm">
                <h3 className="text-white font-semibold text-lg mb-1">US Flight Routes</h3>
                <p className="text-white/70 text-sm">
                    Interactive 3D visualization using Deck.GL and MapLibre.
                    Hold SHIFT + drag to rotate and pitch the map.
                </p>
            </div>
        </div>
    );
}
