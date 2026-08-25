import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddressSearchContext } from "./context";
import type { DaumPostcodeData } from "@/common/components/DaumPostcode/DaumPostcode";

import DaumPostcode from "@/common/components/DaumPostcode/DaumPostcode";
import { CloseIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 카카오 우편번호(Daum Postcode) 검색 — 폼 위를 잠시 덮는 화면.
 *
 * 헤더를 직접 두는 이유는 SDK가 검색 UI만 그리고 **닫는 방법을 주지 않기** 때문이다.
 * 안드로이드는 하드웨어 뒤로가기로 닫히지만 iOS에는 스와이프밖에 없어, 잘못 열면 빠져나올
 * 길이 보이지 않는다. 흐름을 덮는 화면이므로 뒤로가기가 아니라 **우측 상단 X**다.
 *
 * `SafeAreaView`로 상단 인셋을 잡는다 — 이 Modal은 네비게이터 밖에서 뜨므로 스택 화면에
 * 걸어 둔 인셋이 닿지 않는다.
 */
interface AddressSearchProviderProps {
  children: ReactNode;
}

export default function AddressSearchProvider(props: AddressSearchProviderProps) {
  const { children } = props;
  const [visible, setVisible] = useState(false);
  const onSelectRef = useRef<((data: DaumPostcodeData) => void) | null>(null);

  const openAddressSearch = useCallback((onSelect: (data: DaumPostcodeData) => void) => {
    onSelectRef.current = onSelect;
    setVisible(true);
  }, []);

  const handleSubmit = useCallback((data: DaumPostcodeData) => {
    onSelectRef.current?.(data);
    onSelectRef.current = null;
    setVisible(false);
  }, []);

  const handleRequestClose = useCallback(() => {
    onSelectRef.current = null;
    setVisible(false);
  }, []);

  const contextValue = useMemo(() => ({ openAddressSearch }), [openAddressSearch]);

  return (
    <AddressSearchContext.Provider value={contextValue}>
      {children}
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleRequestClose}
      >
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
          <View className="h-46 flex-row items-center border-b-[0.5px] border-divider px-4">
            <Typography
              style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
              className="min-w-0 flex-1 px-11 text-ink"
            >
              주소 검색
            </Typography>
            <TouchableOpacity onPress={handleRequestClose} activeOpacity={0.4} className="p-11">
              <CloseIcon size={20} color="#0F0F0F" />
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            <DaumPostcode onSubmit={handleSubmit} />
          </View>
        </SafeAreaView>
      </Modal>
    </AddressSearchContext.Provider>
  );
}
