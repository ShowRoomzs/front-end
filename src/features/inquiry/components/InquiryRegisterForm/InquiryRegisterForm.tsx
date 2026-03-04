import { useCallback, useMemo } from "react";

import { InquiryCategory } from "../../types/inquiry";
import InquiryDetailDropdown from "../InquiryDetailDropdown/InquiryDetailDropdown";

import ImageUploader from "@/common/components/ImageUploader/ImageUploader";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import SelectableButtonGroup from "@/common/components/SelectableButtonGroup/SelectableButtonGroup";
import TextArea from "@/common/components/TextArea/TextArea";
import VStack from "@/common/components/VStack/VStack";

interface InquiryFormState {
  type: string;
  detailType: string;
  content: string;
}

interface InquiryRegisterFormProps {
  categories?: Array<InquiryCategory>;
  form: InquiryFormState;
  onChangeForm: React.Dispatch<React.SetStateAction<InquiryFormState>>;
  imageUrls: Array<string>;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

export default function InquiryRegisterForm(props: InquiryRegisterFormProps) {
  const { categories, form, onChangeForm, imageUrls, onAddImage, onRemoveImage } = props;

  const categoryItems = useMemo(() => {
    if (!categories) {
      return [];
    }
    return categories.map(c => ({ label: c.description, value: c.key }));
  }, [categories]);

  const detailItems = useMemo(() => {
    if (!categories || !form.type) {
      return [];
    }
    const category = categories.find(c => c.key === form.type);

    return category ? category.details.map(d => ({ label: d.description, value: d.key })) : [];
  }, [categories, form.type]);

  const handleCategoryChange = useCallback(
    (value: string | Array<string>) => {
      onChangeForm(prev => ({ ...prev, type: value as string, detailType: "" }));
    },
    [onChangeForm]
  );

  const handleDetailChange = useCallback(
    (value: string) => {
      onChangeForm(prev => ({ ...prev, detailType: value }));
    },
    [onChangeForm]
  );

  const handleContentChange = useCallback(
    (value: string) => {
      onChangeForm(prev => ({ ...prev, content: value }));
    },
    [onChangeForm]
  );

  return (
    <VStack gap={24} className="py-30 px-20">
      <SelectableButtonGroup
        items={categoryItems}
        value={form.type}
        onChange={handleCategoryChange}
        numOfCols={3}
        mode="single"
      />
      <LabeledComponent label="문의 유형">
        <InquiryDetailDropdown
          items={detailItems}
          value={form.detailType}
          onChange={handleDetailChange}
          hasCategory={!!form.type}
        />
      </LabeledComponent>
      <LabeledComponent label="문의 내용">
        <TextArea
          value={form.content}
          onChangeText={handleContentChange}
          placeholder="내용을 입력해 주세요"
          wrapperClassName="h-[180px]"
          maxLength={500}
        />
      </LabeledComponent>
      <LabeledComponent label="사진 첨부">
        <ImageUploader
          imageUrls={imageUrls}
          onAddImage={onAddImage}
          onRemoveImage={onRemoveImage}
          maxCount={10}
        />
      </LabeledComponent>
    </VStack>
  );
}
