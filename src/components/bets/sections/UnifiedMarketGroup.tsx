import React, { useState, useMemo } from "react";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
  IoGrid,
} from "react-icons/io5";
import OddsButton from "@/components/buttons/OddsButton";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  is_loading?: boolean;
  market_id: number;
  outcomes: any[];
};

const UnifiedMarketGroup = ({
  fixture_data,
  disabled,
  is_loading,
  market_id,
  outcomes,
}: Props) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  const title = outcomes.find((item) => !!item.marketName)?.marketName || ``;

  if (is_loading) return <SkeletonCard title={title} />;
  if (outcomes.length === 0) return null;

  // Don't render if no valid market name exists
  if (!title || title.trim() === "") return null;

  // Detect market structure and handle accordingly
  const marketStructure = useMemo(() => {
    // Check if this is an over/under market with specifiers
    const hasOverUnderSpecifiers = outcomes.some(
      (outcome) =>
        outcome.specifier &&
        outcome.specifier.match(/total=(\d+(?:\.\d+)?)/) &&
        outcome.displayName &&
        (outcome.displayName.toLowerCase().includes("over") ||
          outcome.displayName.toLowerCase().includes("under"))
    );

    // Check if this is a combination market (like 1X2/GG-NG)
    const hasCombinationStructure = outcomes.some(
      (outcome) =>
        outcome.displayName &&
        (outcome.displayName.includes("/") ||
          outcome.displayName.includes(" & "))
    );

    if (hasOverUnderSpecifiers) {
      // Handle Over/Under with specifiers
      const pairsBySpecifier: { [key: string]: { over?: any; under?: any } } =
        {};

      outcomes.forEach((outcome) => {
        const spec = outcome.specifier;
        if (
          !spec ||
          !outcome.displayName ||
          !spec.match(/total=(\d+(?:\.\d+)?)/)
        )
          return;

        if (!pairsBySpecifier[spec]) pairsBySpecifier[spec] = {};

        if (outcome.displayName.toLowerCase().includes("over")) {
          pairsBySpecifier[spec].over = outcome;
        } else if (outcome.displayName.toLowerCase().includes("under")) {
          pairsBySpecifier[spec].under = outcome;
        }
      });

      const specifiers = Object.keys(pairsBySpecifier).sort((a, b) => {
        const getVal = (spec: string) => {
          const m = spec.match(/total=(\d+(?:\.\d+)?)/);
          return m ? parseFloat(m[1]) : 0;
        };
        return getVal(a) - getVal(b);
      });

      return {
        type: "overunder",
        data: pairsBySpecifier,
        specifiers,
      };
    }

    if (hasCombinationStructure) {
      // Handle combination markets
      const structure: Record<string, Record<string, any>> = {};
      const primaryOptions = new Set<string>();
      const secondaryOptions = new Set<string>();

      outcomes.forEach((outcome) => {
        const displayName = outcome.displayName?.toLowerCase() || "";
        let primary = "";
        let secondary = "";

        if (displayName.includes("/")) {
          const parts = displayName.split("/");
          const firstPart = parts[0]?.trim().toLowerCase() || "";
          const secondPart = parts[1]?.trim().toLowerCase() || "";

          if (firstPart.includes("home") || firstPart === "1") primary = "1";
          else if (firstPart.includes("draw") || firstPart === "x")
            primary = "x";
          else if (firstPart.includes("away") || firstPart === "2")
            primary = "2";

          if (secondPart.includes("yes") || secondPart.includes("gg"))
            secondary = "gg";
          else if (secondPart.includes("no") || secondPart.includes("ng"))
            secondary = "ng";
        } else if (displayName.includes("&")) {
          if (displayName.includes("1") && displayName.includes("gg")) {
            primary = "1";
            secondary = "gg";
          } else if (displayName.includes("1") && displayName.includes("ng")) {
            primary = "1";
            secondary = "ng";
          } else if (displayName.includes("x") && displayName.includes("gg")) {
            primary = "x";
            secondary = "gg";
          } else if (displayName.includes("x") && displayName.includes("ng")) {
            primary = "x";
            secondary = "ng";
          } else if (displayName.includes("2") && displayName.includes("gg")) {
            primary = "2";
            secondary = "gg";
          } else if (displayName.includes("2") && displayName.includes("ng")) {
            primary = "2";
            secondary = "ng";
          } else if (displayName.includes("1x") && displayName.includes("gg")) {
            primary = "1x";
            secondary = "gg";
          } else if (displayName.includes("1x") && displayName.includes("ng")) {
            primary = "1x";
            secondary = "ng";
          } else if (displayName.includes("12") && displayName.includes("gg")) {
            primary = "12";
            secondary = "gg";
          } else if (displayName.includes("12") && displayName.includes("ng")) {
            primary = "12";
            secondary = "ng";
          } else if (displayName.includes("x2") && displayName.includes("gg")) {
            primary = "x2";
            secondary = "gg";
          } else if (displayName.includes("x2") && displayName.includes("ng")) {
            primary = "x2";
            secondary = "ng";
          }
        }

        if (primary && secondary) {
          primaryOptions.add(primary);
          secondaryOptions.add(secondary);
          if (!structure[primary]) structure[primary] = {};
          structure[primary][secondary] = outcome;
        }
      });

      if (primaryOptions.size > 0 && secondaryOptions.size > 0) {
        return {
          type: "combination",
          data: structure,
          primaryOptions: Array.from(primaryOptions),
          secondaryOptions: Array.from(secondaryOptions),
        };
      }
    }

    // Default: Group by specifier or use simple grid
    const hasSpecifiers = outcomes.some((outcome) => outcome.specifier);

    if (hasSpecifiers) {
      const groups: { [key: string]: any[] } = {};
      outcomes.forEach((outcome) => {
        const specifier = outcome.specifier || "default";
        if (!groups[specifier]) groups[specifier] = [];
        groups[specifier].push(outcome);
      });

      const specifiers = Object.keys(groups).sort((a, b) => {
        if (a === "default" && b !== "default") return 1;
        if (b === "default" && a !== "default") return -1;

        const getVal = (spec: string) => {
          const match = spec.match(/total=(\d+(?:\.\d+)?)/);
          return match ? parseFloat(match[1]) : 0;
        };

        const valA = getVal(a);
        const valB = getVal(b);

        if (valA !== valB) return valA - valB;
        return a.localeCompare(b);
      });

      return {
        type: "specifier",
        data: groups,
        specifiers,
      };
    }

    // Simple grid layout
    return {
      type: "simple",
      data: outcomes,
      specifiers: [],
    };
  }, [outcomes]);

  // Helper functions for different market types
  const formatLabel = (text: string): string => {
    const labelMap: Record<string, string> = {
      home: "Home Win",
      draw: "Draw",
      away: "Away Win",
      yes: "Yes",
      no: "No",
      over: "Over",
      under: "Under",
      gg: "GG",
      ng: "NG",
      both: "Both Teams",
      "1": "1",
      x: "X",
      "2": "2",
      "1x": "1X",
      "12": "1/2",
      x2: "X2",
    };
    return (
      labelMap[text.toLowerCase()] ||
      text.charAt(0).toUpperCase() + text.slice(1)
    );
  };

  const getIcon = (option: string): string => {
    const iconMap: Record<string, string> = {
      home: "1",
      draw: "X",
      away: "2",
      "1": "1",
      x: "X",
      "2": "2",
      "1x": "1X",
      "12": "1/2",
      x2: "X2",
      both: "GG",
    };
    return iconMap[option.toLowerCase()] || option.charAt(0).toUpperCase();
  };

  const renderContent = () => {
    switch (marketStructure.type) {
      case "overunder":
        const ouData = marketStructure.data as {
          [key: string]: { over?: any; under?: any };
        };
        const ouSpecifiers = marketStructure.specifiers as string[];
        if (!ouSpecifiers || !ouData) return null;

        return (
          <div style={{ padding: "0 12px 12px" }}>
            <table style={{ width: "100%", borderSpacing: 0 }}>
              <tbody>
                {ouSpecifiers.map((spec: string, index: number) => {
                  const group = ouData[spec] || {};
                  const value =
                    spec.match(/total=(\d+(?:\.\d+)?)/)?.[1] || spec;

                  return (
                    <tr key={spec}>
                      <td
                        style={{
                          width: "60px",
                          textAlign: "center",
                          verticalAlign: "middle",
                          padding: "2px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#9ca3af",
                        }}
                      >
                        {value}
                      </td>
                      <td style={{ padding: "2px", width: "50%" }}>
                        <OddsButton
                          outcome={group?.over}
                          game_id={fixture_data?.gameID as unknown as number}
                          fixture_data={fixture_data}
                          show_display_name={true}
                          bg_color={"bg-white text-black"}
                          disabled={!group?.over || disabled}
                          rounded={`${
                            index === ouSpecifiers.length - 1
                              ? "rounded-bl-md"
                              : index === 0
                              ? "rounded-tl-md"
                              : ""
                          }`}
                        />
                      </td>
                      <td style={{ padding: "2px", width: "50%" }}>
                        <OddsButton
                          outcome={group?.under}
                          game_id={fixture_data?.gameID as unknown as number}
                          fixture_data={fixture_data}
                          show_display_name={true}
                          bg_color={"bg-white text-black"}
                          disabled={!group?.under || disabled}
                          rounded={`${
                            index === ouSpecifiers.length - 1
                              ? "rounded-br-md"
                              : index === 0
                              ? "rounded-tr-md"
                              : ""
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case "combination":
        const comData = marketStructure.data as Record<
          string,
          Record<string, any>
        >;
        const primaryOptions = marketStructure.primaryOptions as string[];
        const secondaryOptions = marketStructure.secondaryOptions as string[];
        if (!primaryOptions || !secondaryOptions || !comData) return null;

        return (
          <div style={{ padding: "0 12px 12px" }}>
            <table style={{ width: "100%", borderSpacing: 0 }}>
              {/* Headers */}
              <thead>
                <tr>
                  <th style={{ width: "60px" }}></th>
                  {secondaryOptions.map((secondary: string) => (
                    <th
                      key={`header-${secondary}`}
                      style={{
                        textAlign: "center",
                        padding: "4px 2px 8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9ca3af",
                      }}
                    >
                      {formatLabel(secondary)}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Outcome Rows */}
              <tbody>
                {primaryOptions.map((primary: string) => {
                  const rowOutcomes = comData[primary];
                  return (
                    <tr key={primary}>
                      <td
                        style={{
                          width: "60px",
                          textAlign: "center",
                          verticalAlign: "middle",
                          padding: "2px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#9ca3af",
                        }}
                      >
                        {getIcon(primary)}
                      </td>
                      {secondaryOptions.map(
                        (secondary: string, secIndex: number) => {
                          const outcome = rowOutcomes?.[secondary];
                          return (
                            <td
                              key={`${primary}-${secondary}`}
                              style={{ padding: "2px" }}
                            >
                              {outcome ? (
                                <OddsButton
                                  outcome={outcome}
                                  disabled={disabled}
                                  fixture_data={fixture_data}
                                  game_id={
                                    fixture_data?.gameID as unknown as number
                                  }
                                  show_display_name={true}
                                  bg_color={"bg-white text-black"}
                                  rounded={`${
                                    primaryOptions.indexOf(primary) ===
                                    primaryOptions.length - 1
                                      ? secIndex === 0
                                        ? "rounded-bl-md"
                                        : secIndex ===
                                          secondaryOptions.length - 1
                                        ? "rounded-br-md"
                                        : ""
                                      : primaryOptions.indexOf(primary) === 0
                                      ? secIndex === 0
                                        ? "rounded-tl-md"
                                        : secIndex ===
                                          secondaryOptions.length - 1
                                        ? "rounded-tr-md"
                                        : ""
                                      : ""
                                  }`}
                                />
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#4b5563",
                                    color: "#6b7280",
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                    textAlign: "center",
                                    width: "100%",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  -
                                </div>
                              )}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case "specifier":
        const specData = marketStructure.data as { [key: string]: any[] };
        const specifiers = marketStructure.specifiers as string[];
        if (!specifiers || !specData) return null;

        return (
          <div style={{ padding: "0 8px" }}>
            {specifiers.map((specifier: string) => {
              const groupOutcomes = specData[specifier];
              if (!groupOutcomes) return null;

              let columnWidth = "100%";
              switch (groupOutcomes.length) {
                case 1:
                  columnWidth = "100%";
                  break;
                case 2:
                  columnWidth = "50%";
                  break;
                case 3:
                  columnWidth = "33.333%";
                  break;
                case 4:
                  columnWidth = "25%";
                  break;
                default:
                  columnWidth = "50%";
              }

              return (
                <div key={specifier} style={{ marginBottom: "12px" }}>
                  {specifier !== "default" && specifiers.length > 1 && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      {specifier.replace("total=", "").replace(/^.*=/, "") ||
                        specifier}
                    </div>
                  )}
                  <div
                    style={{
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {groupOutcomes.map((outcome: any, index: number) => {
                      const displayName =
                        outcome.displayName ||
                        outcome.outcomeName ||
                        `Option ${index + 1}`;
                      return (
                        <div
                          key={outcome.outcomeID || `${outcome.id}-${index}`}
                          style={{
                            float: "left",
                            width: columnWidth,
                            padding: "2px",
                            boxSizing: "border-box",
                          }}
                        >
                          <OddsButton
                            outcome={{
                              ...outcome,
                              outcomeName: displayName,
                              displayName: displayName,
                            }}
                            game_id={fixture_data?.gameID as unknown as number}
                            fixture_data={fixture_data}
                            show_display_name={true}
                            bg_color={"bg-white text-black"}
                            height="h-10"
                            disabled={disabled}
                            rounded="rounded-md"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ clear: "both" }}></div>
                </div>
              );
            })}
          </div>
        );

      case "simple":
      default:
        const outcomeData = marketStructure.data as any[];
        let gridColsClass = "";

        switch (outcomeData.length) {
          case 1:
            gridColsClass = "grid-cols-1";
            break;
          case 2:
            gridColsClass = "grid-cols-2";
            break;
          case 3:
            gridColsClass = "grid-cols-3";
            break;
          case 4:
            gridColsClass = "grid-cols-4";
            break;
          default:
            gridColsClass = "grid-cols-2";
        }

        let columnWidth = "100%";
        switch (outcomeData.length) {
          case 1:
            columnWidth = "100%";
            break;
          case 2:
            columnWidth = "50%";
            break;
          case 3:
            columnWidth = "33.333%";
            break;
          case 4:
            columnWidth = "25%";
            break;
          default:
            columnWidth = "50%";
        }

        return (
          <div style={{ padding: "0 8px", overflow: "hidden" }}>
            {outcomeData.map((outcome, index) => (
              <div
                key={outcome?.outcomeID}
                style={{
                  float: "left",
                  width: columnWidth,
                  padding: "2px",
                  boxSizing: "border-box",
                }}
              >
                <OddsButton
                  outcome={outcome}
                  game_id={fixture_data?.gameID as unknown as number}
                  fixture_data={fixture_data}
                  show_display_name={true}
                  bg_color={"bg-white text-black"}
                  height="h-12"
                  disabled={disabled}
                  rounded={`${
                    index === 0
                      ? "rounded-l-md"
                      : outcomeData.length - 1 === index
                      ? "rounded-r-md"
                      : ""
                  }`}
                />
              </div>
            ))}
            <div style={{ clear: "both" }}></div>
          </div>
        );
    }
  };

  return (
    <div
      className={`shadow-2xl ${marketClasses["market-card-bg"]} ${marketClasses["market-card-border"]} border rounded-md p-1 pb-2 ${marketClasses["market-card-hover"]}`}
    >
      <div className="">
        <button
          style={{
            width: "100%",
            padding: "4px 8px",
            textAlign: "left",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => setIsCollapsed((prev) => !prev)}
          type="button"
        >
          <div
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: "8px",
            }}
            className={marketClasses["market-title"]}
          >
            {is_collapsed ? (
              <IoChevronForward size={18} />
            ) : (
              <IoChevronDown size={18} />
            )}
          </div>
          <span
            style={{
              fontWeight: "600",
              fontSize: "14px",
              verticalAlign: "middle",
            }}
            className={marketClasses["market-title"]}
          >
            {title}
          </span>
          <div
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: "4px",
            }}
            className={marketClasses["subtitle-text"]}
          >
            <IoInformationCircleOutline size={16} />
          </div>
          <div
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            {outcomes.length} options
          </div>
        </button>

        {!is_collapsed && <div>{renderContent()}</div>}
      </div>
    </div>
  );
};

export default UnifiedMarketGroup;
