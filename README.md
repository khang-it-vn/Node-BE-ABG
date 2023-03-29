# Node-BE-ABG
BE-NNM Hệ thống cổng thanh toán điện tử

## 1. API
##### 1. /Login
Google authentication

response: 
> success: 
``` 
statusCode = 200
[
  {
    success: true,
    message: "Login success"
  },
  {
    token: "<value>"
  }
]
```
> fail
```
statusCode = 401
```
##### 2. /update-m-pass
method: PUT <br>
headers: {
            Authorizaton: `Bearer token`
          }
body: {
        "mpass": "000000" //mpass có kích thước tối đa là 6 ký tự
      }
>success:

```
statusCode = 200
{
  message: "Update mpass success",
  success: true
}

```
>fail:

```
statusCode = 304
{
  message: "Update mpass false, length of mpass is only 6 character",
  success: false
}
```
##### 3. /getUserInfo

method: GET<br>
headers: {<br>
            Authorizaton: `Bearer token`<br>
          }<br>
> success
```
statusCode = 200
[
  account,
  {
    message: "info account",
    success: true,
  },
]
```

> fail

```
statusCode = 403 
```
Nếu gặp status code 403 thì phải gọi api cập nhật mpass trước mới gọi các api khác được.

##### 4. /binance/getPriceFollowPage/:page

method: GET <br>
headers: { <br>
            Authorizaton: `Bearer token`<br>
          }<br>
> success
```
statusCode = 200
[
    {
        "symbol": "ETHBTC",
        "priceChange": "-0.00048900",
        "priceChangePercent": "-0.760",
        "weightedAvgPrice": "0.06464525",
        "prevClosePrice": "0.06437600",
        "lastPrice": "0.06388700",
        "lastQty": "0.22030000",
        "bidPrice": "0.06388600",
        "bidQty": "36.39200000",
        "askPrice": "0.06388700",
        "askQty": "5.88030000",
        "openPrice": "0.06437600",
        "highPrice": "0.06530400",
        "lowPrice": "0.06368600",
        "volume": "110932.04160000",
        "quoteVolume": "7171.22910247",
        "openTime": 1680003600602,
        "closeTime": 1680090000602,
        "firstId": 410519151,
        "lastId": 410677675,
        "count": 158525
    },
    {
        "symbol": "LTCBTC",
        "priceChange": "0.00001600",
        "priceChangePercent": "0.496",
        "weightedAvgPrice": "0.00324884",
        "prevClosePrice": "0.00323000",
        "lastPrice": "0.00324400",
        "lastQty": "0.08800000",
        "bidPrice": "0.00324400",
        "bidQty": "5.62800000",
        "askPrice": "0.00324500",
        "askQty": "169.25400000",
        "openPrice": "0.00322800",
        "highPrice": "0.00330600",
        "lowPrice": "0.00318300",
        "volume": "95698.52600000",
        "quoteVolume": "310.90942239",
        "openTime": 1680003600595,
        "closeTime": 1680090000595,
        "firstId": 89884447,
        "lastId": 89910962,
        "count": 26516
    },
    ...
]
```

> fail

```
statusCode = 404 
```
Các thuộc tính của đối tượng này bao gồm:
```
  **symbol**: chuỗi ký tự thể hiện tên của cặp tiền điện tử, trong trường hợp này là LTCBTC (Litecoin/Bitcoin).
  **priceChange**: chuỗi ký tự thể hiện đổi giá của cặp tiền trong phiên giao dịch hiện tại.
  **priceChangePercent**: chuỗi ký tự thể hiện phần trăm thay đổi giá của cặp tiền trong phiên giao dịch hiện tại so với phiên trước đó.
  "weightedAvgPrice": giá trung bình có trọng số được tính dựa trên khối lượng giao dịch của cặp tiền điện tử.
  "prevClosePrice": giá đóng cửa của phiên giao dịch trước đó.
  "lastPrice": giá của cặp tiền điện tử ở thời điểm hiện tại.
  "lastQty": khối lượng giao dịch trong lần giao dịch cuối cùng của cặp tiền điện tử.
  "bidPrice" và "askPrice": giá trả và giá đặt (bid và ask) hiện tại của cặp tiền điện tử trên sàn giao dịch.
  "bidQty" và "askQty": khối lượng mua vào (bid) và khối lượng bán ra (ask) hiện tại của cặp tiền điện tử trên sàn giao dịch.
  "openPrice": giá mở cửa của phiên giao dịch hiện tại.
  **highPrice** và **lowPrice**: giá cao nhất và giá thấp nhất trong phiên giao dịch hiện tại.
  **volume** và **quoteVolume**: khối lượng giao dịch dựa trên số lượng được giao dịch và khối lượng được tính theo đơn vị tiền tệ trích dẫn.
  "openTime" và "closeTime": thời điểm mở cửa và đóng cửa của phiên giao dịch hiện tại.
  "firstId" và "lastId": các ID đại diện cho các lệnh mua/bán của cặp tiền điện tử trong khoảng thời gian từ openTime đến closeTime.
  "count": tổng số lệnh mua/bán của cặp tiền điện tử trong khoảng thời gian từ openTime đến closeTime.
```
Chỉ cần quan tâm các thuộc tính in đậm, những thuộc tính này sẽ được hiển thị trên bảng thị trường
  
##### 5. /getBalance

method: GET <br>
headers: { <br>
            Authorizaton: `Bearer token`<br>
          }<br>
> success
```
statusCode = 200
  {
    success: true,
    message: "get balance of address",
    balance: <balance>,
  }
```
> fail
```
statusCode = 500
```
##### 6. 
