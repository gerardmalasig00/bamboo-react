import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import { Box, Button, IconButton } from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

interface MorePopoverProps {
  handleEdit: () => void;
  handleDelete: () => void;
}

const MorePopover = ({ handleDelete, handleEdit }: MorePopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton size="small" onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box padding={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <Button
              onClick={() => {
                handleClose();
                handleEdit();
              }}
              color="info"
              startIcon={<Edit />}
            >
              Edit
            </Button>
            <Button onClick={handleDelete} color="error" startIcon={<Delete />}>
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default MorePopover;
