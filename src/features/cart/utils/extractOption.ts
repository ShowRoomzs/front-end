type OptionName = string;
type OptionValue = string;

export function extractOption(option: string): Array<{ optionName: OptionName; optionValue: OptionValue }> {
  const options = option.split("/") as Array<string>;

  return options.map(item => {
    const [optionName, optionValue] = item.split(":").map(item => item.trim()) as [OptionName, OptionValue];

    return {
      optionName,
      optionValue,
    };
  });
}
