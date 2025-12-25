import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define the item type for drag and drop
const ItemType = "COLUMN";

// Draggable Column Header Component
const DraggableColumn = ({ column, index, moveColumn }) => {
  const [isMultiLine, setIsMultiLine] = useState(false);
  const headerRef = useRef(null);

  // Check if the header exceeds 2 lines to adjust font size dynamically
  useEffect(() => {
    if (headerRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(headerRef.current).lineHeight
      );
      const maxHeight = headerRef.current.clientHeight;
      setIsMultiLine(maxHeight > lineHeight * 1.5); // Adjust this threshold as needed
    }
  }, [column]);

  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      style={{
        cursor: "move",
        userSelect: "none",
        backgroundColor: "#fff",
        padding: "8px 22px 5px 14px",
        textAlign: "left",
        alignContent: "center",
        fontWeight: "800",
        fontSize: isMultiLine ? "1.3rem" : "1.3rem", // Larger font size for multi-line headers
        whiteSpace: "normal", // Allow text to wrap onto the next line
        maxWidth: "85px", // Restrict the column width, can adjust based on your needs
        lineHeight: "1.7rem", // Adjust the line height for the heading
        overflow: "hidden", // Prevent text overflow
        textOverflow: "ellipsis", // Truncate text with ellipsis
        wordWrap: "break-word", // Break the word if needed
        wordBreak: "break-word", // Break the word if needed
        position: "relative", // Necessary to position the arrow icon
        color: "#000",
      }}
      title={column.label} // Show full text on hover
    >
      <span style={{ display: "block", paddingRight: "20px" }} ref={headerRef}>
        {column.label === "Results" && (
          <span
            style={{
              fontFamily: "'Kanit', sans-serif",
              fontSize: "0.95rem", // Font size as requested
              color: "#fff",
              backgroundColor: "#3671e4",
              borderRadius: "50%", // Perfect circle
              width: "16px", // Fixed 15px width
              height: "16px", // Fixed 15px height
              fontWeight: "580",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "9px",
              lineHeight: "1", // Ensures vertical centering
              position: "relative",
              bottom: "3.5px", // Adjust vertical alignment if needed
              padding: "0", // No padding to avoid distortion
            }}
          >
            i
          </span>
        )}

        {column.label}
      </span>
      <i
        className="bi bi-caret-down-fill"
        style={{
          position: "absolute",

          right: "10px",
          bottom: "35%", // Adjust to position the arrow correctly
          color: "#000", // Set the color of the arrow
          fontSize: "0.85rem", // Adjust the size of the arrow
        }}
      ></i>
    </th>
  );
};

