import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

import Divider from "@/common/components/Divider/Divider";
import Dropdown from "@/common/components/Dropdown/Dropdown";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import LabeledInput from "@/common/components/LabeledInput/LabeledInput";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { toast } from "@/common/providers/ToastProvider";
import { useGetBank } from "@/common/queries/useGetBank";
import { useSettingsNavigation } from "@/common/router";
import RefundAccountBottomAction from "@/features/setting/components/RefundAccountBottomAction/RefundAccountBottomAction";
import { useGetRefundAccount } from "@/features/setting/hooks/useGetRefundAccount";
import { useUpdateRefundAccountMutation } from "@/features/setting/hooks/useUpdateRefundAccountMutation";

export default function RefundAccountView() {
  const settingsNavigation = useSettingsNavigation();
  const { data: banks } = useGetBank();
  const { data: refundAccount } = useGetRefundAccount();
  const { mutate: updateRefundAccount } = useUpdateRefundAccountMutation();
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handlePressBack = () => {
    settingsNavigation.goBack();
  };

  const bankItems = useMemo(() => {
    if (!banks?.length || !banks) {
      return [];
    }
    return banks.map(bank => ({
      label: bank.name,
      value: bank.code,
    }));
  }, [banks]);

  const handleChangeBank = useCallback((value: string) => {
    setBankCode(value);
  }, []);

  const handlePressAdd = useCallback(async () => {
    try {
      await updateRefundAccount({ bankCode, accountNumber, accountHolder: "" });
      toast.success(`환불 계좌가 ${refundAccount ? "변경" : "추가"}되었습니다`);
      setBankCode("");
      setAccountNumber("");
    } catch (error) {
      console.error(error);
    }
  }, [updateRefundAccount, bankCode, accountNumber, refundAccount]);

  const handleChangeAccountNumber = useCallback((text: string) => {
    const digits = text.replace(/\D/g, "");

    setAccountNumber(digits);
  }, []);

  return (
    <View className="flex-1">
      <ScreenHeader title="환불 계좌" onPressBack={handlePressBack} />
      {refundAccount && (
        <View className="p-20 bg-gray0">
          <View className="border-[1px] border-gray2 bg-white p-15 rounded-[5px] flex flex-col">
            <View className="flex flex-row items-center justify-between">
              <Typography className="text-black text-12 font-medium">{refundAccount?.bankName}</Typography>
              <Typography className="text-pointColor text-12 font-medium">* 등록 환불 계좌</Typography>
            </View>
            <Typography className="text-black text-16 font-medium mt-8">
              {refundAccount?.accountNumber}
            </Typography>
            <Typography className="text-gray10 text-10 font-normal mt-6">
              {refundAccount?.accountHolder}
            </Typography>
          </View>
        </View>
      )}
      <VStack className="px-20 pt-25" gap={20}>
        <LabeledComponent label="은행 선택">
          <Dropdown items={bankItems} id="bank" value={bankCode} onChange={handleChangeBank} />
        </LabeledComponent>
        <LabeledInput
          placeholder="계좌번호를 입력해 주세요"
          label="계좌번호"
          value={accountNumber}
          keyboardType="numeric"
          onChangeText={handleChangeAccountNumber}
        />
      </VStack>
      <View className="h-10 bg-gray1 mt-25" />
      <VStack className="px-20 pt-25" gap={8}>
        <Typography className="text-black text-13 font-medium">유의사항</Typography>
        <VStack gap={8} className="bg-gray1 border-[1px] border-gray2 rounded-[5px] p-15">
          {refundAccount && (
            <VStack gap={4}>
              <Typography className="text-11 gray-12 font-normal" style={{ color: "#737373" }}>
                변경 된 환불 계좌는 새로운 주문건부터 적용됩니다
              </Typography>
              <Typography className="text-11 gray-12 font-normal" style={{ color: "#737373" }}>
                이미 주문하신 건은 기존의 환불계좌로 환불됩니다
              </Typography>
            </VStack>
          )}
          {refundAccount && <Divider wrapperClassName="bg-gray2" height={1} />}

          <Typography className="text-11 gray-12 font-normal" style={{ color: "#737373" }}>
            추가하실 환불 계좌정보를 상세하게 확인하신 후 추가해주시기 바랍니다
          </Typography>
        </VStack>
      </VStack>
      <RefundAccountBottomAction
        label={refundAccount ? "변경하기" : "추가하기"}
        onPress={handlePressAdd}
        disabled={!bankCode || !accountNumber}
      />
    </View>
  );
}
