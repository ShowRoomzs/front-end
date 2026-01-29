import { useCallback, useRef, useState } from "react";
import { Modal, View } from "react-native";

import { AddressSearchContext } from "./context";
import type { DaumPostcodeData } from "@/common/components/DaumPostcode/DaumPostcode";

import DaumPostcode from "@/common/components/DaumPostcode/DaumPostcode";

interface AddressSearchProviderProps {
  children: React.ReactNode;
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

  const contextValue: { openAddressSearch: (onSelect: (data: DaumPostcodeData) => void) => void } = {
    openAddressSearch,
  };

  return (
    <AddressSearchContext.Provider value={contextValue}>
      {children}
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleRequestClose}
      >
        <View className="flex-1 py-20">
          <DaumPostcode onSubmit={handleSubmit} />
        </View>
      </Modal>
    </AddressSearchContext.Provider>
  );
}
