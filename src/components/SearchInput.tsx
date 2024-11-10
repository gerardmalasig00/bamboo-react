import { Close } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ITodo } from "../types";
import { debounce } from "lodash";

interface SearchInputProps {
  totalItems: ITodo[];
  isLoading: boolean;
  setParams: (prev: string) => void;
  setIsLoading: (prev: boolean) => void;
}
const SearchInput = ({
  totalItems,
  isLoading,
  setParams,
  setIsLoading,
}: SearchInputProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const debouncedSearch = debounce((value: string) => {
      setIsLoading(false);
      setParams(value);
    }, 300);

    debouncedSearch(search);

    return () => {
      debouncedSearch.cancel(); // Cancel debounce when the component unmounts or the search changes
    };
  }, [search, setParams, setIsLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setSearch(e.target.value);
  };
  return (
    <Box width={"100%"} flex={1}>
      <TextField
        sx={{ width: "100%" }}
        value={search}
        onChange={handleChange}
        variant="outlined"
        size="small"
        placeholder="Search product"
        slotProps={{
          input: {
            endAdornment: search ? (
              <InputAdornment position="start">
                <Close
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      // Add rotating animation through transform
                      transform: "rotate(90deg)",
                    },
                  }}
                  onClick={() => {
                    setParams("");
                    setSearch("");
                  }}
                />
              </InputAdornment>
            ) : null,
          },
        }}
        helperText={
          isLoading
            ? "Searching..."
            : totalItems.length === 0
            ? "No todos matched your search keyword."
            : ""
        }
      />
    </Box>
  );
};

export default SearchInput;
