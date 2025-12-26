import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import Typography from "@/common/components/Typography/Typography";

interface AuthEntryBannerProps {
  onPressAuth: () => void;
}

export default function AuthEntryBanner(props: AuthEntryBannerProps) {
  const { onPressAuth } = props;

  return (
    <View className="flex items-center text-center">
      <Typography className="text-black font-semibold text-16 text-center">
        {"쇼룸즈 회원가입하고\n쏟아지는 혜택 받아가세요"}
      </Typography>
      <Button onPress={onPressAuth} size="lg" variant="primary" className="w-full mt-20">
        로그인 / 회원가입
      </Button>
    </View>
  );
}