// Main Table Component
const Index = () => {
  const initialData = [
    {
      results: 0.02,
      moneySpent: 331.9,
      roas1: null,
      endDate: "$0.00",
      shoppingValue: 0.0,
    },
    {
      results: 19.73,
      moneySpent: 5623.63,
      roas1: 3.12,
      endDate: "$17534.52",
      shoppingValue: 17534.52,
    },
    {
      results: 23.62,
      moneySpent: 6234.45,
      roas1: 2.26,
      endDate: "$14067.25",
      shoppingValue: 14067.25,
    },
    {
      results: 70.21,
      moneySpent: 6367.21,
      roas1: 3.03,
      endDate: "$19305.36",
      shoppingValue: 19305.36,
    },
    {
      results: 14.92,
      moneySpent: 117267.32,
      roas1: 3.41,
      endDate: "$399300.60",
      shoppingValue: 399300.6,
    },
    {
      results: 26.47,
      moneySpent: 846.98,
      roas1: 2.1,
      endDate: "$1777.48",
      shoppingValue: 1777.48,
    },
    {
      results: 29.67,
      moneySpent: 667.09,
      roas1: 4.58,
      endDate: "$3055.78",
      shoppingValue: 3055.78,
    },
    {
      results: 29.01,
      moneySpent: 754.24,
      roas1: 2.2,
      endDate: "$1657.68",
      shoppingValue: 1657.68,
    },
    {
      results: 29.54,
      moneySpent: 21298.49,
      roas1: 1.82,
      endDate: "$38860.85",
      shoppingValue: 38860.85,
    },
  ];

  const [tableData, setTableData] = useState(initialData);
  const [columns, setColumns] = useState([
    { label: "Amount spent", key: "moneySpent" },
    { label: "Purchase ROAS (return on ad spend)", key: "roas1" },
    { label: "Purchases conversion value", key: "endDate", currencySymbol: "$" },
    { label: "Results", key: "results" },
    { label: "Cost per result", key: "shoppingValue" },
  ]);
  const [underlinedText, setUnderlinedText] = useState({});
  const [manuallyUnderlined, setManuallyUnderlined] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [editableText, setEditableText] = useState({});
  const [isMiniTextModalOpen, setIsMiniTextModalOpen] = useState(false);
  const [miniText, setMiniText] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [customCurrency, setCustomCurrency] = useState("");
  const moveColumn = (fromIndex, toIndex) => {
    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    setColumns(updatedColumns);
  };
  const textRefs = useRef({});
  const [textWidths, setTextWidths] = useState({});
  const [hasLoadedFromDB, setHasLoadedFromDB] = useState(false);

  const deleteColumn = (index) => {
    const updatedColumns = [...columns];
    const updatedData = tableData.map((row) => {
      const updatedRow = { ...row };
      delete updatedRow[updatedColumns[index].key];
      return updatedRow;
    });

    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
    setTableData(updatedData);
  };

  const deleteRow = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  const handleAddColumn = () => {
    const newColumn = {
      label: newColumnName,
      key: newColumnName.toLowerCase().replace(/\s+/g, ""),
    };
    const updatedColumns = [...columns, newColumn];

    const updatedData = tableData.map((row) => ({
      ...row,
      [newColumn.key]: "",
    }));

    setColumns(updatedColumns);
    setTableData(updatedData);
    setNewColumnName(""); // Reset the input after adding the column
  };

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      acc[column.key] = ""; // Initialize with empty values for new row
      return acc;
    }, {});
    setTableData([...tableData, newRow]);
  };

  const handleDoubleClick = (rowIndex, columnKey) => {
    setIsEditing({ rowIndex, columnKey });
  };

  const handleChange = (e, rowIndex, columnKey) => {
    const updatedData = [...tableData];
    let value = e.target.value;

    // If this is the endDate column (Purchases conversion value), ensure it has the correct currency symbol
    if (columnKey === "endDate") {
      const column = columns.find(col => col.key === "endDate");
      const currencySymbol = column?.currencySymbol || "$";

      // If the value doesn't already have a currency symbol and it's not empty, add it
      if (value && !/[^\d.]/.test(value)) {
        // If it's a number or starts with a number, add the currency symbol
        if (!isNaN(parseFloat(value))) {
          value = `${currencySymbol}${value}`;
        }
      } else if (value) {
        // Replace any existing currency symbol with the current one
        // Extract the numeric part
        const numericValue = value.replace(/[^0-9.]/g, "");
        if (numericValue) {
          value = `${currencySymbol}${numericValue}`;
        }
      }
    }

    updatedData[rowIndex][columnKey] = value;
    setTableData(updatedData);
  };

  const calculateTotals = () => {
    const hasDollarSign = {};
    const currencySymbols = {};
    let totalAmountSpent = 0;
    let totalPurchasesConversion = 0;
    let totalResults = 0;

    const totals = columns.reduce((totals, column) => {
      const key = column.key;
      let total = 0;
      let hasCurrency = false;
      let currencySymbol = column.currencySymbol || "$"; // Default currency symbol

      for (const row of tableData) {
        const value = row[key];
        let numericValue = 0;

        if (typeof value === "number") {
          numericValue = value;
        } else if (typeof value === "string") {
          // Check if the string has any non-numeric characters (likely a currency symbol)
          if (/[^\d.]/.test(value)) hasCurrency = true;
          const cleaned = value.replace(/[^0-9.]/g, "");
          numericValue = parseFloat(cleaned) || 0;
        }

        total += numericValue;
      }

      hasDollarSign[key] = hasCurrency;
      currencySymbols[key] = currencySymbol;

      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      totals[`total${capitalizedKey}`] = total;
      totals[`hasDollar-${key}`] = hasCurrency;
      totals[`currencySymbol-${key}`] = currencySymbol;
      totals[`isAverage-${key}`] = false;

      // Track totals needed for derived values
      if (key === "moneySpent") totalAmountSpent = total;
      if (key === "endDate") totalPurchasesConversion = total;
      if (key === "results") totalResults = total;

      return totals;
    }, {});

    // ROAS (Purchase ROAS) = endDate / moneySpent
    const derivedRoas =
      totalAmountSpent > 0 ? totalPurchasesConversion / totalAmountSpent : 0;

    totals["totalRoas1"] = derivedRoas;
    totals["isAverage-roas1"] = true;

    // Cost per Result = moneySpent / results
    const costPerResultAverage =
      totalResults > 0 ? totalAmountSpent / totalResults : 0;

    // Store in shoppingValue (since that's the key for Cost per result)
    totals["totalShoppingValue"] = costPerResultAverage;
    totals["isAverage-shoppingValue"] = true;

    return totals;
  };

  const totals = calculateTotals();
  const toggleColumnSelection = (key) => {
    setSelectedColumns((prev) => {
      if (prev.includes(key)) {
        return prev.filter((col) => col !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const addMiniTextToColumns = () => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (selectedColumns.includes(column.key)) {
          return {
            ...column,
            miniText: miniText, // Add the miniText field to the column
          };
        }
        return column;
      })
    );
  };
  const removeMiniTextFromColumn = (key) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.key === key) {
          return {
            ...column,
            miniText: undefined, // Remove the miniText field
          };
        }
        return column;
      })
    );
  };

  const toggleCurrencySymbol = (columnKey, customSymbol = null) => {
    setColumns(prevColumns =>
      prevColumns.map(column => {
        if (column.key === columnKey) {
          let newSymbol;

          if (customSymbol) {
            // Use the custom symbol provided
            newSymbol = customSymbol;
          } else {
            // Toggle between $ and ₹
            newSymbol = column.currencySymbol === "$" ? "₹" : "$";
          }

          return { ...column, currencySymbol: newSymbol };
        }
        return column;
      })
    );

    // Update the table data to reflect the new currency symbol
    setTableData(prevData =>
      prevData.map(row => {
        const updatedRow = { ...row };
        if (updatedRow[columnKey] && typeof updatedRow[columnKey] === 'string') {
          // Extract the numeric part
          const numericValue = updatedRow[columnKey].replace(/[^0-9.]/g, "");
          if (numericValue) {
            // Apply the new currency symbol
            const column = columns.find(col => col.key === columnKey);
            let newSymbol = customSymbol;
            if (!newSymbol) {
              newSymbol = column.currencySymbol === "$" ? "₹" : "$";
            }
            updatedRow[columnKey] = `${newSymbol}${numericValue}`;
          }
        }
        return updatedRow;
      })
    );

    // Reset the custom currency input after applying
    if (customSymbol) {
      setCustomCurrency("");
    }
  };

  useEffect(() => {
    const newWidths = {};
    for (const key in textRefs.current) {
      const el = textRefs.current[key];
      if (el) {
        newWidths[key] = el.offsetWidth; // This gets the real text width
      }
    }
    setTextWidths(newWidths);
  }, [tableData, columns, manuallyUnderlined]); // ← include underlines so widths update on toggle

  useEffect(() => {
    if (!hasLoadedFromDB) return; // 🚫 don't save until initial load is done

    const dataToSave = {
      tableData,
      columns,
      manuallyUnderlined,
      editableText,
    };

    fetch("/api/save-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: dataToSave }),
    });
  }, [tableData, columns, manuallyUnderlined, editableText, hasLoadedFromDB]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/save-table");
      const { data } = await res.json();
      if (data) {
        setTableData(data.tableData || []);

        // Ensure columns have the currencySymbol property if they're loaded from the database
        if (data.columns) {
          const updatedColumns = data.columns.map(column => {
            if (column.key === "endDate" && !column.hasOwnProperty("currencySymbol")) {
              return { ...column, currencySymbol: "$" };
            }
            return column;
          });
          setColumns(updatedColumns);
        } else {
          setColumns(columns);
        }

        setManuallyUnderlined(data.manuallyUnderlined || {});
        setEditableText(data.editableText || {});
      }
      setHasLoadedFromDB(true); // ✅ only set this AFTER loading saved data
    };

    fetchData();
  }, []);
  const autoFillCalculatedColumns = () => {
    // Find the currency symbol for the endDate column
    const endDateColumn = columns.find(col => col.key === "endDate");
    const currencySymbol = endDateColumn?.currencySymbol || "$";

    const updatedData = tableData.map((row) => {
      const parseNumber = (value) => {
        if (typeof value === "string") {
          return (
            parseFloat(value.replace(/[^0-9.]/g, "").replace(/,/g, "")) || 0
          );
        }
        return typeof value === "number" ? value : 0;
      };

      const amountSpent = parseNumber(row.moneySpent);
      const results = parseNumber(row.results);
      const purchasesConversion = parseNumber(row.endDate);

      const costPerResult =
        results > 0
          ? `${currencySymbol}${(amountSpent / results).toFixed(2)}`
          : amountSpent > 0
            ? `${currencySymbol}0.00`
            : "";

      const roas =
        amountSpent > 0 && purchasesConversion > 0
          ? parseFloat((purchasesConversion / amountSpent).toFixed(2))
          : "";

      // Format the endDate value with the current currency symbol
      const formattedEndDate = row.endDate ?
        (typeof row.endDate === 'string' && /[^\d.]/.test(row.endDate)) ?
          // If it has any non-numeric characters (likely a currency symbol)
          // Replace with the current currency symbol + the numeric value
          `${currencySymbol}${parseNumber(row.endDate).toFixed(2)}` :
          `${currencySymbol}${parseNumber(row.endDate).toFixed(2)}` :
        `${currencySymbol}0.00`;

      return {
        ...row,
        shoppingValue: costPerResult,
        roas1: roas,
        endDate: formattedEndDate
      };
    });

    setTableData(updatedData);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container my-5">
        <div className="mb-4">
          <button
            className="btn btn-warning"
            onClick={autoFillCalculatedColumns}
          >
            Auto Fill Calculated Columns
          </button>
        </div>

        {/* Add Column Button */}
        <div className="mb-4">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="New Column Name"
          />
          <button className="btn btn-primary" onClick={handleAddColumn}>
            Add Column
          </button>
        </div>

        {/* Add Row Button */}
        <div className="mb-4">
          <button className="btn btn-success" onClick={handleAddRow}>
            Add Row
          </button>
        </div>

        <div className="mb-4">
          <button
            className="btn btn-info"
            onClick={() => setIsMiniTextModalOpen(true)}
          >
            Add Mini Text
          </button>
        </div>

        {/* <div className="mb-4">
          <button
            className="btn btn-info"
            onClick={() => toggleCurrencySymbol("endDate")}
          >
            Toggle Currency: {columns.find(col => col.key === "endDate")?.currencySymbol || "$"} 
            {columns.find(col => col.key === "endDate")?.currencySymbol === "$" ? "→₹" : "→$"}
          </button>
        </div> */}

        <div className="mb-4 d-flex align-items-center">
          <input
            type="text"
            value={customCurrency}
            onChange={(e) => setCustomCurrency(e.target.value)}
            placeholder="Enter custom currency symbol"
            style={{ marginRight: "10px" }}
            maxLength="3"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (customCurrency.trim()) {
                toggleCurrencySymbol("endDate", customCurrency.trim());
              }
            }}
          >
            Apply Custom Currency
          </button>
        </div>

        <div className="mb-4">
          {columns.map(
            (column, index) =>
              column.miniText && (
                <div key={index}>
                  <button
                    onClick={() => removeMiniTextFromColumn(column.key)}
                    style={{ color: "red", marginRight: "5px" }}
                  >
                    Remove Mini Text from "{column.label}" Column
                  </button>
                </div>
              )
          )}
        </div>

        {/* Table */}
        <table
          className="table table-bordered vertical"
          style={{ width: "1180px" }}
        >
          <thead className="table-light">
            <tr>
              {columns.map((column, index) => (
                <DraggableColumn
                  key={index}
                  column={column}
                  index={index}
                  moveColumn={moveColumn}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      onDoubleClick={() =>
                        handleDoubleClick(rowIndex, column.key)
                      }
                      style={{
                        backgroundColor:
                          rowIndex % 2 === 0 ? "#f5f6f8" : "#fff",
                        textAlign: "right",
                        fontWeight: 600,
                        fontSize: "1.4rem",
                        position: "relative", // Needed to position the button
                        padding: "5px 13px 5px 5px",
                      }}
                      onMouseEnter={() =>
                        setUnderlinedText({ rowIndex, columnKey: column.key })
                      }
                      onMouseLeave={() => setUnderlinedText(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          {/* Text with underline */}
                          {isEditing &&
                            isEditing.rowIndex === rowIndex &&
                            isEditing.columnKey === column.key ? (
                            <input
                              type="text"
                              value={row[column.key]}
                              onChange={(e) =>
                                handleChange(e, rowIndex, column.key)
                              }
                              onBlur={() => setIsEditing(null)}
                              autoFocus
                              style={{
                                border: "none",
                                background: "transparent",
                                textAlign: "right",
                                fontWeight: 600,
                                fontSize: "1rem",
                              }}
                            />
                          ) : (
                            <span
                              ref={(el) =>
                              (textRefs.current[`${rowIndex}-${column.key}`] =
                                el)
                              }
                              onDoubleClick={() =>
                                handleDoubleClick(rowIndex, column.key)
                              }
                              style={{
                                position: "relative",
                                display: "inline-block",
                                fontWeight: 450,
                                cursor: "pointer",
                                textDecoration:
                                  (underlinedText?.rowIndex === rowIndex &&
                                    underlinedText?.columnKey === column.key) ||
                                    manuallyUnderlined[
                                    `${rowIndex}-${column.key}`
                                    ]
                                    ? "underline dotted"
                                    : "none",
                              }}
                            >
                              {row[column.key] || "–"}
                            </span>
                          )}

                          {underlinedText?.rowIndex === rowIndex &&
                            underlinedText?.columnKey === column.key && (
                              <button
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "black",
                                  cursor: "pointer",
                                  marginLeft: "5px",
                                }}
                                onClick={() => {
                                  const key = `${rowIndex}-${column.key}`;
                                  setManuallyUnderlined((prev) => ({
                                    ...prev,
                                    [key]: !prev[key],
                                  }));
                                }}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}

                          <input
                            type="text"
                            value={
                              editableText[`${rowIndex}-${column.key}`] || ""
                            }
                            onChange={(e) =>
                              setEditableText({
                                ...editableText,
                                [`${rowIndex}-${column.key}`]: e.target.value,
                              })
                            }
                            onDoubleClick={() =>
                              setEditableText({
                                ...editableText,
                                [`${rowIndex}-${column.key}`]: row[column.key],
                              })
                            }
                            style={{
                              width: "100%",
                              border: "none",
                              background: "transparent",
                              textAlign: "right",
                              fontSize: "19px",
                              color: "#909190",
                              fontWeight: "450",
                            }}
                          />
                        </div>

                        {/* Optional mini text beside */}
                        {column.miniText &&
                          row[column.key] !== "–" &&
                          row[column.key] !== "0" &&
                          row[column.key] !== "0.00" &&
                          row[column.key] !== "$0" &&
                          row[column.key] !== "$0.00" &&
                          row[column.key] && (
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#000",
                                marginLeft: "4px",
                                fontWeight: 450,
                                position: "relative",
                                bottom: "-3px",
                              }}
                            >
                              {column.miniText}
                            </div>
                          )}
                      </div>
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr
              style={{
                backgroundColor: "white",
                boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
                borderBottom: "2px solid #ccc",
              }}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  style={{
                    backgroundColor: "white", // Set the background to white for the total row
                    paddingBottom: "20px",
                    paddingRight: "11px",
                    borderTop: "2px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "flex-end",
                      justifyContent: "right",
                      fontWeight: 750,
                    }}
                    onMouseEnter={() =>
                      setUnderlinedText({
                        rowIndex: "total",
                        columnKey: column.key,
                      })
                    }
                    onMouseLeave={() => setUnderlinedText(null)}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          position: "relative",
                          display: "inline-block",
                          textAlign: "right",
                          fontWeight: 800,
                          fontSize: "23px",
                          textDecoration:
                            (underlinedText?.rowIndex === "total" &&
                              underlinedText?.columnKey === column.key) ||
                              manuallyUnderlined[`total-${column.key}`]
                              ? "underline dotted"
                              : "none",
                        }}
                      >
                        <span
                          ref={(el) =>
                            (textRefs.current[`total-${column.key}`] = el)
                          }
                          style={{ display: "inline" }}
                        >
                          {(() => {
                            const totalKey = `total${column.key.charAt(0).toUpperCase() +
                              column.key.slice(1)
                              }`;
                            const isAverage = totals[`isAverage-${column.key}`];
                            const value = totals[totalKey];

                            if (value === undefined || value === null)
                              return " ";

                            const formattedValue = value.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            );

                            const dollarPrefix = totals[
                              `hasDollar-${column.key}`
                            ]
                              ? totals[`currencySymbol-${column.key}`] || "$"
                              : "";

                            return `${isAverage ? "" : ""
                              }${dollarPrefix}${formattedValue}`;
                          })()}
                        </span>
                      </span>

                      <div>
                        <input
                          type="text"
                          value={editableText[column.key] || ""}
                          onChange={(e) =>
                            setEditableText({
                              ...editableText,
                              [column.key]: e.target.value,
                            })
                          }
                          onDoubleClick={() =>
                            setEditableText({
                              ...editableText,
                              [column.key]:
                                totals[
                                `total${column.key.charAt(0).toUpperCase() +
                                column.key.slice(1)
                                }`
                                ],
                            })
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            textAlign: "right",
                            fontSize: "19px",
                            color: "#909190",
                            fontWeight: "450",
                          }}
                        />
                      </div>
                    </div>
                    {underlinedText?.rowIndex === "total" &&
                      underlinedText?.columnKey === column.key && (
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "black",
                            cursor: "pointer",
                            marginLeft: "5px",
                          }}
                          onClick={() => {
                            const key = `total-${column.key}`;
                            setManuallyUnderlined((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }));
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      )}

                    {column.miniText && (
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#000",
                          marginLeft: "3px",
                          fontWeight: 550,
                          position: "relative",
                          bottom: "-6px",
                        }}
                      >
                        {column.miniText}
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>

        {/* Delete Column Buttons */}
        <div className="mb-4">
          {columns.map((column, index) => (
            <div key={index}>
              <button
                onClick={() => deleteColumn(index)}
                style={{ color: "red", marginRight: "5px" }}
              >
                Delete "{column.label}" Column
              </button>
              <br />
            </div>
          ))}
        </div>

        {/* Delete All Rows */}
        <div className="row">
          <div className="col-md-12 text-center">
            <button className="btn btn-danger" onClick={() => setTableData([])}>
              Delete All Rows
            </button>
          </div>
        </div>
      </div>

      {isMiniTextModalOpen && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-content"
            style={{ padding: "20px", background: "white" }}
          >
            <h4>Enter Mini Text</h4>
            <input
              type="text"
              value={miniText}
              onChange={(e) => setMiniText(e.target.value)}
              placeholder="Enter mini text"
            />
            <div className="mt-3">
              <h5>Select Columns to Add Text:</h5>
              {columns.map((column, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`col-${index}`}
                    checked={selectedColumns.includes(column.key)}
                    onChange={() => toggleColumnSelection(column.key)}
                  />
                  <label htmlFor={`col-${index}`}>{column.label}</label>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setIsMiniTextModalOpen(false);
                addMiniTextToColumns();
              }}
              className="btn btn-primary mt-3"
            >
              Add Text to Selected Columns
            </button>
            <button
              onClick={() => setIsMiniTextModalOpen(false)}
              className="btn btn-secondary mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default Index;
