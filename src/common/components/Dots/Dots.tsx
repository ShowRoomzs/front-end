import { SharedValue } from "react-native-reanimated";

import Dot from "@/common/components/Dots/Dot";
import HStack from "@/common/components/HStack/HStack";

interface DotsProps {
  itemCount: number;
  progress: SharedValue<number>;
}

export default function Dots(props: DotsProps) {
  const { itemCount, progress } = props;

  return (
    <HStack gap={8} className="items-center justify-center">
      {Array.from({ length: itemCount }).map((_, ix) => (
        <Dot key={`dots-${ix}`} index={ix} progress={progress} itemCount={itemCount} />
      ))}
    </HStack>
  );
}
