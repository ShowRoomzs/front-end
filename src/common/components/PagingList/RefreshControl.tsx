import { RefreshControl as RNRefreshControl, RefreshControlProps } from "react-native";

export default function RefreshControl(props: RefreshControlProps) {
  return <RNRefreshControl {...props} colors={["#0F0F0F"]} tintColor="#0F0F0F" />;
}
