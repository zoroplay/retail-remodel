import React, { useEffect, useState } from "react";
import SingleSearchInput from "../inputs/SingleSearchInput";
import { useModal } from "@/hooks/useModal";
import { useBetting } from "@/hooks/useBetting";
import { getClientTheme } from "@/config/theme.config";
import { showToast } from "../tools/toast";
import { useFetchFixturesMutation } from "@/store/services/bets.service";
import Input from "../inputs/Input";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { ChevronDown, Grid, Trash2 } from "lucide-react";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { AppHelper } from "@/lib/helper";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  addCashDeskItem,
  removeCashDeskItem,
  setCashDeskItem,
} from "@/store/features/slice/cashdesk.slice";

interface FormData {
  eventId: string;
  eventDate: string;
  event: string;
  smartCode: string;
  fixture?: PreMatchFixture;
  odds: string;
  is_edit: boolean;
}
type Props = {
  formData: FormData;
  is_empty_form: boolean;
  index: number;

  total: number;
};
const QuickBets = ({ formData: _form, total, index, is_empty_form }: Props) => {
  const { classes } = getClientTheme();
  const cashdeskClasses = classes.cashdesk_page;

  const [formData, setFormData] = useState<FormData>({
    eventId: _form.eventId,
    eventDate: _form.eventDate,
    event: _form.event,
    smartCode: _form.smartCode,
    odds: _form.odds || "",
    is_edit: false,
    fixture: _form.fixture,
  });
  useEffect(() => {
    setFormData({
      eventId: _form.eventId,
      eventDate: _form.eventDate,
      event: _form.event,
      smartCode: _form.smartCode,
      odds: _form.odds || "",
      is_edit: false,
      fixture: _form.fixture,
    });
  }, [_form]);
  const dispatch = useAppDispatch();
  const {
    selected_bets = [],
    total_odds,
    stake,
    potential_winnings,
    updateStake,
    clearBets,
    addBet,
    removeBet,
    updateBetOdds,
  } = useBetting();
  const [
    getFixture,
    {
      data: fixturesData,
      isSuccess,
      isLoading: isFixtureLoading,
      error,
      isError,
    },
  ] = useFetchFixturesMutation();
  const [eventId, setEventId] = useState("");
  const { openModal } = useModal();
  const smartCodeInputRef = React.useRef<HTMLInputElement>(null);
  const eventIdInputRef = React.useRef<HTMLInputElement>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Focus on Event ID input when component mounts or when form is empty
  useEffect(() => {
    if (eventIdInputRef.current && is_empty_form) {
      eventIdInputRef.current.focus();
    }
  }, [is_empty_form]);

  // Also focus when component first mounts
  useEffect(() => {
    if (eventIdInputRef.current) {
      eventIdInputRef.current.focus();
    }
  }, []);
  const handleSmartCodeChange = (text: string) => {
    const fixture = formData?.fixture;

    if (text === "") {
      const outcome = fixture?.outcomes?.find(
        (o: any) => o.displayName === formData.smartCode
      );

      removeBet({
        event_id: Number(fixture?.gameID) || 0,
        display_name: outcome?.displayName || "",
      });
    }
    // Find outcome by display name and add to quick bet entries
    if (formData.fixture && text) {
      const outcome = formData.fixture.outcomes?.find(
        (o: any) => o.displayName === text
      );

      if (outcome) {
        // Check if bet is already selected or in quick entries
        const isAlreadySelected = (selected_bets || []).some(
          (bet: any) =>
            bet.game_id === formData?.fixture?.gameID &&
            bet.game.display_name === outcome.displayName
        );

        if (!isAlreadySelected) {
          // Clear the smart code after successful addition
          console.log("Adding bet to quick entries:", outcome);
          setFormData((prev) => ({
            ...prev,
            odds: String(outcome.odds || ""),
          }));
          addBet({
            fixture_data: formData.fixture,
            outcome_data: outcome,
            element_id: formData.fixture.matchID,
            bet_type: "pre",
            global_vars: {},
            bonus_list: [],
          });
          !is_empty_form && dispatch(addCashDeskItem());

          // Remove from quick entries

          showToast({
            type: "success",
            title: "Bet Added!",
            description: `${outcome.marketName} @ ${formData.fixture?.name} added to your slip`,
          });
        } else {
          console.log("Bet already selected or in quick entries:", outcome);
          // Clear smart code and show info
          setFormData((prev) => ({
            ...prev,
            odds: String(outcome.odds || ""),
          }));

          // Show info toast
          showToast({
            type: "info",
            title: isAlreadySelected
              ? "Bet Already Selected"
              : "Already in Quick Entry",
            description: isAlreadySelected
              ? "This bet is already in your slip"
              : "This bet is already in quick entry",
          });
        }
      } else {
        // Outcome not found, clear only smart code and show error
        setFormData((prev) => ({ ...prev, smartCode: "" }));
        // Show error toast
        showToast({
          type: "error",
          title: "Invalid Outcome",
          description: `Outcome "${text}" not found`,
        });
      }
    }
    setFormData((prev) => ({ ...prev, smartCode: text }));
  };
  const fetchFixtureData = async (eventId: string) => {
    setIsFormLoading(true);
    console.log("Fetching fixture data for event ID:", eventId);
    try {
      const newQueryParams = {
        tournament_id: eventId,
        sport_id: "1",
        period: "all",
        markets: ["1", "10", "18"],
        specifier: "",
      };

      const result = await getFixture(newQueryParams);
    } catch (error) {
      console.error("Error fetching fixture:", error);
      setIsFormLoading(false);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      const event_ids = selected_bets.map((bet) => bet.game_id);

      if (event_ids.includes(Number(fixturesData?.gameID))) {
        showToast({
          type: "error",
          title: "Game Already exists on Quick Entry",
          // description: "The selected fixture is not available.",
        });
        setIsFormLoading(false);

        return;
      }
      setFormData((prev) => ({
        ...prev,
        eventId: fixturesData?.gameID || "",
        eventDate:
          AppHelper.convertToTimeString(new Date(fixturesData?.date)) || "",
        event: fixturesData?.name || "-",
        smartCode: "",
        fixture: fixturesData as unknown as PreMatchFixture,
        // odds: fixturesData?. || "",
      }));
      dispatch(
        setCashDeskItem({
          index,
          event_id: String(fixturesData?.gameID || ""),
          event_date:
            AppHelper.convertToTimeString(new Date(fixturesData?.date)) || "",
          event: fixturesData?.name || "-",
          smart_code: "",
          fixture: fixturesData as unknown as PreMatchFixture,
        })
      );
      setIsFormLoading(false);
    }

    if (isError) {
      console.error("Error fetching fixture data:", error);
      setIsFormLoading(false);
    }
  }, [isSuccess, fixturesData, isError]);
  useEffect(() => {
    if (formData.eventId && formData.event && smartCodeInputRef.current) {
      smartCodeInputRef.current.focus();
    }
  }, [formData.eventId, formData.event]);

  // Focus on smart code input when fixture is successfully loaded
  useEffect(() => {
    if (isSuccess && formData.fixture && smartCodeInputRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        smartCodeInputRef.current?.focus();
      }, 100);
    }
  }, [isSuccess, formData.fixture]);
  const handleEventIdChange = async (text: string) => {
    setFormData((prev) => ({ ...prev, eventId: text }));
    // If 4 digits entered, fetch fixture data from server
    if (text.length >= 4) {
      await fetchFixtureData(text);
    }
  };

  const handleEventIdKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && eventId.length >= 1) {
      fetchFixtureData(eventId);
    }
  };
  return (
    <>
      <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 px-2 py-1 ">
        {[
          {
            id: "down",
            name: (
              <div className="relative flex justify-center items-center ">
                {total > 1 && (
                  <div
                    className={`relative flex justify-center items-center rounded-full h-8 w-8 bg-red-600/30 text-red-600 border border-red-600/60 hover:bg-red-600/70 transition cursor-pointer ${
                      !formData.eventId && !formData.fixture ? "!hidden" : ""
                    }`}
                    onClick={() => {
                      const outcome = formData?.fixture?.outcomes?.find(
                        (o: any) => o.displayName === formData.smartCode
                      );
                      Promise.all([
                        removeBet({
                          event_id: Number(formData?.fixture?.gameID) || 0,
                          display_name: outcome?.displayName || "",
                        }),
                        dispatch(
                          removeCashDeskItem({
                            event_id: String(formData.eventId),
                          })
                        ),
                      ]);
                    }}
                  >
                    <Trash2 size={20} className=" mx-auto" />
                  </div>
                )}
              </div>
            ),
          },
          {
            id: "event_id",
            name: (
              <div className="relative">
                <SingleSearchInput
                  ref={eventIdInputRef}
                  value={formData.eventId}
                  onChange={(e) => {
                    // handleEventIdChange(e.target.value);
                    setEventId(e.target.value);
                  }}
                  onKeyDown={handleEventIdKeyPress}
                  type="number"
                  tabIndex={1}
                  text_color={cashdeskClasses["input-text"]}
                  bg_color={cashdeskClasses["input-bg"]}
                  className={`w-full border ${cashdeskClasses["input-border"]} rounded-lg px-3 py-2 placeholder-slate-400  transition-all`}
                  placeholder="Enter 4-digit ID"
                  onSearch={(e) => {
                    handleEventIdChange(e);
                  }}
                  searchState={{
                    isValid: formData.eventId.length >= 4,
                    isNotFound: false,
                    // isNotFound: isError || !fixturesData?.gameID,
                    isLoading: isFormLoading,
                    message: "",
                  }}
                  height={"h-[32px]"}
                  error=""
                />
              </div>
            ),
          },
          {
            id: "date",
            name: (
              <>
                {" "}
                {isFormLoading ? (
                  <div
                    className={`h-full ${cashdeskClasses["input-bg"]} animate-pulse rounded w-full`}
                  ></div>
                ) : (
                  <div
                    className={`flex justify-start items-center ${cashdeskClasses["input-bg"]} border ${cashdeskClasses["input-border"]} rounded-md px-3 py-2 h-[32px]`}
                  >
                    <span
                      className={`${cashdeskClasses["input-text"]} text-sm font-mono`}
                    >
                      {formData.eventDate || "--:--"}
                      {/* {AppHelper.convertToTimeString(
                        new Date(formData.eventDate)
                      ) || "--:--"} */}
                    </span>
                  </div>
                )}
              </>
            ),
          },
          {
            id: "event",
            name: (
              <>
                {" "}
                {isFormLoading ? (
                  <div
                    className={`h-full ${cashdeskClasses["input-bg"]} animate-pulse rounded flex-1 w-full`}
                  ></div>
                ) : (
                  <div
                    className={`${cashdeskClasses["input-bg"]} border ${cashdeskClasses["input-border"]} rounded-md px-3 py-2 pb-1 min-h-[32px] flex items-center`}
                  >
                    <span
                      className={`${cashdeskClasses["input-text"]} text-xs font-medium truncate`}
                    >
                      {formData.event || "Select an event ID first"}
                    </span>
                  </div>
                )}
              </>
            ),
          },
          {
            id: "code",
            name: (
              <>
                {" "}
                <div className="relative">
                  <Input
                    ref={smartCodeInputRef}
                    value={formData.smartCode}
                    onChange={(e) => handleSmartCodeChange(e.target.value)}
                    placeholder={
                      formData.fixture ? "Enter code" : "Set Event ID first"
                    }
                    tabIndex={2}
                    bg_color={cashdeskClasses["input-bg"]}
                    className={`w-full border ${cashdeskClasses["input-border"]} rounded-lg px-3 py-2 ${cashdeskClasses["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                    name="smartCode"
                    disabled={!formData.fixture || isFormLoading}
                    height={"h-[32px]"}
                    text_color="text-xs"
                  />
                  {formData.fixture && !isFormLoading && (
                    <button
                      className={`absolute right-2 top-[50%] transform -translate-y-1/2 p-1 ${cashdeskClasses["row-hover"]} rounded transition-colors`}
                      title="View available codes"
                      onClick={() => {
                        openModal({
                          modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
                          ref: formData?.fixture?.gameID,
                        });
                      }}
                    >
                      <Grid className="text-slate-400" size={14} />
                    </button>
                  )}
                </div>
              </>
            ),
          },
          {
            id: "odds",
            name: (
              <div className="relative flex justify-center items-center h-8">
                <p
                  className={`p-1 font-semibold ${cashdeskClasses["summary-value-text"]}`}
                >
                  {Number(formData.odds).toFixed(2) || "--:--"}
                </p>
              </div>
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`${
              item.id === "event"
                ? "col-span-4"
                : item.id === "odds" || item.id === "down"
                ? "col-span-1"
                : item.id === "code"
                ? "col-span-3"
                : "col-span-2"
            } ${
              cashdeskClasses["input-text"]
            } text-[11px] tracking-wide whitespace-nowrap `}
          >
            {item.name}
          </div>
        ))}
      </div>
      {/* Fixture Info Panel */}
      {formData.fixture && !isFormLoading && (
        <div
          className={`p-1 px-2 ${cashdeskClasses["summary-item-bg"]} border ${cashdeskClasses["summary-item-border"]} rounded-t-none`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p
                className={`${cashdeskClasses["summary-value-text"]} font-semibold text-xs`}
              >
                {formData.fixture.name}
              </p>
              <p
                className={`${cashdeskClasses["summary-label-text"]} text-[11px]`}
              >
                Match ID: {formData.fixture.matchID} • Game ID:{" "}
                {formData.fixture.gameID}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`${cashdeskClasses["summary-label-text"]} text-[11px]`}
              >
                Available Markets
              </p>
              <p
                className={`${cashdeskClasses["summary-value-text"]} font-bold text-xs`}
              >
                {formData.fixture.outcomes?.length || 0} outcomes
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickBets;
