import { useMemo } from "react";
import { Image } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { ProductDetail } from "@/features/product/types/product";

interface ProductInquiryProductDetailProps {
  product: ProductDetail | undefined;
}
export default function ProductInquiryProductDetail(props: ProductInquiryProductDetailProps) {
  const { product } = props;

  const discountRate = useMemo(() => {
    if (!product?.regularPrice || !product?.salePrice) {
      return 0;
    }
    return Math.floor(((product?.regularPrice - product?.salePrice) / product?.regularPrice) * 100);
  }, [product?.regularPrice, product?.salePrice]);

  return (
    <HStack className="p-20 border-b-[1px] border-gray2" gap={10}>
      <Image className="h-40 w-40" source={{ uri: product?.representativeImageUrl }} />
      <VStack gap={4}>
        <Typography className="text-black text-13 font-medium">{product?.name}</Typography>
        <HStack className="items-center" gap={6}>
          {discountRate > 0 && (
            <Typography className="text-pointColor text-13 font-medium">{`${discountRate}%`}</Typography>
          )}
          <Typography className="text-black text-13 font-medium">{`₩${product?.salePrice.toLocaleString()}`}</Typography>
        </HStack>
      </VStack>
    </HStack>
  );
}
