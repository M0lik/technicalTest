import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function ResultTable({ data, sumValue, lastUpdateTime }: {data: any[], sumValue: Number, lastUpdateTime: number}) {
  return data && data.length > 0 ? (
    <div style={{ margin: "20px" }} >
      <h2>Last update {new Date(lastUpdateTime).toUTCString()}</h2>
      <p>One update per minute, capped by third party api</p>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Unary price (usd)</TableCell>
            <TableCell align="right">Total price for qtt (usd)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <TableRow
              key={row.symbol}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {row.symbol}
              </TableCell>
              <TableCell align="right">{row.unitaryPrice}</TableCell>
              <TableCell align="right">{row.totalPrice}</TableCell>
            </TableRow>
          ))}
          <TableRow
            key={"Sum"}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">Global Amount : {sumValue.toString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  ) : null;
}
