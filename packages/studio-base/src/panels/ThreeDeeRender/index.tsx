// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { PanelExtensionContext } from "@foxglove/studio";
import Panel from "@foxglove/studio-base/components/Panel";
import PanelExtensionAdapter from "@foxglove/studio-base/components/PanelExtensionAdapter";
import ThemeProvider from "@foxglove/studio-base/theme/ThemeProvider";
import { PanelConfigSchema, SaveConfig } from "@foxglove/studio-base/types/panels";

import { ThreeDeeRender } from "./ThreeDeeRender";
import helpContent from "./index.help.md";

function initPanel(context: PanelExtensionContext, config: ThreeDeeConfig) {
  ReactDOM.render(
    <StrictMode>
      <ThemeProvider isDark>
        <ThreeDeeRender context={context} config={config} />
      </ThemeProvider>
    </StrictMode>,
    context.panelElement,
  );
}

export type ThreeDeeConfig = {
  customBackgroundColor?: string;
};

type Props = {
  config: ThreeDeeConfig;
  saveConfig: SaveConfig<ThreeDeeConfig>;
};

function ThreeDeeRenderAdapter(props: Props) {
  return (
    <PanelExtensionAdapter
      config={props.config}
      saveConfig={props.saveConfig}
      help={helpContent}
      initPanel={(ctx) => initPanel(ctx, props.config)}
    />
  );
}

const configSchema: PanelConfigSchema<ThreeDeeConfig> = [
  { key: "customBackgroundColor", type: "color", title: "Background color" },
];
ThreeDeeRenderAdapter.panelType = "3D";
ThreeDeeRenderAdapter.defaultConfig = {} as ThreeDeeConfig;
ThreeDeeRenderAdapter.configSchema = configSchema;

export default Panel(ThreeDeeRenderAdapter);
