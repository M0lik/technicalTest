import { useState, useEffect } from "react";
import { socket } from "./socket";
import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import PreviewTable from "./components/previewTable";
import ResultTable from "./components/resultTable";

export default function App() {
  const [indexes, setIndexes] = useState<any[]>([]);

  const [quantityInput, setQuantityInput] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);

  const [selection, setSelection] = useState<any[]>([]);

  const [usdValues, setUsdValues] = useState<any>(null);
  const [sumValue, setSumValue] = useState(0);

  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const addToSelection = () => {
    const newEntry = { name: selectedCurrency.id, value: quantityInput };
    const tmp = [...selection, newEntry];
    setSelection(tmp);
  };

  const confirmSelection = () => {
    socket.emit("getUsdValue", selection);
    socket.emit("getUsdSumedPrices", selection);
  };

  const reset = () => {
    setSelection([]);
    setUsdValues([]);
    setSumValue(0);
  };

  useEffect(() => {
    socket.connect();
    socket.emit("getSymbols", null);

    socket.on("getSymbols", (indexesArray) => setIndexes(indexesArray));
    socket.on("getUsdValue", (usdValuesArray) => {
      setLastUpdateTime(Date.now());
      setUsdValues(usdValuesArray);
    });
    socket.on("getUsdSumedPrices", (sumResult) => setSumValue(sumResult));
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#909090",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <Paper
        style={{
          flex: 1,
          margin: 20,
          textAlign: "center",
          backgroundColor: "#f2f2f2",
        }}
      >
        <h2>Cryptos to usd</h2>
        <div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <TextField
              type="number"
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              onChange={(e) => setQuantityInput(Number(e.target.value))}
              value={quantityInput}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={indexes}
              sx={{ width: 300 }}
              getOptionLabel={(option: any) => option.id}
              onChange={(e, value) => setSelectedCurrency(value)}
              renderInput={(params) => (
                <TextField {...params} label="Currency" />
              )}
            />
            <Button variant="outlined" onClick={addToSelection}>
              <Add />
            </Button>
          </div>

          <PreviewTable data={selection} />

          {(usdValues?.length > 0 || selection?.length > 0) && (
            <div>
              <Button onClick={confirmSelection} variant="outlined">
                Validation
              </Button>

              <Button
                variant="outlined"
                onClick={reset}
                style={{ marginLeft: "10px" }}
              >
                Reset
              </Button>
            </div>
          )}

          <ResultTable data={usdValues} sumValue={sumValue} lastUpdateTime={lastUpdateTime} />
        </div>
      </Paper>
    </div>
  );
}
