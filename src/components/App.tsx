import React, { useState } from "react";
import { TableBuilder } from "./table/builders/tableBuilder";
import { v4 as uuid } from "uuid";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";

export interface Data {
  id: string;
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
  price: number;
  history: {date: string, customerId: string, amount: number}[]
}

export function createData(
  id: string,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
): Data {
  return { id, name, calories, fat, carbs, protein, price, history: [
    { date: '2020-01-05', customerId: uuid(), amount: 3 },
    { date: '2020-01-02', customerId: uuid(), amount: 1 }
  ] 
};
}

export const rows = [
  createData(uuid(),'Cupcake', 305, 3.7, 67, 4.3, 4),
  createData(uuid(),'Donut', 452, 25.0, 51, 4.9, 4),
  createData(uuid(),'Eclair', 262, 16.0, 24, 6.0, 4),
  createData(uuid(),'Frozen yoghurt', 159, 6.0, 24, 4.0, 4),
  createData(uuid(),'Gingerbread', 356, 16.0, 49, 3.9, 4),
  createData(uuid(),'Honeycomb', 408, 3.2, 87, 6.5, 4),
  createData(uuid(),'Ice cream sandwich', 237, 9.0, 37, 4.3, 4),
  createData(uuid(),'Jelly Bean', 375, 0.0, 94, 0.0, 4),
  createData(uuid(),'KitKat', 518, 26.0, 65, 7.0, 4),
  createData(uuid(),'Lollipop', 392, 0.2, 98, 0.0, 4),
  createData(uuid(),'Marshmallow', 318, 0, 81, 2.0, 4),
  createData(uuid(),'Nougat', 360, 19.0, 9, 37.0, 4),
  createData(uuid(),'Oreo', 437, 18.0, 63, 4.0, 4),
];

const App = () => {

  const [state, setState] = useState(0);

  const createATable = () => {
    var metaTable = TableBuilder
    .Table<Data>(rows)
      .Toolbar("GLC")
        .SupportFullTableSearch()
        .SupportCSVExport()
        .SupportPrintExport()
      .End()
      .Theme()
        .SizeBreakpoint("xs", 600)
        .SizeBreakpoint("sm", 960)
        .SizeBreakpoint("md", 1280)
        .SizeBreakpoint("lg", 1980)
        .SizeBreakpoint("xl", 2420)
      .End()
      .Paging()
        .PageSizeOption(5)
        .PageSizeOption(10)
        .PageSizeOption(20)
        .PageSizeAll()
      .End()
      .Selectable()
      .Column()
        .Collapseable((data) => {
          return <Box margin={1}>
          <Typography variant="h6" gutterBottom component="div">
              Another History
          </Typography>
          <Table size="small" aria-label="purchases">
              <TableHead>
              <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Total price ($)</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {data.history!.map((historyRow) => (
                  <TableRow key={historyRow.date}>
                  <TableCell component="th" scope="row">
                      {historyRow.date}
                  </TableCell>
                  <TableCell>{historyRow.customerId}</TableCell>
                  <TableCell align="right">{historyRow.amount}</TableCell>
                  <TableCell align="right">
                      {Math.round(historyRow.amount * data.price * 100) / 100}
                  </TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>
      </Box>
        })
      .Column("Name")
        .Sortable()
        .Field("name")
        .HideOnBreakpoint("xs")
        .OnClick((data) => console.log(data))
      .Column("Calories", true)
        .Sortable()
        .HideOnBreakpoint("sm")
        .Field("calories")
      .Column("Fat(g)", true)
        .Sortable()
        .Field("fat")
      .Column("Carbs(g)", true)
        .Sortable()
        .Field("carbs")
      .Column("Protein(g)", true)
        .Custom((data) => {
          return <div style={{textAlign: "right"}}>{data.protein}</div>
        })
      .End()
      .Build();

      return metaTable;
  }
  
  return (
    <div style={{padding: "100px", backgroundColor: "#eeeeee"}}>
        {createATable()}
    </div>
  );
}

export default App;


