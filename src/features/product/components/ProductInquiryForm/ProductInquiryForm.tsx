import { useMemo } from "react";

import Dropdown from "@/common/components/Dropdown/Dropdown";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import TextArea from "@/common/components/TextArea/TextArea";
import VStack from "@/common/components/VStack/VStack";
import { useGetProductInquiryCategory } from "@/features/product/hooks/useGetProductInquiryCategory";

interface ProductInquiryFormProps {
  type: string;
  content: string;
  onChangeType: (type: string) => void;
  onChangeContent: (content: string) => void;
}
export default function ProductInquiryForm(props: ProductInquiryFormProps) {
  const { onChangeType, onChangeContent, type, content } = props;
  const { data: productInquiryCategory } = useGetProductInquiryCategory();

  console.log("productInquiryCategory", productInquiryCategory);

  const categoryItems = useMemo(() => {
    if (!productInquiryCategory?.length) {
      return [];
    }
    return productInquiryCategory.map(category => ({
      label: category.description,
      value: category.key,
    }));
  }, [productInquiryCategory]);

  return (
    <VStack gap={20} className="py-30 px-20">
      <LabeledComponent label="문의 유형">
        <Dropdown items={categoryItems} id="inquiry-category" value={type} onChange={onChangeType} />
      </LabeledComponent>
      <LabeledComponent label="문의할 내용을 입력해주세요">
        <TextArea
          value={content}
          onChangeText={onChangeContent}
          placeholder="내용을 입력해 주세요"
          wrapperClassName="h-200"
          maxLength={500}
        />
      </LabeledComponent>
    </VStack>
  );
}
