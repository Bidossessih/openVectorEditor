import React from "react";
import { compose } from "redux";
import { Tab2, Tabs2 } from "@blueprintjs/core";
import { startCase } from "lodash";
import FeatureProperties from "./FeatureProperties";
import GeneralProperties from "./GeneralProperties";
import CutsiteProperties from "./CutsiteProperties";
import OrfProperties from "./OrfProperties";
import GenbankView from "./GenbankView";
import TranslationProperties from "./TranslationProperties";
import PrimerProperties from "./PrimerProperties";
import PartProperties from "./PartProperties";

import "./style.css";
import { withProps } from "recompose";
const allTabs = {
  general: GeneralProperties,
  features: FeatureProperties,
  parts: PartProperties,
  primers: PrimerProperties,
  translations: TranslationProperties,
  cutsites: CutsiteProperties,
  orfs: OrfProperties,
  genbank: GenbankView
};
export class PropertiesInner extends React.Component {
  render() {
    const {
      propertiesTool = {},
      propertiesViewTabUpdate,
      dimensions = {},
      height,
      propertiesList,
      closePanelButton
    } = this.props;
    const { width } = dimensions;

    const { tabId } = propertiesTool;
    const propertiesTabs = propertiesList.map(name => {
      const Comp = allTabs[name];
      return (
        <Tab2
          key={name}
          title={startCase(name)}
          id={name}
          panel={<Comp {...this.props} />}
        />
      );
    });

    return (
      <div
        style={{
          position: "relative"
        }}
      >
        {closePanelButton}
        <div
          className={"ve-propertiesPanel"}
          style={{
            display: "flex",
            width,
            height,
            zIndex: 10,
            padding: 10
          }}
        >
          {propertiesTabs.length ? (
            <Tabs2
              style={{ width }}
              renderActiveTabPanelOnly
              selectedTabId={tabId}
              onChange={propertiesViewTabUpdate}
            >
              <Tabs2.Expander />
              {propertiesTabs}
              <Tabs2.Expander />
            </Tabs2>
          ) : (
            <div style={{ margin: 20, fontSize: 20 }}>
              No Properties to display
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  withProps(({ PropertiesProps }) => {
    return { ...PropertiesProps };
  })
)(PropertiesInner);
