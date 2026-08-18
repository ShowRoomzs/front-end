export interface NoticeListItem {
  id: number;
  title: string;
  /** [중요] 배지 노출 및 목록 상단 고정 */
  pinned: boolean;
  createdDate: string;
}

export interface NoticeDetail extends NoticeListItem {
  /** 어드민에서 작성한 리치 에디터 HTML이 그대로 실린다 */
  content: string;
}
