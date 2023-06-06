
import { useEffect, useMemo, useState } from "react";
import {  
    Button, 
    Checkbox, 
    Fade, 
    Grid, 
    InputAdornment,
    Menu,
    MenuItem, 
    Modal, 
    Select, 
    Table, 
    TableCell, 
    TablePagination, 
    TableRow, 
    TableSortLabel, 
    TextField, 
    Typography
} from "@material-ui/core";
import Box from '@mui/material/Box';
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { v4 as uuid } from 'uuid';
import debounce from "lodash.debounce";
import { visuallyHidden } from '@mui/utils';

import "../Assets/User.css";
import UserForm from "../Components/UserForm";
import { UserInterface } from "../Interfaces/User";
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser, updateUser, userStatus } from "../Redux/UserAction";
// import { addUser, deleteUser, updateUser } from "../Redux/UserReducer";

type Order = 'asc' | 'desc';
const headCells = [
    {
      id: 'firstName',
      label: 'First Name',
    },
    {
        id: 'lastName',
        label: 'Last Name',
    },
    {
        id: 'email',
        label: 'Email',
    }   
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(order: Order, orderBy: Key,): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const User = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [data, setData] = useState({});
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [checkedUserinfo, setCheckedUserInfo] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filter, setFilter] = useState("firstName");
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof UserInterface>('firstName');

    const openMenu = Boolean(anchorEl);
    
    const handleMenuClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
      setAnchorEl(null);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setData({});
    }

    const handleDeleteModalOpen = () => setOpenDeleteModal(true);
    const handleDeleteModalClose = () => setOpenDeleteModal(false);

    let userList = useSelector((state: any) => state.user.addUser);

    const addUserHandler = (user: UserInterface) => {
        handleClose();
        if (user.id) { 
            dispatch(updateUser(user));
        } else {
            const userData = {
                id: uuid(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                active: true
            }
            dispatch(addUser(userData));
        }
    }

    const getUser = (user: UserInterface) => {
        setUserData(user);
    }

    const deleteUserData = () => {
        handleDeleteModalClose();
        // dispatch(deleteUser(userData));
        dispatch(deleteUser(userData));
    }

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            if (value.includes(',')) {
                const newValue = value.split(',');
                setCheckedUserInfo(newValue);
            } else {
                setCheckedUserInfo([...checkedUserinfo, value]);
            }
        } else {
            if (value.includes(',')) {
                const newValue = value.split(',');
                const data = checkedUserinfo.filter(val => !newValue.includes(val));
                setCheckedUserInfo(data);
            } else {
                setCheckedUserInfo(checkedUserinfo.filter((i) => i !== value));
            }  
        }
    }
    
    const changeMenuItem = (event: any) => {
        dispatch(userStatus(checkedUserinfo, event.target.innerText));
        handleDeleteModalClose();
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelect = (event: any) => {
        setFilter(event.target.value);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(e.target.value);
    };

    if (searchTerm !== "") {
        userList = userList.filter((i: UserInterface) => {
            if (filter === "firstName") {
                if(
                    i.firstName.toLowerCase().includes(searchTerm) 
                    || i.firstName.toUpperCase().includes(searchTerm)
                    || i.firstName.includes(searchTerm)) {
                    return i;
                }
            } else if (filter === "lastName") {
                if(
                    i.lastName.toLowerCase().includes(searchTerm)
                    || i.lastName.toUpperCase().includes(searchTerm)
                    || i.lastName.includes(searchTerm)) {
                    return i;
                }
            } else if (filter === "email") {
                if(i.email.toLowerCase().includes(searchTerm)
                    || i.email.toUpperCase().includes(searchTerm)
                    || i.email.includes(searchTerm)) {
                    return i;
                }
            } else if (filter === "phone") {
                if(i.phone.toLowerCase().includes(searchTerm)
                    || i.phone.toUpperCase().includes(searchTerm)
                    || i.phone.includes(searchTerm)) {
                    return i;
                }
            }
        });
    }

    const debouncedResults = useMemo(() => {
        return debounce(handleChange, 300);
    }, []);
    
    useEffect(() => {
        return () => {
            debouncedResults.cancel();
        };
    });

    const handleRequestSort = (event: React.MouseEvent<unknown>,property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    return (
        <Box className="content-box-lg">
            <Box className="title-heading">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h3">
                            Search
                        </Typography>
                    </Grid>
                </Grid>    
            </Box>

            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="First Name"
                            className="search-select"
                            value={filter}
                            onChange={e => handleSelect(e)}
                        >
                            <MenuItem value="firstName">First Name</MenuItem>
                            <MenuItem value="lastName">Last Name</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Phone</MenuItem>
                        </Select>
                        <TextField
                            id="search" 
                            variant="outlined"
                            placeholder="Search here..."
                            className="search-field"
                            onChange={debouncedResults}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className="search-icon">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Button
                            type="submit" 
                            variant="contained"
                            className="add-user-btn"
                            onClick={handleOpen}
                        >
                            +Create New User
                        </Button>
                    </Grid>
                </Grid>   
                <Modal open={open}
                    onClose={handleClose}
                    closeAfterTransition
                >
                    <UserForm onSaveData={addUserHandler} formData={data}/>
                </Modal> 
            </Box>

            <Box>
                <Table>
                    <TableRow>
                        <TableCell>
                            <Checkbox
                                color="primary"
                                value={userList.map((i: UserInterface) => i.id)}
                                onChange={e => handleCheckBoxChange(e)}
                            />
                        </TableCell>
                        {headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
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
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell >
                            <Box className="action-align">
                                Action
                                <MoreVertIcon
                                    className="dot-icon"
                                    aria-controls={openMenu ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openMenu ? 'true' : undefined}
                                    onClick={handleMenuClick}
                                />
                                <Menu
                                    id="fade-menu"
                                    MenuListProps={{
                                    'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={e => changeMenuItem(e)} value="Active">Active</MenuItem>
                                    <MenuItem onClick={e => changeMenuItem(e)} value="InActive">InActive</MenuItem>
                                </Menu>
                            </Box>
                        </TableCell>
                    </TableRow>

                    { userList.length > 0
                        ?
                        (rowsPerPage > 0
                            ? stableSort(userList, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : userList
                        ).map((i: UserInterface) => {
                            const isItemSelected = checkedUserinfo.indexOf(i.id) !== -1;
                           
                            return (
                                <TableRow key={i.id}>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            value={i.id}
                                            onChange={e => handleCheckBoxChange(e)}
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    <TableCell>{i.firstName}</TableCell>
                                    <TableCell>{i.lastName}</TableCell>
                                    <TableCell>{i.email}</TableCell>
                                    <TableCell>+91{i.phone}</TableCell>
                                    <TableCell>
                                        {
                                            i.active ?
                                            (
                                                <Button variant="contained" className="active-btn">
                                                    Active
                                                </Button>
                                            ): 
                                            (
                                                <Button variant="contained" className="in-active-btn">
                                                    InActive
                                                </Button>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <EditOutlinedIcon  
                                            className="edit-icon"
                                            onClick={() => {handleOpen(); setData(i); }}
                                        />
                                        <DeleteOutlineOutlinedIcon 
                                            className="delete-icon"
                                            onClick={() => {handleDeleteModalOpen(); getUser(i); }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }) : <TableRow>No data</TableRow> 
                    }
                </Table>
                <TablePagination
                    component="div"
                    onPageChange={handleChangePage}
                    page={page}
                    count={userList.length}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Modal open={openDeleteModal}
                    onClose={handleDeleteModalClose}
                    closeAfterTransition
                >
                    <Box className="delete-user-modal">
                        <p>Are you sure you want to delete the book?</p>
                        <Button onClick={() => deleteUserData()} type="submit" variant="contained" className="success-btn">Yes</Button> 
                        <Button onClick={handleDeleteModalClose} type="submit" variant="contained" className="error-btn">No</Button>
                    </Box>
                </Modal>
            </Box>

        </Box>
    );
}

export default User;
