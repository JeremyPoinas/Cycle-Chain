import React from "react";
import { Link } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Stack } from "@mui/system";

const columns = [
    { id: 'category', label: 'Category', minWidth: 100 },
    { id: 'producerAddress', label: 'Producer', minWidth: 100 },
    { id: 'model', label: 'Model', minWidth: 100 },
    { id: 'serialNumber', label: 'Serial Number', minWidth: 100 }
];


function CreateBuyButtons() {  
  return (
    <Stack direction="row" spacing={2}>
        <Button variant="contained" endIcon={<AddCircleIcon />}>Install a part</Button>
        <Link to="/parts-buying" style={{ textDecoration: 'none' }}>
          <Button variant="contained" endIcon={<ShoppingCartIcon />}>Buy a part</Button>
        </Link>
    </Stack>
  )
};


export function PartsTable({parts}) {
  const rows = parts;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440, width:"auto" }}>
        <Table stickyHeader aria-label="sticky table">


          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>



          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (

                    <TableRow button component={Link} to={"/part/"+row.id} hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                );
              })}
          </TableBody>


        </Table>
      </TableContainer>


      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default function PartsTableWithButtons({parts}) {
  return (
    <Stack spacing={2} alignItems="stretch">
      <PartsTable parts={parts} />
      <CreateBuyButtons />
    </Stack>
  )
}