import React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'category', label: 'Catégorie', minWidth: 100 },
    { id: 'manufacturer', label: 'Fabricant', minWidth: 100 },
    { id: 'model', label: 'Modèle', minWidth: 100 },
    { id: 'serialNumber', label: 'Numéro de série', minWidth: 100 }
];

const rows = [
    {category: "Transmission", manufacturer: "Dae Gun", model: "TMS36", serialNumber: "238387438"},
    {category: "Transmission", manufacturer: "Dae Gun", model: "TMS36", serialNumber: "679273548"},
    {category: "Transmission", manufacturer: "Dae Gun", model: "TMSX30", serialNumber: "094539273"},
    {category: "Vérin", manufacturer: "CWA", model: "V900", serialNumber: "198354672"},
    {category: "Vérin", manufacturer: "CWA", model: "V900", serialNumber: "198453728"},
    {category: "Vérin", manufacturer: "CWA", model: "Vt43", serialNumber: "198254637"},
    {category: "Vérin", manufacturer: "CWA", model: "Vt56", serialNumber: "198453627"},
    {category: "Boulon", manufacturer: "Dae Gun", model: "M320", serialNumber: "185364782"},
    {category: "Boulon", manufacturer: "Dae Gun", model: "M320", serialNumber: "673298364"},
    {category: "Boulon", manufacturer: "Dae Gun", model: "M25", serialNumber: "678172546"},
    {category: "Boulon", manufacturer: "Dae Gun", model: "M100", serialNumber: "908153728"},
]

export default function PartsTable() {
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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