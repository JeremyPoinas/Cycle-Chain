import React from "react";
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
import { Link } from "react-router-dom";

const columns = [
    { id: 'category', label: 'Catégorie', minWidth: 100 },
    { id: 'manufacturer', label: 'Fabricant', minWidth: 100 },
    { id: 'reference', label: 'Référence', minWidth: 100 },
    { id: 'id', label: 'Numéro de série', minWidth: 100 }
];


function CreateBuyButtons() {
  return (
    <Stack direction="row" spacing={2}>

        <Button variant="contained" endIcon={<AddCircleIcon />}>Créer</Button>

        <Link to="/parts-buying" style={{ textDecoration: 'none' }}>
          <Button variant="contained" endIcon={<ShoppingCartIcon />}>Acheter</Button>
        </Link>
        
    </Stack>
  )
}


function PartsTable({parts}) {

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
    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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

                    <TableRow button component={Link} to={"/part/"+row.id} hover role="checkbox" tabIndex={-1} key={row.code}>
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
    <Stack spacing={2}>
      <PartsTable parts={parts} />
      <CreateBuyButtons />
    </Stack>
  )
}