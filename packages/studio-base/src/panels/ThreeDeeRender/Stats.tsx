// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useEffect, useState } from "react";
import ThreeStats from "three/examples/jsm/libs/stats.module";

import { Renderer } from "./Renderer";
import { useRenderer, useRendererEvent } from "./RendererContext";

let stats: ThreeStats | undefined;
let drawCallsPanel: ThreeStats.Panel | undefined;
let trianglesPanel: ThreeStats.Panel | undefined;
let texturesPanel: ThreeStats.Panel | undefined;
let geometriesPanel: ThreeStats.Panel | undefined;
let maxDrawCalls = 0;
let maxTriangles = 0;
let maxTextures = 0;
let maxGeometries = 0;

function update(renderer: Renderer) {
  maxDrawCalls = Math.max(maxDrawCalls, renderer.gl.info.render.calls);
  maxTriangles = Math.max(maxTriangles, renderer.gl.info.render.triangles);
  maxTextures = Math.max(maxTextures, renderer.gl.info.memory.textures);
  maxGeometries = Math.max(maxGeometries, renderer.gl.info.memory.geometries);

  drawCallsPanel?.update(renderer.gl.info.render.calls, maxDrawCalls);
  trianglesPanel?.update(renderer.gl.info.render.triangles, maxTriangles);
  texturesPanel?.update(renderer.gl.info.memory.textures, maxTextures);
  geometriesPanel?.update(renderer.gl.info.memory.geometries, maxGeometries);
  stats?.update();
}

export function Stats(): JSX.Element {
  const [div, setDiv] = useState<HTMLDivElement | ReactNull>(ReactNull);
  const renderer = useRenderer();

  useRendererEvent("endFrame", () => renderer && update(renderer));

  useEffect(() => {
    if (!div) {
      return;
    }

    stats = ThreeStats();
    stats.dom.style.position = "relative";
    stats.dom.style.zIndex = "auto";
    drawCallsPanel = ThreeStats.Panel("draws", "red", "black");
    trianglesPanel = ThreeStats.Panel("tris", "cyan", "black");
    texturesPanel = ThreeStats.Panel("textures", "yellow", "black");
    geometriesPanel = ThreeStats.Panel("geometries", "green", "black");
    stats.addPanel(drawCallsPanel);
    stats.addPanel(trianglesPanel);
    stats.addPanel(texturesPanel);
    stats.addPanel(geometriesPanel);
    div.appendChild(stats.dom);
    stats.showPanel(0);
    return () => {
      if (stats) {
        try {
          div.removeChild(stats.dom);
        } catch (ex) {
          // ignore
        }
      }
    };
  }, [div]);

  return <div ref={setDiv} />;
}
