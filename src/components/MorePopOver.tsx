import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import { Box, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

interface MorePopoverProps {
  children: React.ReactNode;
}

const MorePopover = ({ children }: MorePopoverProps) => {
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
        <Box padding={2}>{children}</Box>
      </Popover>
    </Box>
  );
};

export default MorePopover;
