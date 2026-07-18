import Tabs from "@mui/joy/Tabs";
import JoyTabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

export function UITabs({
  value,
  defaultValue = 0,
  onChange,
  children,
  ...props
}) {
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue}
      onChange={(_, value) => onChange?.(value)}
      {...props}
    >
      {children}
    </Tabs>
  );
}

export function UITabList({
  children,
  sx,
  ...props
}) {
  return (
    <JoyTabList
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "transparent",
        ...sx,
      }}
      {...props}
    >
      {children}
    </JoyTabList>
  );
}

export function UITab({
  children,
  ...props
}) {
  return (
    <Tab
      sx={{
        fontWeight: 600,
        minHeight: 48,
        transition: "all .2s",

        "&[aria-selected='true']": {
          color: "primary.500",
        },
      }}
      {...props}
    >
      {children}
    </Tab>
  );
}

export function UITabPanel({
  children,
  sx,
  ...props
}) {
  return (
    <TabPanel
      sx={{
        py: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
    </TabPanel>
  );
}