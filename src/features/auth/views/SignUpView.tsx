import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { View } from "react-native";

import Divider from "@/common/components/Divider/Divider";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import LabeledInput from "@/common/components/LabeledInput/LabeledInput";
import SelectableButtonGroup, {
  SelectableButtonGroupItem,
} from "@/common/components/SelectableButtonGroup/SelectableButtonGroup";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { CheckboxProvider } from "@/common/providers/CheckboxProvider";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import AuthTermsCheckboxGroup from "@/features/auth/components/AuthTermsCheckboxGroup/AuthTermsCheckboxGroup";
import { formatBirthdate } from "@/features/auth/utils/formatBirthdate";

export default function SignUpView() {
  const route = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.SIGN_UP>>();
  const { onSuccessLogin } = route.params || {};
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("male"); // TODO : 타입 지정
  const [birthday, setBirthday] = useState("");

  console.log("onSuccessLogin", onSuccessLogin);
  // 회원가입 성공 시 onSuccessLogin 콜백 호출(테스트 필요)

  const genderItems = useMemo<Array<SelectableButtonGroupItem>>(
    () => [
      {
        label: "남자",
        value: "male",
      },
      {
        label: "여자",
        value: "female",
      },
    ],
    []
  );

  const handleChangeNickname = (newNickname: string) => {
    setNickname(newNickname);
  };
  const handleChangeGender = (newGender: string) => {
    setGender(newGender);
  };
  const handleChangeBirthday = (newBirthday: string) => {
    setBirthday(formatBirthdate(newBirthday));
  };

  return (
    <CheckboxProvider>
      <View className="flex-1 mt-25">
        <View className="flex flex-col px-20">
          <VStack gap={10}>
            <Typography className="text-20 font-semibold">회원가입</Typography>
            <Typography className="text-13 text-gray9">하단 항목들을 입력해 주세요</Typography>
          </VStack>
          <VStack gap={20} className="mt-35">
            <LabeledInput label="닉네임" value={nickname} onChangeText={handleChangeNickname} />
            <LabeledComponent label="성별">
              <SelectableButtonGroup
                items={genderItems}
                value={gender}
                onChange={value => handleChangeGender(value as string)}
                wrapperClassName="flex flex-row"
              />
            </LabeledComponent>
            <LabeledInput
              label="생년월일"
              value={birthday}
              onChangeText={handleChangeBirthday}
              placeholder="생년월일을 입력해 주세요"
              helperText="예제. yyyy.mm.dd"
            />
          </VStack>
        </View>
        <Divider height={10} wrapperClassName="bg-gray1 my-30" />
        <View className="px-20">
          <VStack gap={20}>
            <Typography className="text-16 font-semibold">전체 동의</Typography>
            <AuthTermsCheckboxGroup />
          </VStack>
        </View>
      </View>
    </CheckboxProvider>
  );
}
