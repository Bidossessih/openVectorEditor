import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class FeatureProperties extends React.Component {
  render() {
    const {
      readOnly,
      sequenceData = {},
      featurePropertiesSelectedEntities,
      showAddOrEditFeatureDialog,
      deleteFeature
    } = this.props;
    const { features } = sequenceData;
    const featuresToUse = map(features, feature => {
      return {
        ...feature,
        ...(feature.strand === undefined && {
          strand: feature.forward ? 1 : -1
        }),
        size: getRangeLength(feature, sequenceData.sequence.length)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          withCheckboxes
          noPadding
          maxHeight={400}
          formName={"featureProperties"}
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              { path: "color", type: "string" },
              { path: "name", type: "string" },
              { path: "type", type: "string" },
              {
                path: "size",
                type: "string",
                render: (val, record) => {
                  const base1Range = convertRangeTo1Based(record);
                  return (
                    <span>
                      {val}{" "}
                      <span style={{ fontSize: 10 }}>
                        ({base1Range.start}-{base1Range.end})
                      </span>
                    </span>
                  );
                }
              },
              { path: "strand", type: "string" }
            ]
          }}
          entities={featuresToUse}
        />
        {!readOnly && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{ marginRight: 15 }}
              onClick={() => {
                showAddOrEditFeatureDialog();
              }}
            >
              New
            </Button>
            <Button
              onClick={() => {
                showAddOrEditFeatureDialog(
                  featurePropertiesSelectedEntities[0]
                );
              }}
              style={{ marginRight: 15 }}
              disabled={featurePropertiesSelectedEntities.length !== 1}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                deleteFeature(featurePropertiesSelectedEntities);
              }}
              style={{ marginRight: 15 }}
              disabled={!featurePropertiesSelectedEntities.length}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withSelectedEntities("featureProperties")(FeatureProperties);
