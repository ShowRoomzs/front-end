export interface AutoCompleteItem {
  id: number;
  name: string;
}

export interface AutoCompleteResponse {
  products: Array<AutoCompleteItem>;
  markets: Array<AutoCompleteItem>;
  showrooms: Array<AutoCompleteItem>;
}
