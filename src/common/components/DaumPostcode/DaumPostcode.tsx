import WebView, { WebViewMessageEvent } from "react-native-webview";

export type DaumPostcodeData = {
  address: string;
  addressEnglish: string;
  addressType: "R" | "J";
  apartment: string;
  autoJibunAddress: string;
  autoJibunAddressEnglish: string;
  autoRoadAddress: string;
  autoRoadAddressEnglish: string;
  bcode: string;
  bname: string;
  bname1: string;
  bname1English: string;
  bname2: string;
  bname2English: string;
  bnameEnglish: string;
  buildingCode: string;
  buildingName: string;
  hname: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  noSelected: "Y" | "N";
  postcode: string;
  postcode1: string;
  postcode2: string;
  postcodeSeq: string;
  query: string;
  roadAddress: string;
  roadAddressEnglish: string;
  roadname: string;
  roadnameCode: string;
  roadnameEnglish: string;
  sido: string;
  sidoEnglish: string;
  sigungu: string;
  sigunguCode: string;
  sigunguEnglish: string;
  userLanguageType: "K" | "E";
  userSelectedType: "R" | "J";
  zonecode: string;
};

interface DaumPostcodeProps {
  onSubmit: (data: DaumPostcodeData) => void;
}

export default function DaumPostcode(props: DaumPostcodeProps) {
  const { onSubmit } = props;

  const postcodeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
      <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      <style>
        body, html { width: 100%; height: 100%; margin: 0; padding: 0; }
        #container { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="container"></div>
      <script>
        function init() {
          new daum.Postcode({
            oncomplete: function(data) {
             window.ReactNativeWebView.postMessage(JSON.stringify(data));
            },
            width: '100%',
            height: '100%',
            animation: true,
            hideMapBtn: true, 
          }).embed(document.getElementById('container'));
        }
       
        window.addEventListener('DOMContentLoaded', init);
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      onSubmit(data as DaumPostcodeData);
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <WebView
      className="flex flex-1"
      source={{
        html: postcodeHTML,
        baseUrl: "https://postcode.map.daum.net",
      }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      originWhitelist={["*"]}
    />
  );
}
