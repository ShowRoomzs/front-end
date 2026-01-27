import { RefreshControl as RNRefreshControl, RefreshControlProps } from "react-native";

export default function RefreshControl(props: RefreshControlProps) {
  return <RNRefreshControl {...props} colors={["#0D0C11"]} tintColor="#0D0C11" />;
}
