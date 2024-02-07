import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";

// VIBE UI COMPONENTS
import { Flex, Button, TextField, Dropdown, Toast } from "monday-ui-react-core";

// MONDAY SDK
const monday = mondaySdk();

export const OrderForm = () => {
  const [context, setContext] = useState();

  // STATE
  const [fragranceOptions, setFragranceOptions] = useState([]);
  const [fragnences, setFragnences] = useState([]);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [quantity, setQuantity] = useState(0);

  //TOAST
  const [toastOpen, setToastOpen] = useState(false);
  const onClickCallback = useCallback(
    () => setToastOpen((toastOpen) => !toastOpen),
    [setToastOpen]
  );
  const onCloseCallback = useCallback(
    () => setToastOpen(false),
    [setToastOpen]
  );
  const actions = useMemo(
    () => [
      {
        type: Toast.actionTypes.BUTTON,
        content: "Undo",
      },
    ],
    []
  );

  useEffect(() => {
    monday.execute("valueCreatedForUser");
    monday.listen("context", (res) => {
      setContext(res.data);
      fetchFragrenceOptions();
    });
  }, []);

  ///////////////////////////////////////////
  // FETCH FRAGRENCE OPTIONS
  ///////////////////////////////////////////

  const fetchFragrenceOptions = async () => {
    console.log("fetching fragrence options");
    try {
      const response = await fetch("http://localhost:5003/fragrance");
      const data = await response.json();

      let labelsSet = new Set();
      data.forEach((item) => {
        labelsSet.add(item.category);
      });

      labelsSet = Array.from(labelsSet);

      let options = labelsSet.map((label, index) => {
        return { value: index, label: label };
      });

      setFragranceOptions(options);
    } catch (error) {
      console.error("Error fetching fragrence options");
    }
  };

  ///////////////////////////////////////////
  // SUBMIT ORDER
  ///////////////////////////////////////////

  const handleSubmit = async (e) => {
    let mutation =
      "mutation ($myItemName: String!, $columnVals: JSON!) { create_item (board_id:5974213726, create_labels_if_missing: true, item_name:$myItemName, column_values:$columnVals) { id } }";
    let vars = {
      myItemName: "New Order",
      columnVals: JSON.stringify({
        status: { label: "New Order" },
        date_1: new Date().toISOString().split("T")[0],
        numbers: quantity,
        dropdown: {
          labels: [...fragnences.map((fragrance) => fragrance.label)],
        },
        text: first,
        text6: last,
      }),
    };

    try {
      await monday.api(mutation, { variables: vars });
      onClickCallback();
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    console.log("resetting form");
    setFirst("");
    setLast("");
    setQuantity(0);
    setFragnences([]);
  };

  ///////////////////////////////////////////
  // RENDER SECTON
  ///////////////////////////////////////////

  return (
    <>
      <Toast
        open={toastOpen}
        type={Toast.types.POSITIVE}
        actions={actions}
        onClose={onCloseCallback}
        autoHideDuration={5000}
        className="monday-storybook-toast_box"
      >
        We successfully added your order!
      </Toast>

      <div className="App">
        <Flex gap={Flex.gaps.LARGE} direction={Flex.directions.COLUMN}>
          <Flex gap={10} direction="Horizontal">
            <TextField
              required={true}
              requiredAsterisk={true}
              title="First Name"
              placeholder="First Name"
              value={first}
              onChange={(name) => {
                setFirst(name);
              }}
            />
            <TextField
              required={true}
              requiredAsterisk={true}
              title="Last Name"
              placeholder="Last Name"
              value={last}
              onChange={(last) => {
                setLast(last);
              }}
            />

            <TextField
              required={true}
              requiredAsterisk={true}
              title="Quantity"
              placeholder="quantity"
              value={quantity}
              type="number"
              onChange={(quantity) => {
                setQuantity(quantity);
              }}
            />
          </Flex>

          <div style={{ width: "100%" }}>
            <Dropdown
              required={true}
              multi
              value={fragnences}
              options={fragranceOptions}
              onClick={(e) => {
                console.log("fetching fragrence options");
                fetchFragrenceOptions();
              }}
              onChange={(e) => {
                setFragnences(e);
              }}
              placeholder="Select Three Sents"
            />
          </div>

          <Button
            // type="submit"
            onClick={() => {
              handleSubmit();
            }}
            disabled={
              (fragnences?.length !== 3) |
              (first.length === 0) |
              (last.length === 0) |
              (quantity < 1)
                ? true
                : false
            }
          >
            Create Order
          </Button>
        </Flex>
      </div>
    </>
  );
};
