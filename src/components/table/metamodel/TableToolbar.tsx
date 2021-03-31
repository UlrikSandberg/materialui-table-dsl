import { Divider, FormControl, Grow, IconButton, InputAdornment, InputBase, InputLabel, makeStyles, OutlinedInput, Paper, TextField, Theme, Toolbar, Tooltip, Typography } from "@material-ui/core";
import { Clear, CloudDownload, Delete, DeleteOutline, Directions, FilterList, FontDownload, GetApp, Menu, Print, Search, ViewColumn } from "@material-ui/icons";
import { request } from "https";
import React, { useEffect, useState } from "react";
import { ToolbarConfiguration } from "../builders/toolbarBuilder";
import GrowSwitch from "./GrowSwitch";

const useStyles = makeStyles((theme: Theme) => ({
    main: {
        display: 'flex',
        flex: '1 0 auto',
        maxWidth: "500px"
      },
      searchIcon: {
        color: theme.palette.text.secondary,
        marginTop: '10px',
        marginRight: '8px',
      },
      searchText: {
        flex: '0.8 0',
      },
      clearIcon: {
        '&:hover': {
          color: theme.palette.error.main,
        },
      },
}));

interface TableToolbarProps {
    numSelected: number
    tableTitle: string
    onDelete?: () => void
    toolbarConfiguration: ToolbarConfiguration
    onRequestSearch: (isSearching: boolean, searchString: string) => void
    onRequestCSVExport: () => void;
    onRequestPrintExport: () => void;
}

const TableToolbar = (props: TableToolbarProps) => {

    const classes = useStyles();

    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const { numSelected, tableTitle, onDelete, toolbarConfiguration, onRequestSearch, onRequestCSVExport, onRequestPrintExport } = props;

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [])

    const onKeyDown = (event : KeyboardEvent) => {
        if(event.code === "Escape") {
            changeSearchState(false)
        }
    }

    const changeSearchState = (state: boolean) => {
        onRequestSearch(state, searchText);
        setIsSearching(state)
    }

    const onInputChange = (searchText: string) => {
        onRequestSearch(isSearching, searchText);
        setSearchText(searchText);
    }

    const renderSearch = () => {
        if(toolbarConfiguration.supportFullTableSearch) {
            return <Tooltip title="Search">
                <IconButton onClick={() => changeSearchState(!isSearching)}>
                    <Search></Search>
                </IconButton>
            </Tooltip>
        }
    }

    const renderCSVExport = () => {
        if(toolbarConfiguration.supportCSVExport) {
            return <Tooltip title="Download CSV">
                <IconButton onClick={() => onRequestCSVExport()}>
                    <GetApp></GetApp>
                </IconButton>
            </Tooltip>
        }
    }

    const renderPrintExport = () => {
        if(toolbarConfiguration.supportPrintExport) {
            return <Tooltip title="Print">
                <IconButton onClick={() => onRequestPrintExport()}>
                    <Print></Print>
                </IconButton>
            </Tooltip>
        }
    }

    const renderColumnToggles = () => {
        if(toolbarConfiguration.supportColumnToggles) {
            return <Tooltip title="View Columns">
                <IconButton>
                    <ViewColumn></ViewColumn>
                </IconButton>
            </Tooltip>
        }
    }

    const renderColumnFilters = () => {
        if(toolbarConfiguration.supportColumnFiltering) {
            return <Tooltip title="Filter list">
                <IconButton>
                    <FilterList></FilterList>
                </IconButton>
            </Tooltip>
        }
    }

    return (
        <Toolbar style={{display: "flex", justifyContent: "space-between", backgroundColor: numSelected > 0 ? "#F08E43" : "transparent"}}>
            <GrowSwitch 
            onUI={
                <div className={classes.main}>
                    <Search className={classes.searchIcon} />
                    <TextField
                        className={classes.searchText}
                        autoFocus={true}
                        placeholder={"Search"}
                        onChange={e => onInputChange(e.target.value)}
                        value={searchText}
                    />
                    <IconButton className={classes.clearIcon} onClick={() => changeSearchState(false)}>
                        <Clear />
                    </IconButton>
                </div>
            } 
            offUI={
                numSelected > 0 ? (
                    <Typography>
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography>
                        {tableTitle}
                    </Typography>
                )
            } 
            state={isSearching}/>
            <div>
                { numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={onDelete}>
                            <Delete></Delete>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        {renderSearch()}
                        {renderCSVExport()}
                        {renderPrintExport()}
                        {renderColumnToggles()}
                        {renderColumnFilters()}
                    </>
                )}
            </div>
        </Toolbar>
    )
}

export default TableToolbar;