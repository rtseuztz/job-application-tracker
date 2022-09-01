import * as React from 'react';
import styles from '../styles/Table.module.css'
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DataContextInterface, filter, job, newJob } from './authContext';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useData } from './authContext'
import _ from 'underscore';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Divider, Drawer, Input, List, TextField } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { styled, useTheme } from '@mui/material/styles';

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

function createData(
  company: string,
  salary: number,
  title: string,
  uid: string,
  jid: string,
  date: Date
): job {
  return {
    company,
    salary,
    title,
    uid,
    jid,
    date
  };
}
function addJobDialog() {

}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string | Date },
    b: { [key in Key]: number | string | Date },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof job;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date'
  },
  {
    id: 'company',
    numeric: false,
    disablePadding: false,
    label: 'Company',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Job Title',
  },
  {
    id: 'salary',
    numeric: true,
    disablePadding: false,
    label: 'Salary ($)',
  },
  {
    id: 'uid',
    numeric: true,
    disablePadding: false,
    label: 'UID',
  },
];
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof job) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof job) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  searchFunc: (e: any) => void
}
const DrawerHeader = styled('div')(({ theme }: any) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, searchFunc } = props;
  const [jobModalOpen, setJobModalOpen] = React.useState<boolean>(false)
  const [filterModalOpen, setFilterModalOpen] = React.useState<boolean>(false)
  const newJobModalRef = React.useRef(null);
  const data: DataContextInterface = useData()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!newJobModalRef.current)
      return
    const formData = new FormData(newJobModalRef.current)
    const company: string = formData.get('company') as string ?? ""
    const title: string = formData.get('title') as string ?? ""
    const salary: number = parseFloat(formData.get('salary') as string) ?? 0
    const job: newJob = {
      title: title,
      company: company,
      salary: salary,
      date: new Date()
    }
    setJobModalOpen(false);
    data.addJob(job)
  }

  /**
   * Filter
   */
  const [filters, setFilters] = React.useState<filter[]>([])
  var filterKey: keyof job = 'company'
  const newFilterRef = React.useRef(null)
  React.useEffect(() => {
    setFilters(data.getFilters())
  }, [data.getFilters()])
  const addFilter = (e: any) => {
    e.preventDefault();
    if (!newFilterRef.current)
      return
    const formData = new FormData(newFilterRef.current)
    const key: keyof job = formData.get('key') as keyof job ?? ""
    const comparator: string = formData.get('comparator') as string ?? ""
    const value: string = formData.get('value') as string ?? ""
    const filter: filter = {
      key: key,
      comparator: comparator,
      value: value
    }
    data.addFilter(filter)
  }
  /**
   * Search
   */
  return (
    <>
      <Drawer
        sx={{
          width: "100%",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "100%",
            boxSizing: 'border-box',
            flexDirection: 'row'
          },
        }}
        variant="persistent"
        anchor="bottom"
        open={filterModalOpen}
      >
        <DrawerHeader>
          <IconButton onClick={() => setFilterModalOpen(false)}>
            {<ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <form ref={newFilterRef} onSubmit={addFilter}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              name="key"
              displayEmpty
              native={true}
            >
              {["company", "title", "salary"].map((k) => {
                return <option>{k}</option>
              })}

            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              name="comparator"
              displayEmpty
              native={true}
            >
              {["is", "like", "not like", ">", "<"].map((c) => {
                return <option>{c}</option>
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField
              name="value"
              placeholder="value"
            />
          </FormControl>
          <Button type="submit">add filter</Button>
        </form>
        <div>
          {filters.map((f) => {
            return (
              <div>{`${f.key} ${f.comparator} ${f.value}`}</div>
            )
          })}
        </div>
      </Drawer>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.dark, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Jobs
          </Typography>
        )}
        <input onChange={searchFunc} placeholder='search'></input>
        <Tooltip title="Add Job">
          <IconButton onClick={() => setJobModalOpen(!jobModalOpen)} >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={jobModalOpen}
          onClose={() => setJobModalOpen(false)}
          className={styles.addJobModal}>
          <form className={styles.addJobForm} ref={newJobModalRef} onSubmit={handleSubmit}>
            <div className={styles.addJobModal}>Add a job</div>
            <input name="company" placeholder='company'></input>
            <input name="title" placeholder='title'></input>
            <input name="salary" placeholder='salary'></input>
            <DialogActions>
              <Button onClick={() => setJobModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* <Dialog
        open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <>
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                displayEmpty
              >
                <MenuItem>fd</MenuItem>
                <MenuItem>fd</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                displayEmpty
              >
                <MenuItem>fd</MenuItem>
                <MenuItem>fd</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                displayEmpty
              >
                <MenuItem></MenuItem>
              </Select>
            </FormControl>
            <Button>add filter</Button>
          </div>

          {filters.forEach((f) => {
            return (
              <div>{f.key}</div>
            )
          })}
          <form ref={newJobModalRef} onSubmit={handleSubmit}>
            <div>dialog</div>
            <input name="company" placeholder='company'></input>
            <input name="title" placeholder='title'></input>
            <input name="salary" placeholder='salary'></input>
            <DialogActions>
              <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
              <Button type="submit">Ok</Button>
            </DialogActions>
          </form>
        </>

      </Dialog> */}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton onClick={() => setFilterModalOpen(!filterModalOpen)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </>
  );
};


export default function EnhancedTable(data: Array<job>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof job>('date');
  const [searchBy, setSearchBy] = React.useState<string>('');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortedRows, setSortedRows] = React.useState(data);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const [getFormat, setFormat] = React.useState<Intl.NumberFormat>(formatter);
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof job,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = sortedRows.map((n) => n.jid);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const searchFunc = (e: any) => {
    console.log(e)
    const searchVal = e.target.value;
    setSearchBy(searchVal)
  }
  React.useEffect(() => {
    setPage(0)
    setSortedRows(data.filter(r => (r.company?.includes(searchBy) ?? false) || (r.title?.includes(searchBy) ?? false)))
    console.log(sortedRows)
  }, [data, searchBy])
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    Math.max(0, rowsPerPage - sortedRows.length)
  const options = { year: "numeric", month: "long", day: "numeric" }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            searchFunc={searchFunc} />
          <TableContainer>
            <Table
              style={{ tableLayout: "fixed" }}
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={sortedRows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                rows.slice().sort(getComparator(order, orderBy)) */}
                {(sortedRows).slice().sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.jid);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        className={styles.tableRow}
                        hover
                        onClick={(event) => handleClick(event, row.jid)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.jid}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.date.toLocaleDateString() + " " + row.date.toLocaleTimeString()}
                        </TableCell>
                        <TableCell className={styles.company} title={row.company} align="left">{row.company}</TableCell>
                        <TableCell className={styles.title} align="left">{row.title}</TableCell>
                        <TableCell className={styles.salary} align="right">{getFormat.format(row.salary)}</TableCell>
                        <TableCell align="right">{row.uid}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
